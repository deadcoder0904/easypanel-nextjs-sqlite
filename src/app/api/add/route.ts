import crypto from 'crypto'
import { NextResponse } from 'next/server'

import { db } from '@/app/db/index'
import { userTable } from '@/app/db/schema'

export const POST = async () => {
  const id = crypto.randomBytes(20).toString('base64url')
  const users = await db.insert(userTable).values({ id }).returning()

  return NextResponse.json({ users })
}
