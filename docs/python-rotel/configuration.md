---
sidebar_position: 3
---

# Configuration

This is the full list of global options and their environment variable alternatives. Any defaults left blank in the table are either False or None.

| Option Name        | Type      | Environ                  | Default              | Options               |
| ------------------ | --------- | ------------------------ | -------------------- | --------------------- |
| enabled            | bool      | ROTEL_ENABLED            |                      |                       |
| pid_file           | str       | ROTEL_PID_FILE           | /tmp/rotel-agent.pid |                       |
| log_file           | str       | ROTEL_LOG_FILE           | /tmp/rotel-agent.log |                       |
| log_format         | str       | ROTEL_LOG_FORMAT         | text                 | json, text            |
| debug_log          | list[str] | ROTEL_DEBUG_LOG          |                      | traces, metrics, logs |
| otlp_grpc_endpoint | str       | ROTEL_OTLP_GRPC_ENDPOINT | localhost:4317       |                       |
| otlp_http_endpoint | str       | ROTEL_OTLP_HTTP_ENDPOINT | localhost:4318       |                       |

For each exporter you would like to use, see the configuration options below. Exporters should be
assigned to the `exporters` dict with a custom name.

## OTLP Exporter

To construct an OTLP exporter, use the method `Config.otlp_exporter()` with the following options.

| Option Name            | Type           | Default | Options      |
| ---------------------- | -------------- | ------- | ------------ |
| endpoint               | str            |         |              |
| protocol               | str            | grpc    | grpc or http |
| headers                | dict[str, str] |         |              |
| compression            | str            | gzip    | gzip or none |
| request_timeout        | str            | 5s      |              |
| retry_initial_backoff  | str            | 5s      |              |
| retry_max_backoff      | str            | 30s     |              |
| retry_max_elapsed_time | str            | 300s    |              |
| batch_max_size         | int            | 8192    |              |
| batch_timeout          | str            | 200ms   |              |
| tls_cert_file          | str            |         |              |
| tls_key_file           | str            |         |              |
| tls_ca_file            | str            |         |              |
| tls_skip_verify        | bool           |         |              |

## Datadog Exporter

Rotel provides an experimental [Datadog exporter](https://github.com/streamfold/rotel/blob/main/src/exporters/datadog/README.md)
that supports traces at the moment. Construct a Datadog exporter
with the method `Config.datadog_exporter()` using the following options.

| Option Name     | Type | Default | Options                |
| --------------- | ---- | ------- | ---------------------- |
| region          | str  | us1     | us1, us3, us5, eu, ap1 |
| custom_endpoint | str  |         |                        |
| api_key         | str  |         |                        |

## Clickhouse Exporter

Rotel provides a Clickhouse exporter with support metrics, logs, and traces. Construct a Clickhouse exporter with the
method `Config.clickhouse_exporter()` using the following options.

| Option Name     | Type | Default | Options |
| --------------- | ---- | ------- | ------- |
| endpoint        | str  |         |         |
| database        | str  | otel    |         |
| table_prefix    | str  | otel    |         |
| compression     | str  | lz4     |         |
| async_insert    | bool | true    |         |
| user            | str  |         |         |
| password        | str  |         |         |
| enable_json     | bool |         |         |
| json_underscore | bool |         |         |

## Kafka Exporter

Rotel provides a Kafka exporter with support for metrics, logs, and traces. Construct a Kafka exporter with the
method `Config.kafka_exporter()` using the following options.

| Option Name                                | Type | Default           | Options                                                                      |
| ------------------------------------------ | ---- | ----------------- | ---------------------------------------------------------------------------- |
| brokers                                    | list | localhost:9092    |                                                                              |
| traces_topic                               | str  | otlp_traces       |                                                                              |
| logs_topic                                 | str  | otlp_logs         |                                                                              |
| metrics_topic                              | str  | otlp_metrics      |                                                                              |
| format                                     | str  | protobuf          | json, protobuf                                                               |
| compression                                | str  | none              | gzip, snappy, lz4, zstd, none                                                |
| acks                                       | str  | one               | all, one, none                                                               |
| client_id                                  | str  | rotel             |                                                                              |
| max_message_bytes                          | int  | 1000000           |                                                                              |
| linger_ms                                  | int  | 5                 |                                                                              |
| retries                                    | int  | 2147483647        |                                                                              |
| retry_backoff_ms                           | int  | 100               |                                                                              |
| retry_backoff_max_ms                       | int  | 1000              |                                                                              |
| message_timeout_ms                         | int  | 300000            |                                                                              |
| request_timeout_ms                         | int  | 30000             |                                                                              |
| batch_size                                 | int  | 1000000           |                                                                              |
| partitioner                                | str  | consistent-random | consistent, consistent-randomm, murmur2-random, murmur2, fnv1a, fnv1a-random |
| partitioner_metrics_by_resource_attributes | str  | 1000              |                                                                              |
| partitioner_logs_by_resource_attributes    | str  | 1000              |                                                                              |
| custom_config                              | str  | 1000              |                                                                              |
| sasl_username                              | str  |                   |                                                                              |
| sasl_password                              | str  |                   |                                                                              |
| sasl_mechanism                             | str  |                   | plain, scram-sha256, scram-sha512                                            |
| security_protocol                          | str  | plaintext         | plaintext, ssl, sasl-plaintext, sasl-ssl                                     |

## Blackhole Exporter

The blackhole exporter can be configured by using the method `Config.blackhole_exporter()`. It
does not have any options.

## Multiple exporters

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
