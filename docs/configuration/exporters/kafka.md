---
sidebar_position: 6
---

# Kafka Exporter

Export OpenTelemetry metrics, logs, and traces to Kafka.

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | Alpha   |
| Logs           | Alpha   |
| Metrics        | Alpha   |


### Kafka exporter configuration (Experimental)

The Kafka exporter can be selected by passing `--exporter kafka`. The Kafka exporter supports metrics,
logs, and traces.

| Option                                                    | Default           | Options                                                                     |
|-----------------------------------------------------------|-------------------|-----------------------------------------------------------------------------|
| --kafka-exporter-brokers                                  | localhost:9092    |                                                                             |
| --kafka-exporter-traces-topic                             | otlp_traces       |                                                                             |
| --kafka-exporter-metrics-topic                            | otlp_metrics      |                                                                             |
| --kafka-exporter-logs-topic                               | otlp_logs         |                                                                             |
| --kafka-exporter-format                                   | protobuf          | json, protobuf                                                              |
| --kafka-exporter-compression                              | none              | gzip, snappy, lz4, zstd, none                                               |
| --kafka-exporter-request-timeout                          | 30s               |                                                                             |
| --kafka-exporter-acks                                     | one               | none, one, all                                                              |
| --kafka-exporter-client-id                                | rotel             |                                                                             |
| --kafka-exporter-max-message-bytes                        | 1000000           |                                                                             |
| --kafka-exporter-linger-ms                                | 5                 |                                                                             |
| --kafka-exporter-retries                                  | 2147483647        |                                                                             |
| --kafka-exporter-retry-backoff-ms                         | 100               |                                                                             |
| --kafka-exporter-retry-backoff-max-ms                     | 1000              |                                                                             |
| --kafka-exporter-message-timeout-ms                       | 300000            |                                                                             |
| --kafka-exporter-request-timeout-ms                       | 30000             |                                                                             |
| --kafka-exporter-batch-size                               | 1000000           |                                                                             |
| --kafka-exporter-partitioner                              | consistent-random | consistent, consistent-random, murmur2-random, murmur2, fnv1a, fnv1a-random |
| --kafka-exporter-partition-metrics-by-resource-attributes | false             |                                                                             |
| --kafka-exporter-partition-logs-by-resource-attributes    | false             |                                                                             |
| --kafka-exporter-custom-config                            |                   |                                                                             |
| --kafka-exporter-sasl-username                            |                   |                                                                             |
| --kafka-exporter-sasl-password                            |                   |                                                                             |
| --kafka-exporter-sasl-mechanism                           |                   | PLAIN, SCRAM-SHA-256, SCRAM-SHA-512                                         |
| --kafka-exporter-security-protocol                        | PLAINTEXT         | PLAINTEXT, SSL, SASL_PLAINTEXT, SASL_SSL                                    |

The Kafka broker addresses must be specified (comma-separated for multiple brokers). Data can be serialized as JSON or Protobuf format.

#### Acknowledgement Modes

The `--kafka-exporter-acks` option controls the producer acknowledgement behavior, balancing between performance and
durability:

- `none` (acks=0): No acknowledgement required - fastest performance but least durable, data may be lost if the leader
  fails
- `one` (acks=1): Wait for leader acknowledgement only - balanced approach, good performance with reasonable
  durability (default)
- `all` (acks=all): Wait for all in-sync replicas to acknowledge - slowest but most durable, ensures data is not lost

For secure connections, you can configure SASL authentication:

```bash
rotel start --exporter kafka \
  --kafka-exporter-brokers "broker1:9092,broker2:9092" \
  --kafka-exporter-sasl-username "your-username" \
  --kafka-exporter-sasl-password "your-password" \
  --kafka-exporter-sasl-mechanism "SCRAM-SHA-256" \
  --kafka-exporter-security-protocol "SASL_SSL" \
  --kafka-exporter-compression "gzip" \
  --kafka-exporter-acks "all"
```

#### Producer Performance Tuning

The Kafka exporter provides several options for tuning producer performance and reliability:

- `--kafka-exporter-linger-ms`: Delay in milliseconds to wait for messages to accumulate before sending. Higher values
  improve batching efficiency but increase latency.
- `--kafka-exporter-retries`: How many times to retry sending a failing message. High values ensure delivery but may
  cause reordering.
- `--kafka-exporter-retry-backoff-ms`: Initial backoff time before retrying a failed request.
- `--kafka-exporter-retry-backoff-max-ms`: Maximum backoff time for exponentially backed-off retry requests.
- `--kafka-exporter-message-timeout-ms`: Maximum time to wait for messages to be sent successfully. Messages exceeding
  this timeout will be dropped.
- `--kafka-exporter-request-timeout-ms`: Timeout for individual requests to the Kafka brokers.
- `--kafka-exporter-batch-size`: Maximum size of message batches in bytes. Larger batches improve throughput but
  increase memory usage.
- `--kafka-exporter-partitioner`: Controls how messages are distributed across partitions. Options include consistent
  hashing and murmur2/fnv1a hash algorithms.

#### Message Partitioning Control

For improved consumer parallelism and data organization, you can enable custom partitioning based on telemetry data:

- `--kafka-exporter-partition-metrics-by-resource-attributes`: When enabled, metrics are partitioned by resource
  attributes (like service name), grouping related metrics together.
- `--kafka-exporter-partition-logs-by-resource-attributes`: When enabled, logs are partitioned by resource attributes,
  organizing logs by service or application.

These options override the global partitioner setting for specific telemetry types when enabled.

#### Advanced Configuration

For advanced use cases, you can set arbitrary Kafka producer configuration parameters using the
`--kafka-exporter-custom-config` option. This accepts comma-separated key=value pairs:

```bash
rotel start --exporter kafka \
  --kafka-exporter-custom-config "enable.idempotence=true,max.in.flight.requests.per.connection=1" \
  --kafka-exporter-brokers "broker1:9092,broker2:9092"
```

**Configuration Precedence**: Custom configuration parameters are applied *after* all built-in options, meaning they
will override any conflicting built-in settings. For example:

```bash
# The custom config will override the built-in batch size setting
rotel start --exporter kafka \
  --kafka-exporter-batch-size 500000 \
  --kafka-exporter-custom-config "batch.size=2000000"
  # Final batch.size will be 2000000, not 500000
```

This allows you to configure any rdkafka producer parameter that isn't explicitly exposed through dedicated CLI options.
See
the [librdkafka configuration documentation](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)
for all available parameters.

The Kafka exporter uses the high-performance rdkafka library and includes built-in retry logic and error handling.

