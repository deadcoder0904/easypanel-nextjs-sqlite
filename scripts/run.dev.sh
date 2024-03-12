#!/bin/bash
set -e

# Set the directory of the database in a variable
DB_PATH=/data/users.dev.sqlite

# Set to true only when you want to run the migrate script, i.e, when changing database schema
# Automate it by only setting it to true by tracking `entries.idx` in `migrations/meta/_journal.json`
MIGRATE_DATABASE=false

# Inspired by https://pranavmalvawala.com/run-script-only-on-first-start-up & https://serverfault.com/a/1134812/1078165
FIRST_TIME_MIGRATION_DEV="FIRST_TIME_MIGRATION_DEV"
if [[ ! -e /data/$FIRST_TIME_MIGRATION_DEV ]] || [[ $MIGRATE_DATABASE = true ]]; then
	# Place your script that you only want to run on first startup.
  echo 'Initialize database first time only'
	touch /data/$FIRST_TIME_MIGRATION_DEV

	echo "Migrating database '/data/users.dev.sqlite'"
	pnpm db:migrate:dev & PID=$!
	# Wait for migration to finish
	wait $PID
fi

echo "Starting development server..."
pnpm dev
