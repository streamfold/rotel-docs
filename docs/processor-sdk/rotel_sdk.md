---
sidebar_position: 3
---

# Install rotel-sdk

The [rotel-sdk](https://pypi.org/project/rotel-sdk/) python package provides type hints for the Rotel processor SDK and is intended for use in your IDE of choice. The package is compatible with pyright and other popular python LSP type checker and auto-complete integrations. 

The best way to get started is to create a new development environment for writing your processors and install `rotel-sdk`

```commandline
mkdir /tmp/rotel_processors_example; cd /tmp/rotel_processors_example
python -m venv ./.venv
source ./.venv/bin/activate
pip install rotel-sdk --pre
```
## Modules and Classes Provided

| Module                               | Classes                                                             |
|--------------------------------------|---------------------------------------------------------------------|
| rotel_sdk.open_telemetry.common.v1   | AnyValue, ArrayValue, InstrumentationScope, KeyValue, KeyValueList, |
| rotel_sdk.open_telemetry.resource.v1 | Resource                                                            |
| rotel_sdk.open_telemetry.trace.v1    | ResourceSpans, ScopeSpans, Span, Event, Link, Status                |
| rotel_sdk.open_telemetry.logs.v1     | ResourceLogs, ScopeLogs, LogRecord                                  |
| rotel_sdk.open_telemetry.metrics.v1  | ResourceMetrics, ScopeMetrics, Metric, MetricData, Gauge, Sum, Histogram, ExponentialHistogram, Summary, ExponentialHistogramBuckets, NumberDataPoint, HistogramDataPoint, ExponentialHistogramDataPoint, SummaryDataPoint, ValueAtQuantile, Exemplar, AggregationTemporality, NumberDataPointValue, ExemplarValue |





