import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'

const __dirname = import.meta.dirname

// DO NOT IMPORT THE SAME CODE FROM `db` otherwise it fails on production
const url = `/data/${process.env.SQLITE_DATABASE_NAME}`
console.log({ url })
const client = sqlite(url, { verbose: console.log })
// use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
client.pragma('synchronous=normal')
client.pragma('foreign_keys=on')
const db = drizzle(client)

async function main() {
  console.info(`Running migrations...`)
  const migrationsFolder = path.join(__dirname, '..', 'src/app/db/migrations')
  migrate(db, { migrationsFolder })
  console.info('Migrated successfully')

  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
})
