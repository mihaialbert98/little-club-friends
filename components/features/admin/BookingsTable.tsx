'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { BookingWithActivity } from '@/types'

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nou',
  CONTACTED: 'Contactat',
  RESOLVED: 'Rezolvat',
  CANCELLED: 'Anulat',
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: '#fee2e2', text: '#991b1b' },
  CONTACTED: { bg: '#fef9c3', text: '#713f12' },
  RESOLVED: { bg: '#dcfce7', text: '#14532d' },
  CANCELLED: { bg: '#f3f4f6', text: '#6b7280' },
}

export default function BookingsTable({ bookings: initialBookings }: { bookings: BookingWithActivity[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState<string>('ALL')

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as BookingWithActivity['status'] } : b)))
      toast.success('Status actualizat')
    } catch {
      toast.error('Eroare la actualizare')
    }
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['ALL', 'NEW', 'CONTACTED', 'RESOLVED', 'CANCELLED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'ALL' ? 'Toate' : STATUS_LABELS[s]}
            <span className="ml-1.5 text-xs opacity-70">
              {s === 'ALL' ? bookings.length : bookings.filter((b) => b.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Părinte', 'Telefon', 'Copii', 'Activitate', 'Date preferate', 'Status', 'Acțiuni'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                    Nu există rezervări
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => {
                  const colors = STATUS_COLORS[booking.status] ?? { bg: '#f3f4f6', text: '#6b7280' }
                  const activityName = booking.activity?.translations?.[0]?.name ?? '-'
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{booking.parentName}</div>
                        <div className="text-xs text-gray-400">{booking.email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <a href={`tel:${booking.phone}`} className="hover:underline">{booking.phone}</a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {booking.numberOfChildren} ({booking.childrenAges})
                      </td>
                      <td className="px-4 py-3 text-gray-600">{activityName}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{booking.preferredDates}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {STATUS_LABELS[booking.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {Object.entries(STATUS_LABELS).map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
