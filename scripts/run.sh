#!/bin/bash
set -e

echo "Installing dependencies using pnpm..."
pnpm install & PID=$!
wait $PID

echo "Creating 'data/users.prod.sqlite' using bind volume mount"
pnpm run db:migrate:prod & PID=$!
# Wait for migration to finish
wait $PID

echo "Starting production server..."
node server.js & PID=$!

wait $PID