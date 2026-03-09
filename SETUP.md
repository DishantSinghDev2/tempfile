# TempFile — Complete Setup Guide

This guide walks you through deploying TempFile from scratch to Cloudflare Workers.

---

## Prerequisites

- Node.js 22+
- `pnpm` installed globally: `npm i -g pnpm`
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- A [Google Cloud account](https://console.cloud.google.com)
- A [Paddle account](https://www.paddle.com) (sandbox for testing)
- A [DITBlogs account](https://ditblogs.com) for blog integration

---

## Step 1: Install Dependencies

```bash
pnpm install
```

---

## Step 2: Cloudflare Setup

### 2.1 Login to Wrangler

```bash
pnpm wrangler login
# Note your account ID:
pnpm wrangler whoami
```

### 2.2 Create D1 Database

```bash
pnpm wrangler d1 create tempfile-db
# Copy the database_id output into wrangler.jsonc → d1_databases[0].database_id
```

### 2.3 Create R2 Buckets

```bash
# Production file bucket
pnpm wrangler r2 bucket create tempfile-files
pnpm wrangler r2 bucket create tempfile-files-dev  # for local preview

# OpenNext cache bucket
pnpm wrangler r2 bucket create tempfile-cache
```

### 2.4 Create KV Namespaces

```bash
# Rate limiting KV
pnpm wrangler kv namespace create RATE_LIMIT_KV
# Copy the ID into wrangler.jsonc → kv_namespaces[0].id

pnpm wrangler kv namespace create RATE_LIMIT_KV --preview
# Copy the preview_id into wrangler.jsonc → kv_namespaces[0].preview_id

# Deduplication KV
pnpm wrangler kv namespace create DEDUP_KV
# Copy the ID into wrangler.jsonc → kv_namespaces[1].id

pnpm wrangler kv namespace create DEDUP_KV --preview
# Copy the preview_id into wrangler.jsonc → kv_namespaces[1].preview_id
```

### 2.5 Update wrangler.jsonc

Fill in your actual IDs in `wrangler.jsonc`:

```jsonc
{
  "name": "tempfile",           // Change if desired
  "d1_databases": [{
    "database_id": "YOUR_D1_ID"  // From step 2.2
  }],
  "r2_buckets": [
    { "binding": "NEXT_INC_CACHE_R2_BUCKET", "bucket_name": "tempfile-cache" },
    {
      "binding": "FILE_BUCKET",
      "bucket_name": "tempfile-files",
      "preview_bucket_name": "tempfile-files-dev"
    }
  ],
  "kv_namespaces": [
    { "binding": "RATE_LIMIT_KV", "id": "YOUR_KV_ID", "preview_id": "YOUR_PREVIEW_ID" },
    { "binding": "DEDUP_KV", "id": "YOUR_KV_ID", "preview_id": "YOUR_PREVIEW_ID" }
  ]
}
```

### 2.6 Run Database Migrations

```bash
# Local (for development)
pnpm db:migrate:local

# Production
pnpm db:migrate:prod
```

---

## Step 3: Google Cloud Storage Setup

### 3.1 Create a GCS bucket

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new bucket (e.g., `tempfile-uploads-prod`)
3. Set location: Multi-region (US or EU)
4. Storage class: Standard
5. Access control: Fine-grained

### 3.2 Configure CORS for direct browser uploads

Create `cors.json`:

```json
[
  {
    "origin": ["https://tempfile.io", "http://localhost:3000"],
    "method": ["PUT", "GET", "OPTIONS"],
    "responseHeader": ["Content-Type", "Content-Length"],
    "maxAgeSeconds": 3600
  }
]
```

Apply:
```bash
gcloud storage buckets update gs://tempfile-uploads-prod --cors-file=cors.json
```

### 3.3 Create a service account

```bash
# Create service account
gcloud iam service-accounts create tempfile-upload \
  --display-name="TempFile Upload Service"

# Grant Storage Object Admin
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:tempfile-upload@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Create and download key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account="tempfile-upload@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

4. Copy the JSON key content (minified, single line) for the `GCS_SERVICE_ACCOUNT_KEY` secret.

---

## Step 4: OAuth Provider Setup

### 4.1 GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Application name: TempFile
3. Homepage URL: `https://tempfile.io`
4. Callback URL: `https://tempfile.io/api/auth/callback/github`
5. Copy Client ID and Client Secret

For local dev, create a separate GitHub App with callback: `http://localhost:3000/api/auth/callback/github`

### 4.2 Google OAuth

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs:
   - `https://tempfile.io/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

---

## Step 5: Paddle Billing Setup

### 5.1 Create products and prices

1. Go to [Paddle Dashboard](https://vendors.paddle.com)
2. Create 4 products: Starter, Pro, Enterprise (Free has no Paddle product)
3. For each, create monthly and yearly prices
4. Copy the price IDs (format: `pri_xxx`) into your environment variables

### 5.2 Configure webhook

1. In Paddle dashboard → Notifications → Create notification
2. URL: `https://tempfile.io/api/webhook/paddle`
3. Events to listen:
   - `subscription.created`
   - `subscription.activated`
   - `subscription.canceled`
   - `subscription.past_due`
4. Copy the webhook secret

---

## Step 6: DITBlogs Integration

1. Create an account at [ditblogs.com](https://ditblogs.com)
2. Create your publication for TempFile
3. Get your API key from the dashboard
4. Set `DITBLOGS_API_KEY` in your environment

---

## Step 7: Configure Secrets

### For local development (.dev.vars)

```bash
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your actual credentials
```

### For production (Cloudflare Workers)

```bash
# Set each secret via wrangler:
echo "your-auth-secret" | pnpm wrangler secret put AUTH_SECRET
echo "your-github-client-id" | pnpm wrangler secret put GITHUB_CLIENT_ID
echo "your-github-client-secret" | pnpm wrangler secret put GITHUB_CLIENT_SECRET
echo "your-google-client-id" | pnpm wrangler secret put GOOGLE_CLIENT_ID
echo "your-google-client-secret" | pnpm wrangler secret put GOOGLE_CLIENT_SECRET
# Paste the minified JSON key:
pnpm wrangler secret put GCS_SERVICE_ACCOUNT_KEY
echo "your-paddle-api-key" | pnpm wrangler secret put PADDLE_API_KEY
echo "your-paddle-webhook-secret" | pnpm wrangler secret put PADDLE_WEBHOOK_SECRET
echo "your-ditblogs-api-key" | pnpm wrangler secret put DITBLOGS_API_KEY
```

---

## Step 8: Local Development

### Option A: Docker (Recommended)

```bash
# Standard Next.js dev server
docker-compose up app

# OR preview with real Workers runtime
docker-compose --profile preview up preview
```

### Option B: Direct

```bash
# Generate TypeScript types for CF bindings
pnpm cf-typegen

# Run dev server
pnpm dev

# OR preview in Workers runtime
pnpm preview
```

---

## Step 9: Deploy to Production

```bash
# Build + deploy in one command
pnpm deploy

# OR separate steps:
pnpm build:open   # Build OpenNext output
pnpm wrangler deploy  # Deploy to Cloudflare
```

### Post-deploy: Set environment variables

In Cloudflare Dashboard → Workers & Pages → tempfile → Settings → Variables:

Add these as plaintext variables:
- `NEXT_PUBLIC_APP_URL` = `https://tempfile.io`
- `GCS_BUCKET_NAME` = `tempfile-uploads-prod`
- `GCS_PROJECT_ID` = `your-project-id`
- `PADDLE_ENVIRONMENT` = `production`

---

## Step 10: Custom Domain

1. In Cloudflare Dashboard → Workers & Pages → tempfile → Triggers → Custom Domains
2. Add your domain (e.g., `tempfile.io`)
3. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## Step 11: Set up GCS Lifecycle Rules (Optional)

Move files to Nearline after 6 hours if never downloaded:

```bash
cat > lifecycle.json << 'EOF'
{
  "rule": [
    {
      "action": {"type": "SetStorageClass", "storageClass": "NEARLINE"},
      "condition": {
        "age": 1,
        "matchesPrefix": ["files/"]
      }
    }
  ]
}
EOF

gcloud storage buckets update gs://tempfile-uploads-prod \
  --lifecycle-file=lifecycle.json
```

---

## Troubleshooting

### "FinalizationRegistry is not defined"

Update your `compatibility_date` in `wrangler.jsonc` to `2025-05-05` or later.

### "process.env is empty"

Ensure your `compatibility_date` is set to `2025-04-01` or later. Earlier dates don't auto-populate `process.env`.

### CORS errors on file upload

Make sure your GCS bucket CORS configuration includes your domain (see Step 3.2).

### Auth.js errors about AUTH_URL

Set `AUTH_URL` and `AUTH_TRUST_HOST=true` in your `.dev.vars` or worker secrets.

### D1 migrations not applying

```bash
# Check migration status
pnpm wrangler d1 migrations list tempfile-db

# Run locally
pnpm wrangler d1 migrations apply tempfile-db --local
```

---

## Architecture Diagram

```
Browser
  │
  ├─── POST /api/upload ──────────────────► Cloudflare Worker
  │         (metadata: filename, size,       │  ├── D1: dedup check
  │          sha256, mimeType)               │  ├── KV: rate limit check
  │                                          │  ├── D1: insert file record
  │    ◄─── { uploadUrl, shareId } ─────────┤  └── GCS: generate signed URL
  │
  ├─── PUT <GCS signed URL> ─────────────► Google Cloud Storage
  │         (file bytes, direct)             (never through Worker)
  │
  ├─── POST /api/upload/confirm ─────────► Cloudflare Worker
  │                                          └── D1: status = "active"
  │
  ◄─── /f/{shareId} ─────────────────────── Worker: share page (SSR)
  │
  └─── GET /api/files/{id}/download ──────► Worker: 302 redirect
                                             └── GCS/R2 signed URL
```
