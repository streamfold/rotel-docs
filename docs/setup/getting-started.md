# Getting started

To quickly get started with Rotel you can leverage the pre-built Docker images.

## Running Rotel

We use the prebuilt docker image for this example, but you can also download a binary from the [releases](https://github.com/streamfold/rotel/releases) page.

Execute Rotel with the following arguments:

```bash
docker run -ti -p 4317-4318:4317-4318 streamfold/rotel --debug-log traces --exporter blackhole
```

Rotel is now listening on `localhost:4317` (gRPC) and `localhost:4318` (HTTP). To debug metrics or logs,
add an additional `--debug-log metrics|logs`.

## Verify

We'll use the [telemetrygen](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen) project to verify Rotel is working. Send OTLP traces to Rotel and verify
that it is receiving data:

```bash
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@latest

telemetrygen traces --otlp-insecure --duration 5s
```

Check the output from Rotel and you should see several "Received traces" log lines.

## Next

Check out the full configuration documentation for connecting an exporter and testing end-to-end delivery.
