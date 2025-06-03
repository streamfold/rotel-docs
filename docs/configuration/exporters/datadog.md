---
sidebar_position: 2
---

# Datadog Exporter

| Telemetry Type | Support |
|----------------|---------|
| Traces         | Alpha   |


The Datadog exporter can be selected by passing `--exporter datadog`. The Datadog exporter only supports traces at the
moment. For more information, see the [Datadog Exporter](src/exporters/datadog/README.md) docs.

| Option                             | Default | Options                |
|------------------------------------|---------|------------------------|
| --datadog-exporter-region          | us1     | us1, us3, us5, eu, ap1 |
| --datadog-exporter-custom-endpoint |         |                        |
| --datadog-exporter-api-key         |         |                        |

Specifying a custom endpoint will override the region selection.
