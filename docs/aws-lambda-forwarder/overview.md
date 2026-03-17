---
sidebar_position: 1
---

# Overview

[Rotel Lambda Forwarder](https://github.com/streamfold/rotel-lambda-forwarder) is an AWS Lambda function written in Rust that forwards CloudWatch and S3-stored logs to OpenTelemetry-compatible backends. It receives requests triggered by either CloudWatch Logs subscription filters or S3 event notifications, transforms them into OpenTelemetry log format, and exports them using the [Rotel](https://github.com/streamfold/rotel) agent. This is built on the existing Rotel OpenTelemetry data plane, so logs can be exported to any [supported exporter](/docs/category/exporters). Logs can be filtered, transformed, or enriched by adding small processor functions written in Python.

By leveraging the high-performance Rotel data plane, Rotel Lambda Forwarder can transform logs at high volume while minimizing Lambda runtime duration costs.

## Features

- **OpenTelemetry Native**: Transforms all logs to OpenTelemetry format
- **Multiple Log Sources**: Supports both CloudWatch Logs subscriptions and S3 event notifications
- **Multiple Export Targets**: Supports OTLP HTTP/gRPC and other exporters via Rotel
- **Python Log Processors**: Filter, transform, and enrich logs with Python before exporting
- **Automatic Parsing**: Support for JSON and key=value parsing, with automatic detection
- **Log Stream Parser Mapping**: Pre-built parser rules for known AWS CloudWatch log groups/streams
- **AWS Resource Attributes**: Automatically enriches logs with AWS Lambda metadata and resource tags
- **Reliable Delivery**: Ensures logs are delivered successfully

## Supported Services

The following services have been tested to work via CloudWatch and/or S3 logs. They include custom log
source detection and additional custom handling.

Unlisted services that log via CloudWatch or S3 will likely work, but may be missing custom processing. This list will
be expanded as we verify support for additional services.

| **Source**             | **Location**        |
| ---------------------- | ------------------- |
| CodeBuild Logs         | CloudWatch          |
| CloudWatch Logs        | CloudWatch          |
| CloudTrail Logs        | CloudWatch, S3      |
| EKS Control Plane Logs | CloudWatch          |
| Lambda Logs            | CloudWatch          |
| VPC Flow Logs          | CloudWatch, S3      |