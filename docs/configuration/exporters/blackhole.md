---
sidebar_position: 5
---

# Blackhole Exporter

| Telemetry Type | Support |
|----------------|---------|
| Traces         | Alpha   |
| Metric         | Alpha   |
| Logs           | Alpha   |


The blackhole exporter will drop all telemetry exported immediately. It can be useful when debugging
and you're using the `--debug-log` option to log telemetry. It can also be useful if you are using
an exporter that doesn't support a given telemetry type, but you'd still like to listen and receive
the remaining telemetry types.

The blackhole exporter can be used by specifying `--exporter blackhole`.