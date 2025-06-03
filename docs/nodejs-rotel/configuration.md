---
sidebar_position: 3
---

# Configuration

This is the full list of options and their environment variable alternatives. Any defaults left blank in the table are either False or None.

| Option Name                    | Type         | Environ                              | Default              | Options         |
|--------------------------------|--------------|--------------------------------------|----------------------|-----------------|
| enabled                        | boolean      | ROTEL_ENABLED                        |                      |                 |
| pid_file                       | string       | ROTEL_PID_FILE                       | /tmp/rotel-agent.pid |                 |
| log_file                       | string       | ROTEL_LOG_FILE                       | /tmp/rotel-agent.log |                 |
| log_format                     | string       | ROTEL_LOG_FORMAT                     | text                 | json, text      |
| debug_log                      | string[]     | ROTEL_DEBUG_LOG                      |                      | traces, metrics |
| otlp_grpc_endpoint             | string       | ROTEL_OTLP_GRPC_ENDPOINT             | localhost:4317       |                 |
| otlp_http_endpoint             | string       | ROTEL_OTLP_HTTP_ENDPOINT             | localhost:4318       |                 |
| otlp_receiver_traces_disabled  | boolean      | ROTEL_OTLP_RECEIVER_TRACES_DISABLED  |                      |                 |
| otlp_receiver_metrics_disabled | boolean      | ROTEL_OTLP_RECEIVER_METRICS_DISABLED |                      |                 |
| otlp_receiver_logs_disabled    | boolean      | ROTEL_OTLP_RECEIVER_LOGS_DISABLED    |                      |                 |
| exporter                       | OTLPExporter |                                      |                      |                 |

The OTLPExporter can be enabled with the following options.

| Option Name            | Type                | Environ                                    | Default | Options      |
|------------------------|---------------------|--------------------------------------------|---------|--------------|
| endpoint               | string              | ROTEL_OTLP_EXPORTER_ENDPOINT               |         |              |
| protocol               | string              | ROTEL_OTLP_EXPORTER_PROTOCOL               | grpc    | grpc or http |
| headers                | Map[string, string] | ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS         |         |              |
| compression            | string              | ROTEL_OTLP_EXPORTER_COMPRESSION            | gzip    | gzip or none |
| request_timeout        | string              | ROTEL_OTLP_EXPORTER_REQUEST_TIMEOUT        | 5s      |              |
| retry_initial_backoff  | string              | ROTEL_OTLP_EXPORTER_RETRY_INITIAL_BACKOFF  | 5s      |              |
| retry_max_backoff      | string              | ROTEL_OTLP_EXPORTER_RETRY_MAX_BACKOFF      | 30s     |              |
| retry_max_elapsed_time | string              | ROTEL_OTLP_EXPORTER_RETRY_MAX_ELAPSED_TIME | 300s    |              |
| batch_max_size         | number              | ROTEL_OTLP_EXPORTER_BATCH_MAX_SIZE         | 8192    |              |
| batch_timeout          | string              | ROTEL_OTLP_EXPORTER_BATCH_TIMEOUT          | 200ms   |              |
| tls_cert_file          | string              | ROTEL_OTLP_EXPORTER_TLS_CERT_FILE          |         |              |
| tls_key_file           | string              | ROTEL_OTLP_EXPORTER_TLS_KEY_FILE           |         |              |
| tls_ca_file            | string              | ROTEL_OTLP_EXPORTER_TLS_CA_FILE            |         |              |
| tls_skip_verify        | boolean             | ROTEL_OTLP_EXPORTER_TLS_SKIP_VERIFY        |         |              |
