---
sidebar_position: 2
---

# Configuration

The AWS FireLens Rotel integration is configured using the same environment variables documented for Rotel, [documented here](/docs/category/configuration).

## Environment Variables Set by Launcher

The Go launcher automatically sets these environment variables based on the Fluent Bit configuration that AWS FireLens provides:

| Variable | Description | Example |
|----------|-------------|---------|
| `ROTEL_FLUENT_RECEIVER_ENDPOINT` | TCP endpoint for Fluent Bit forward protocol | `127.0.0.1:24224` |
| `ROTEL_FLUENT_RECEIVER_SOCKET_PATH` | Unix socket path for Fluent Bit forward protocol | `/var/run/fluent.sock` |
| `ROTEL_OTEL_RESOURCE_ATTRIBUTES` | Resource attributes from ECS attributes | `ecs_cluster=prod,ecs_task_arn=arn:aws:...` |

These variables are automatically configured by the launcher, so you don't need to set them manually.

## Exporter Configuration

Configure your preferred exporter using environment variables on the `log_router` container in your ECS task definition.

### Example: ClickHouse

```json
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
```

### Example: OTLP (Generic)

```json
{
  "name": "log_router",
  "image": "streamfold/aws-firelens-rotel:latest",
  "firelensConfiguration": {
    "type": "fluentbit"
  },
  "environment": [
    {
      "name": "ROTEL_OTLP_EXPORTER_ENDPOINT",
      "value": "https://api.honeycomb.io"
    },
    {
      "name": "ROTEL_OTLP_EXPORTER_PROTOCOL",
      "value": "http"
    },
    {
      "name": "ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS",
      "value": "x-honeycomb-team=your-api-key"
    },
    {
      "name": "ROTEL_EXPORTER",
      "value": "otlp"
    }
  ]
}
```

## Using AWS Secrets Manager

For sensitive configuration values like passwords and API keys, use AWS Secrets Manager with ECS:

```json
{
  "name": "log_router",
  "image": "streamfold/aws-firelens-rotel:latest",
  "firelensConfiguration": {
    "type": "fluentbit"
  },
  "secrets": [
    {
      "name": "ROTEL_CLICKHOUSE_EXPORTER_PASSWORD",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:clickhouse-password-abc123"
    }
  ],
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
      "name": "ROTEL_EXPORTER",
      "value": "clickhouse"
    }
  ]
}
```

:::tip
Make sure your ECS task execution role has permissions to access the secrets in AWS Secrets Manager.
:::
