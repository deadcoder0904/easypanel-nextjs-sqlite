FROM node:20-alpine AS base

# mostly inspired from https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile & https://github.com/remix-run/example-trellix/blob/main/Dockerfile

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate 
# set the store dir to a folder that is not in the project
RUN pnpm config set store-dir ~/.pnpm-store
RUN pnpm fetch

# 1. Install all dependencies including dev dependencies
FROM base AS deps
# Root user is implicit so you don't have to actually specify it. From https://stackoverflow.com/a/45553149/6141587
# USER root
USER node
# WORKDIR now sets correct permissions if you set USER first so `USER node` has permissions on `/app` directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json pnpm-lock.yaml* ./
COPY --chown=node:node /src/app/db/migrations ./migrations

USER root
RUN pnpm install --frozen-lockfile --prefer-offline

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

# This will do the trick, use the corresponding env file for each environment.
COPY --chown=node:node .env.production .env.production

# Copied from https://stackoverflow.com/a/69867550/6141587
USER root
# Give /data directory correct permissions otherwise WAL mode won't work. It means you can't have 2 users writing to the database at the same time without this line as *.sqlite-wal & *.sqlite-shm are automatically created & deleted when *.sqlite is busy.
RUN mkdir -p /data && chown -R node:node /data

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# 3. Production image, copy all the files and run next
FROM base AS runner
USER node
WORKDIR /app

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME '0.0.0.0'
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

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

COPY --from=builder --chown=node:node /app/scripts/drizzle-migrate.mjs ./scripts/drizzle-migrate.mjs
COPY --from=builder --chown=node:node /app/scripts/package.json ./scripts/package.json
COPY --from=builder --chown=node:node /app/scripts/pnpm-lock.yaml ./scripts/pnpm-lock.yaml
COPY --from=builder --chown=node:node /app/scripts/run.sh ./run.sh
RUN chmod +x run.sh

CMD ["sh", "run.sh"]
