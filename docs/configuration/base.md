---
sidebar_position: 1
---

# Base configuration

Rotel is configured on the command line with multiple flags. See the table below for the full list of options. Rotel
will also output the full argument list:

```shell
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
| --otlp-grpc-endpoint              | localhost:4317       |                                                              |
| --otlp-http-endpoint              | localhost:4318       |                                                              |
| --otlp-grpc-max-recv-msg-size-mib | 4                    |                                                              |
| --exporter                        | otlp                 | otlp, blackhole, datadog, clickhouse, awsxray, awsemf, kafka |
| --otlp-receiver-traces-disabled   |                      |                                                              |
| --otlp-receiver-metrics-disabled  |                      |                                                              |
| --otlp-receiver-logs-disabled     |                      |                                                              |
| --otlp-receiver-traces-http-path  | /v1/traces           |                                                              |
| --otlp-receiver-metrics-http-path | /v1/metrics          |                                                              |
| --otlp-receiver-logs-http-path    | /v1/logs             |                                                              |
| --otel-resource-attributes        |                      |                                                              |
| --enable-internal-telemetry       |                      |                                                              |
