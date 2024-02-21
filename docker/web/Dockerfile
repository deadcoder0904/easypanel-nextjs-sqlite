FROM node:20-alpine AS base

# mostly inspired from https://github.com/BretFisher/node-docker-good-defaults/blob/main/Dockerfile
# RUN npm i npm@latest -g

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Root user is implicit so you don't have to actually specify it. From https://stackoverflow.com/a/45553149/6141587
# USER root
RUN mkdir -p /app
RUN chown -R node:node /app
USER node
# WORKDIR now sets correct permissions if you set USER first
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY --chown=node:node package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY --chown=node:node /src/app/db/migrations ./migrations

USER root
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi
USER node

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

# This will do the trick, use the corresponding env file for each environment.
COPY --chown=node:node .env.production .env.production
RUN mkdir -p /data

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create /data/users.prod.sqlite using Volume Mount
# RUN npm run db:migrate:prod
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=node:node /app/public ./public
# COPY --from=builder --chown=node:node /data /data

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Move the drizzle directory to the runtime image
COPY --from=builder --chown=node:node /app/src/app/db/migrations ./migrations

# Move the run script and litestream config to the runtime image
COPY --from=builder --chown=node:node /app/scripts/drizzle-migrate.mjs ./scripts/drizzle-migrate.mjs
# COPY --from=builder --chown=node:node /app/scripts/init.sh ./init.sh
COPY --from=builder --chown=node:node /app/scripts/run.sh ./run.sh
# RUN chmod +x init.sh
RUN chmod +x run.sh

RUN chown -R node:node /app/node_modules
# Create data directory or else `npm run db:migrate:prod` will fail with TypeError: Cannot open database because the directory does not exist
# RUN mkdir -p /data

# USER nextjs

EXPOSE 3000

# ENV PORT 3000
# ENV HOSTNAME localhost

# CMD ["npm", "run", "start"]
# ENTRYPOINT ["init.sh"]
RUN ls -la node_modules

CMD ["sh", "run.sh"]
