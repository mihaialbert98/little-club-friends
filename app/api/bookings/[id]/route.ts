import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BookingStatusSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const booking = await db.booking.findUnique({
    where: { id },
    include: { activity: { include: { translations: true } } },
  })

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(booking)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const parsed = BookingStatusSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const booking = await db.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  })

  return NextResponse.json(booking)
}
