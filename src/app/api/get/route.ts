import { NextResponse } from 'next/server'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'

export const GET = async () => {
  const type = 'POST /api/get'
  console.log(type)
  try {
    const users = await db.select().from(userTable).execute()
    return NextResponse.json({ type, users })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ type, err })
  }
}
