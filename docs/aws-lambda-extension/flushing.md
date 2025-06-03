---
sidebar_position: 4
---

# Adaptive Flushing

This extension uses an **adaptive flushing model**, similar to the one implemented in [Datadog's new Rust Lambda extension](https://www.datadoghq.com/blog/engineering/datadog-lambda-extension-rust/).

On the initial invocation after a cold start, the extension flushes all telemetry data **at the end** of each function invocation. This ensures minimal delay in telemetry availability. However, because the flush happens *after* the invocation completes, it can slightly increase the billed duration of the function.

If the extension detects a regular invocation pattern—such as invocations occurring at least once per minute—it will switch to **periodic flushing at the start** of each invocation. This overlaps the flush operation with the function’s execution time, reducing the likelihood of added billed duration due to telemetry flushing.

For long-running invocations, a **global backup timer** is used to flush telemetry periodically. This timer is reset whenever a regular flush occurs, ensuring that telemetry is still sent even if invocation patterns become irregular.
