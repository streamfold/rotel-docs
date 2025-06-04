---
sidebar_position: 1
---

# Overview

[Rotel Lambda Extension](https://github.com/streamfold/rotel-lambda-extension) is an advanced AWS Lambda extension layer, built on top of [Rotel](https://github.com/streamfold/rotel)—a lightweight, high-performance and low overhead OpenTelemetry Collector perfectly suited for resource-constrained environments. By minimizing binary size, reducing cold start latency, and lowering memory overhead, this extension optimizes performance and cost efficiency in AWS Lambda deployments.

The Rotel Lambda Extension integrates with the Lambda [TelemetryAPI](https://docs.aws.amazon.com/lambda/latest/dg/telemetry-api.html) to collect **function logs** and **extension logs** and will export them to the configured exporter. This can reduce your Lambda observability costs if you combine it with [disabling CloudWatch Logs](#disabling-cloudwatch-logs). 

## Using

Choose the Lambda layer that matches your Lambda runtime architecture (**alpha** versions shown):

**x86-64/amd64**
```
arn:aws:lambda:{region}:418653438961:layer:rotel-extension-amd64-alpha:{version}
```

**arm64**
```
arn:aws:lambda:{region}:418653438961:layer:rotel-extension-arm64-alpha:{version}
```

The layer is deployed in the following AWS regions (if you don't see yours, let us know!):
- us-east-{1, 2}, us-west-{1, 2}
- eu-central-1, eu-north-1, eu-west-{1, 2, 3}
- ca-central-1
- ap-southeast-{1, 2}, ap-northeast-{1, 2}
- ap-south-1
- sa-east-1

The layer supports the Amazon Linux 2023
[Lambda runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-supported)
(`provided.al2023`).

The _version_ field should match the integer value for the latest release on the
[Releases](https://github.com/streamfold/rotel-lambda-extension/releases) page,
for example `v12-alpha` should use `12` as the version.


## Examples

These are example repos demonstrating how to use the Rotel Lambda Extension.

* [Node.js Auto Instrumentation](https://github.com/streamfold/nodejs-aws-lambda-example): This uses the Node.js auto instrumentation [layer](https://github.com/open-telemetry/opentelemetry-lambda/blob/main/nodejs/README.md) to instrument a Node.js app and emit metrics, logs and traces to Honeycomb.
* [Python + Clickhouse](https://github.com/streamfold/python-aws-lambda-clickhouse-example): Python application with manual OpenTelemetry instrumentation, sending OpenTelemetry traces and logs to Clickhouse. All Lambda logs are converted to OTel and immediately sent to Clickhouse, so this can avoid expensive Cloudwatch log costs. This example uses the JSON data type by default to improve the query support for OTel key/value attributes.
