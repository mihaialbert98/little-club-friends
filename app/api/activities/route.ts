import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ActivitySchema } from '@/lib/validations'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') ?? 'ro'
  const season = searchParams.get('season')

  const activities = await db.activity.findMany({
    where: {
      isActive: true,
      ...(season ? { season: season as 'WINTER' | 'SUMMER' | 'BOTH' } : {}),
    },
    include: {
      translations: { where: { locale } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(activities)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = ActivitySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { translations, ...actData } = parsed.data

  const activity = await db.activity.create({
    data: {
      ...actData,
      translations: { create: translations },
    },
    include: { translations: true },
  })

  return NextResponse.json(activity, { status: 201 })
}
