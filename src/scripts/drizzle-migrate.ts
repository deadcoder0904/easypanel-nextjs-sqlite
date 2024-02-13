import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { isProduction } from 'std-env'

import { env } from '@/app/lib/env'

export const url = isProduction
  ? `/data/${env.SQLITE_DATABASE_NAME}`
  : `${env.SQLITE_DATABASE_NAME}`

async function main() {
  const client = sqlite(url)
  const db = drizzle(client)

  console.info(`Running migrations...`)
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
