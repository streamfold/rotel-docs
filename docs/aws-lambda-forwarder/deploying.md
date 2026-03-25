---
sidebar_position: 2
---

# Deploying

There are two deployment methods available:

1. **Docker Container (Recommended)** - Deploy using container images from Amazon ECR Public
   - Supports all features including Python log processors
   - Automatic image management via CloudFormation
   - Available for both x86_64 and arm64 architectures

2. **ZIP File** - Deploy using pre-built Lambda ZIP packages
   - Simpler deployment for basic use cases
   - Does not support Python log processors
   - Available in release downloads

## Deploy with CloudFormation (Docker Container - Recommended)

The CloudFormation templates automatically pull container images from Amazon ECR Public and copy them to your private ECR repository.

:::note
Python log processors are only supported when using the Docker container deployment method.
:::

### Export to OTLP Endpoint

Launch this stack to export CloudWatch logs to any OTLP-compatible endpoint.

| **x86_64** | **arm64** |
|------------|-----------|
| [Launch Stack ↗️](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=rotel-lambda-forwarder-otlp&templateURL=https://rotel-cloudformation.s3.us-east-1.amazonaws.com/stacks/latest/x86_64/rotel-lambda-forwarder-otlp.yaml) | [Launch Stack ↗️](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=rotel-lambda-forwarder-otlp&templateURL=https://rotel-cloudformation.s3.us-east-1.amazonaws.com/stacks/latest/arm64/rotel-lambda-forwarder-otlp.yaml) |

### Export to ClickHouse

Launch this stack to export CloudWatch logs to ClickHouse.

| **x86_64** | **arm64** |
|------------|-----------|
| [Launch Stack ↗️](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=rotel-lambda-forwarder-clickhouse&templateURL=https://rotel-cloudformation.s3.us-east-1.amazonaws.com/stacks/latest/x86_64/rotel-lambda-forwarder-clickhouse.yaml) | [Launch Stack ↗️](https://console.aws.amazon.com/cloudformation/home#/stacks/create/review?stackName=rotel-lambda-forwarder-clickhouse&templateURL=https://rotel-cloudformation.s3.us-east-1.amazonaws.com/stacks/latest/arm64/rotel-lambda-forwarder-clickhouse.yaml) |

## Upgrading with CloudFormation

To upgrade the Lambda function to use the latest upstream image, update the CloudFormation stack using the **ForceRedeploy** parameter.

### Method 1: Force Redeploy with Same Tag

If you're using a tag like `latest` and want to pull the newest version:

1. Navigate to your CloudFormation stack in the AWS Console
2. Click **Update** on the stack
3. Select **Use current template**
4. Find the **ForceRedeploy** parameter
5. Increment the value (e.g., change from `1` to `2`, or use a timestamp like `2024-01-15`)
6. Complete the stack update

The CloudFormation stack will automatically:
- Pull the latest image from Amazon ECR Public (`public.ecr.aws/streamfold/rotel-lambda-forwarder`)
- Copy it to your private ECR repository
- Redeploy the Lambda function with the updated image

### Method 2: Upgrade to Specific Version

To upgrade to a specific version tag (e.g., `v1.2.3`):

1. Navigate to your CloudFormation stack in the AWS Console
2. Click **Update** on the stack
3. Select **Use current template**
4. Find the **ForwarderImageTag** parameter
5. Change the value to the desired version (e.g., from `latest` to `v1.2.3`)
6. Complete the stack update

:::note
When using CloudFormation deployment, you don't need to manually pull and push images — the stack handles this automatically through a CodeBuild project.
:::

## Manual Deployment

### Option 1: Docker Container Deployment (Recommended)

**Supports:** All features including Python log processors

The forwarder is available as a container image in [Amazon ECR Public](https://gallery.ecr.aws/streamfold/rotel-lambda-forwarder):

```
public.ecr.aws/streamfold/rotel-lambda-forwarder:latest
```

#### Step 1: Copy Image to Your Private ECR

First, create a private ECR repository:

```bash
aws ecr create-repository \
  --repository-name rotel-lambda-forwarder \
  --region YOUR_REGION
```

Pull the image from ECR Public and push to your private repository:

```bash
# Login to ECR Public (us-east-1 only)
aws ecr-public get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin public.ecr.aws

# Pull the image
docker pull public.ecr.aws/streamfold/rotel-lambda-forwarder:latest

# Login to your private ECR
aws ecr get-login-password --region YOUR_REGION | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com

# Tag the image for your private registry
docker tag public.ecr.aws/streamfold/rotel-lambda-forwarder:latest \
  YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:latest

# Push to your private ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:latest
```

Replace:
- `YOUR_REGION` with your AWS region (e.g., `us-west-2`)
- `YOUR_ACCOUNT_ID` with your AWS account ID

#### Step 2: Create IAM Execution Role

Create an IAM role with the necessary permissions for the Lambda function:

```bash
aws iam create-role \
  --role-name rotel-lambda-forwarder-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

Attach the basic Lambda execution policy:

```bash
aws iam attach-role-policy \
  --role-name rotel-lambda-forwarder-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

Create and attach a custom policy with required permissions:

```bash
aws iam create-policy \
  --policy-name rotel-lambda-forwarder-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["logs:ListTagsForResource"],
        "Resource": "arn:aws:logs:*:*:log-group:*"
      },
      {
        "Effect": "Allow",
        "Action": ["ec2:DescribeFlowLogs"],
        "Resource": "*"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject", "s3:PutObject"],
        "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/rotel-lambda-forwarder/*"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject"],
        "Resource": "arn:aws:s3:::YOUR_LOG_BUCKET_NAME/*"
      },
      {
        "Effect": "Allow",
        "Action": [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage"
        ],
        "Resource": "*"
      }
    ]
  }'

aws iam attach-role-policy \
  --role-name rotel-lambda-forwarder-role \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/rotel-lambda-forwarder-policy
```

**Important Notes:**
- Replace `YOUR_BUCKET_NAME` with the S3 bucket used for caching flow log configurations
- Replace `YOUR_LOG_BUCKET_NAME` with the S3 bucket(s) containing log files to process (if using S3 log processing)
- The `s3:GetObject` permission on log buckets is only required if you're using S3 event notifications for log processing

#### Step 3: Create Lambda Function from Container Image

```bash
aws lambda create-function \
  --function-name rotel-lambda-forwarder \
  --package-type Image \
  --code ImageUri=YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:latest \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/rotel-lambda-forwarder-role \
  --timeout 30 \
  --memory-size 256 \
  --architectures x86_64 \
  --region YOUR_REGION \
  --environment Variables="{
    ROTEL_EXPORTER=otlp,
    ROTEL_OTLP_EXPORTER_ENDPOINT=https://your-otlp-endpoint.com,
    FORWARDER_S3_BUCKET=your-cache-bucket-name
  }"
```

**Important parameters:**
- `--package-type Image`: Indicates this is a container-based Lambda
- `--code ImageUri`: The full URI of your container image in ECR
- `--architectures`: Must match the image architecture (`x86_64` or `arm64`)
- `--timeout`: Adjust based on your log volume (recommended: 30 seconds)
- `--memory-size`: Adjust based on log volume (recommended: 256–512 MB)

#### Step 4: Update Function with a New Image

To update the function with a new image version:

```bash
# Pull new image from ECR Public
docker pull public.ecr.aws/streamfold/rotel-lambda-forwarder:v1.2.3

# Tag and push to your private ECR
docker tag public.ecr.aws/streamfold/rotel-lambda-forwarder:v1.2.3 \
  YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:v1.2.3

docker push YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:v1.2.3

# Update Lambda function
aws lambda update-function-code \
  --function-name rotel-lambda-forwarder \
  --image-uri YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/rotel-lambda-forwarder:v1.2.3
```

---

### Option 2: ZIP File Deployment

:::note
Python log processors are **not supported** with ZIP file deployment. Use Docker container deployment if you need Python processor support.
:::

Pre-built Lambda ZIP files for x86_64 and arm64 architectures are available from the [Releases](https://github.com/rotel-dev/rotel-lambda-forwarder/releases) page, or from the following links:

| **Region** | **x86_64** | **arm64** |
| ---------- | ---------- | --------- |
| us-east-1  | [Download](https://rotel-lambda-forwarder.s3.us-east-1.amazonaws.com/rotel-lambda-forwarder/latest/x86_64/rotel-lambda-forwarder.zip) | [Download](https://rotel-lambda-forwarder.s3.us-east-1.amazonaws.com/rotel-lambda-forwarder/latest/arm64/rotel-lambda-forwarder.zip) |

The following us-east-1 S3 bucket contains pre-built files for any given release and architecture:

```
s3://rotel-lambda-forwarder/rotel-lambda-forwarder/v{version}/{arch}/rotel-lambda-forwarder.zip
```

For the latest release, use:

```
s3://rotel-lambda-forwarder/rotel-lambda-forwarder/latest/{arch}/rotel-lambda-forwarder.zip
```

:::note
These files are located in the AWS us-east-1 region, so you can only create Lambda functions in that same region directly. If you need to create the function in a different region, copy the `rotel-lambda-forwarder.zip` to a bucket in that target region first.
:::

#### Step 1: Create IAM Execution Role

Create an IAM role with the necessary permissions for the Lambda function:

```bash
aws iam create-role \
  --role-name rotel-lambda-forwarder-role \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Principal": {"Service": "lambda.amazonaws.com"},
      "Action": "sts:AssumeRole"
    }]
  }'
```

Attach the basic Lambda execution policy:

```bash
aws iam attach-role-policy \
  --role-name rotel-lambda-forwarder-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

The Lambda function also needs permissions to:
1. List tags on CloudWatch Logs log groups
2. Describe VPC flow logs
3. Read and write to the S3 bucket for cache persistence

Create and attach a custom policy:

```bash
aws iam create-policy \
  --policy-name rotel-lambda-forwarder-policy \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["logs:ListTagsForResource"],
        "Resource": "arn:aws:logs:*:*:log-group:*"
      },
      {
        "Effect": "Allow",
        "Action": ["ec2:DescribeFlowLogs"],
        "Resource": "*"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:GetObject", "s3:PutObject"],
        "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/rotel-lambda-forwarder/*"
      },
      {
        "Effect": "Allow",
        "Action": ["s3:ListBucket"],
        "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
      }
    ]
  }'

aws iam attach-role-policy \
  --role-name rotel-lambda-forwarder-role \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/rotel-lambda-forwarder-policy
```

Replace `YOUR_BUCKET_NAME` with your S3 bucket name and `YOUR_ACCOUNT_ID` with your AWS account ID.

#### Step 2: Create the Lambda Function

```bash
aws lambda create-function \
  --function-name rotel-lambda-forwarder \
  --runtime provided.al2023 \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/rotel-lambda-forwarder-role \
  --handler bootstrap \
  --code S3Bucket=rotel-lambda-forwarder,S3Key=rotel-lambda-forwarder/latest/x86_64/rotel-lambda-forwarder.zip \
  --timeout 30 \
  --memory-size 256 \
  --architectures x86_64 \
  --region YOUR_REGION \
  --environment Variables="{
    ROTEL_OTLP_EXPORTER_ENDPOINT=https://your-otlp-endpoint.com,
    FORWARDER_S3_BUCKET=your-cache-bucket-name
  }"
```

**Important parameters:**
- `--runtime`: Use `provided.al2023` for the Amazon Linux 2023 custom runtime
- `--architectures`: Must match your build target (`x86_64` or `arm64`)
- `--timeout`: Adjust based on your log volume (recommended: 30 seconds)
- `--memory-size`: Adjust based on log volume (recommended: 256–512 MB)

#### Step 3: Update Function Code

To update an existing function with the latest version:

```bash
aws lambda update-function-code \
  --function-name rotel-lambda-forwarder \
  --s3-bucket rotel-lambda-forwarder \
  --s3-key rotel-lambda-forwarder/latest/x86_64/rotel-lambda-forwarder.zip
```

#### Step 4: Update Environment Variables (optional)

```bash
aws lambda update-function-configuration \
  --function-name rotel-lambda-forwarder \
  --environment Variables="{
    ROTEL_OTLP_EXPORTER_ENDPOINT=https://your-otlp-endpoint.com,
    FORWARDER_S3_BUCKET=your-cache-bucket-name
  }"
```
