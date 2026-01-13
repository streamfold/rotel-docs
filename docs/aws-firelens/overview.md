---
sidebar_position: 1
---

# Overview

[AWS FireLens Rotel](https://github.com/streamfold/aws-firelens-rotel) is a lightweight, high-performance integration that combines [AWS FireLens](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html) with [Rotel](/docs/about/rotel), a high-performance and resource-efficient OpenTelemetry collection data plane written in Rust. This project enables seamless collection and forwarding of container logs and metrics from Amazon ECS tasks to OpenTelemetry-compatible backends.

This replaces the use of Fluent Bit or Fluentd as the `log_router` container.

## Benefits

* **Native OpenTelemetry support** - No need for additional containers/collectors
* **High performance** - Built on Rotel's efficient Rust foundation
* **Flexible log processing** - Write log processors in Python, download from S3
* **Drop-in replacement** - Simply switch the container image in your ECS task definition

## How It Works

AWS FireLens provides native integration with Fluent Bit for log routing in ECS tasks. This project provides an alternative based on the Rotel project:

* Uses a small Go launcher to read the Fluent Bit configuration file to parse out the listen address and Unix socket path
* Go launcher sets appropriate environment variables for Rotel before launching it
* Just switch the container name and set Rotel exporter configuration
* Add multiple log processors based on Rotel's [Python Processor SDK](/docs/category/processor-sdk)

Rotel automatically starts a native OpenTelemetry receiver on localhost ports 4317 (gRPC) and 4318 (HTTP). ECS logs are automatically converted to OTLP log format.

## Quick Start

### Using with AWS ECS

1. Add the FireLens Rotel container to your ECS task definition
2. Set Rotel environment variable [configuration](/docs/category/configuration) variables on the `log_router` container

For example, to export logs, metrics and traces to ClickHouse Cloud:

```json
{
  "family": "my-task",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "my-app:latest",
      "logConfiguration": {
        "logDriver": "awsfirelens",
        "options": {}
      }
    },
    {
      "name": "log_router",
      "image": "streamfold/aws-firelens-rotel:latest",
      "firelensConfiguration": {
        "type": "fluentbit"
      },
      "environment": [
        {
          "name": "ROTEL_CLICKHOUSE_EXPORTER_ENDPOINT",
          "value": "https://xxxx.us-east-1.aws.clickhouse.cloud:8443"
        },
        {
          "name": "ROTEL_CLICKHOUSE_EXPORTER_USER",
          "value": "default"
        },
        {
          "name": "ROTEL_CLICKHOUSE_EXPORTER_PASSWORD",
          "value": "my-password"
        },
        {
          "name": "ROTEL_EXPORTER",
          "value": "clickhouse"
        }
      ]
    }
  ]
}
```

## Container Image

The FireLens Rotel container is available on Docker Hub:

```
streamfold/aws-firelens-rotel:latest
```

## Next Steps

- Learn about [Configuration](/docs/aws-firelens/configuration) options
- Explore [Log Processors](/docs/aws-firelens/log-processors) for transforming logs
- Review available [Exporters](/docs/category/configuration) for your observability backend