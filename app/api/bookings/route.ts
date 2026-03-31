import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { BookingSchema } from '@/lib/validations'
import { sendBookingNotification, sendBookingConfirmation } from '@/lib/email'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await db.booking.findMany({
    include: { activity: { include: { translations: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = BookingSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Date invalide', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const booking = await db.booking.create({ data: parsed.data })

  // Fire-and-forget emails (don't block the response)
  const fullBooking = await db.booking.findUnique({
    where: { id: booking.id },
    include: { activity: { include: { translations: true } } },
  })

  if (fullBooking) {
    sendBookingNotification(fullBooking).catch(console.error)
    sendBookingConfirmation(fullBooking).catch(console.error)
  }

  return NextResponse.json({ id: booking.id }, { status: 201 })
}
