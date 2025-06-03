---
sidebar_position: 2
---

# Configuration

The Rotel Lambda Extension is configured using the same environment variables documented
for the Rotel collector,
[documented here](https://github.com/streamfold/rotel?tab=readme-ov-file#configuration).

To ease configuration for Lambda environments, you can set `ROTEL_ENV_FILE` to the path
name of a file and that file will be interpreted as an `.env` file. For example, set
`ROTEL_ENV_FILE=/var/task/rotel.env` and include the following `rotel.env` file in your
function bundle:
```shell
ROTEL_OTLP_EXPORTER_ENDPOINT=https://api.axiom.co
ROTEL_OTLP_EXPORTER_PROTOCOL=http
ROTEL_OTLP_EXPORTER_CUSTOM_HEADERS="Authorization=Bearer ${AXIOM_API_KEY},X-Axiom-Dataset=${AXIOM_DATASET}"
```

The values `${AXIOM_API_KEY}` and `${AXIOM_DATASET}` will be resolved from the environment of the function,
allowing you to set the secret values in your AWS Lambda function definition and out of the on-disk file.
