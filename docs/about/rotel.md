
# Rotel

Rotel is a lightweight Rust application that provides an efficient, high-performance solution for collecting, processing, and exporting OpenTelemetry data with support for metrics, logs, and traces. With first-class OTLP support and a constantly growing exporter set, it’s a practical alternative to the OpenTelemetry Collector. Its Rust implementation ensures minimal resource usage and a compact binary size, making it ideal for resource-constrained environments and applications where minimizing overhead is critical.

Rotel is fully open-sourced under the Apache 2.0 license and can be easily bundled with popular runtimes as packages, simplifying deployment without the need for a sidecar container. It includes built-in batching and support for multiple exporters including: OTLP, Datadog, ClickHouse, Kafka, and AWS X-Ray.
