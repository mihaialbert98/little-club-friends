import { db } from '@/lib/db'
import BookingsTable from '@/components/features/admin/BookingsTable'

export default async function BookingsPage() {
  const bookings = await db.booking.findMany({
    include: { activity: { include: { translations: { where: { locale: 'ro' } } } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rezervări</h1>
        <span className="text-sm text-gray-500">{bookings.length} total</span>
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  )
}
