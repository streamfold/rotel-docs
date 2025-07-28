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

```python
import os

from rotel import Config, Rotel

from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import SimpleSpanProcessor


# Enable at deploy time with ROTEL_ENABLED=true
if os.environ.get("ROTEL_ENABLED") == "true":
    #
    # Configure Rotel to export to Axiom
    #
    otlp_exporter = Config.otlp_exporter(
        endpoint="https://api.axiom.co",
        protocol="http", # Axiom only supports HTTP
        headers={
            "Authorization": f"Bearer {os.environ['AXIOM_API_TOKEN']}",
            "X-Axiom-Dataset": os.environ["AXIOM_DATASET"],
        },
    )

    rotel = Rotel(
        enabled=True,
        exporters = {
            'axiom': otlp_exporter,
        },
        exporters_traces = ['axiom']
    )

    # Start the agent
    rotel.start()

    #
    # Configure OpenTelemetry SDK to export to the localhost Rotel
    #

    # Define the service name resource for the tracer.
    resource = Resource(
        attributes={
            SERVICE_NAME: "pyrotel-test"
        }
    )

    # Create a TracerProvider with the defined resource for creating tracers.
    provider = TracerProvider(resource=resource)

    # Create the OTel exporter to send to the localhost Rotel agent
    exporter = OTLPSpanExporter(endpoint = "http://localhost:4318/v1/traces")

    # Create a processor with the OTLP exporter to send trace spans.
    #
    # You could also use the BatchSpanProcessor, but since Rotel runs locally
    # and will batch, you can avoid double batching.
    processor = SimpleSpanProcessor(exporter)
    provider.add_span_processor(processor)

    # Set the TracerProvider as the global tracer provider.
    trace.set_tracer_provider(provider)
```
