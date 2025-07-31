import type { Context } from "@netlify/edge-functions";

// Types for the request payload
interface NetlifyGeoData {
  city?: string;
  country?: string;
  country_code?: string;
  region?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
}

interface NetlifyRequestContext {
  geo: NetlifyGeoData;
  ip: string;
  request_id: string;
  server_region: string;
}

interface LoggingPayload {
  url: string;
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  context: NetlifyRequestContext;
  timestamp: string;
  status_code: number;
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  // Get the logging endpoint from environment variable, fallback to example
  const loggingEndpoint =
    Netlify.env.get("LOGGING_ENDPOINT") || "https://post.example.com/netlify";
  const loggingKey =
    Netlify.env.get("LOGGING_KEY") || "unknown";

    // Parse URL for query parameters
    const url = new URL(request.url);
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // Extract headers (filter out sensitive ones)
    const headers: Record<string, string> = {};
    const allowedHeaders = [
      "user-agent",
      "referer",
      "accept",
      "accept-language",
      "origin",
    ];

    for (const [key, value] of request.headers.entries()) {
      if (allowedHeaders.includes(key.toLowerCase())) {
        headers[key] = value;
      }
    }
    
    const resp = await context.next();
    
    // Skip redirects
    if (resp.status === 301) {
      return resp;
    }

  try {
    // Prepare the logging payload
    const payload: LoggingPayload = {
      url: request.url,
      method: request.method,
      headers,
      query: queryParams,
      context: {
        geo: {
          city: context.geo?.city,
          country: context.geo?.country?.name,
          country_code: context.geo?.country?.code,
          region: context.geo?.subdivision?.name,
          latitude: context.geo?.latitude?.toString(),
          longitude: context.geo?.longitude?.toString(),
          timezone: context.geo?.timezone,
        },
        ip: context.ip,
        request_id: context.requestId,
        server_region: context.server?.region || "unknown",
      },
      timestamp: new Date().toISOString(),
      status_code: resp.status,
    };

    // Send to logging endpoint asynchronously (don't wait for response)
    await fetch(loggingEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Logging-Key": loggingKey,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(500), // tight bound of 500ms
    }).catch((error) => {
      console.error("Failed to send log to endpoint:", error);
    });

    return resp;
  } catch (error) {
    console.error("Error in edge function:", error);

    return resp;
  }
}

export const config = {
  path: "/*", // Match all paths - adjust as needed for your use case
  excludedPath: ["/*.css", "/*.js", "/*.svg", "/*.png", "/*.jpg", "/*.ico", "/site.webmanifest"], // exclude static assets
};
