---
sidebar_position: 4
---

# Writing a span processor

Your processor must implement a function called `process_spans` in order for rotel to execute your processor. Each time `process_spans` is called your processor will be handed an instance of the ResourceSpan class for you to manipulate as you like.

## ResourceSpan processor example

The following is an example OTel ResourceSpan processor called append_resource_attributes_to_spans.py which adds the OS name, version, and a timestamp named rotel.process.time to the Resource Attributes of a batch of Spans. Open up your editor or Python IDE and paste the following into a file called append_resource_attributes_to_spans.py and run with the following command.

```python title="append_resource_attributes_to_spans.py"
import platform
from datetime import datetime

from rotel_sdk.open_telemetry.resource.v1 import Resource
from rotel_sdk.open_telemetry.common.v1 import KeyValue, AnyValue
from rotel_sdk.open_telemetry.trace.v1 import ResourceSpans


def process_spans(resource_spans: ResourceSpans):
    resource = resource_spans.resource
    # If resource is None, we'll create a new one to store our attributes, otherwise we'll
    # append to the existing Resource
    if resource is None:
        resource = Resource()

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    os_name = platform.system()
    os_version = platform.release()
    # Add attributes
    resource.attributes.append(KeyValue("os.name", AnyValue(os_name)))
    resource.attributes.append(KeyValue("os.version", AnyValue(os_version)))
    resource.attributes.append(KeyValue("rotel.process.time", AnyValue(current_time)))
```

Now start rotel and the processor with the following command and use a load generator to generate some spans and send to rotel. When you view the spans in your observability backend you should now see the newly added attributes.

```commandline
./rotel start --otlp-exporter-endpoint `<otlp-endpoint-url>` --otlp-with-trace-processor ./append_resource_attributes_to_spans.py
```

