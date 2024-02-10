import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { isLinux } from 'std-env'

import { env } from '@/app/lib/env'

async function main() {
  const FINAL_DATABASE_PATH = isLinux
    ? `/app/${env.DATABASE_URL}`
    : env.DATABASE_URL

  const client = sqlite(FINAL_DATABASE_PATH)
  const db = drizzle(client)

  console.info(`Running migrations... ${FINAL_DATABASE_PATH}`)
  migrate(db, {
    migrationsFolder: path.join(__dirname, '..', '/app/db/migrations'),
  })
  console.info('Migrated successfully')
  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
})
