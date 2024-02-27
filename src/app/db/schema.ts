import { text, sqliteTable } from 'drizzle-orm/sqlite-core'

export const userTable = sqliteTable('user', {
  name: text('name').primaryKey(),
})
