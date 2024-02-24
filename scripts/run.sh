#!/bin/bash
set -e

echo "Creating '/data/users.prod.sqlite' using bind volume mount"
pnpm run db:migrate:prod & PID=$!
# Wait for migration to finish
wait $PID

echo "Starting production server..."
node server.js & PID=$!

wait $PID