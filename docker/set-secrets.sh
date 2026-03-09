#!/bin/bash
# docker/set-secrets.sh
# Sets all production secrets in Cloudflare Workers via wrangler

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}Setting Cloudflare Worker secrets...${NC}"
echo "You will be prompted for each secret value."
echo ""

secrets=(
  "AUTH_SECRET:Next-auth secret (min 32 chars, run: openssl rand -base64 32)"
  "GITHUB_CLIENT_ID:GitHub OAuth App Client ID"
  "GITHUB_CLIENT_SECRET:GitHub OAuth App Client Secret"
  "GOOGLE_CLIENT_ID:Google OAuth Client ID"
  "GOOGLE_CLIENT_SECRET:Google OAuth Client Secret"
  "GCS_SERVICE_ACCOUNT_KEY:GCS service account JSON (single line, no newlines)"
  "PADDLE_API_KEY:Paddle API key"
  "PADDLE_WEBHOOK_SECRET:Paddle webhook signing secret"
  "DITBLOGS_API_KEY:DITBlogs API key"
  "CRON_SECRET:Random secret for cron endpoint auth (openssl rand -hex 32)"
)

for secret_entry in "${secrets[@]}"; do
  name="${secret_entry%%:*}"
  description="${secret_entry#*:}"
  echo -e "${YELLOW}→ $name${NC}"
  echo "  $description"
  echo -n "  Value: "
  read -rs value
  echo ""
  if [ -n "$value" ]; then
    echo "$value" | wrangler secret put "$name"
    echo -e "${GREEN}  ✓ Set${NC}"
  else
    echo "  (skipped)"
  fi
  echo ""
done

echo -e "${GREEN}✓ All secrets configured.${NC}"
echo ""
echo "Reminder: Set these vars in wrangler.jsonc (not secrets):"
echo "  NEXT_PUBLIC_APP_URL, GCS_BUCKET_NAME, GCS_PROJECT_ID,"
echo "  PADDLE_ENVIRONMENT, MAX_FREE_FILE_SIZE, etc."
