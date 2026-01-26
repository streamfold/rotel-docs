---
sidebar_position: 1
---

# Overview

[Rotel Lambda Extension](https://github.com/streamfold/rotel-lambda-extension) is an advanced AWS Lambda extension layer, built on top of [Rotel](/docs/about/rotel). By minimizing binary size, reducing cold start latency, and lowering memory overhead, this extension optimizes performance and cost efficiency in AWS Lambda deployments.

The Rotel Lambda Extension integrates with the Lambda [TelemetryAPI](https://docs.aws.amazon.com/lambda/latest/dg/telemetry-api.html) to collect **function logs** and **extension logs** and will export them to the configured exporter. This can reduce your Lambda observability costs if you combine it with [disabling CloudWatch Logs](#disabling-cloudwatch-logs). 

## Using

Choose the Lambda layer that matches your Lambda runtime architecture. The `{version}` field
is dependent on the AWS region that you are deploying into. Check the [releases](https://github.com/streamfold/rotel-lambda-extension/releases)
page for the latest version numbers that correspond to your region.

| Architecture | ARN                                                                          |
| ------------ | ---------------------------------------------------------------------------- |
| x86-64/amd64 | `arn:aws:lambda:{region}:418653438961:layer:rotel-extension-amd64:{version}` |
| arm64        | `arn:aws:lambda:{region}:418653438961:layer:rotel-extension-arm64:{version}` |

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

## Disabling CloudWatch Logs

By default, AWS Lambda will send all Lambda logs to Amazon CloudWatch. To reduce costs, you may want to disable those logs if you are forwarding your logs to an external logging provider.

1. Open the AWS Console and navigate to AWS Lambda
2. Navigate to your Lambda function
3. Select Configuration -> Permissions
4. Click the execution role under "Role Name" to pop over to the IAM console
5. Edit the role in the IAM console and remove any `logs:*` actions
    - if you are using a custom policy, edit the policy to remove `logs:*` actions
    - if you are using an AWS Managed policy, like `AWSLambdaBasicExecutionRole`, remove it from the role
6. Save the role and your next execution should not send logs to CloudWatch

## Examples

These are example repos demonstrating how to use the Rotel Lambda Extension.

* [Node.js Auto Instrumentation](https://github.com/streamfold/nodejs-aws-lambda-example): This uses the Node.js auto instrumentation [layer](https://github.com/open-telemetry/opentelemetry-lambda/blob/main/nodejs/README.md) to instrument a Node.js app and emit metrics, logs and traces to Honeycomb.
* [Python + Clickhouse](https://github.com/streamfold/python-aws-lambda-clickhouse-example): Python application with manual OpenTelemetry instrumentation, sending OpenTelemetry traces and logs to Clickhouse. All Lambda logs are converted to OTel and immediately sent to Clickhouse, so this can avoid expensive Cloudwatch log costs. This example uses the JSON data type by default to improve the query support for OTel key/value attributes.
