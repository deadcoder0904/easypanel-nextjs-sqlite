import type { Config } from 'drizzle-kit'
import { isProduction } from 'std-env'

// import { env } from '@/app/lib/env'

export const url = isProduction
  ? `/data/${process.env.SQLITE_DATABASE_NAME}`
  : `${process.env.SQLITE_DATABASE_NAME}`

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: { url },
  verbose: true,
} satisfies Config
