# OFREP Bucketing Worker

This repository contains a Cloudflare Worker that implements the OpenFeature Remote Evaluation Protocol (OFREP) for feature flag evaluation. It provides a bucketing service that can be used with the OpenFeature SDK.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (v3 or later)
- A Cloudflare account with Workers enabled

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/OFREP-bucketing-worker.git
cd OFREP-bucketing-worker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.dev.vars` file in the root directory with your configuration:
```
DVC_API_KEY=your_devcycle_api_key
CF_ZONE_ID=your_cloudflare_zone_id
CF_API_TOKEN=your_cloudflare_api_token
```

4. Update the `wrangler.toml` file with your Cloudflare account details:
```toml
account_id = "your_cloudflare_account_id"
```

Also update the route pattern if you want to use a different domain:
```toml
route = { pattern = "your-domain.com/*", zone_name = "your-domain.com" }
```

## Development

To run the worker locally:
```bash
npm run dev
```

## Deployment

To deploy the worker to your Cloudflare environment:
```bash
npm run deploy
```

## Example Usage

An example implementation is provided in the `example` directory. To run the example:

1. Navigate to the example directory:
```bash
cd example
```

2. Install dependencies:
```bash
npm install
```

3. Update the example's `wrangler.toml` with your account details and desired route.

4. Deploy the example worker:
```bash
npm run deploy
```

## API Endpoints

### POST /ofrep/v1/evaluate/flags/:key?

Evaluates feature flags based on the provided context. The endpoint accepts a JSON payload with the following structure:

```json
{
  "context": {
    "user_id": "user-123",
    "targetingKey": "optional-targeting-key",
    "customAttribute": "value"
  }
}
```

## Environment Variables

- `DVC_API_KEY`: Your DevCycle Server API key
- `CF_ZONE_ID`: Your Cloudflare Zone ID
- `CF_API_TOKEN`: Your Cloudflare API token

## License

[Add your license information here]
