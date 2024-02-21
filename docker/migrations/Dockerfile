FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app

# We only need these dependencies for the migration script
RUN npm install drizzle-orm postgres dotenv tsx

FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "migration:run"]
