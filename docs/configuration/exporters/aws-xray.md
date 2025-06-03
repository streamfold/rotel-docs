---
sidebar_position: 4
---

# AWS X-Ray Exporter

| Telemetry Type | Support |
|----------------|---------|
| Traces         | Alpha   |

The AWS X-Ray exporter can be selected by passing `--exporter aws-xray`. The X-Ray exporter only supports traces. Note:
X-Ray
limits batch sizes to 50 traces segments. If you assign a `--batch-max-size` of greater than 50, Rotel will override and
enforce the max
batch size of 50 with the warning
`INFO AWS X-Ray only supports a batch size of 50 segments, setting batch max size to 50`

AWS Credentials including `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_SESSION_TOKEN` for the X-Ray exporter
are
automatically sourced from Rotel's environment on startup.

| Option                          | Default   | Options          |
|---------------------------------|-----------|------------------|
| --xray-exporter-region          | us-east-1 | aws region codes |
| --xray-exporter-custom-endpoint |           |                  |

For a list of available AWS X-Ray region codes here: https://docs.aws.amazon.com/general/latest/gr/xray.html
