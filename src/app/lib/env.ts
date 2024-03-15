import { createEnv } from '@t3-oss/env-nextjs'

import { z } from 'zod'

export const env = createEnv({
  server: {
    MODE: z.enum(['development', 'production']),
    SQLITE_DATABASE_NAME: z.string(),
  },
  experimental__runtimeEnv: {},
})
