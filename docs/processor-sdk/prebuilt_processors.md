---
sidebar_position: 6
---

# Prebuilt Processors

The Rotel Github repository includes a number of prebuilt processors that you can use right out of the box. To the greatest extent possible rotel matches the configuration and behavior of existing processors from [opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib). Prebuilt processors are found in the [processors](https://github.com/streamfold/rotel/tree/main/rotel_python_processor_sdk/processors) folder under the [rotel_python_processor_sdk](https://github.com/streamfold/rotel/tree/main/rotel_python_processor_sdk) directory.                                                         

## Available prebuilt processors

| Name                 | Supported telemetry types |
|----------------------|---------------------------|
| Attributes Processor | logs, traces              |
| Redaction Processor  | logs, traces              |

## Using prebuilt processors

In order to use a prebuilt processor simply add the directory containing prebuilt processors to your python `sys.path`. 

```python
import sys
sys.path.append('/github/rotel/rotel_python_processor_sdk/processors')
```

## Example: Attribute Processor
Check out the [attributes_processor_test.py](https://github.com/streamfold/rotel/blob/main/rotel_python_processor_sdk/python_tests/attributes_processor_test.py) for a full example on how to use the prebuilt Attributes processor.

After we import the AttributeProcessor, and a few other configuration types, we create a new `Config` and specify the actions we wish to perform. Then we create a new processor with the constructor `AttributeProcessor(config: Config)`. Finally in our `process_logs` and `process_spans` functions we call our processor.

```python title="attributes_processor_test.py"
import itertools
import sys

from rotel_sdk.open_telemetry.logs.v1 import ResourceLogs
from rotel_sdk.open_telemetry.trace.v1 import ResourceSpans

sys.path.insert(0, './processors')

from attributes_processor import Config, ActionKeyValue, Action, AttributeProcessor

processor_config = Config(
    actions=[
        # INSERT: Add 'host.name' if not exists
        ActionKeyValue(key="host.name", action=Action.INSERT, value="my-server-1"),

        # UPDATE: Change 'http.status_code' to string type
        ActionKeyValue(key="http.status_code", action=Action.UPDATE, value="OK"),

        # UPSERT: Add or update 'env' attribute
        ActionKeyValue(key="env", action=Action.UPSERT, value="production"),

        # UPSERT with from_attribute: Copy 'user.email' to 'email'
        ActionKeyValue(key="email", action=Action.UPSERT, from_attribute="user.email"),

        # HASH: Hash 'user.id'
        ActionKeyValue(key="user.id", action=Action.HASH),

        # HASH with regex: Hash any attribute starting with 'trace'
        ActionKeyValue(key="", action=Action.HASH, regex_pattern=r"^trace.*"),

        # EXTRACT: Extract 'id' and 'name' from 'raw_data'
        ActionKeyValue(key="raw_data", action=Action.EXTRACT,
                       regex_pattern=r"id:(?P<extracted_id>\d+),name:(?P<extracted_name>\w+)"),

        # CONVERT: Convert 'temp_str_int' to int
        ActionKeyValue(key="temp_str_int", action=Action.CONVERT, converted_type="int"),

        # DELETE: Remove 'path' attribute
        ActionKeyValue(key="path", action=Action.DELETE),

        # DELETE with regex: Remove any attribute ending with '.secret'
        ActionKeyValue(key="", action=Action.DELETE, regex_pattern=r".*\.secret$"),
    ]
)

processor = AttributeProcessor(processor_config)


def process_logs(resource_logs: ResourceLogs):
    for log_record in itertools.chain.from_iterable(
            scope_log.log_records for scope_log in resource_logs.scope_logs
    ):
        attrs = processor.process_attributes(log_record.attributes)
        log_record.attributes = attrs


def process_spans(resource_spans: ResourceSpans):
    for span in itertools.chain.from_iterable(
            scope_span.spans for scope_span in resource_spans.scope_spans
    ):
        attrs = processor.process_attributes(span.attributes)
        span.attributes = attrs
```
