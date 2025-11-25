---
sidebar_position: 4
---

# AWS EMF Exporter

Export OpenTelemetry metrics to Cloudwatch Logs in EMF format.

| Telemetry Type | Support |
| -------------- | ------- |
| Metrics        | ✅      |

---

The AWS EMF exporter can be selected by passing `--exporter awsemf`. The AWS EMF exporter only supports metrics. The
AWS EMF exporter will convert metrics into the AWS Cloudwatch [Embedded metric format](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html) and
send those as JSON log lines to Cloudwatch. Cloudwatch will convert the log lines into Cloudwatch Metrics.

See the [AWS Auth](/docs/configuration/aws-auth) page for instructions on how to retrieve credentials necessary
for exporting to Cloudwatch.

| Option                                                 | Default          | Options          |
| ------------------------------------------------------ | ---------------- | ---------------- |
| --awsemf-exporter-region                               | us-east-1        | aws region codes |
| --awsemf-exporter-custom-endpoint                      |                  |                  |
| --awsemf-exporter-log-group-name                       | /metrics/default |                  |
| --awsemf-exporter-log-stream-name                      | otel-stream      |                  |
| --awsemf-exporter-log-retention                        | 0                |                  |
| --awsemf-exporter-namespace                            |                  |                  |
| --awsemf-exporter-retain-initial-value-of-delta-metric | false            |                  |
| --awsemf-exporter-include-dimensions                   |                  |                  |
| --awsemf-exporter-exclude-dimensions                   |                  |                  |

## Dimension Filtering

By default all resource and metric data point attributes will be included as dimensions in the Cloudwatch Metric. You
can use the `include-dimensions` and `exclude-dimensions` options to selectively filter which dimensions are included
in the generated metric. This can be useful to include a high-cardinality dimension in the log output, but not set
it on the metric. The Cloudwatch Metric will represent the aggregation across all values without incurring the cost
of the excessive high-cardinality.
In the scenario that you want to examine the data based on the high-cardinality dimension, you can use Logs Insights
to query that dimension from the logs.

Both `include-dimensions` and `exclude-dimensions` take comma-separated wildcard patterns to match against the attribute
names from the metrics. The `*` character can be used to match zero-or-more characters. Matching is case insensitive.
By default all dimensions are included (`include-dimensions=*`), but you can also selectively filter which to include.
The `exclude-dimensions` takes precedence, so any dimension that matches an exclude pattern will be excluded.

### Example

- `--awsemf-exporter-include-dimensions service.*,http.*`
- `--awsemf-exporter-exclude-dimensions *.internal`

With these options, here's how the following attributes would be handled:

- `service.name`: included
- `http.method`: included
- `http.internal`: excluded
- `telemetry.sdk.language`: excluded

## Notes

- If the log stream or log group do not exist, the exporter will attempt to create them automatically. Make sure that the credentials have the
  right IAM permissions.
- If `--awsemf-exporter-retain-initial-value-of-delta-metric` is true, then the initial value of a delta metric is retained when calculating deltas.
- If the namespace is not specified, Rotel will look for `service.namespace` and `service.name` in the resource attributes and use those. If those
  don't exist, it will fall back to a namespace of _default_.
- Log retention is specified in days, with zero meaning never expire. Valid values are: 1, 3, 5, 7, 14, 30, 60, 90, 120, 150, 180, 365, 400, 545,
  731, 1827, 2192, 2557, 2922, 3288, or 3653.
