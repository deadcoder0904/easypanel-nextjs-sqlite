import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'node:path'
import { isProduction } from 'std-env'

import { db } from '@/app/db/index'

async function main() {
  // const migrationsFolder = isProduction
  //   ? path.join(__dirname, '..', '..', './migrations')
  //   : path.join(__dirname, '..', '/app/db/migrations')
  console.log(path.join(__dirname, '..', '/app/db/migrations'))
  console.info(`Running migrations...`)
  migrate(db, {
    migrationsFolder: path.join(__dirname, '..', '/app/db/migrations'),
  })
  console.info('Migrated successfully')

  process.exit(0)
}

main().catch((e) => {
  console.error('Migration failed')
  console.error(e)
  process.exit(1)
})
