'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react'

type Row = {
  id: string
  slug: string
  name: string
  season: 'WINTER' | 'SUMMER' | 'BOTH'
  priceFrom: number | null
  isActive: boolean
  imageCount: number
  thumbnail: string | null
}

const SEASON_LABEL: Record<Row['season'], string> = {
  WINTER: 'Iarnă',
  SUMMER: 'Vară',
  BOTH: 'Tot anul',
}
const SEASON_COLOR: Record<Row['season'], string> = {
  WINTER: 'bg-sky-100 text-sky-700',
  SUMMER: 'bg-green-100 text-green-700',
  BOTH: 'bg-orange-100 text-orange-700',
}

export default function ActivitiesList({ rows, locale }: { rows: Row[]; locale: string }) {
  const router = useRouter()
  const [items, setItems] = useState(rows)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ștergi definitiv activitatea „${name}”?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((r) => r.id !== id))
      toast.success('Activitate ștearsă')
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
        <h1 className="text-2xl font-bold text-gray-900">Activități</h1>
        <Link
          href={`/${locale}/admin/activities/new`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> Adaugă activitate
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          Nicio activitate încă.{' '}
          <Link href={`/${locale}/admin/activities/new`} className="text-blue-600 font-medium hover:underline">
            Adaugă prima activitate →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {items.map((r) => (
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
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${SEASON_COLOR[r.season]}`}>
                    {SEASON_LABEL[r.season]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {r.priceFrom !== null ? `de la ${r.priceFrom} RON` : 'preț nespecificat'}
                  </span>
                  <span className="text-xs text-gray-400">{r.imageCount} poze</span>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/activities/${r.id}/edit`}
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
          ))}
        </div>
      )}
    </div>
  )
}
