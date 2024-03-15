import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { env } from '@app/lib/env'

const url =
  env.MODE === 'development'
    ? path.join(__dirname, '../../../', './data', env.SQLITE_DATABASE_NAME)
    : `/data/${env.SQLITE_DATABASE_NAME}`

console.log(`ahoy!! using ${url}`)

const client = sqlite(url, { verbose: console.log })
// use sqlite pragma. recommended from https://cj.rs/blog/sqlite-pragma-cheatsheet-for-performance-and-consistency/
client.pragma('journal_mode=WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
client.pragma('synchronous=normal')
client.pragma('foreign_keys=on')

export const db = drizzle(client)
