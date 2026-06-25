'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, User } from 'lucide-react'

type Row = {
  id: string
  name: string
  imageUrl: string | null
  isActive: boolean
  certCount: number
}

export default function InstructorsList({ rows, locale }: { rows: Row[]; locale: string }) {
  const router = useRouter()
  const [items, setItems] = useState(rows)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ștergi definitiv instructorul „${name}”?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((r) => r.id !== id))
      toast.success('Instructor șters')
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
        <h1 className="text-2xl font-bold text-gray-900">Instructori</h1>
        <Link
          href={`/${locale}/admin/instructors/new`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} /> Adaugă instructor
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          Niciun instructor încă.{' '}
          <Link href={`/${locale}/admin/instructors/new`} className="text-blue-600 font-medium hover:underline">
            Adaugă primul instructor →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
          {items.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{r.name}</p>
                  {!r.isActive && (
                    <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
                      Inactiv
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">{r.certCount} certificări</p>
              </div>
              <Link
                href={`/${locale}/admin/instructors/${r.id}/edit`}
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
