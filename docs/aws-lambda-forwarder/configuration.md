---
sidebar_position: 3
---

# Configuration

The Lambda Forwarder is configured via the same environment variables supported by Rotel,
as documented in the [Configuration](/docs/category/configuration) section.

## Retrying and Reliability

The Lambda Forwarder relies on the at-least-once reliability built into Rotel to ensure
that an incoming request is successfully exported before returning success. This means that
the Lambda function duration will include the time to export to all configured exporters.
If an incoming logs request cannot be exported during the function's duration, the Lambda
Forwarder will return a failure. CloudWatch is stated to retry up to 24 hours for any
unsuccessful subscription Lambda request.

Given that failures will be retried by CloudWatch, it makes little sense for Rotel to retry
export requests past the maximum function duration. You should set the following environment
variable to prevent requests from retrying past the function timeout. This should be set to
match the function's maximum timeout.

```bash
ROTEL_EXPORTER_RETRY_MAX_ELAPSED_TIME=30s
```

## Log Group Tag Caching

The Lambda Forwarder automatically retrieves and caches tags associated with CloudWatch log
groups. Tags are added as resource attributes in the format `cloudwatch.log.tags.<tag-key>`.

:::note
When deploying via CloudFormation, an S3 bucket for tag caching is automatically created
with the name `rotel-lambda-forwarder-<stack-name>-<account-id>`. For manual deployments,
you need to create an S3 bucket and set the `FORWARDER_S3_BUCKET` environment variable.
:::

### How It Works

1. **First Request**: When logs are received from a log group for the first time, the forwarder
   calls the CloudWatch Logs `ListTagsForResource` API to fetch tags.
2. **Caching**: Tags are cached in memory with a 15-minute TTL to avoid repeated API calls.
3. **S3 Persistence**: If configured with an S3 bucket, the tag cache is persisted to S3 for
   durability across Lambda cold starts.
4. **Automatic Updates**: The cache is automatically updated when new log groups are encountered
   or when cached entries expire.

### S3 Configuration

For manual deployments, set the `FORWARDER_S3_BUCKET` environment variable:

```bash
FORWARDER_S3_BUCKET=your-cache-bucket-name
```

The cache file is stored at:

```
s3://<bucket>/rotel-lambda-forwarder/cache/log-groups/tags.json.gz
```

:::note
If you don't need tag enrichment, you can omit the `logs:ListTagsForResource` permission from
the Lambda's IAM role. A circuit breaker will activate on the first log batch and the forwarder
will continue processing logs without tags.
:::

### Example

If a log group has tags `env=production` and `team=platform`, the resource attributes will include:
- `cloudwatch.log.tags.env` = `production`
- `cloudwatch.log.tags.team` = `platform`

## S3 Log Processing

When using S3 event notifications to process log files, you can configure processing behavior
with these environment variables:

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `FORWARDER_S3_MAX_PARALLEL_OBJECTS` | Maximum number of S3 objects to process concurrently | `5` |
| `FORWARDER_S3_BATCH_SIZE` | Number of log records to batch per ResourceLog | `1000` |

See the [Parsing and Formatting](./parsing-and-formatting.md#s3-log-processing) page for complete setup instructions.

## OTLP Log Processors

You can configure OTLP log processors to transform or filter logs before they are exported.
The Lambda Forwarder supports loading processor configurations from any HTTP/HTTPS endpoint
or S3 bucket.

:::note
Python log processors are only supported when using the Docker container deployment method.
:::

See the [Processor SDK](/docs/category/processor-sdk) documentation for how to build processors.

Set the `FORWARDER_OTLP_LOG_PROCESSORS` environment variable on the Lambda function, or use the
`LogProcessors` CloudFormation parameter:

```bash
FORWARDER_OTLP_LOG_PROCESSORS="https://gist.githubusercontent.com/mheffner/4d4aaa0f3f7ffc620fb740763f4e0098/raw/parse_vpc_logs.py,s3://my-bucket-name/processors/filter-ecs-logs.py"
```

:::note
If you load processors from an S3 bucket, make sure the Lambda execution role has IAM permissions
to read from that bucket.
:::

**Features:**
- Multiple URIs can be specified as a comma-separated list (supports `http`, `https`, and `s3`)
- Processors are downloaded to `/tmp/log_processors/`
- Processors are executed in the order specified in `FORWARDER_OTLP_LOG_PROCESSORS`

### Example

The following processor filters VPC Flow Log records that have `action == REJECT`, discarding
them before they are exported:

```python
import itertools
import json

from rotel_sdk.open_telemetry.common.v1 import AnyValue, KeyValue
from rotel_sdk.open_telemetry.logs.v1 import ResourceLogs

def process_logs(resource_logs: ResourceLogs):
    """
    Look for VPC flow logs and filter logs that have action == REJECT
    """

    if resource_logs.resource and resource_logs.resource.attributes:
        # Check if this is an AWS VPC Flow Log
        vpc_flow_log_found = False
        for attr in resource_logs.resource.attributes:
            if attr.key == "cloud.platform" and isinstance(attr.value.value, str) and attr.value.value == "aws_vpc_flow_log":
                vpc_flow_log_found = True
                break

        if not vpc_flow_log_found:
            return

    # Filter out VPC flow logs with action == "REJECT"
    for scope_log in resource_logs.scope_logs:
        filtered_log_records = []
        for log_record in scope_log.log_records:
            # Check if this log record has action == "REJECT"
            should_keep = True
            for attr in log_record.attributes:
                if attr.key == "action" and isinstance(attr.value.value, str) and attr.value.value == "REJECT":
                    should_keep = False
                    break

            if should_keep:
                filtered_log_records.append(log_record)

        # Replace the log_records with the filtered list
        scope_log.log_records = filtered_log_records
```
