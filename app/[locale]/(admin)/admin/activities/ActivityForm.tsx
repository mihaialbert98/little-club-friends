'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2, Star, ImageOff } from 'lucide-react'

type Season = 'WINTER' | 'SUMMER' | 'BOTH'

type ImageItem = {
  url: string
  alt: string
  isPrimary: boolean
}

export type ActivityFormValues = {
  id?: string
  season: Season
  ageMin: string
  ageMax: string
  durationHours: string
  priceFrom: string
  isActive: boolean
  sortOrder: string
  ro: { name: string; shortDesc: string; description: string }
  en: { name: string; shortDesc: string; description: string }
  images: ImageItem[]
}

const EMPTY: ActivityFormValues = {
  season: 'BOTH',
  ageMin: '',
  ageMax: '',
  durationHours: '',
  priceFrom: '',
  isActive: true,
  sortOrder: '0',
  ro: { name: '', shortDesc: '', description: '' },
  en: { name: '', shortDesc: '', description: '' },
  images: [],
}

const inputCls =
  'w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40'
const labelCls = 'text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5'

export default function ActivityForm({ initial, locale }: { initial?: ActivityFormValues; locale: string }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [v, setV] = useState<ActivityFormValues>(initial ?? EMPTY)
  const [tab, setTab] = useState<'ro' | 'en'>('ro')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const addImage = () => {
    const url = newImageUrl.trim()
    if (!url) return
    if (!URL.canParse(url)) {
      toast.error('URL invalid')
      return
    }
    setV((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        { url, alt: '', isPrimary: prev.images.length === 0 }, // first image is primary by default
      ],
    }))
    setNewImageUrl('')
  }

  const removeImage = (idx: number) => {
    setV((prev) => {
      const images = prev.images.filter((_, i) => i !== idx)
      // Ensure there is always a primary if any images remain.
      if (images.length > 0 && !images.some((im) => im.isPrimary)) images[0].isPrimary = true
      return { ...prev, images }
    })
  }

  const setPrimary = (idx: number) => {
    setV((prev) => ({
      ...prev,
      images: prev.images.map((im, i) => ({ ...im, isPrimary: i === idx })),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!v.ro.name.trim()) {
      toast.error('Numele (RO) este obligatoriu')
      setTab('ro')
      return
    }
    setSaving(true)

    const payload = {
      season: v.season,
      ageMin: v.ageMin ? Number(v.ageMin) : undefined,
      ageMax: v.ageMax ? Number(v.ageMax) : undefined,
      durationHours: v.durationHours ? Number(v.durationHours) : null,
      priceFrom: v.priceFrom ? Number(v.priceFrom) : null,
      isActive: v.isActive,
      sortOrder: v.sortOrder ? Number(v.sortOrder) : 0,
      ro: v.ro,
      en: v.en.name.trim() ? v.en : undefined,
      images: v.images.map((im, i) => ({
        url: im.url,
        alt: im.alt,
        isPrimary: im.isPrimary,
        sortOrder: i,
      })),
    }

    try {
      const res = await fetch(
        isEdit ? `/api/admin/activities/${initial!.id}` : '/api/admin/activities',
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
      toast.success(isEdit ? 'Activitate actualizată' : 'Activitate creată')
      router.push(`/${locale}/admin/activities`)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'A apărut o eroare')
    } finally {
      setSaving(false)
    }
  }

  const tr = v[tab]
  const setTr = (field: 'name' | 'shortDesc' | 'description', value: string) =>
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
              placeholder={tab === 'ro' ? 'ex: Lecții de schi' : 'e.g. Ski lessons'}
            />
          </div>
          <div>
            <label className={labelCls}>Descriere scurtă</label>
            <input
              className={inputCls}
              value={tr.shortDesc}
              onChange={(e) => setTr('shortDesc', e.target.value)}
              placeholder="O propoziție afișată în listă"
            />
          </div>
          <div>
            <label className={labelCls}>Descriere completă</label>
            <textarea
              className={`${inputCls} min-h-[120px]`}
              value={tr.description}
              onChange={(e) => setTr('description', e.target.value)}
              placeholder="Detalii afișate pe pagina activității"
            />
          </div>
        </div>
        {tab === 'en' && (
          <p className="text-xs text-gray-400 mt-3">
            Dacă lași câmpurile EN goale, se va afișa varianta în română.
          </p>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Sezon</label>
          <select
            className={inputCls}
            value={v.season}
            onChange={(e) => setV({ ...v, season: e.target.value as Season })}
          >
            <option value="WINTER">Iarnă</option>
            <option value="SUMMER">Vară</option>
            <option value="BOTH">Tot anul</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Preț de la (RON) — opțional</label>
          <input
            type="number"
            min="0"
            className={inputCls}
            value={v.priceFrom}
            onChange={(e) => setV({ ...v, priceFrom: e.target.value })}
            placeholder="ex: 150"
          />
        </div>
        <div>
          <label className={labelCls}>Vârstă minimă — opțional</label>
          <input
            type="number"
            min="1"
            max="18"
            className={inputCls}
            value={v.ageMin}
            onChange={(e) => setV({ ...v, ageMin: e.target.value })}
            placeholder="ex: 4"
          />
        </div>
        <div>
          <label className={labelCls}>Vârstă maximă — opțional</label>
          <input
            type="number"
            min="1"
            max="18"
            className={inputCls}
            value={v.ageMax}
            onChange={(e) => setV({ ...v, ageMax: e.target.value })}
            placeholder="ex: 16"
          />
        </div>
        <div>
          <label className={labelCls}>Durată (ore) — opțional</label>
          <input
            type="number"
            min="1"
            max="24"
            step="1"
            className={inputCls}
            value={v.durationHours}
            onChange={(e) => setV({ ...v, durationHours: e.target.value })}
            placeholder="ex: 2"
          />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="isActive"
            type="checkbox"
            checked={v.isActive}
            onChange={(e) => setV({ ...v, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Activă (vizibilă pe site)
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

      {/* Images */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-semibold text-gray-800 mb-1">Imagini (link extern)</p>
        <p className="text-xs text-gray-400 mb-4">
          Lipește un link către o imagine (ex: de pe Facebook). Prima imagine sau cea marcată cu ⭐ este miniatura.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="url"
            className={inputCls}
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addImage()
              }
            }}
            placeholder="https://..."
          />
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-md hover:bg-gray-700 whitespace-nowrap"
          >
            <Plus size={15} /> Adaugă
          </button>
        </div>

        {v.images.length === 0 ? (
          <p className="text-sm text-gray-400">Nicio imagine adăugată.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {v.images.map((img, idx) => (
              <div
                key={`${img.url}-${idx}`}
                className={`relative border rounded-lg overflow-hidden group ${
                  img.isPrimary ? 'border-amber-400 ring-2 ring-amber-200' : 'border-gray-200'
                }`}
              >
                <div className="relative h-32 bg-gray-100">
                  <ImagePreview url={img.url} />
                </div>
                {img.isPrimary && (
                  <span className="absolute top-1.5 left-1.5 z-10 flex items-center gap-1 text-[10px] font-bold uppercase bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded">
                    <Star size={10} /> Miniatură
                  </span>
                )}
                <div className="p-2 flex gap-1.5 bg-white">
                  {!img.isPrimary && (
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-amber-700 border border-amber-200 rounded hover:bg-amber-50"
                    >
                      <Star size={11} /> Miniatură
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] text-red-600 border border-red-200 rounded hover:bg-red-50"
                  >
                    <Trash2 size={11} /> Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Se salvează...' : isEdit ? 'Salvează modificările' : 'Creează activitatea'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/activities`)}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Anulează
        </button>
      </div>
    </form>
  )
}

// Live preview of an external image URL. Falls back to a placeholder on error.
// Uses a plain <img> (not next/image) so arbitrary admin-pasted URLs always render.
function ImagePreview({ url }: { url: string }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-1">
        <ImageOff size={20} />
        <span className="text-[10px]">Nu se încarcă</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  )
}
