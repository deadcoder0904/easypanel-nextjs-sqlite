import type { Config } from 'drizzle-kit'
import { isLinux } from 'std-env'

export const FINAL_DATABASE_PATH = isLinux
  ? `/app/${process.env.DATABASE_URL}`
  : `${process.env.DATABASE_URL}`

export default {
  schema: './src/app/db/schema.ts',
  out: './src/app/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: FINAL_DATABASE_PATH,
  },
  verbose: true,
} satisfies Config
