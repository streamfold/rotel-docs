---
sidebar_position: 5
---

# Subscriptions

The Lambda Forwarder supports two log source trigger types: CloudWatch Logs subscription
filters and S3 event notifications. Configure one or both depending on where your logs are stored.

## CloudWatch Subscriptions

To forward logs from CloudWatch Logs to the Lambda Forwarder, create a subscription filter on
each CloudWatch log group you want to collect logs from.

### Prerequisites

The Lambda function must have permission to be invoked by CloudWatch Logs for each log group
you want to subscribe to.

Add this permission for each log group:

```bash
aws lambda add-permission \
  --function-name rotel-lambda-forwarder \
  --statement-id cloudwatch-logs-invoke \
  --action "lambda:InvokeFunction" \
  --principal logs.amazonaws.com \
  --source-arn "arn:aws:logs:REGION:ACCOUNT_ID:log-group:/YOUR_LOG_GROUP:*"
```

Replace `REGION`, `ACCOUNT_ID`, and `YOUR_LOG_GROUP` with appropriate values.

### Create a Subscription Filter

Create a subscription filter to forward logs from a CloudWatch Logs log group to the forwarder:

```bash
aws logs put-subscription-filter \
  --log-group-name YOUR_LOG_GROUP \
  --filter-name forward-to-rotel \
  --filter-pattern "" \
  --destination-arn arn:aws:lambda:REGION:ACCOUNT_ID:function:rotel-lambda-forwarder
```

**Parameters:**

- `--log-group-name`: The CloudWatch Logs log group to forward from
- `--filter-name`: A name for the subscription filter
- `--filter-pattern`: Log filter pattern (use `""` to forward all logs, or specify a pattern to match a subset)
- `--destination-arn`: The ARN of the `rotel-lambda-forwarder` function

### Important Notes

- Each log group can have a maximum of 2 subscription filters
- The Lambda function must be in the same region as the log group
- Monitor Lambda invocations and errors in CloudWatch Metrics after setup
- CloudWatch will retry unsuccessful subscription Lambda invocations for up to 24 hours

## S3 Notifications

To forward logs stored in S3, configure your S3 bucket to send event notifications to the
Lambda Forwarder whenever new log files are created.

### Prerequisites

The Lambda function must have permission to be invoked by S3 and must have read access to the
log bucket.

#### Grant Lambda Invocation Permission

Allow the S3 bucket to invoke the Lambda function:

```bash
aws lambda add-permission \
  --function-name rotel-lambda-forwarder \
  --statement-id s3-invoke \
  --action "lambda:InvokeFunction" \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::YOUR_BUCKET_NAME \
  --source-account YOUR_ACCOUNT_ID
```

Replace `YOUR_BUCKET_NAME` and `YOUR_ACCOUNT_ID` with appropriate values.

#### Grant S3 Read Permission

Ensure the Lambda execution role has `s3:GetObject` permission for the log bucket:

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject"],
  "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
}
```

### Configure S3 Event Notifications

Set up event notifications on your S3 bucket to trigger the Lambda function when new objects
are created:

```bash
aws s3api put-bucket-notification-configuration \
  --bucket YOUR_BUCKET_NAME \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [
      {
        "LambdaFunctionArn": "arn:aws:lambda:REGION:ACCOUNT_ID:function:rotel-lambda-forwarder",
        "Events": ["s3:ObjectCreated:*"]
      }
    ]
  }'
```

You can also scope the notification to a specific prefix or suffix to limit which objects
trigger the function:

```bash
aws s3api put-bucket-notification-configuration \
  --bucket YOUR_BUCKET_NAME \
  --notification-configuration '{
    "LambdaFunctionConfigurations": [
      {
        "LambdaFunctionArn": "arn:aws:lambda:REGION:ACCOUNT_ID:function:rotel-lambda-forwarder",
        "Events": ["s3:ObjectCreated:*"],
        "Filter": {
          "Key": {
            "FilterRules": [
              { "Name": "prefix", "Value": "logs/" },
              { "Name": "suffix", "Value": ".log.gz" }
            ]
          }
        }
      }
    ]
  }'
```


:::note
The Lambda function must be in the same region as the S3 bucket
:::
