import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { isProduction } from 'std-env'

// DO NOT IMPORT THE SAME CODE FROM `db` otherwise it fails on production
const url = isProduction
  ? `./data/${process.env.SQLITE_DATABASE_NAME}`
  : `${process.env.SQLITE_DATABASE_NAME}`

const client = sqlite(url, { verbose: console.log })
client.pragma('journal_mode = WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
const db = drizzle(client)

async function main() {
  console.info(`Running migrations...`)
  migrate(db, {
    migrationsFolder: path.join(__dirname, '..', 'src/app/db/migrations'),
  })
  console.info('Migrated successfully')

  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
})
