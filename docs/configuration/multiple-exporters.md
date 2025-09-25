---
sidebar_position: 3
---

# Multiple Exporters

Rotel can be configured to support exporting to multiple destinations across multiple exporter types.

The following additional configuration parameters set up support for multiple exporters. Similar to the base configuration
options, all
CLI arguments can be passed as environment variables as well. It is not possible to set `--exporter` and `--exporters`
at the same time.

| Option              | Default | Options                          |
|---------------------|---------|----------------------------------|
| --exporters         |         | name:type pairs, comma-separated |
| --exporters-traces  |         | exporter name                    |
| --exporters-metrics |         | exporter name                    |
| --exporters-logs    |         | exporter name                    |

First start by defining the set of exporters that you would like to use, optionally specifying a custom name for them
to differentiate their configuration options. For example, to export logs and metrics to two separate Clickhouse nodes
while exporting traces to Datadog, we'll use the following `--exporters` argument (or `ROTEL_EXPORTERS` envvar):

```bash
--exporters logging:clickhouse,stats:clickhouse,datadog
```

The argument form of `--exporters` takes `name:type` pairs separated by commas, where the first part is a custom name and
the second part is the type of exporter. You can exclude the name if there is a single exporter by that name, which means
the name is the same as the exporter type.

Next you must set environment variables in the form `ROTEL_EXPORTER_{NAME}_{PARAMETER}` to configure the multiple
exporters. These variable names are dynamic and use the custom name to differentiate settings for similar exporter types.
These must be specified by environment variables, there are no CLI argument alternatives for them.
The `{PARAMETER}` fields match the configuration options for the given exporter type.

Using our example above, the user must set, at a minimum, the following environment variables. (For Clickhouse Cloud you
would need to include a username/password, but we are skipping those for brevity.)

* `ROTEL_EXPORTER_LOGGING_ENDPOINT=https://xxxxxxx.us-east-1.aws.clickhouse.cloud:8443`
* `ROTEL_EXPORTER_STATS_ENDPOINT=https://xxxxxxx.us-west-1.aws.clickhouse.cloud:8443`
* `ROTEL_EXPORTER_DATADOG_API_KEY=dd-abcd1234`

Lastly, the user would need to connect these exporters to the telemetry types. Using the requirements above, the user
would specify the following:

```bash
--exporters-traces datadog --exporters-metrics stats --exporters-logs logging
```

Alternatively, the following environment variables would do the same:
* `ROTEL_EXPORTERS_TRACES=datadog`
* `ROTEL_EXPORTERS_METRICS=stats`
* `ROTEL_EXPORTERS_LOGS=logging`

That's it, Rotel will now export logs and metrics to different Clickhouse Cloud endpoints while sending traces to
Datadog.

The [Python Lamba + Clickhouse Example](/docs/examples/lambda-clickhouse.md) includes an example of multiple exporter configuration.

:::note

At the moment, only a single exporter can be set for any telemetry type. This constraint will be relaxed in the
future.

:::
