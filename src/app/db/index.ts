import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { isProduction } from 'std-env'

import { env } from '@/app/lib/env'

console.log(`ahoy!!`)

const url = isProduction
  ? `/data/${env.SQLITE_DATABASE_NAME}`
  : `${env.SQLITE_DATABASE_NAME}`

const client = sqlite(url, { verbose: console.log })
client.pragma('journal_mode = WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
export const db = drizzle(client)
