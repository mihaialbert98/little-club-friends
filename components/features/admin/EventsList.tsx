'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ImageOff, CalendarDays } from 'lucide-react'

export type EventRow = {
  id: string
  name: string
  startDate: string | null // ISO or null
  endDate: string | null
  isActive: boolean
  imageCount: number
  thumbnail: string | null
}

// Format a date range like "12 iul – 18 iul 2026" / single date / nothing.
function formatRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt((start ?? end)!)
}

export default function EventsList({
  rows,
  apiBase,
  listPath,
  title,
  addLabel,
  emptyLabel,
}: {
  rows: EventRow[]
  apiBase: string // "/api/admin/tabere"
  listPath: string // `/${locale}/admin/tabere`
  title: string
  addLabel: string
  emptyLabel: string
}) {
  const router = useRouter()
  const [items, setItems] = useState(rows)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ștergi definitiv „${name}”?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((r) => r.id !== id))
      toast.success('Șters')
      router.refresh()
    } catch {
      toast.error('Ștergerea a eșuat')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link
          href={`${listPath}/new`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> {addLabel}
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          {emptyLabel}{' '}
          <Link href={`${listPath}/new`} className="text-blue-600 font-medium hover:underline">
            {addLabel} →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {items.map((r) => {
            const range = formatRange(r.startDate, r.endDate)
            return (
              <div key={r.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {r.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff size={18} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{r.name}</p>
                    {!r.isActive && (
                      <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                        Inactivă
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {range ? (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <CalendarDays size={12} /> {range}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">fără dată</span>
                    )}
                    <span className="text-xs text-gray-400">{r.imageCount} poze</span>
                  </div>
                </div>
                <Link
                  href={`${listPath}/${r.id}/edit`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100"
                >
                  <Pencil size={14} /> Editează
                </Link>
                <button
                  onClick={() => handleDelete(r.id, r.name)}
                  disabled={deletingId === r.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Șterge
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
