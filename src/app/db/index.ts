import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { isDevelopment, isLinux } from 'std-env'

import { env } from '@/app/lib/env'

// const DATABASE_EXTENSION = isDevelopment ? 'dev' : 'prod'
// const DATABASE_PATH = `${env.DATABASE_NAME}.${DATABASE_EXTENSION}.sqlite`
export const FINAL_DATABASE_PATH = isLinux
  ? `/app/${env.DATABASE_URL}`
  : env.DATABASE_URL
const client = sqlite(FINAL_DATABASE_PATH)
client.pragma('journal_mode = WAL') // see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md

export const db = drizzle(client)
