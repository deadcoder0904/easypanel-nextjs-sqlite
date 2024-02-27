#!/bin/bash
set -e

# Set the directory of the database in a variable
DB_PATH=/data/users.prod.sqlite

# Copied from https://pranavmalvawala.com/run-script-only-on-first-start-up
CONTAINER_FIRST_STARTUP="CONTAINER_FIRST_STARTUP"
if [ ! -e /data/$CONTAINER_FIRST_STARTUP ]; then
	# Place your script that you only want to run on first startup.
  echo 'Initialize database first time only'
	touch /data/$CONTAINER_FIRST_STARTUP

	# Only install dependencies for drizzle migration. Those are not bundled via `next build` as its optimized to only install dependencies that are used in next.js app
	echo "Installing production dependencies"
	cd scripts
	pnpm config set store-dir ~/.pnpm-store
	pnpm fetch
	pnpm install --prod --prefer-offline
	cd ..

	echo "Creating '/data/users.prod.sqlite' using bind volume mount"
	pnpm db:migrate:prod & PID=$!
	# Wait for migration to finish
	wait $PID
fi

# Restore the database if it does not already exist.
if [ -f $DB_PATH ]; then
	echo "Database already exists, skipping restore"
else
	echo "No database found, restoring from replica if exists"
	# Restore backup from litestream if backup exists
	litestream restore -if-replica-exists $DB_PATH
fi

echo "Starting production server..."
# Run litestream with your app as the subprocess.
exec litestream replicate -exec "node server.js"
