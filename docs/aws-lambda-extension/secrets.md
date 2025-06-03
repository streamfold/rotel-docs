---
sidebar_position: 3
---

# Secrets

Secret values can be retrieved from **[AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)** or from **[AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)** by specifying the full
ARN of the stored secret as the environment variable name. This allows you to keep secret values out of configuration
files.

## AWS Secrets Manager Example

```shell
ROTEL_OTLP_EXPORTER_ENDPOINT=https://api.axiom.co
ROTEL_OTLP_EXPORTER_PROTOCOL=http
ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS="Authorization=Bearer ${arn:aws:secretsmanager:us-east-1:123377354456:secret:axiom-api-key-r1l7G9},X-Axiom-Dataset=${AXIOM_DATASET}"
```

Secrets retrieved from AWS Secrets Manager also support JSON encoded secret key/value pairs. The secret
value can be retrieved by suffixing the ARN with a `#key-name` where `key-name` is the top-level JSON key. For example,
if the secret named `axiom-r1l7G9` contained:

```json
{
  "key": "1234abcd",
  "dataset": "my-dataset"
}
```

Then the following example would extract those values:
```shell
ROTEL_OTLP_EXPORTER_ENDPOINT=https://api.axiom.co
ROTEL_OTLP_EXPORTER_PROTOCOL=http
ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS="Authorization=Bearer ${arn:aws:secretsmanager:us-east-1:123377354456:secret:axiom-r1l7G9#key},X-Axiom-Dataset=${arn:aws:secretsmanager:us-east-1:123377354456:secret:axiom-r1l7G9#dataset}"
```


## AWS Parameter Store Example

```shell
ROTEL_OTLP_EXPORTER_ENDPOINT=https://api.axiom.co
ROTEL_OTLP_EXPORTER_PROTOCOL=http
ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS="Authorization=Bearer ${arn:aws:ssm:us-east-1:123377354456:parameter/axiom-api-key},X-Axiom-Dataset=${AXIOM_DATASET}"
```

## Permissions

You must ensure the following IAM permissions exist for your Lambda runtime execution role:

* Secrets Manager
    - [`secretsmanager:GetSecretValue`](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html)
    - [`secretsmanager:BatchGetSecretValue`](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_BatchGetSecretValue.html)
* Parameter Store
    - [`ssm:GetParameters`](https://docs.aws.amazon.com/systems-manager/latest/APIReference/API_GetParameters.html)

Secrets must be stored as a plaintext secret string value for AWS Secrets Manager and as a SecureString for AWS Parameter Store.

## Impact

AWS API calls can increase cold start latency by 100-150 ms even when made within the same region, so be
mindful of that impact when retrieving secrets. Secrets are retrieved in batches up to 10, so retrieving
multiple secret values should not take longer than a single secret.

Secrets are only retrieved on initialization, so subsequent invocations are not impacted.
