---
sidebar_position: 7
---

# Using with Pyrotel

If you are using the [Python Rotel](/docs/python-rotel/overview) distribution, you can easily add processors when configuring Rotel. These configuration
options allow you to specify a list of file paths to processors for each of the telemetry types:

| Option Name        | Type      |
| ------------------ | --------- |
| processors_metrics | list[str] |
| processors_traces  | list[str] |
| processors_logs    | list[str] |

## Example

Here's a full configuration example for adding a custom processor for traces. Just specify the full path
to the config file:

```python
client = Client(
    enabled = True,
    exporters = {
        'datadog': Config.datadog_exporter(
            api_key = "1234abcd",
        ),
    },
    exporters_traces = ['datadog'],
    processors_traces=[f"{os.path.dirname(__file__)}/processors/trace_processor.py"]
)
client.start()
```
