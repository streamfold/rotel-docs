---
sidebar_position: 2
---

# Getting started

## Rotel configuration

Add the `rotel` Python package to your project's dependencies. There are two approaches to configuring rotel:
1. typed config dicts
2. environment variables

### Typed dicts

In the startup section of your `main.py` add the following code block. Replace the endpoint with the endpoint of your OpenTelemetry vendor and any required API KEY headers.

```python
from rotel import Config, Rotel

rotel = Rotel(
    enabled = True,
    exporter = Config.otlp_exporter(
        endpoint = "https://foo.example.com",
        headers = {
            "x-api-key" : settings.API_KEY,
            "x-data-set": "testing"
        }
    ),
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
* `ROTEL_OTLP_EXPORTER_ENDPOINT=https://foo.example.com`
* `ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS=x-api-key={API_KEY}`

Any typed configuration options will override environment variables of the same name.

## OpenTelemetry SDK configuration

Once the rotel collector agent is running, you may need to configure your application's instrumentation. If you are using the default rotel endpoints of *localhost:4317* and *localhost:4318*, then you should not need to change anything.

To set the endpoint the OpenTelemetry SDK will use, set the following environment variable:

* `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317`
