---
sidebar_position: 3
---

# Log Processors

AWS FireLens Rotel supports loading OTLP log processors to transform or filter logs before they are exported. Processors can be written in Python using Rotel's [Processor SDK](/docs/category/processor-sdk) and loaded from Amazon S3.

## Overview

Log processors allow you to:
- Parse JSON logs and extract structured fields
- Filter logs based on content or attributes
- Add, modify, or remove log attributes
- Extract trace IDs, log levels, and timestamps
- Transform log data before sending to your observability backend

The aws-firelens-rotel environment is automatically set up with Python 3.13, so you can write sophisticated processors using modern Python features.

## Configuration

### Loading Processors from S3

Set the `S3_OTLP_LOG_PROCESSORS` environment variable on the `log_router` container with a comma-separated list of S3 URIs:

```json
{
  "name": "log_router",
  "image": "streamfold/aws-firelens-rotel:latest",
  "firelensConfiguration": {
    "type": "fluentbit"
  },
  "environment": [
    {
      "name": "S3_OTLP_LOG_PROCESSORS",
      "value": "s3://my-bucket/processors/parse_json.py,s3://my-bucket/processors/filter.py"
    },
    {
      "name": "ROTEL_EXPORTER",
      "value": "otlp"
    }
  ]
}
```

### How It Works

1. The launcher downloads processor files from the specified S3 URIs
2. Files are saved to `/tmp/log_processors/`
3. The launcher automatically sets `ROTEL_OTLP_WITH_LOGS_PROCESSOR` with the downloaded file paths
4. Processors are executed in the order specified in the comma-separated list

### Required IAM Permissions

Your ECS task role must include S3 permissions to download the processor files:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-bucket/processors/*"
      ]
    }
  ]
}
```

## Example Processor

Here's an example processor that parses JSON logs and extracts structured fields like log level, trace IDs, and timestamps:

```python title="parse_json_logs.py"
import itertools
import json

from rotel_sdk.open_telemetry.common.v1 import AnyValue, KeyValue
from rotel_sdk.open_telemetry.logs.v1 import ResourceLogs

def process_logs(resource_logs: ResourceLogs):
    """
    Parses JSON log bodies and sets fields based on the properties of the JSON log.
    The remaining top-level keys are set as attributes on the log record.
    """

    for log_record in itertools.chain.from_iterable(
        scope_log.log_records for scope_log in resource_logs.scope_logs
    ):
        try:
            if not log_record.body:
                continue
            
            if not isinstance(log_record.body.value, str):
                continue
                
            if not log_record.body.value.startswith("{"):
                continue

            log = json.loads(log_record.body.value)

            # Body may be in message, msg, or log
            for key in ["message", "msg", "log"]:
                if key in log and log[key]:
                    log_record.body = AnyValue(log[key])
                    del log[key]
                    break
            # Extract trace and span ID's if available
            if "trace_id" in log and log["trace_id"]:
                log_record.trace_id = bytes.fromhex(log["trace_id"])
                del log["trace_id"]
            if "span_id" in log and log["span_id"]:
                log_record.span_id = bytes.fromhex(log["span_id"])
                del log["span_id"]

            # Extract log level if available
            # TODO: Use a contstant for these
            if "level" in log and log["level"]:
                level = log["level"].lower()
                if level == "info":
                    log_record.severity_number = 9
                elif level == "warn":
                    log_record.severity_number = 13
                elif level == "error":
                    log_record.severity_number = 17
                elif level == "debug":
                    log_record.severity_number = 5
                elif level == "fatal":
                    log_record.severity_number = 21
                elif level == "trace":
                    log_record.severity_number = 1

                log_record.severity_text = log["level"]
                del log["level"]

            # Parse and remove timestamps
            for key in ["timestamp", "ts"]:
                if key in log and log[key]:
                    # Parse timestamp - could be RFC3339 or integer seconds
                    timestamp_value = log[key]
                    if isinstance(timestamp_value, str):
                        # Try parsing as RFC3339 format
                        import datetime

                        try:
                            dt = datetime.datetime.fromisoformat(
                                timestamp_value.replace("Z", "+00:00")
                            )
                            timestamp_ns = int(dt.timestamp() * 1_000_000_000)
                        except ValueError:
                            # If RFC3339 parsing fails, try as string representation of number
                            try:
                                timestamp_ns = int(
                                    float(timestamp_value) * 1_000_000_000
                                )
                            except ValueError:
                                continue
                    else:
                        # Assume it's a numeric value in seconds
                        timestamp_ns = int(float(timestamp_value) * 1_000_000_000)

                    log_record.time_unix_nano = timestamp_ns
                    del log[key]
                    break

            # Add remaining log fields as attributes
            for key, value in log.items():
                log_record.attributes.append(KeyValue(key, AnyValue(value)))

        except Exception as _e:
            pass
```

## Multiple Processors

You can chain multiple processors together. They will be executed in the order specified:

```json
{
  "name": "S3_OTLP_LOG_PROCESSORS",
  "value": "s3://my-bucket/processors/parse_json.py,s3://my-bucket/processors/add_metadata.py,s3://my-bucket/processors/filter_debug.py"
}
```

In this example:
1. `parse_json.py` - Parses JSON logs and extracts fields
2. `add_metadata.py` - Adds additional metadata to logs
3. `filter_debug.py` - Filters out debug-level logs

## Writing Processors

See the [Processor SDK](/docs/category/processor-sdk) documentation for detailed information on writing log processors, including:

- [Python SDK](/docs/processor-sdk/python) - Python API reference
- [Processor Interface](/docs/processor-sdk/interface) - Processor contract and behavior
- [Examples](/docs/examples/processors) - More processor examples
