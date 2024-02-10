import { NextResponse } from 'next/server'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'
import { getId } from '@/app/lib/utils'

export const POST = async () => {
  const id = getId()
  const users = await db.insert(userTable).values({ id }).returning()

  return NextResponse.json({ users })
}
