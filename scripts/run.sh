#!/bin/bash
set -e

# Only install dependencies for drizzle migration. Those are not bundled via `next build` as its optimized to only install dependencies that are used in next.js app
echo "Installing production dependencies"
cd scripts
pnpm config set store-dir ~/.pnpm-store
pnpm fetch
pnpm install --prod --prefer-offline
cd ..

echo "Creating '/data/users.prod.sqlite' using bind volume mount"
pnpm run db:migrate:prod & PID=$!
# Wait for migration to finish
wait $PID

echo "Starting production server..."
node server.js & PID=$!

wait $PID