import type { Config } from 'drizzle-kit'

// import { env } from '@/app/lib/env'

export const url = `${process.env.SQLITE_DATABASE_NAME}`

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: { url },
  verbose: true,
} satisfies Config