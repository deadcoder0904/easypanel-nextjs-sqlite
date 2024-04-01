import { createEnv } from '@t3-oss/env-nextjs'

import { z } from 'zod'

export const env = createEnv({
  server: {
    MODE: z.enum(['development', 'production', 'staging']),
    SQLITE_DATABASE_PATH: z.string(),
  },
  experimental__runtimeEnv: {},
})
