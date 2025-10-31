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
| --otlp-exporter-authenticator          |         | sigv4auth  |
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

:::note

Selecting _http_ as the OTLP exporter protocol will export as `http/protobuf`. The OTLP exporter does not support HTTP/JSON.

:::

## Cloudwatch OTLP Export

The Rotel OTLP exporter can export to the
[Cloudwatch OTLP endpoints](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-OTLPEndpoint.html)
for traces and logs. You'll need to select the HTTP protocol and enable the sigv4auth authenticator.

See the [AWS Auth](/docs/configuration/aws-auth) page for instructions on how to retrieve credentials necessary
for using the sigv4auth authenticator to export to Cloudwatch.

### Traces

Here is the full environment variable configuration to send traces to Cloudwatch, swap the region code as needed.

```bash
ROTEL_EXPORTERS=traces:otlp
ROTEL_EXPORTER_TRACES_PROTOCOL=http
ROTEL_EXPORTER_TRACES_ENDPOINT=https://xray.<region code>.amazonaws.com
ROTEL_EXPORTER_TRACES_AUTHENTICATOR=sigv4auth
ROTEL_EXPORTERS_TRACES=traces
```

:::note

Tracing requires that you
enable [Transaction Search](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search.html)
in the AWS console before you can send OTLP traces.

:::

### Logs

Here is the full environment variable configuration to send logs to Cloudwatch, swap the region code and
log group/stream as needed.

```bash
ROTEL_EXPORTERS=logs:otlp
ROTEL_EXPORTER_LOGS_PROTOCOL=http
ROTEL_EXPORTER_LOGS_ENDPOINT=https://logs.<region code>.amazonaws.com
ROTEL_EXPORTER_LOGS_CUSTOM_HEADERS="x-aws-log-group=<log group>,x-aws-log-stream=<log stream>"
ROTEL_EXPORTER_LOGS_AUTHENTICATOR=sigv4auth
ROTEL_EXPORTERS_LOGS=logs
```

:::note

To send OTLP logs to Cloudwatch you must create a log group and log stream. Exporting will fail if these do not exist
ahead of time and they are not created by default.

:::
