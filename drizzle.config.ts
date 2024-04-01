import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// bug in drizzle: see https://github.com/drizzle-team/drizzle-orm/issues/1228
// import { env } from '@app/lib/env'

dotenv.config({ path: '.env.development' })

if (!process.env.SQLITE_DATABASE_PATH) {
  throw Error(`process.env.SQLITE_DATABASE_PATH isn't set!`)
}

// only ran in development so no need to dd a production check
const url = `${process.env.SQLITE_DATABASE_PATH}`

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: { url },
  verbose: true,
} satisfies Config
