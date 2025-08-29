---
sidebar_position: 3
---

# ClickHouse Exporter

Export OpenTelemetry metrics, logs and traces to ClickHouse.

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | Alpha   |
| Logs           | Alpha   |
| Metrics        | Alpha   |

## Options

The ClickHouse exporter can be selected by passing `--exporter clickhouse`. The ClickHouse exporter has full support
for traces, logs, and metrics.

| Option                                | Default | Options     |
| ------------------------------------- | ------- | ----------- |
| --clickhouse-exporter-endpoint        |         |             |
| --clickhouse-exporter-database        | otel    |             |
| --clickhouse-exporter-table-prefix    | otel    |             |
| --clickhouse-exporter-compression     | lz4     | none, lz4   |
| --clickhouse-exporter-async-insert    | true    | true, false |
| --clickhouse-exporter-request-timeout | 5s      |             |
| --clickhouse-exporter-enable-json     |         |             |
| --clickhouse-exporter-json-underscore |         |             |
| --clickhouse-exporter-user            |         |             |
| --clickhouse-exporter-password        |         |             |

## Table naming

The ClickHouse endpoint must be specified while all other options can be left as defaults. The table prefix is prefixed
onto the specific telemetry table name with underscore, so a table prefix of `otel` will be combined with `_traces` to
generate the full table name of `otel_traces`.

## Async inserts

The ClickHouse exporter will enable [async inserts](https://clickhouse.com/docs/optimize/asynchronous-inserts) by
default,
although it can be disabled server-side. Async inserts are
recommended for most workloads to avoid overloading ClickHouse with many small inserts. Async inserts can be disabled by
specifying:
`--clickhouse-exporter-async-insert false`.

## DDL

The exporter will not generate the table schema if it does not exist. Use the
[clickhouse-ddl](https://github.com/streamfold/rotel/blob/main/src/bin/clickhouse-ddl/README.md) command for generating the necessary table DDL for ClickHouse. The
DDL matches the schema used in the
OpenTelemetry [ClickHouse exporter](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/exporter/clickhouseexporter/README.md).

## JSON

Enabling JSON via the `--clickhouse-exporter-enable-json` will use the new
[JSON data type](https://clickhouse.com/docs/sql-reference/data-types/newjson) in ClickHouse. This data
type is only available on the most recent versions of ClickHouse. Make sure that you enable JSON with `--enable-json`
when creating tables with `clickhouse-ddl`. By default, any JSON key inserted with a period in it will create
a nested JSON object. You can replace periods in JSON keys with underscores by passing the option
`--clickhouse-exporter-json-underscore` which will keep the JSON keys flat. For example, the resource attribute
`service.name` will be inserted as `service_name`.

---

:::note

The ClickHouse exporter is built using code from the official Rust [clickhouse-rs](https://crates.io/crates/clickhouse)
crate.

:::
