---
sidebar_position: 1
---

# Base configuration

Rotel is configured on the command line with multiple flags. See the table below for the full list of options. Rotel
will also output the full argument list:

```bash
rotel start --help
```

All CLI arguments can also be passed as environment variable by prefixing with `ROTEL_` and switching hyphens to
underscores. For example, `--otlp-grpc-endpoint localhost:5317` can also be specified by setting the environment
variable `ROTEL_OTLP_GRPC_ENDPOINT=localhost:5317`.

Any option above that does not contain a default is considered false or unset by default.

| Option                            | Default              | Options                                                      |
| --------------------------------- | -------------------- | ------------------------------------------------------------ |
| --daemon                          |                      |                                                              |
| --log-format                      | text                 | json                                                         |
| --pid-file                        | /tmp/rotel-agent.pid |                                                              |
| --log-file                        | /tmp/rotel-agent.log |                                                              |
| --debug-log                       |                      | metrics, traces, logs                                        |
| --debug-log-verbosity             | basic                | basic, detailed                                              |
| --otlp-grpc-endpoint              | localhost:4317       |                                                              |
| --otlp-http-endpoint              | localhost:4318       |                                                              |
| --otlp-grpc-max-recv-msg-size-mib | 4                    |                                                              |
| --receiver                        | otlp                 | otlp, kafka                                                  |
| --exporter                        | otlp                 | otlp, blackhole, datadog, clickhouse, awsxray, awsemf, kafka |
| --batch-max-size                  | 8192                 |                                                              |
| --batch-timeout                   | 200ms                |                                                              |
| --otel-resource-attributes        |                      |                                                              |
| --enable-internal-telemetry       |                      |                                                              |

## Retries and Timeouts

Requests will be retried if they match retryable error codes like 429 (Too Many Requests) or timeout. You can control
the retry behavior globally for all exporters with the following options:

- `--exporter-retry-initial-backoff`: Initial backoff duration (default: `5s`)
- `--exporter-retry-max-backoff`: Maximum backoff interval (default: `30s`)
- `--exporter-retry-max-elapsed-time`: Maximum wall time a request will be retried for until it is marked as a
  permanent failure (default: `300s`)

These global retry settings apply to all exporters unless overridden by exporter-specific retry options (see individual
exporter configuration pages for details).

Each exporter can also override the default request timeout. For example, the OTLP exporter default timeout of 5 seconds
can be overridden with `--otlp-exporter-request-timeout`. All time options should be represented as string time
durations, e.g. `"250ms"` for 250 milliseconds, `"3s"` for 3 seconds.

## Component configuration

Next, select your configuration for receivers and exporters.

- [Receivers](/docs/category/receivers)
- [Exporters](/docs/category/exporters)
