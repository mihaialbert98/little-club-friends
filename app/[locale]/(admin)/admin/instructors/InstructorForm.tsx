'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, X, ImageOff } from 'lucide-react'

export type InstructorFormValues = {
  id?: string
  imageUrl: string
  isActive: boolean
  sortOrder: string
  certifications: string[]
  ro: { name: string; bio: string }
  en: { name: string; bio: string }
}

const EMPTY: InstructorFormValues = {
  imageUrl: '',
  isActive: true,
  sortOrder: '0',
  certifications: [],
  ro: { name: '', bio: '' },
  en: { name: '', bio: '' },
}

const inputCls =
  'w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40'
const labelCls = 'text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5'

export default function InstructorForm({ initial, locale }: { initial?: InstructorFormValues; locale: string }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [v, setV] = useState<InstructorFormValues>(initial ?? EMPTY)
  const [tab, setTab] = useState<'ro' | 'en'>('ro')
  const [newCert, setNewCert] = useState('')
  const [imgErrored, setImgErrored] = useState(false)
  const [saving, setSaving] = useState(false)

  const addCert = () => {
    const c = newCert.trim()
    if (!c) return
    if (v.certifications.includes(c)) {
      setNewCert('')
      return
    }
    setV((prev) => ({ ...prev, certifications: [...prev.certifications, c] }))
    setNewCert('')
  }

  const removeCert = (cert: string) =>
    setV((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c !== cert) }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!v.ro.name.trim()) {
      toast.error('Numele (RO) este obligatoriu')
      setTab('ro')
      return
    }
    setSaving(true)

    const payload = {
      imageUrl: v.imageUrl.trim(),
      isActive: v.isActive,
      sortOrder: v.sortOrder ? Number(v.sortOrder) : 0,
      certifications: v.certifications,
      ro: v.ro,
      en: v.en.name.trim() ? v.en : undefined,
    }

    try {
      const res = await fetch(
        isEdit ? `/api/admin/instructors/${initial!.id}` : '/api/admin/instructors',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error ?? 'Save failed')
      }
      toast.success(isEdit ? 'Instructor actualizat' : 'Instructor creat')
      router.push(`/${locale}/admin/instructors`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setSaving(false)
    }
  }

  const tr = v[tab]
  const setTr = (field: 'name' | 'bio', value: string) =>
    setV((prev) => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }))

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Bilingual content */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex gap-2 mb-4">
          {(['ro', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setTab(l)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                tab === l ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {l === 'ro' ? '🇷🇴 Română' : '🇬🇧 English (opțional)'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              Nume {tab === 'ro' && <span className="text-red-500">*</span>}
            </label>
            <input
              className={inputCls}
              value={tr.name}
              onChange={(e) => setTr('name', e.target.value)}
              placeholder={tab === 'ro' ? 'ex: Andrei Popescu' : 'e.g. Andrei Popescu'}
            />
          </div>
          <div>
            <label className={labelCls}>Biografie</label>
            <textarea
              className={`${inputCls} min-h-[120px]`}
              value={tr.bio}
              onChange={(e) => setTr('bio', e.target.value)}
              placeholder="Scurtă descriere a instructorului"
            />
          </div>
        </div>
        {tab === 'en' && (
          <p className="text-xs text-gray-400 mt-3">
            Dacă lași câmpurile EN goale, se va afișa varianta în română.
          </p>
        )}
      </div>

      {/* Image + meta */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className={labelCls}>Poză (link extern) — opțional</label>
          <input
            type="url"
            className={inputCls}
            value={v.imageUrl}
            onChange={(e) => {
              setV({ ...v, imageUrl: e.target.value })
              setImgErrored(false)
            }}
            placeholder="https://..."
          />
          {v.imageUrl.trim() && (
            <div className="mt-3 relative w-28 h-36 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {imgErrored ? (
                <div className="flex flex-col items-center text-gray-400 gap-1">
                  <ImageOff size={20} />
                  <span className="text-[10px]">Nu se încarcă</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setImgErrored(true)}
                />
              )}
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>Certificări</label>
          <div className="flex gap-2 mb-2">
            <input
              className={inputCls}
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCert()
                }
              }}
              placeholder="ex: Instructor certificat ISIA"
            />
            <button
              type="button"
              onClick={addCert}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-md hover:bg-gray-700 whitespace-nowrap"
            >
              <Plus size={15} /> Adaugă
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {v.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
              >
                {cert}
                <button type="button" onClick={() => removeCert(cert)} className="text-gray-400 hover:text-red-600">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 pt-6">
            <input
              id="isActive"
              type="checkbox"
              checked={v.isActive}
              onChange={(e) => setV({ ...v, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Activ (vizibil pe site)
            </label>
          </div>
          <div>
            <label className={labelCls}>Ordine afișare</label>
            <input
              type="number"
              className={inputCls}
              value={v.sortOrder}
              onChange={(e) => setV({ ...v, sortOrder: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Se salvează...' : isEdit ? 'Salvează modificările' : 'Creează instructorul'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/instructors`)}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Anulează
        </button>
      </div>
    </form>
  )
}
