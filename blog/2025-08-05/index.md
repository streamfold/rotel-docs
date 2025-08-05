---
slug: rotel-fast-and-efficient-opentelemetry-collection-in-rust
title: "Rotel: Fast and Efficient OpenTelemetry Collection in Rust"
authors: [rjenkins, mheffner]
tags: [announcements]
image: ./red-pepper.svg
---

Observability shouldn't be a resource hog, that’s why at the end of last year, we started an ambitious new project – Rotel. We’ve been excited to see the rise of OpenTelemetry as a vendor neutral standard for telemetry and it's inspired us to apply our systems experience to develop a high-performance, resource efficient data plane for collecting OpenTelemetry data. 

Rotel is a new open-source alternative for collecting OpenTelemetry data and is engineered to be an efficient, high-performance solution for receiving, processing, and exporting OpenTelemetry data. Rotel runs as a standalone process and consumes telemetry from external processes or other collection agents. It consumes **75% less memory and 50% less CPU** in benchmarks, so it is particularly well-suited for environments where resource optimization is paramount.

Today we’re excited to announce Rotel and we welcome the community to build with us.

<!-- truncate -->

## Systems approach to telemetry collection

The OpenTelemetry Collector reference implementation is written in Go and has been successfully deployed at scale, handling large volumes of telemetry data. It’s often deployed to collect telemetry from the application and to aggregate, transform, and forward data from multiple collectors to external vendors. In many architectures, telemetry must be collected close to the application itself by running collection tools in sidecars on Kubernetes, in lightweight serverless functions, or even at the edge. Without a systems-level approach to building these tools, we risk the unpredictability of garbage collection impacting performance and resource usage. Rust offers a unique memory model with strict ownership and borrowing rules, which permit direct control over memory allocation and deallocation. This results in a process that can maintain strict limits on its resource usage at all times, something that a garbage collected runtime just can’t do with the predictability these environments demand.

Drawing from our experience developing infrastructure close to the systems-level, we wanted to tackle the pain points we’ve seen firsthand, things like slow cold starts in AWS Lambda or excessive memory usage in Kubernetes. Our hypothesis was that these challenges could be mitigated by selecting a language that provides more control and predictability over every slice of memory and CPU. We believe certain workloads demand this level of efficiency, and Rotel is our first step toward addressing that need.

## Unlocking New OpenTelemetry Possibilities

We felt confident that Rotel could significantly ease resource utilization and reduce the cost of high-volume telemetry processing, but then earlier this year, another question began to form: What additional benefits would emerge from building a collector for OpenTelemetry from the ground up, in a low-level language?

Could we make it easier for developers to own, configure and ship OpenTelemetry collection by simply installing a module in a project? Could we make filtering and transformation of OpenTelemetry as easy as pulling up your favorite IDE and writing a snippet of code?

Beyond the practical implications, these questions also felt like an **exciting technical challenge** – a chance to apply our hard-won experience to a problem we deeply cared about and **that's why we're excited to introduce you to Rotel\!**

### Key Capabilities

* **Comprehensive OTLP Support:** Rotel acts as an OTLP receiver and exporter, supporting gRPC, HTTP/Protobuf, and HTTP/JSON.  
* **Flexible Exporter Options:** Beyond standard OTLP export, Rotel includes exporters for ClickHouse, Datadog, Kafka, and AWS X-Ray.  
* **Resource Efficiency:** Up to 75% less memory utilization and 50% less cpu usage on [OpenTelemetry collector benchmarks](https://streamfold.github.io/rotel-otel-loadtests/benchmarks/).  
* **Serverless Extension**: Easily deploy Rotel on AWS Lambda as an extension with very fast cold-start times.  
* **Robust Data Delivery:** Built-in batching, retry mechanisms, and configurable timeouts ensure reliable data delivery  
* **Runtime Integrations:** Easily bundle Rotel with popular runtimes. We provide simple to use integrations for Python ([streamfold/pyrotel](https://github.com/streamfold/pyrotel)) and Node.js ([streamfold/rotel-nodejs](https://github.com/streamfold/rotel-nodejs)).

## Getting Started

The fastest way to experience Rotel is running directly with Docker:

```shell
docker run -ti -p 4317-4318:4317-4318 streamfold/rotel \
    --debug-log traces --exporter blackhole
```

Then use the OpenTelemetry telemetry generator to emit some fake telemetry:

```shell
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@latest
telemetrygen traces --otlp-insecure --duration 5s
```

From the Rotel container you’ll then see log messages indicating it has received trace spans. 

See the full [Getting Started](https://rotel.dev/docs/setup/getting-started) guide for more information.

## Advanced Capabilities

### Python Processor SDK

One of Rotel's most innovative features is its [Python processor SDK](https://github.com/streamfold/rotel/blob/main/rotel_python_processor_sdk/rotel_sdk/README.md). This SDK enables developers to write custom Python code to modify OpenTelemetry data in-flight before export. Rust’s zero-overhead FFI allows Rotel to provide a high-performance Python extension for processing OpenTelemetry.

The SDK includes LSP support for code completion and syntax highlighting, along with prebuilt processors for common use cases such as attribute modification and data redaction. You can install the SDK with: `pip install rotel-sdk`.

Here's an example of adding a custom attribute to spans:

```py
from rotel_sdk.open_telemetry.common.v1 import KeyValue, AnyValue
from rotel_sdk.open_telemetry.trace.v1 import ResourceSpans

def process_spans(resource_spans: ResourceSpans):
    for scope_spans in resource_spans.scope_spans:
        for span in scope_spans.spans:
            # Add custom attribute to all spans
            span.attributes.append(KeyValue("processed.by",
                AnyValue("my_processor")))
```

### Python and Node.js packages

You can also install Rotel directly from Python and Node.js packages. These distributions bundle a build of the Rotel agent directly inside the package, so you can install Rotel alongside your application using the same dependency management tools. Developers can deploy their application and OpenTelemetry collection in a single artifact, particularly convenient for single container PaaS environments.

These packages also provide configuration as code, allowing you to configure Rotel in the same language as your application. There’s no requirement to compose large YAML configs or write custom DSL syntax to get started.

Check out the Rotel [Python](https://rotel.dev/docs/category/python-rotel) or [Node.js](https://rotel.dev/docs/category/nodejs-rotel) packages.

### AWS Lambda Extension

We’ve also developed a native AWS Lambda Extension, [available on GitHub](https://github.com/streamfold/rotel-lambda-extension), to deploy OpenTelemetry in serverless applications. Existing OpenTelemetry Lambda builds, such as [ADOT](https://aws-otel.github.io/docs/getting-started/lambda), are often large and can add up to a second of cold-start initialization time, directly impacting Lambda function response and increasing serverless costs. The Rotel Lambda Extension compresses down to a size of **8MB** and starts in **under 70ms**. This, combined with an adaptive flushing technique that minimizes post-function delays, drastically reduces cold-start impacts.

Beyond reduced cold-start times, the Rotel Lambda Extension integrates with the TelemetryAPI  to convert all function logs to OpenTelemetry format and export them to your configured exporter destinations. This allows you to reduce your CloudWatch costs by replacing it with your preferred logging vendor.

### ClickHouse Support

ClickHouse has been a reliable choice for large-scale telemetry data storage thanks to its efficiency and ability to handle very large data volumes. With the introduction of ClickStack, ClickHouse’s open-source observability solution, the project now offers a fully integrated solution for OpenTelemetry.

Rotel’s ClickHouse exporter provides complete support for ClickHouse, allowing you to export metrics, logs, and traces. It also supports the new [JSON column type](https://clickhouse.com/docs/sql-reference/data-types/newjson) (available in recent ClickHouse releases), which replaces the older map type and simplifies working with key/value attributes common in OpenTelemetry data. This makes it easier to write flexible queries, for example filtering traces by attributes or aggregating metrics by custom tags. For teams building or scaling observability pipelines, combining Rotel with ClickStack offers a straightforward, high-performance observability solution.

### Performance

Rotel has been built from the ground up using Rust, which allows us to achieve system-level performance reliably, without the concern of undefined behavior. Rust’s strict memory model enables high performance without the overhead associated with traditional garbage-collected memory models. It’s a [popular choice](https://www.datadoghq.com/blog/datadog-next-gen-lambda-extension/) for systems requiring high performance and low resource usage.

To get a sense of Rotel’s performance, we [adapted](https://github.com/streamfold/rotel-otel-loadtests) the OpenTelemetry Collector Contrib benchmarks to run against Rotel. The results: Rotel requires **75% less memory and uses 50% less CPU**. These benchmarks [run nightly](https://streamfold.github.io/rotel-otel-loadtests/benchmarks/) against the latest versions of both the OpenTelemetry Collector and Rotel.

## Up next

Rotel is open-sourced under the Apache 2.0 license and is under active development. While it is currently in alpha and we are actively gathering feedback, many users have already successfully deployed Rotel to production environments and are engaged members of our community.

Rotel’s early roadmap came from our own experience and the feedback of users. While our mission is to build the highest performing, most resource efficient data plane for processing OpenTelemetry, user feedback plays a critical role in helping us decide what to build next. In addition to continuing to support our users and improve upon the features we’ve built, these are some general categories we want to focus on next.

### Extending Receiver and Exporter Integrations

Rotel started with full OpenTelemetry Protocol (OTLP) compatibility and has grown to support a handful of exporter integrations. We want to expand support for additional use cases, both on the receiver and exporter sides. Object storage is crucial for building large-scale telemetry systems, so we plan to add an exporter for it along with support for popular columnar storage formats. Work is already in progress on an Apache Parquet writer.

Rotel only receives OTLP data at the moment, but we want to expand this to include file log tailing and remote scraping of endpoints like Prometheus. We have recently added a Kafka exporter and plan to follow this with support for a Kafka receiver soon.  

### Expanding Processor and OTTL support

We have shown that we can integrate native language processor support with Python via our SDK with low overhead. We plan to expand on these efforts to improve the integration of Python into the processing path and develop a rich processor framework users can build upon. We’re also exploring pure Rust processors for high-volume and compute intensive workloads like: filtering, transformation, and tail sampling.

We also intend to investigate OTTL support. While anything written in a domain specific language like OTTL can be expressed in Python, supporting OTTL will help alleviate switching costs for users who have invested significant time building OTTL processor expressions. We would love to know which processors are most important to the community and which may be particularly well suited for a systems-level approach.

### Durable Pipelines

You can hope for the best, but sometimes you have to plan for the worst, and telemetry pipelines are no exception. Rotel should provide the option to build durable pipelines with options like guaranteed at-least-once delivery, for receivers and exporters that support it. Rotel should allow telemetry to be spooled to disk or S3 when export destinations are offline for extended durations. We want to support durability with little to no overhead and in a way that is simple to configure.

### OpenTelemetry Arrow

The OTEL Arrow project is an ongoing effort to augment OTLP with the Apache Arrow columnar format for inter-process communication. Apache Arrow is particularly well suited for the repetitiveness of telemetry data and could significantly improve the efficiency of telemetry pipelines. Many of the leading Arrow libraries are implemented in Rust so Rotel is well suited to integrate with these efforts.

## Get Involved

Ready to explore Rotel? Visit [rotel.dev](https://rotel.dev) and [github.com/streamfold/rotel](https://github.com/streamfold/rotel) for detailed documentation and examples.

Join our [Discord server](https://rotel.dev/discord) to discuss the project, share feedback, or ask questions. Whether you're evaluating observability solutions or are simply interested in the technical approach, we welcome your participation.
