#!/usr/bin/env sh
set -e

if [ $MODE != "development" ]; then
	# This should be before running migrations otherwise it results in empty database after `rm -rf ./data`
	# Restore the database if it does not already exist.
	if [ -f $SQLITE_DATABASE_PATH ]; then
		echo "Database already exists, skipping restore"
	else
		echo "No database found, restoring from replica if exists"
		# Restore backup from litestream if backup exists
		litestream restore -if-replica-exists $SQLITE_DATABASE_PATH
	fi
fi

# Set to true only when you want to run the migrate script, i.e, when changing database schema
# Automate it by only setting it to true by tracking `entries.idx` in `migrations/meta/_journal.json`
MIGRATE_DATABASE=false

# Inspired by https://pranavmalvawala.com/run-script-only-on-first-start-up & https://serverfault.com/a/1134812/1078165
FIRST_TIME_MIGRATION="FIRST_TIME_MIGRATION_$MODE"
if [[ ! -e /data/$FIRST_TIME_MIGRATION ]] || [[ $MIGRATE_DATABASE = true ]]; then
	# Place your script that you only want to run on first startup.
  echo "Initialize database first time only"
	touch /data/$FIRST_TIME_MIGRATION

	if [ $MODE != "development" ]; then
		# Only install dependencies for drizzle migration. Those are not bundled via `next build` as its optimized to only install dependencies that are used in next.js app
		echo "Installing $MODE dependencies"
		cd scripts
		pnpm config set store-dir ~/.pnpm-store
		pnpm fetch
		pnpm install --prod --prefer-offline
		cd ..
	fi

	echo "Migrating /data/users.$MODE.sqlite"
	if [ $MODE = "production" ]; then
		pnpm db:migrate:prod & PID=$!
		# Wait for migration to finish
		wait $PID
	elif [ $MODE = "staging" ]; then
		pnpm db:migrate:staging & PID=$!
		wait $PID
	else
		pnpm db:migrate:dev & PID=$!
		wait $PID
	fi
fi

echo "Starting $MODE server..."

if [ $MODE = "development" ]; then
	pnpm dev
else
	# Run litestream with your app as the subprocess.
	exec litestream replicate -exec "node server.js"
fi
