import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'

import { db } from '@app/db/index'
import { userTable } from '@app/db/schema'

const cleanupDatabase = (db: BetterSQLite3Database<Record<string, never>>) => {
  try {
    const users = db.delete(userTable).run()
    console.log({ users })
  } catch (err) {
    console.error('Something went wrong...')
    console.error(err)
  }
}

const main = () => {
  console.log('🧨 Started deleting the database...\n')
  cleanupDatabase(db)
  console.log('\n🧨 Done deleting the database successfully...\n')
}

main()
