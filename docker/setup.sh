#!/bin/bash
# docker/setup.sh
# One-shot infrastructure setup script for TempFile
# Run: bash docker/setup.sh

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  TempFile Infrastructure Setup     ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════╝${NC}"
echo ""

# Check required tools
check_tool() {
  if ! command -v "$1" &> /dev/null; then
    echo -e "${RED}✗ $1 is required but not installed.${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ $1 found${NC}"
}

echo -e "${YELLOW}Checking required tools...${NC}"
check_tool "node"
check_tool "pnpm"
check_tool "wrangler"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Wrangler login
echo -e "${YELLOW}Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
  echo "Please log in to Cloudflare:"
  wrangler login
fi
echo -e "${GREEN}✓ Authenticated with Cloudflare${NC}"
echo ""

# Create D1 database
echo -e "${YELLOW}Creating D1 database...${NC}"
DB_OUTPUT=$(wrangler d1 create tempfile-db 2>&1 || true)
DB_ID=$(echo "$DB_OUTPUT" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2 || echo "")
if [ -n "$DB_ID" ]; then
  echo -e "${GREEN}✓ D1 database created: $DB_ID${NC}"
  # Update wrangler.jsonc
  sed -i.bak "s/YOUR_D1_DATABASE_ID/$DB_ID/" wrangler.jsonc
  rm -f wrangler.jsonc.bak
else
  echo -e "${YELLOW}⚠ Could not auto-extract DB ID. Update wrangler.jsonc manually.${NC}"
fi
echo ""

# Create R2 buckets
echo -e "${YELLOW}Creating R2 buckets...${NC}"
wrangler r2 bucket create tempfile-files 2>/dev/null || echo "  (tempfile-files already exists)"
wrangler r2 bucket create tempfile-files-dev 2>/dev/null || echo "  (tempfile-files-dev already exists)"
wrangler r2 bucket create tempfile-cache 2>/dev/null || echo "  (tempfile-cache already exists)"
echo -e "${GREEN}✓ R2 buckets ready${NC}"
echo ""

# Create KV namespaces
echo -e "${YELLOW}Creating KV namespaces...${NC}"
RL_OUTPUT=$(wrangler kv namespace create RATE_LIMIT_KV 2>&1 || true)
RL_ID=$(echo "$RL_OUTPUT" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
RL_PREVIEW_OUTPUT=$(wrangler kv namespace create RATE_LIMIT_KV --preview 2>&1 || true)
RL_PREVIEW_ID=$(echo "$RL_PREVIEW_OUTPUT" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4 || echo "")

DEDUP_OUTPUT=$(wrangler kv namespace create DEDUP_KV 2>&1 || true)
DEDUP_ID=$(echo "$DEDUP_OUTPUT" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
DEDUP_PREVIEW_OUTPUT=$(wrangler kv namespace create DEDUP_KV --preview 2>&1 || true)
DEDUP_PREVIEW_ID=$(echo "$DEDUP_PREVIEW_OUTPUT" | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4 || echo "")

if [ -n "$RL_ID" ]; then
  sed -i.bak "s/YOUR_KV_NAMESPACE_ID/$RL_ID/" wrangler.jsonc
  rm -f wrangler.jsonc.bak
fi
if [ -n "$RL_PREVIEW_ID" ]; then
  sed -i.bak "s/YOUR_KV_PREVIEW_ID/$RL_PREVIEW_ID/" wrangler.jsonc
  rm -f wrangler.jsonc.bak
fi
if [ -n "$DEDUP_ID" ]; then
  sed -i.bak "s/YOUR_DEDUP_KV_ID/$DEDUP_ID/" wrangler.jsonc
  rm -f wrangler.jsonc.bak
fi
if [ -n "$DEDUP_PREVIEW_ID" ]; then
  sed -i.bak "s/YOUR_DEDUP_KV_PREVIEW_ID/$DEDUP_PREVIEW_ID/" wrangler.jsonc
  rm -f wrangler.jsonc.bak
fi
echo -e "${GREEN}✓ KV namespaces ready${NC}"
echo ""

# Generate TypeScript types
echo -e "${YELLOW}Generating Cloudflare type bindings...${NC}"
pnpm cf-typegen
echo -e "${GREEN}✓ Types generated${NC}"
echo ""

# Run local migrations
echo -e "${YELLOW}Running D1 migrations (local)...${NC}"
pnpm db:migrate:local
echo -e "${GREEN}✓ Local DB migrated${NC}"
echo ""

echo -e "${CYAN}════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Infrastructure setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Copy .env.example → .env.local and fill in your credentials"
echo "  2. Copy .dev.vars.example → .dev.vars and fill in secrets"
echo "  3. Run: pnpm dev     (Next.js dev server)"
echo "     OR:  pnpm preview  (real Cloudflare Workers runtime)"
echo ""
echo "  For production deploy:"
echo "  4. Set secrets: bash docker/set-secrets.sh"
echo "  5. Run: pnpm deploy"
echo -e "${CYAN}════════════════════════════════════${NC}"
