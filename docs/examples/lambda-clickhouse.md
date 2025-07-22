---
sidebar_position: 2
---

# AWS Lambda + Clickhouse

This example showcases the integration of the Rotel Lambda Extension with Clickhouse to store OpenTelemetry traces and logs. Application traces and Lambda output logs are sent directly to Clickhouse from AWS Lambda, so you can skip Cloudwatch entirely. This example leverages the new Clickhouse JSON data type to store key/value telemetry attributes efficiently.

This also demonstrates [multiple exporters](/docs/configuration/multiple-exporters.md) configuration by exporting metrics to the blackhole exporter.

[python-aws-lambda-clickhouse-example](https://github.com/streamfold/python-aws-lambda-clickhouse-example)
