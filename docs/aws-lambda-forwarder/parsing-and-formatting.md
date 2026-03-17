---
sidebar_position: 4
---

# Parsing and Formatting

## Attribute Mapping

### Log Record Field Mapping

The forwarder attempts to map attributes from a log line to top-level properties of the
OTLP log record when possible. This may vary by log source.

| **Field** | **Description** |
| --------- | --------------- |
| `trace_id` / `span_id` | If present and matching the OTLP format, promoted to the log record fields |
| `severity_text` / `severity_number` | Attempts to map the `level` field to severity fields if possible |
| `timestamp` | Pulled from log fields if possible, otherwise falls back to the observed arrival time |
| `body` | Looks for `log`, `msg`, or `message` fields. Some log sources construct an appropriate body from custom attribute fields |

If a log record cannot be parsed into structured fields, the `body` of the log record is set
to the full string contents of the log.

### Remaining Attributes

The remaining attributes that are not mapped to top-level log record fields are persisted and
stored in the `attributes` field of the log record. Attribute names are kept identical to their
original values in the incoming CloudWatch log record. The forwarder does not remap these field
names by default.

This is intentional for several reasons:

- **Translation loss**: Remapping field names makes it challenging to cross-reference AWS
  documentation, requiring a guide to map between contexts.
- **Schema versioning**: Changes to the mapping would require versioning or migration to avoid
  breaking existing queries.

The forwarder adds a `cloudwatch.id` field to the log record attributes representing the unique
ID of the log record in CloudWatch. This can be used to deduplicate log records.

## Field Stripping

The forwarder supports stripping message fields before they are converted to OTLP log record
attributes. This allows sensitive, verbose, or otherwise unnecessary fields to be removed before
shipping them to an exporter.

Field stripping is currently hard-coded based on the platform from which the log record is
received. Configurable field stripping is planned for a future release.

### EKS

The following fields are stripped from EKS log records:

- `responseElements.credentials.sessionToken`

## VPC Flow Logs

The forwarder includes comprehensive support for AWS VPC Flow Logs written to CloudWatch or S3.

### Automatic Format Detection

- **Dynamic Configuration**: Automatically fetches and caches flow log configurations from the EC2 API
- **Custom Formats**: Supports custom log formats defined in your VPC Flow Log configuration
- **Format Caching**: Caches parsed format configurations with a 30-minute TTL to minimize API calls
- **S3 Persistence**: Flow log configurations are persisted to S3 for durability across Lambda cold starts

### Typed Field Parsing

VPC Flow Log fields are parsed according to their AWS-defined data types per the
[AWS VPC Flow Logs documentation](https://docs.aws.amazon.com/vpc/latest/userguide/flow-log-records.html).

### Configuration

VPC Flow Logs are automatically detected when either the CloudWatch Log Group name or S3 bucket and prefix match the pattern for VPC Flow Logs. No additional configuration is required.

The Lambda function requires the following IAM permission to fetch flow log configurations:

```json
{
  "Effect": "Allow",
  "Action": ["ec2:DescribeFlowLogs"],
  "Resource": "*"
}
```

This permission is included in the CloudFormation templates by default.

:::note
When flow logs are sent to Cloudwatch they should be sent to unique CloudWatch Log Groups.
If multiple flow logs are exported to
the same log group, the Lambda Forwarder will be unable to correctly parse the fields.
:::
