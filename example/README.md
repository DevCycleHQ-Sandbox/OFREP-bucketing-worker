# OFREP Bucketing Worker Example

This example demonstrates how to use the OFREP Bucketing Worker with the OpenFeature SDK. It shows how to evaluate feature flags using the OFREP protocol.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (v3 or later)
- A Cloudflare account with Workers enabled
- The main OFREP Bucketing Worker deployed (follow instructions in the root README first)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update `wrangler.toml` with your Cloudflare account details:
```toml
account_id = "your_cloudflare_account_id"
```

3. Update the route pattern if you want to use a different domain:
```toml
route = { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
```

4. Update the service binding to point to your deployed OFREP Bucketing Worker:
```toml
services = [
  { binding = "OFREP_BUCKETING", service = "your-ofrep-bucketing-worker-name" }
]
```

## Development

To run the example worker locally:
```bash
npm run dev
```

## Deployment

To deploy the example worker to your Cloudflare environment:
```bash
npm run deploy
```

## Testing the Example

The example worker exposes a test endpoint that evaluates multiple feature flags:

```bash
curl -X POST https://your-worker-url/test-evaluation/ \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "user_id": "test-user-123",
      "customAttribute": "value"
    }
  }'
```

The response will include the evaluated values for three different feature flags:
- `ofrep-demo` (boolean)
- `ofrep-string` (string)
- `ofrep-num` (number)

Example response:
```json
{
  "ofrep-demo": true,
  "ofrep-string": "test-value",
  "ofrep-num": 42,
  "boolEvaluationTime": 123,
  "stringEvaluationTime": 45,
  "numberEvaluationTime": 67
}
```

## How It Works

The example demonstrates:
1. Setting up the OFREP Provider with your deployed bucketing worker
2. Configuring OpenFeature with the provider
3. Creating a client and evaluating different types of feature flags
4. Performance tracking for flag evaluations

Key code sections:
```typescript
const provider = new OFREPProvider({ 
    baseUrl: 'https://your-bucketing-worker.com',
    fetchImplementation: (input, init) => env.OFREP_BUCKETING.fetch(input, init)
});

await OpenFeature.setProviderAndWait(provider);
const client = OpenFeature.getClient();

// Evaluate flags
const boolFlag = await client.getBooleanValue('ofrep-demo', false, context);
const stringFlag = await client.getStringValue('ofrep-string', 'default', context);
const numberFlag = await client.getNumberValue('ofrep-num', 100, context);
```

## Troubleshooting

1. If you get a "Service not found" error, make sure:
   - The main OFREP Bucketing Worker is deployed
   - The service binding in `wrangler.toml` matches your worker's name

2. If flag evaluations return default values, verify:
   - Your feature flags are properly configured
   - The context object contains the required targeting attributes

3. For local development issues:
   - Ensure both the main worker and example are running
   - Check that service bindings are properly configured in `wrangler.toml`
