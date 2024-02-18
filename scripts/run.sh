#!/bin/bash
set -e

# npm run db:migrate:prod & PID=$!
# Wait for migration to finish
# wait $PID

echo "Starting production server..."
node server.js & PID=$!

wait $PID