---
sidebar_position: 3
---

# Configuration

This is the full list of global options and their environment variable alternatives. Any defaults left blank in the table are either False or None.

| Option Name        | Type      | Environ              | Default              | Options               |
|--------------------|-----------|----------------------|----------------------|-----------------------|
| enabled            | bool      | ROTEL_ENABLED        |                      |                       |
| pid_file           | str       | ROTEL_PID_FILE       | /tmp/rotel-agent.pid |                       |
| log_file           | str       | ROTEL_LOG_FILE       | /tmp/rotel-agent.log |                       |
| log_format         | str       | ROTEL_LOG_FORMAT     | text                 | json, text            |
| debug_log          | list[str] | ROTEL_DEBUG_LOG      |                      | traces, metrics, logs |
| otlp_grpc_endpoint | str       | ROTEL_OTLP_GRPC_ENDPOINT | localhost:4317   |                       |
| otlp_http_endpoint | str       | ROTEL_OTLP_HTTP_ENDPOINT | localhost:4318   |                       |

For each exporter you would like to use, see the configuration options below. Exporters should be
assigned to the `exporters` dict with a custom name.

## OTLP Exporter

To construct an OTLP exporter, use the method `Config.otlp_exporter()` with the following options.

| Option Name            | Type           | Environ                                    | Default | Options      |
|------------------------|----------------|--------------------------------------------|---------|--------------|
| endpoint               | str            | ROTEL_OTLP_EXPORTER_ENDPOINT               |         |              |
| protocol               | str            | ROTEL_OTLP_EXPORTER_PROTOCOL               | grpc    | grpc or http |
| headers                | dict[str, str] | ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS         |         |              |
| compression            | str            | ROTEL_OTLP_EXPORTER_COMPRESSION            | gzip    | gzip or none |
| request_timeout        | str            | ROTEL_OTLP_EXPORTER_REQUEST_TIMEOUT        | 5s      |              |
| retry_initial_backoff  | str            | ROTEL_OTLP_EXPORTER_RETRY_INITIAL_BACKOFF  | 5s      |              |
| retry_max_backoff      | str            | ROTEL_OTLP_EXPORTER_RETRY_MAX_BACKOFF      | 30s     |              |
| retry_max_elapsed_time | str            | ROTEL_OTLP_EXPORTER_RETRY_MAX_ELAPSED_TIME | 300s    |              |
| batch_max_size         | int            | ROTEL_OTLP_EXPORTER_BATCH_MAX_SIZE         | 8192    |              |
| batch_timeout          | str            | ROTEL_OTLP_EXPORTER_BATCH_TIMEOUT          | 200ms   |              |
| tls_cert_file          | str            | ROTEL_OTLP_EXPORTER_TLS_CERT_FILE          |         |              |
| tls_key_file           | str            | ROTEL_OTLP_EXPORTER_TLS_KEY_FILE           |         |              |
| tls_ca_file            | str            | ROTEL_OTLP_EXPORTER_TLS_CA_FILE            |         |              |
| tls_skip_verify        | bool           | ROTEL_OTLP_EXPORTER_TLS_SKIP_VERIFY        |         |              |

## Datadog Exporter

Rotel provides an experimental [Datadog exporter](https://github.com/streamfold/rotel/blob/main/src/exporters/datadog/README.md)
that supports traces at the moment. To use it instead of the OTLP exporter,
use the method `Config.datadog_exporter()` with the following options.

| Option Name     | Type | Environ                                | Default | Options                |
|-----------------|------|----------------------------------------|---------|------------------------|
| region          | str  | ROTEL_DATADOG_EXPORTER_REGION          | us1     | us1, us3, us5, eu, ap1 |
| custom_endpoint | str  | ROTEL_DATADOG_EXPORTER_CUSTOM_ENDPOINT |         |                        |
| api_key         | str  | ROTEL_DATADOG_EXPORTER_API_KEY         |         |                        |

## Clickhouse Exporter

Rotel provides a Clickhouse exporter with full support for metrics, logs, and traces.
To use the Clickhouse exporter instead of the OTLP exporter,
use the method `Config.clickhouse_exporter()` with the following options.

| Option Name  | Type | Environ                                | Default | Options |
|--------------|------|----------------------------------------|---------|---------|
| endpoint     | str  | ROTEL_CLICKHOUSE_EXPORTER_ENDPOINT     |         |         |
| database     | str  | ROTEL_CLICKHOUSE_EXPORTER_DATABASE     | otel    |         |
| table_prefix | str  | ROTEL_CLICKHOUSE_EXPORTER_TABLE_PREFIX | otel    |         |
| compression  | str  | ROTEL_CLICKHOUSE_EXPORTER_COMPRESSION  | lz4     |         |
| async_insert | bool | ROTEL_CLICKHOUSE_EXPORTER_ASYNC_INSERT | true    |         |
| user         | str  | ROTEL_CLICKHOUSE_EXPORTER_USER         |         |         |
| password     | str  | ROTEL_CLICKHOUSE_EXPORTER_PASSWORD     |         |         |

## Blackhole Exporter

The blackhole exporter can be configured by using the method `Config.blackhole_exporter()`. It
does not have any options.