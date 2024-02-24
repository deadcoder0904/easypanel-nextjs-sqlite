import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { isProduction } from 'std-env'

import { env } from '@app/lib/env'

const url = isProduction
  ? `/data/${env.SQLITE_DATABASE_NAME}`
  : `${env.SQLITE_DATABASE_NAME}`

console.log(`ahoy!! using ${url}`)

const client = sqlite(url, { verbose: console.log })
// use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
// client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
// client.pragma('synchronous=normal')
// client.pragma('foreign_keys=on')
export const db = drizzle(client)

// migrate(db, {
//   migrationsFolder: isProduction
//     ? '/app/migrations'
//     : path.join(__dirname, '..', 'src/app/db/migrations'),
// })
