---
sidebar_position: 1
---

# Overview

Rotel includes a Python processor SDK that allows you to write custom processors in Python to modify OpenTelemetry data
in-flight. The SDK provides interfaces for processing both traces and logs data (metrics coming soon!) through a simple
Python API.

The processor SDK enables you to:

- Access and modify trace spans, including span data, attributes, events, links and status
- Process log records, including severity, body content, and associated attributes
- Modify resource attributes across traces and logs
- Transform data using custom Python logic before it is exported

Example of a simple trace processor:

```python
def process(resource_spans):
    for scope_spans in resource_spans.scope_spans:
        for span in scope_spans.spans:
            # Add custom attribute to all spans
            span.attributes["processed.by"] = "my_processor"
```
