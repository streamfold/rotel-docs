---
sidebar_position: 5
---

# AWS X-Ray Exporter

Export OpenTelemetry traces to AWS X-Ray.

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | Alpha   |

The AWS X-Ray exporter can be selected by passing `--exporter awsxray`. The X-Ray exporter only supports traces. Note:
X-Ray
limits batch sizes to 50 traces segments. If you assign a `--batch-max-size` of greater than 50, Rotel will override and
enforce the max
batch size of 50 with the warning
`INFO AWS X-Ray only supports a batch size of 50 segments, setting batch max size to 50`

AWS Credentials including `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` for the X-Ray exporter
are
automatically sourced from Rotel's environment on startup.

| Option                             | Default   | Options          |
| ---------------------------------- | --------- | ---------------- |
| --awsxray-exporter-region          | us-east-1 | aws region codes |
| --awsxray-exporter-custom-endpoint |           |                  |

For a list of available AWS X-Ray region codes here: https://docs.aws.amazon.com/general/latest/gr/xray.html
