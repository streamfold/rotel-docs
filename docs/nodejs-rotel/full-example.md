---
sidebar_position: 4
---

# Full example

To illustrate this further, here's a full example of how to use Rotel to send trace spans to [Axiom](https://axiom.co/)
from an application instrumented with OpenTelemetry.

The code sample depends on the following environment variables:
* `ROTEL_ENABLED=true`: Turn on or off based on the deployment environment
* `AXIOM_DATASET`: Name of an Axiom dataset
* `AXIOM_API_TOKEN`: Set to an API token that has access to the Axiom dataset

```javascript
const { Rotel } = require("@streamfold/rotel");

const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { trace } = require('@opentelemetry/api');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { ATTR_SERVICE_NAME } = require ('@opentelemetry/semantic-conventions');
const { resourceFromAttributes } = require('@opentelemetry/resources');

function initRotel() {
  const rotel = new Rotel({
    enabled: true,
    exporter: {
      endpoint: "https://api.axiom.co",
      protocol: "http",
      headers: {
        "Authorization": "Bearer " + process.env.AXIOM_API_TOKEN,
        "X-Axiom-Dataset": process.env.AXIOM_DATASET
      }
    },
  })
  return rotel;
}

function initOtel() {
  const exporter = new OTLPTraceExporter({                                                                                                                   
    url: 'http://127.0.0.1:4317', // points to our local rotel
  });                                                                                                                                                  
                                                                                                                                                     
  // Initialize the tracer provider                                                                                                                    
  const provider = new NodeTracerProvider({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: 'rotel-nodejs-service',
    }),
    spanProcessors: [
        new SimpleSpanProcessor(exporter)
    ],
  });

  // Register the provider as the global tracer provider
  provider.register();
  return provider;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main routine
  async function main() {
  const rotel = initRotel();
  const provider = initOtel();
  rotel.start();
  console.log("Hello from example");
  const tracer = trace.getTracer('rotel-node-js-hello-world');
  console.log("starting main span");
  const mainSpan = tracer.startSpan('main');
  // sleep for a second to simulate span start/end time
  await sleep(1000);
  mainSpan.end();
  console.log("main span ended, flushing")
  await provider.forceFlush();
  await provider.shutdown();
  rotel.stop();
  console.log("goodbye")
}

main();

```
