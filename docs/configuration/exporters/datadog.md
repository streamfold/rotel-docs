---
sidebar_position: 2
---

# Datadog Exporter

Export OpenTelemetry to Datadog.

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | 🚧      |

---

The Datadog exporter can be selected by passing `--exporter datadog`. The Datadog exporter only supports traces at the
moment. For more information, see the [Datadog Exporter](https://github.com/streamfold/rotel/blob/main/src/exporters/datadog/README.md) docs.

| Option                                    | Default                        | Options                |
| ----------------------------------------- | ------------------------------ | ---------------------- |
| --datadog-exporter-region                 | us1                            | us1, us3, us5, eu, ap1 |
| --datadog-exporter-custom-endpoint        |                                |                        |
| --datadog-exporter-api-key                |                                |                        |
| --datadog-exporter-retry-initial-backoff  | (uses global exporter default) |                        |
| --datadog-exporter-retry-max-backoff      | (uses global exporter default) |                        |
| --datadog-exporter-retry-max-elapsed-time | (uses global exporter default) |                        |

Specifying a custom endpoint will override the region selection.
