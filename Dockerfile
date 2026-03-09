# Dockerfile
# For local development only — production deploys to Cloudflare Workers

FROM node:22-alpine AS base
RUN npm install -g pnpm@latest

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Development
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Preview (simulates CF Workers runtime with wrangler)
FROM base AS preview
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build:open
EXPOSE 8787
CMD ["pnpm", "exec", "opennextjs-cloudflare", "preview"]
