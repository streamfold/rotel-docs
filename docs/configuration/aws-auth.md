---
sidebar_position: 4
---

# AWS Authentication

Several Rotel exporters require AWS credentials to sign the HTTP requests made to
AWS endpoints. Rotel leverages the AWS SDK configuration to
acquire said credentials. Below are a few of the ways you can configure AWS with Rotel
to support destinations that require AWS authentication. See the full
[docs](https://docs.aws.amazon.com/sdkref/latest/guide/creds-config-files.html)
for complete support.

:::note

When running as part of the Lambda Extension, Rotel reads the AWS environmental variables
that are injected into the AWS Lambda runtime environment. Refer to the AWS Lambda
[documentation](https://docs.aws.amazon.com/lambda/latest/dg/security_iam_service-with-iam.html)
for how to configure permissions in AWS Lambda.

:::

## Environmental variables

You can always explicitly set AWS access keys using environment variables.

```bash
export AWS_ACCESS_KEY_ID=".."
export AWS_SECRET_ACCESS_KEY=".."
export AWS_SESSION_TOKEN=".."   # Optional
export AWS_DEFAULT_REGION="us-east-1"  # Can be used to override region for all auth methods

rotel start --exporter blackhole
```

## AWS Config files

The exact location depends on your operating system, but Rotel supports AWS configuration files
for defining roles and permissions. Here's an example from a profile at `$HOME/.aws/config`:

```text
[profile testing]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws_session_token=IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZ2luX2IQoJb3JpZVERYLONGSTRINGEXAMPLE

[profile prod]
sso_session = my-sso
sso_account_id = 111122223333
sso_role_name = SampleRole
```

With these entries you can select the configuration to use by setting `AWS_PROFILE` before running Rotel. Check
the config file [docs](https://docs.aws.amazon.com/sdkref/latest/guide/file-format.html) for more info.

```bash
# use the testing config
AWS_PROFILE=testing rotel start --exporter blackhole

# use production (requires authorizing SSO session first)
AWS_PROFILE=prod rotel start --exporter blackhole
```

## Instance Metadata Service (IMDS)

Rotel also supports retrieving AWS credentials from the Instance Metadata Service (IMDS) on Amazon EC2 instances.
Just run Rotel directly and it will attempt to access credentials from IMDS if it is available. This should work
on most EC2 infrastructure including VMs and ECS.
