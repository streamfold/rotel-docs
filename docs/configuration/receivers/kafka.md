---
sidebar_position: 2
---

# Kafka Receiver

Receive OpenTelemetry from Kafka.

| Telemetry Type | Support |
| -------------- | ------- |
| Traces         | ✅      |
| Logs           | ✅      |
| Metrics        | ✅      |

---

The Kafka Receiver allows Rotel to consume telemetry data from Kafka topics. The receiver supports consuming metrics,
logs, and traces from
separate topics in either JSON or Protobuf format.

To enable the Kafka receiver, you must specify which telemetry types to consume using the appropriate flags:

- `--kafka-receiver-traces` to consume traces
- `--kafka-receiver-metrics` to consume metrics
- `--kafka-receiver-logs` to consume logs

| Option                                             | Default        | Options                                                                |
|----------------------------------------------------|----------------|------------------------------------------------------------------------|
| --kafka-receiver-brokers                           | localhost:9092 | Kafka broker addresses (comma-separated)                               |
| --kafka-receiver-traces-topic                      | otlp_traces    | Topic name for traces                                                  |
| --kafka-receiver-metrics-topic                     | otlp_metrics   | Topic name for metrics                                                 |
| --kafka-receiver-logs-topic                        | otlp_logs      | Topic name for logs                                                    |
| --kafka-receiver-traces                            | false          | Enable consuming traces                                                |
| --kafka-receiver-metrics                           | false          | Enable consuming metrics                                               |
| --kafka-receiver-logs                              | false          | Enable consuming logs                                                  |
| --kafka-receiver-format                            | protobuf       | json, protobuf                                                         |
| --kafka-receiver-group-id                          | rotel-consumer | Consumer group ID for coordinated consumption                          |
| --kafka-receiver-client-id                         | rotel          | Client ID for the Kafka consumer                                       |
| --kafka-receiver-enable-auto-commit                | false          | Enable auto commit of offsets                                          |
| --kafka-receiver-auto-commit-interval-ms           | 5000           | Auto commit interval in milliseconds                                   |
| --kafka-receiver-auto-offset-reset                 | latest         | earliest, latest, error                                                |
| --kafka-receiver-session-timeout-ms                | 30000          | Session timeout in milliseconds                                        |
| --kafka-receiver-heartbeat-interval-ms             | 3000           | Heartbeat interval in milliseconds                                     |
| --kafka-receiver-max-poll-interval-ms              | 300000         | Maximum poll interval in milliseconds                                  |
| --kafka-receiver-max-partition-fetch-bytes         | 1048576        | Maximum bytes per partition the consumer will buffer                   |
| --kafka-receiver-fetch-min-bytes                   | 1              | Minimum number of bytes for fetch requests                             |
| --kafka-receiver-fetch-max-wait-ms                 | 500            | Maximum wait time for fetch requests in milliseconds                   |
| --kafka-receiver-socket-timeout-ms                 | 60000          | Socket timeout in milliseconds                                         |
| --kafka-receiver-metadata-max-age-ms               | 300000         | Maximum age of metadata in milliseconds                                |
| --kafka-receiver-isolation-level                   | read-committed | read-uncommitted, read-committed                                       |
| --kafka-receiver-enable-partition-eof              | false          | Enable partition EOF notifications                                     |
| --kafka-receiver-check-crcs                        | true           | Check CRC32 of consumed messages                                       |
| --kafka-receiver-disable-exporter-indefinite-retry |                | Disable indefinite retry for exporters when offset tracking is enabled |
| --kafka-receiver-custom-config                     |                | Custom consumer config (comma-separated key=value)                     |
| --kafka-receiver-sasl-username                     |                | SASL username for authentication                                       |
| --kafka-receiver-sasl-password                     |                | SASL password for authentication                                       |
| --kafka-receiver-sasl-mechanism                    |                | plain, scram-sha256, scram-sha512                                      |
| --kafka-receiver-security-protocol                 |                | plaintext, ssl, sasl-plaintext, sasl-ssl                               |
| --kafka-receiver-ssl-ca-location                   |                | SSL CA certificate location                                            |
| --kafka-receiver-ssl-certificate-location          |                | SSL certificate location                                               |
| --kafka-receiver-ssl-key-location                  |                | SSL key location                                                       |
| --kafka-receiver-ssl-key-password                  |                | SSL key password                                                       |

## Offset Tracking and Data Reliability

By default, the Kafka receiver uses **manual offset tracking** to ensure data reliability. With offset tracking enabled:

- **At Least Once Guaranteed Delivery**: Kafka offsets are only committed after telemetry data is successfully exported
- **Indefinite Retry**: Exporters retry indefinitely by default to prevent data loss. If an export fails, the exporter
  will keep retrying until it succeeds.
- **Backpressure Handling**: The Kafka receiver will pause consuming when the pipeline reaches its maximum
  in-memory capacity

### Disabling Indefinite Retry

If you prefer to revert to timeout-based retry behavior (which may result in data loss on persistent export failures),
use:

```shell
--kafka-receiver-disable-exporter-indefinite-retry
```

With this flag, failed exports that exceed the retry timeout will be negatively acknowledged (NACK'd), allowing the
receiver to continue processing new messages.

### Using Auto-Commit (Legacy Behavior)

To revert to the legacy auto-commit behavior where offsets are committed immediately regardless of export success:

```shell
--kafka-receiver-enable-auto-commit 
```

**Warning**: Auto-commit mode may result in data loss if exports fail, as Kafka will mark messages as consumed even if
they weren't successfully exported.

## Consumer Configuration

The Kafka receiver acts as a consumer and supports standard Kafka consumer configurations:

### Consumer Group Management

- `--kafka-receiver-group-id`: Sets the consumer group ID for coordinated consumption across multiple Rotel instances
- `--kafka-receiver-enable-auto-commit`: Controls whether offsets are automatically committed by Kafka (default: false).
  When disabled, Rotel uses manual offset tracking to ensure data reliability.
- `--kafka-receiver-auto-commit-interval-ms`: How often to commit offsets when auto-commit is enabled (only applies when
  auto-commit is true)
- `--kafka-receiver-disable-exporter-indefinite-retry`: When using manual offset tracking, exporters retry indefinitely
  by default. Set this flag to revert to timeout-based retries.

### Offset Management

- `--kafka-receiver-auto-offset-reset`: Controls behavior when no initial offset exists or the current offset is invalid
    - `earliest`: Start consuming from the beginning of the topic
    - `latest`: Start consuming from the end of the topic (default)
    - `error`: Throw an error if no offset is found

### Session and Heartbeat Configuration

- `--kafka-receiver-session-timeout-ms`: Maximum time before the consumer is considered dead and rebalancing occurs
- `--kafka-receiver-heartbeat-interval-ms`: How often to send heartbeats to the broker
- `--kafka-receiver-max-poll-interval-ms`: Maximum delay between poll() calls before consumer is considered failed

### Fetch Configuration

- `--kafka-receiver-fetch-min-bytes`: Minimum amount of data the server should return for a fetch request
- `--kafka-receiver-fetch-max-wait-ms`: Maximum time the server will wait to accumulate fetch-min-bytes of data
- `--kafka-receiver-max-partition-fetch-bytes`: Maximum amount of data per partition the server will return

### Data Integrity

- `--kafka-receiver-check-crcs`: Enables CRC32 checking of consumed messages for data integrity
- `--kafka-receiver-isolation-level`: Controls which messages are visible to the consumer
    - `read-uncommitted`: Read all messages including those from uncommitted transactions
    - `read-committed`: Only read messages from committed transactions (default)

## Security Configuration

For secure Kafka clusters, the receiver supports both SASL and SSL authentication:

### SASL Authentication

```shell
rotel start \
  --kafka-receiver-traces \
  --kafka-receiver-brokers "broker1:9092,broker2:9092" \
  --kafka-receiver-sasl-username "your-username" \
  --kafka-receiver-sasl-password "your-password" \
  --kafka-receiver-sasl-mechanism "scram-sha256" \
  --kafka-receiver-security-protocol "sasl-ssl"
```

### SSL Configuration

```shell
rotel start \
  --kafka-receiver-traces \
  --kafka-receiver-brokers "broker1:9093,broker2:9093" \
  --kafka-receiver-security-protocol "ssl" \
  --kafka-receiver-ssl-ca-location "/path/to/ca-cert" \
  --kafka-receiver-ssl-certificate-location "/path/to/client-cert" \
  --kafka-receiver-ssl-key-location "/path/to/client-key"
```

## Advanced Configuration

The `--kafka-receiver-custom-config` option allows setting arbitrary Kafka consumer configuration parameters using
comma-separated key=value pairs:

```shell
rotel start \
  --kafka-receiver-traces \
  --kafka-receiver-custom-config "max.poll.records=100,fetch.max.bytes=52428800"
```

Custom configuration parameters are applied after all built-in options, allowing them to override any conflicting
settings. See
the [librdkafka configuration documentation](https://github.com/confluentinc/librdkafka/blob/master/CONFIGURATION.md)
for all available consumer parameters.

## Example Usage

Basic example consuming traces from Kafka:

```shell
rotel start \
  --kafka-receiver-traces \
  --kafka-receiver-brokers "localhost:9092" \
  --kafka-receiver-traces-topic "my-traces" \
  --kafka-receiver-format "json" \
  --exporter otlp \
  --otlp-exporter-endpoint "localhost:4317"
```

Consuming multiple telemetry types with custom configuration:

```shell
rotel start \
  --kafka-receiver-traces \
  --kafka-receiver-metrics \
  --kafka-receiver-logs \
  --kafka-receiver-brokers "kafka1:9092,kafka2:9092,kafka3:9092" \
  --kafka-receiver-group-id "rotel-production" \
  --kafka-receiver-auto-offset-reset "earliest" \
  --kafka-receiver-format "protobuf" \
  --exporter clickhouse \
  --clickhouse-exporter-endpoint "https://clickhouse.example.com:8443"
```
