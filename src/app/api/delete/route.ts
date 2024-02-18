import { NextResponse } from 'next/server'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'

export const GET = async () => {
  const type = 'POST /api/delete'
  console.log(type)
  const users = await db.delete(userTable).execute()
  return NextResponse.json({ type, users })
}
