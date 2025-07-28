---
sidebar_position: 2
---

# Getting started

## Rotel configuration

Add the `rotel` [Python package](https://pypi.org/project/rotel/) to your project's dependencies. There are two approaches to configuring rotel:
1. typed config dicts
2. environment variables

### Typed dicts

In the startup section of your `main.py` add the following code block. Replace the endpoint with the endpoint of your OpenTelemetry vendor and any required API KEY headers.

```python
from rotel import Config, Rotel

rotel = Rotel(
    enabled = True,
    exporters = {
        'otlp': Config.otlp_exporter(
            endpoint = "https://foo.example.com",
            headers = {
                "x-api-key" : settings.API_KEY,
                "x-data-set": "testing"
            }
        ),
    },
    # Define exporters per telemetry type
    exporters_traces = ['otlp'],
    exporters_metrics = ['otlp'],
    exporters_logs = ['otlp']
)

rotel.start()
```

### Environment variables

You can also configure rotel entirely with environment variables. In your application startup, insert:
```python
import rotel
rotel.start()
```

In your application deployment configuration, set the following environment variables. These match the typed configuration above:

* `ROTEL_ENABLED=true`
* `ROTEL_EXPORTERS=otlp`
* `ROTEL_EXPORTER_OTLP_ENDPOINT=https://foo.example.com`
* `ROTEL_EXPORTER_OTLP_CUSTOM_HEADERS=x-api-key={API_KEY},x-data-set=testing`
* `ROTEL_EXPORTERS_TRACES=otlp`
* `ROTEL_EXPORTERS_METRICS=otlp`
* `ROTEL_EXPORTERS_LOGS=otlp`

Any typed configuration options will override environment variables of the same name.

## OpenTelemetry SDK configuration

Once Rotel is running, you may need to configure your application's instrumentation. If you are using the default Rotel endpoints of *localhost:4317* and *localhost:4318*, then you should not need to change anything.

To set the endpoint the OpenTelemetry SDK will use, set the following environment variable:

* `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317`

### Multiple exporters

Pyrotel supports [multiple exporters](https://rotel.dev/docs/configuration/multiple-exporters), allowing you to send data to
different destinations per telemetry type. Just set the `exporters` entry to a dict map of exporter definitions and then
configure the exporters per telemetry type. For example, this will send metrics and logs to an OTLP endpoint while
sending traces to Datadog:

```python
from rotel import Config, Rotel

rotel = Rotel(
    enabled = True,
    exporters = {
        'logs_and_metrics': Config.otlp_exporter(
            endpoint = "https://foo.example.com",
            headers = {
                "x-api-key" : settings.API_KEY,
                "x-data-set": "testing"
            }
        ),
        'tracing': Config.datadog_exporter(
            api_key = "1234abcd",
        ),
    },
    # Define exporters per telemetry type
    exporters_traces = ['tracing'],
    exporters_metrics = ['logs_and_metrics'],
    exporters_logs = ['logs_and_metrics']
)
rotel.start()
```