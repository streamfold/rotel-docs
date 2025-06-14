---
sidebar_position: 1
---

# OTLP Exporter

Export OpenTelemetry metrics, logs, and traces to any OTLP endpoint.

| Telemetry Type | Support |
|----------------|---------|
| Metrics        | Alpha   |
| Traces         | Alpha   |
| Logs           | Alpha   |


The OTLP exporter is the default, or can be explicitly selected with `--exporter otlp`.

| Option                                 | Default | Options    |
|----------------------------------------|---------|------------|
| --otlp-exporter-endpoint               |         |            |
| --otlp-exporter-protocol               | grpc    | grpc, http |
| --otlp-exporter-custom-headers         |         |            |
| --otlp-exporter-compression            | gzip    | gzip, none |
| --otlp-exporter-tls-cert-file          |         |            |
| --otlp-exporter-tls-cert-pem           |         |            |
| --otlp-exporter-tls-key-file           |         |            |
| --otlp-exporter-tls-key-pem            |         |            |
| --otlp-exporter-tls-ca-file            |         |            |
| --otlp-exporter-tls-ca-pem             |         |            |
| --otlp-exporter-tls-skip-verify        |         |            |
| --otlp-exporter-request-timeout        | 5s      |            |
| --otlp-exporter-retry-initial-backoff  | 5s      |            |
| --otlp-exporter-retry-max-backoff      | 30s     |            |
| --otlp-exporter-retry-max-elapsed-time | 300s    |            |

Any of the options that start with `--otlp-exporter*` can be set per telemetry type: metrics, traces or logs. For
example, to set a custom endpoint to export traces to, set: `--otlp-exporter-traces-endpoint`. For other telemetry
types their value falls back to the top-level OTLP exporter config.
