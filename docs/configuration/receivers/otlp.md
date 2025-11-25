---
sidebar_position: 1
---

# OTLP Receiver

Receive OpenTelemetry over OpenTelemetry Protocol (OTLP).

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | ✅      |
| Logs           | ✅      |
| Metrics        | ✅      |

---

The OTLP receiver is the default receiver if no other receiver is selected, or you can explicitly select it with `--receiver otlp`.


| Option                            | Default              | Options                                                      |
| --------------------------------- | -------------------- | ------------------------------------------------------------ |
| --otlp-receiver-traces-disabled   |                      |                                                              |
| --otlp-receiver-metrics-disabled  |                      |                                                              |
| --otlp-receiver-logs-disabled     |                      |                                                              |
| --otlp-receiver-traces-http-path  | /v1/traces           |                                                              |
| --otlp-receiver-metrics-http-path | /v1/metrics          |                                                              |
| --otlp-receiver-logs-http-path    | /v1/logs             |                                                              |
