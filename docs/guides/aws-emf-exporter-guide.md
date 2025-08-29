# AWS EMF Exporter Guide

This guide walks you through using Rotel's AWS EMF (Embedded Metric Format) exporter to efficiently send metrics to CloudWatch while maintaining cost control and query flexibility.

## What is AWS EMF?

AWS [Embedded Metric Format (EMF)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) is a JSON specification that allows you to generate CloudWatch metrics through structured log events. Instead of directly publishing metrics to CloudWatch, EMF works by:

1. **Embedding metrics in logs** - Your application writes JSON-formatted log entries containing both metric data and metadata
2. **Automatic extraction** - CloudWatch automatically extracts metrics from these logs for visualization and alerting
3. **Dual benefits** - You get both detailed logs for debugging and aggregated metrics for monitoring

The key advantage is that you can include high-cardinality data in your logs (like user IDs, request IDs, or detailed error information) while only creating cost-effective, aggregated metrics in CloudWatch. When you need to dive deeper, you can query the rich log data using [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html).

### Grouping common metrics

When you publish OpenTelemetry metrics, there may be multiple metrics representing different measured values, but all with the same data point attributes. When publishing these
metrics as an EMF log event, they can be collapsed into a single log event as multi-variate metrics. Given that the data point attributes are the same, a single log event can
represent each of the metric values. Rotel will automatically group all metrics of similar type with matching unit type, resource, and data point attributes.

## Basic Usage

To use the AWS EMF exporter with Rotel, simply specify it when starting:

```bash
rotel --exporter awsemf
```

Any OpenTelemetry metrics received will be emitted to the default AWS region (`us-east-1`). Because the AWS EMF exporter only supports
metrics, you may want to configure [multiple exporters](/docs/configuration/multiple-exporters) to send traces and logs to other destinations.

## Key Configuration Options

### AWS Credentials and Region

The exporter automatically uses standard AWS credential sources from your environment:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (if using temporary credentials)

You can also override the default AWS region to send Cloudwatch logs to:

```bash
rotel --exporter awsemf --awsemf-exporter-region us-west-2
```

### Log Organization

By default logs are emitted to the Cloudwatch logs group `/metrics/default` and to the log stream name `otel-stream`. If the log
group or log stream do not exist, Rotel will automatically create them.

All Cloudwatch metrics must also be published to a _Namespace_. Namespaces isolate similar metrics from different applications so that
they are not aggregated together. Rotel will look for the semantic resource attributes `service.name` and `service.namespace` and
use those as the Namespace if they exist, or fallback to the default namespace `default`. You can also explicitly override the
namespace for all metrics, disregarding the resource attributes.

```bash
rotel --exporter awsemf \
  --awsemf-exporter-log-group-name "/my-app/metrics" \
  --awsemf-exporter-log-stream-name "production-stream" \
  --awsemf-exporter-namespace "MyApplication"
```

## Managing High-Cardinality Dimensions

One of the most powerful features of the EMF exporter is its ability to handle high-cardinality dimensions intelligently. This is where the `--awsemf-exporter-exclude-dimensions` and `--awsemf-exporter-include-dimensions` options become crucial.

### The Problem: High-Cardinality Metrics

Imagine you're tracking HTTP request latency and you have these attributes on your metrics:
- `service.name` (low cardinality: ~5 values)
- `http.method` (low cardinality: ~10 values)
- `user.id` (high cardinality: thousands of values)
- `request.id` (very high cardinality: millions of values)

If all these became CloudWatch metric dimensions, you'd create an enormous number of individual metrics, leading to high costs and potential dimension limits.

### The Solution: Selective Dimension Filtering

With EMF, you can include high-cardinality data in your logs while excluding it from the metrics:

```bash
rotel --exporter awsemf \
  --awsemf-exporter-exclude-dimensions "user.id,request.id"
```

This configuration:
- **Creates metrics** with dimensions: `service.name`, `http.method` (plus any future dimensions)
- **Excludes from metrics**: `user.id`, `request.id`
- **Keeps in logs**: All attributes including `user.id` and `request.id`

### Wildcard Patterns

The dimension filters support wildcard patterns with `*`:

```bash
# Include all service and http attributes, exclude anything ending in .id
--awsemf-exporter-include-dimensions "service.*,http.*"
--awsemf-exporter-exclude-dimensions "*.id"
```

Pattern matching is case-insensitive and `exclude-dimensions` takes precedence over `include-dimensions`. By default all metrics are included,
which is equivalent to passing `--awsemf-exporter-include-dimensions "*"`

## Querying High-Cardinality Data

When you need to investigate specific high-cardinality scenarios, use CloudWatch Logs Insights:

```sql
fields @timestamp, user.id, request.id, http.response_time
| filter service.name = "auth-service" 
| filter user.id = "user123"
| sort @timestamp desc
| limit 100
```

This gives you detailed, user-specific data that would be expensive to maintain as separate metrics.

## Advanced Configuration

### Log Retention

When Rotel creates a new log group it can set the default log retention, in days, for the log group. By default,
logs are configured to "never expire" (`0`).

```bash
# Keep logs for 30 days
rotel --exporter awsemf --awsemf-exporter-log-retention 30
```

Check the Cloudwatch API [docs](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_PutRetentionPolicy.html) for the
permitted values for log retention.

### Delta Metrics

AWS EMF expects metric values to contain only the delta from the previous value, not cumulative totals. Therefore Rotel must use delta tracking for cumulative temporality metrics.

Rotel handles this automatically by:
1. **Caching last values** - Tracking the last reported value for each unique metric
2. **Calculating deltas** - Subtracting the previous value from the current value
3. **Dropping first samples** - By default, the very first sample is dropped since there's no previous value to calculate a delta from

For continuously reported metrics (like request counts), dropping the first sample is usually acceptable. However, for infrequent metrics where every data point matters, you may want to retain that initial value:

```bash
# Report the first sample even though it can't be a proper delta
rotel --exporter awsemf --awsemf-exporter-retain-initial-value-of-delta-metric true
```

## Troubleshooting

### Permissions

Ensure your AWS credentials have at minimum:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:PutLogEvents",
                "logs:CreateLogGroup",
                "logs:CreateLogStream"
            ],
            "Resource": "*"
        }
    ]
}
```
