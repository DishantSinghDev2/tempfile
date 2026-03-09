# TempFile

**Instant Secure File Sharing — Files that disappear.**

> Share any file with an auto-expiring link. No account required. SHA-256 deduplication, direct GCS uploads, Cloudflare R2 hot tier. Built entirely on Cloudflare Workers + Google Cloud Storage.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yourusername/tempfile)

---

## What is TempFile?

TempFile is a production-ready ephemeral file hosting platform with:

- **Zero-proxy architecture** — files go client → GCS directly, Workers only handle metadata
- **SHA-256 deduplication** — same file uploaded twice = instant second upload, no bytes transferred
- **Hot file CDN tier** — popular files (>3 downloads, >100 MB) auto-promote to Cloudflare R2
- **Smart expiry** — early-delete triggers when uploader downloads their own file once after 30 min
- **Abuse protection** — per-IP scoring with upload volume, GB/day, and download burst tracking
- **Monetization** — Paddle-powered subscriptions with Free / Starter / Pro / Enterprise tiers
- **Developer API** — signed upload URLs, file management, webhook events

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Runtime | Cloudflare Workers via OpenNext |
| Database | Cloudflare D1 (SQLite) + Drizzle ORM |
| Primary Storage | Google Cloud Storage (Standard tier) |
| Hot CDN Tier | Cloudflare R2 |
| Rate Limiting | Cloudflare KV |
| Dedup Cache | Cloudflare KV |
| Auth | Auth.js v5 (next-auth beta) |
| Payments | Paddle |
| Blog | DITBlogs SDK |
| Deployment | Cloudflare Workers via `wrangler` + OpenNext |

---

## Repository Structure

```
tempfile/
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Public pages: home, pricing, blog
│   │   ├── (dashboard)/        # Authenticated dashboard
│   │   ├── api/                # API routes (metadata only — no file bytes)
│   │   │   ├── upload/         # POST: create signed URL + dedup check
│   │   │   ├── upload/confirm/ # POST: mark upload as active
│   │   │   ├── files/          # GET/DELETE: user file management
│   │   │   ├── files/[id]/     # GET: share page metadata
│   │   │   ├── files/[id]/download/ # GET: redirect to signed URL
│   │   │   └── webhook/paddle/ # POST: subscription events
│   │   ├── f/[id]/             # Public share page
│   │   └── auth/               # Sign in / error pages
│   ├── components/
│   │   ├── upload/             # UploadZone (core feature)
│   │   ├── layout/             # Nav, Footer
│   │   ├── dashboard/          # DashboardNav, FileRow
│   │   ├── marketing/          # Hero, Features, HowItWorks, CTA
│   │   └── ui/                 # FadeIn, SectionMarker
│   ├── lib/
│   │   ├── db/                 # Drizzle schema + D1 client
│   │   ├── storage/            # GCS signed URL generation
│   │   ├── billing/            # Paddle API client
│   │   ├── file-service.ts     # Core upload/download business logic
│   │   ├── rate-limit.ts       # KV-based rate limiting + abuse scoring
│   │   ├── plans.ts            # Plan definitions and limits
│   │   ├── blogs.ts            # DITBlogs SDK integration
│   │   └── utils.ts            # Helpers
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   └── auth.ts                 # Auth.js v5 configuration
├── drizzle/                    # DB migrations (generated)
├── public/                     # Static assets
├── wrangler.jsonc              # Cloudflare Workers config
├── open-next.config.ts         # OpenNext adapter config
├── next.config.ts              # Next.js config
├── drizzle.config.ts           # Drizzle Kit config
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Local dev environment
├── .env.example                # Environment variable template
└── .dev.vars.example           # Wrangler secrets template
```

---

## Quick Start (Docker)

### Prerequisites
- Docker + Docker Compose
- Node.js 22+ (for wrangler CLI)
- A Cloudflare account
- A Google Cloud account

### 1. Clone and configure

```bash
git clone https://github.com/yourusername/tempfile.git
cd tempfile

# Copy environment files
cp .env.example .env.local
cp .dev.vars.example .dev.vars

# Edit both files with your credentials
nano .env.local
nano .dev.vars
```

### 2. Run locally with Docker

```bash
# Development mode (Next.js dev server)
docker-compose up app

# Preview mode (real Cloudflare Workers runtime)
docker-compose --profile preview up preview
```

The app is now running at:
- Dev: `http://localhost:3000`
- Preview (Workers runtime): `http://localhost:8787`

---

## Full Setup Guide

See **[SETUP.md](./SETUP.md)** for the complete step-by-step guide covering:
1. Cloudflare account setup (D1, R2, KV namespaces, Worker)
2. Google Cloud Storage bucket + service account
3. Auth providers (GitHub, Google OAuth)
4. Paddle billing configuration
5. DITBlogs integration
6. Database migrations
7. Production deployment

---

## API Reference

### Upload a file

```bash
# Step 1: Get signed upload URL
POST /api/upload
Content-Type: application/json
Authorization: Bearer <optional>

{
  "filename": "document.pdf",
  "mimeType": "application/pdf",
  "size": 1048576,
  "sha256": "abc123...",       # Client-computed SHA-256
  "expiryHours": 24,          # Optional, default 24
  "maxDownloads": null        # Optional, null = unlimited
}

# Response (new file):
{
  "success": true,
  "data": {
    "shareId": "abc12345xyz0",
    "uploadUrl": "https://storage.googleapis.com/...",  # PUT here directly
    "alreadyExists": false,
    "expiresAt": "2025-01-02T00:00:00.000Z"
  }
}

# Response (dedup hit — instant!):
{
  "success": true,
  "data": {
    "shareId": "def67890uvw1",
    "alreadyExists": true,       # No upload needed
    "expiresAt": "2025-01-02T00:00:00.000Z"
  }
}

# Step 2: Upload directly to GCS (bypass your server entirely)
PUT <uploadUrl>
Content-Type: application/pdf
<file bytes>

# Step 3: Confirm the upload
POST /api/upload/confirm
Content-Type: application/json

{ "shareId": "abc12345xyz0" }
```

### Download a file

```bash
# Redirects (302) to a signed GCS/R2 URL
GET /api/files/{shareId}/download
```

### List your files (authenticated)

```bash
GET /api/files
Authorization: Bearer <session-token>

?page=1&limit=20
```

### Delete a file (authenticated)

```bash
DELETE /api/files?id={fileId}
Authorization: Bearer <session-token>
```

---

## Cost Optimization Strategy

TempFile implements all 15 cost-saving strategies from the architecture spec:

| # | Strategy | Implementation |
|---|---|---|
| 1 | Upload deduplication | SHA-256 hash check via KV + D1 before upload |
| 2 | Direct uploads only | Clients PUT directly to GCS signed URLs |
| 3 | Storage lifecycle tiers | GCS Standard → R2 Hot → GCS Nearline → Delete |
| 4 | Early deletion | Same-IP single download after 30min triggers delete |
| 5 | Download burst limits | KV rate limiter: 10 downloads/file free |
| 6 | Expiry countdown UX | "Auto-deletes in 23h 12m" shown on share page |
| 7 | Client-side compression | Zip multiple files in browser before upload |
| 8 | Block expensive types | .torrent, .exe blocked; .iso/.mkv free-restricted |
| 9 | Size-based economics | >500 MB forced 6h expiry; >2 GB Pro only |
| 10 | Anonymous by default | No account required for basic uploads |
| 11 | Edge redirect | Workers only `return redirect(signedUrl)` |
| 12 | Abuse scoring | Upload count + GB/day + download bursts → IP block |
| 13 | Hot file cache | >100 MB + >3 downloads → copy to R2 |
| 14 | Download count expiry | Auto-delete after last download + 2h |
| 15 | Storage quota per IP | Max 1 GB active storage free → oldest deleted |

---

## Plans & Pricing

| Plan | Price | File Size | Expiry | Downloads | Credits |
|---|---|---|---|---|---|
| Free | $0 | 100 MB | 24h | 10 | — |
| Starter | $5/mo | 500 MB | 7d | ∞ | 100/mo |
| Pro | $15/mo | 2 GB | 30d | ∞ | 500/mo |
| Enterprise | $99/mo | 10 GB | 365d | ∞ | 5,000/mo |

---

## Environment Variables

See `.env.example` for all required variables. Critical ones:

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Next-auth signing secret (32+ chars) |
| `GCS_SERVICE_ACCOUNT_KEY` | GCS service account JSON (stringified) |
| `GCS_BUCKET_NAME` | GCS bucket for file storage |
| `PADDLE_API_KEY` | Paddle API key for billing |
| `PADDLE_WEBHOOK_SECRET` | Paddle webhook signing secret |
| `DITBLOGS_API_KEY` | DITBlogs SDK API key |

---

## License

MIT
