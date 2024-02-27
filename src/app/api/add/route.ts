import { NextResponse } from 'next/server'

import { db } from '@app/db/index'
import { userTable } from '@app/db/schema'
import { randomNameGenerator } from '@app/lib/utils'

// needed otherwise next.js yells SqliteError: no such table: user
export const dynamic = 'force-dynamic'

export const POST = async () => {
  const type = 'POST /api/add'
  console.log(type)
  const name = randomNameGenerator()
  try {
    const users = await db.insert(userTable).values({ name }).returning()
    return NextResponse.json({ type, users })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ type, err })
  }
}
