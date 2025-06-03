---
sidebar_position: 4
---

# Instrumented MCP Server

Demonstration of a Remote MCP server instrumented with OpenTelemetry tracing and sending traces to Datadog. This provides a single connected trace from MCP server through to any backend APIs or databases giving you a complete understanding of your MCP server availability.

Features:
- Bundles a lightweight OpenTelemetry collector using rotel
- Scripts that deploy to Render
- Pushes trace spans to Datadog (using early experimental rotel trace support)
- Pulls the latest weather forecast from a configurable backend API

[mcp-demo-server-otel](https://github.com/streamfold/mcp-demo-server-otel)

