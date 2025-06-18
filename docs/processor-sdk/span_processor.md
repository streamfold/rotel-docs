---
sidebar_position: 4
---

# Writing a span processor

Your processor must implement a function called `process_spans` in order for rotel to execute your processor. Each time `process_spans` is called your processor will be handed an instance of the ResourceSpan class for you to manipulate as you like.

## ResourceSpan processor example

The following is an example OTel ResourceSpan processor called `append_resource_attributes_to_spans.py` which adds the OS name, version, and a timestamp named `rotel.process.time` to the Resource Attributes of a batch of Spans. Open up your editor or Python IDE and paste the following into a file called `append_resource_attributes_to_spans.py` and run with the following command.

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

Start rotel and the processor with the following command. 

```commandline
./rotel start --exporter blackhole --otlp-with-trace-processor ./append_resource_attributes.py --debug-log traces --debug-log-verbosity detailed
```

Now open a new terminal and run the following telemetrygen command

```commandline
telemetrygen traces --otlp-endpoint 127.0.0.1:4317 --otlp-insecure
```

With `debug-log` enabled rotel will print out the ResourceSpans before and after executing your processor.

```
INFO OTLP payload before processing
ResourceSpans #0
Resource SchemaURL: https://opentelemetry.io/schemas/1.4.0
Resource attributes:
     -> service.name: Str(telemetrygen)
ScopeSpans #0
ScopeSpans SchemaURL: 
InstrumentationScope telemetrygen 
Span #0
    Trace ID       : e199fc80864d844728ebad88ccfadc67
    Parent ID      : 4e4fb0523f19a0d7
    ID             : a94838a53a9b92c0
    Name           : okey-dokey-0
    Kind           : SPAN_KIND_SERVER
Start time: 1750218567597408000
End time: 1750218567597531000
    Status code    : STATUS_CODE_UNSET
    Status message : 
Attributes:
     -> net.peer.ip: Str(1.2.3.4)
     -> peer.service: Str(telemetrygen-client)
Span #1
    Trace ID       : e199fc80864d844728ebad88ccfadc67
    Parent ID      : 
    ID             : 4e4fb0523f19a0d7
    Name           : lets-go
    Kind           : SPAN_KIND_CLIENT
Start time: 1750218567597408000
End time: 1750218567597531000
    Status code    : STATUS_CODE_UNSET
    Status message : 
Attributes:
     -> net.peer.ip: Str(1.2.3.4)
     -> peer.service: Str(telemetrygen-server)

INFO OTLP payload after processing
ResourceSpans #0
Resource SchemaURL: https://opentelemetry.io/schemas/1.4.0
Resource attributes:
     -> service.name: Str(telemetrygen)
     -> os.name: Str(Darwin)
     -> os.version: Str(23.3.0)
     -> rotel.process.time: Str(2025-06-17 20:49:27)
ScopeSpans #0
ScopeSpans SchemaURL: 
InstrumentationScope telemetrygen 
Span #0
    Trace ID       : e199fc80864d844728ebad88ccfadc67
    Parent ID      : 4e4fb0523f19a0d7
    ID             : a94838a53a9b92c0
    Name           : okey-dokey-0
    Kind           : SPAN_KIND_SERVER
Start time: 1750218567597408000
End time: 1750218567597531000
    Status code    : STATUS_CODE_UNSET
    Status message : 
Attributes:
     -> net.peer.ip: Str(1.2.3.4)
     -> peer.service: Str(telemetrygen-client)
Span #1
    Trace ID       : e199fc80864d844728ebad88ccfadc67
    Parent ID      : 
    ID             : 4e4fb0523f19a0d7
    Name           : lets-go
    Kind           : SPAN_KIND_CLIENT
Start time: 1750218567597408000
End time: 1750218567597531000
    Status code    : STATUS_CODE_UNSET
    Status message : 
Attributes:
     -> net.peer.ip: Str(1.2.3.4)
     -> peer.service: Str(telemetrygen-server)

```


