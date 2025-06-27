---
sidebar_position: 1
---

# Overview

Rotel includes a Python SDK that allows you to write custom OpenTelemetry processors in Python. The SDK makes it easy to filter and transform OpenTelemetry data 
before sending to an exporter. Rotel's Rust bindings for Python are implemented with [pyo3](https://github.com/pyo3/pyo3), providing a high-performance OpenTelemetry processor API bundled as a Python extension. 

The processor SDK enables you to:

- Access and modify trace spans, including span data, attributes, events, links and status.
- Process log records, including severity, body content, and associated attributes.
- Process and transform metrics data, including gauges, sums, histograms, exponential histograms, and summaries with their data points, exemplars, and quantile values.
- Modify resource attributes across traces, logs, and metrics.
- Transform data using custom Python logic before it is exported.

## Supported Telemetry Types

| Telemetry Type | Support     |
|----------------|-------------|
| Traces         | Alpha       |
| Logs           | Alpha       |
| Metrics        | Alpha       |

## Example

Below is an example of a simple span processor:

```python
def process_spans(resource_spans: ResourceSpans):
    for scope_spans in resource_spans.scope_spans:
        for span in scope_spans.spans:
            # Add custom attribute to all spans
            span.attributes.append(KeyValue("processed.by", "my_processor"))
```
