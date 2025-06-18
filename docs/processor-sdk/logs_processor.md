---
sidebar_position: 5
---

# Writing a logs processor

For logs let's try something a little different. The following is an example OTel log processor called
`redact_emails_in_logs.py`. This script checks to see if LogRecords have a body that contains email addresses.
If an email is found, we redact the email and replace it with the string `[email redacted]`.
Open up your editor or Python IDE and paste the following into a file called `redact_emails_in_logs.py` and run with the
following command.

```python title="redact_emails_in_logs.py"
import re
import itertools

from rotel_sdk.open_telemetry.common.v1 import AnyValue
from rotel_sdk.open_telemetry.logs.v1 import ResourceLogs

email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

def process_logs(resource_logs: ResourceLogs):
    for log_record in itertools.chain.from_iterable(
        scope_log.log_records for scope_log in resource_logs.scope_logs
    ):
        if hasattr(log_record, 'body') and log_record.body and hasattr(log_record.body, 'value'):
            if log_record.body.value and re.search(email_pattern, log_record.body.value):
                if log_record.body is not None:
                    log_record.body = redact_emails(log_record.body)

def redact_emails(body: AnyValue) -> AnyValue:
    """
    Searches for email addresses in a string and replaces them with '[email redacted]'
    
    Args:
        text (str): The input string to search for email addresses
        
    Returns:
        str: The string with email addresses replaced by '[email redacted]'
    """
    if body.value is None or not isinstance(body.value, str):
        return body
    redacted_body, matches = re.subn(email_pattern, '[email redacted]', body.value)
    if matches == 0:
        return body
    return AnyValue(redacted_body)
```

Now start rotel and the processor with the following command and use a load generator to send some log messages to rotel
that contain email addresses.
When you view the logs in your observability backend you should now see the email address are redacted.

```commandline
./rotel start --exporter blackhole  --otlp-with-logs-processor ./redact_email_in_logs.py --debug-log logs --debug-log-verbosity detailed
```

Next run the following `telemetrygen` command

```text
telemetrygen logs --otlp-endpoint 127.0.0.1:4317 --otlp-insecure --body '192.168.1.45 - - [23/May/2025:14:32:17 +0000] "POST /contact-form HTTP/1.1" 200 1247 "https://example.com/contact" "Mozilla/5.0 (Windows NT 10.0; Win64; x6     4) AppleWebKit/537.36" "email=john.doe@company.com&subject=Support Request&message=Need help with login issues"'
```

Rotel will print out the before and after values of the OTLP log message

```
=== BEFORE ===
2025-06-18T04:00:17.219929Z  INFO Starting Rotel. grpc_endpoint="127.0.0.1:4317" http_endpoint="127.0.0.1:4318"
ResourceLog #0
Resource SchemaURL: https://opentelemetry.io/schemas/1.4.0
ScopeLogs #0
ScopeLogs SchemaURL: 
LogRecord #0
ObservedTimestamp: 0
Timestamp: 1750219220720478000
SeverityText: Info
SeverityNumber: SEVERITY_NUMBER_INFO(9)
Body: Str(192.168.1.45 - - [23/May/2025:14:32:17 +0000] "POST /contact-form HTTP/1.1" 200 1247 "https://example.com/contact" "Mozilla/5.0 (Windows NT 10.0; Win64; x6     4) AppleWebKit/537.36" "email=john.doe@company.com&subject=Support Request&message=Need help with login issues")
Attributes:
     -> app: Str(server)
    Trace ID       : 
    Span ID        : 
Flags: 0

=== AFTER ===
ResourceLog #0
Resource SchemaURL: https://opentelemetry.io/schemas/1.4.0
ScopeLogs #0
ScopeLogs SchemaURL: 
LogRecord #0
ObservedTimestamp: 0
Timestamp: 1750219220720478000
SeverityText: Info
SeverityNumber: SEVERITY_NUMBER_INFO(9)
Body: Str(192.168.1.45 - - [23/May/2025:14:32:17 +0000] "POST /contact-form HTTP/1.1" 200 1247 "https://example.com/contact" "Mozilla/5.0 (Windows NT 10.0; Win64; x6     4) AppleWebKit/537.36" "email=[email redacted]&subject=Support Request&message=Need help with login issues")
Attributes:
     -> app: Str(server)
    Trace ID       : 
    Span ID        : 
Flags: 0
```
