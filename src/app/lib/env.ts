import { createEnv } from '@t3-oss/env-nextjs'

import { z } from 'zod'

export const env = createEnv({
  server: {
    SQLITE_DATABASE_NAME: z.string(),
  },
  experimental__runtimeEnv: {},
})
