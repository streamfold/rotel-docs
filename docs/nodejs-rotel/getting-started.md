---
sidebar_position: 2
---

# Getting started

## Rotel configuration

Add the `rotel` npm package to your project's dependencies. There are two approaches to configuring rotel:
1. Typescript or Javascript
2. Environment variables

### JS / TS config

In the startup section of your `index.js` or `index.ts` add the following code block. Replace the endpoint with the endpoint of your OpenTelemetry vendor and any required API KEY headers.

---
```javascript
const { Rotel } = require("@streamfold/rotel");

const rotel = new Rotel({
  enabled: true,
  exporter: {
      endpoint: "https://foo.example.com",
      headers: {
          "x-api-key" : "xxxxx",
      }
    },
})
rotel.start()
```

### Environment variables

You can also configure rotel entirely with environment variables. In your application startup, insert:
```javascript
const { Rotel } = require("@streamfold/rotel");
new Rotel().start();
```

In your application deployment configuration, set the following environment variables. These match the typed configuration above:
* `ROTEL_ENABLED=true`
* `ROTEL_OTLP_EXPORTER_ENDPOINT=https://foo.example.com`
* `ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS=x-api-key={API_KEY}`

Any typed configuration options will override environment variables of the same name.

## OpenTelemetry SDK configuration

Once the rotel collector agent is running, you may need to configure your application's instrumentation. If you are using the default rotel endpoints of *localhost:4317* and *localhost:4318*, then you should not need to change anything.

To set the endpoint the OpenTelemetry SDK will use, set the following environment variable:

* `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317`
