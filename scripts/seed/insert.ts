import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { db } from '@app/db/index'
import { userTable } from '@app/db/schema'
import { getId } from '@app/lib/utils'

const seedAdmin = async (db: BetterSQLite3Database<Record<string, never>>) => {
  const userData: (typeof userTable.$inferInsert)[] = [
    { id: getId() },
    { id: getId() },
  ]
  const users = await db.insert(userTable).values(userData).returning()
  console.log({ users })
}

const main = async () => {
  console.log('🧨 Started seeding the database...\n')
  seedAdmin(db)
  console.log('\n🧨 Done seeding the database successfully...\n')
}

main()
