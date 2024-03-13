FROM node:20-alpine AS base

# mostly inspired from https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile & https://github.com/remix-run/example-trellix/blob/main/Dockerfile

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate 
# set the store dir to a folder that is not in the project
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm fetch

# 1. Install all dependencies including dev dependencies
FROM base AS dev
# Root user is implicit so you don't have to actually specify it. From https://stackoverflow.com/a/45553149/6141587
# USER root
USER node
# WORKDIR now sets correct permissions if you set USER first so `USER node` has permissions on `/app` directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json pnpm-lock.yaml* ./
COPY --chown=node:node . .

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

USER root
RUN pnpm install --frozen-lockfile --prefer-offline
RUN pnpm install sharp@0.32.6

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# Inspired by https://github.com/vercel/next.js/discussions/36935
RUN mkdir -p /app/.next/cache && chown -R node:node /app/.next/cache
# Persist the next cache in a volume
VOLUME ["/app/.next/cache"]
COPY --from=dev --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

# This will do the trick, use the corresponding env file for each environment.
COPY --chown=node:node .env* ./

# Copied from https://stackoverflow.com/a/69867550/6141587
USER root
# Give /data directory correct permissions otherwise WAL mode won't work. It means you can't have 2 users writing to the database at the same time without this line as *.sqlite-wal & *.sqlite-shm are automatically created & deleted when *.sqlite is busy.
RUN mkdir -p /data && chown -R node:node /data

# set to production otherwise it throws error ⚠ You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

# 3. Production image, copy all the files and run next
FROM base AS runner
USER node
WORKDIR /app

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder --chown=node:node /app/.env* ./
COPY --from=builder --chown=node:node /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Move the drizzle directory to the runtime image
COPY --from=builder --chown=node:node /app/src/app/db/migrations ./migrations

# Move the litestream binary to the runtime image from the litestream image
# You can use a specific version of litestream by changing the tag
# COPY --from=litestream/litestream:0.3.13 /usr/local/bin/litestream /usr/local/bin/litestream
COPY --from=litestream/litestream:latest --chown=node:node /usr/local/bin/litestream /usr/local/bin/litestream
COPY --from=builder --chown=node:node /app/litestream.yml /etc/litestream.yml

COPY --from=builder --chown=node:node /app/scripts ./scripts
