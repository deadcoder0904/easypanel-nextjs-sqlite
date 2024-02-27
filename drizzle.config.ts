import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

// import { env } from '@app/lib/env'

dotenv.config({ path: '.env.development' })

if (!process.env.SQLITE_DATABASE_NAME) {
  throw Error(`process.env.SQLITE_DATABASE_NAME isn't set!`)
}

// only ran in development so no need to dd a production check
export const url = `${process.env.SQLITE_DATABASE_NAME}`

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: { url },
  verbose: true,
} satisfies Config
