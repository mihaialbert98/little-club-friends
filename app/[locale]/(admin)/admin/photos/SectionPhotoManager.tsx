'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save, Trash2, ImageOff } from 'lucide-react'

type SectionPhoto = {
  sectionKey: string
  url: string
  publicId: string
  alt: string
}

type SectionDef = {
  key: string
  label: string
  description: string
  fallbackUrl: string
}

const SECTIONS: SectionDef[] = [
  { key: 'home.hero_bg', label: 'Acasă — Imagine principală (Hero)', description: 'Fotografia mare din spatele titlului de pe prima pagină', fallbackUrl: '/scraped/home/f8a62b65-4386-45c8-b880-6bb8b0c1bbaa-scaled.webp' },
  { key: 'home.about_strip', label: 'Acasă — Secțiunea „De ce noi”', description: 'Fotografia din secțiunea despre noi (instructor + copil)', fallbackUrl: '/scraped/api-media/IMG_1787-scaled.webp' },
  { key: 'instructors.hero_bg', label: 'Instructori — Imagine principală', description: 'Fotografia de fundal din antetul paginii Instructori', fallbackUrl: '/scraped/instructori/IMG_1392-scaled-e1735057973622.jpg' },
  { key: 'instructors.action', label: 'Instructori — Fotografie acțiune', description: 'Banda foto din partea de jos a paginii Instructori', fallbackUrl: '/scraped/home/IMG_1790-scaled.jpeg' },
  { key: 'about.hero_bg', label: 'Despre noi — Imagine principală', description: 'Fotografia de fundal din antetul paginii Despre noi', fallbackUrl: '/scraped/despre-noi/149d3d6f-7898-48f0-b00b-d1cf11ee27fa.webp' },
  { key: 'about.story', label: 'Despre noi — Fotografie poveste', description: 'Fotografia de lângă textul „Povestea noastră”', fallbackUrl: '/scraped/despre-noi/IMG_3878-scaled.jpeg' },
]

export default function SectionPhotoManager({
  initialPhotos,
}: {
  initialPhotos: SectionPhoto[]
}) {
  const [photos, setPhotos] = useState<Record<string, SectionPhoto>>(() => {
    const map: Record<string, SectionPhoto> = {}
    for (const p of initialPhotos) map[p.sectionKey] = p
    return map
  })
  // Draft URL per section (what's typed in the input)
  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const p of initialPhotos) map[p.sectionKey] = p.url
    return map
  })
  const [saving, setSaving] = useState<string | null>(null)

  const handleSave = async (sectionKey: string) => {
    const url = (drafts[sectionKey] ?? '').trim()
    if (!url) {
      toast.error('Adaugă un link către imagine.')
      return
    }
    if (!URL.canParse(url)) {
      toast.error('URL invalid.')
      return
    }
    setSaving(sectionKey)
    try {
      const res = await fetch('/api/admin/section-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, url, alt: '' }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => ({
        ...prev,
        [sectionKey]: { sectionKey, url, publicId: '', alt: '' },
      }))
      toast.success('Fotografie actualizată!')
    } catch {
      toast.error('Salvarea a eșuat.')
    } finally {
      setSaving(null)
    }
  }

  const handleRevert = async (sectionKey: string) => {
    if (!confirm('Revii la fotografia implicită pentru această secțiune?')) return
    try {
      const res = await fetch('/api/admin/section-photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => {
        const next = { ...prev }
        delete next[sectionKey]
        return next
      })
      setDrafts((prev) => ({ ...prev, [sectionKey]: '' }))
      toast.success('Revenit la fotografia implicită.')
    } catch {
      toast.error('Revenirea a eșuat.')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SECTIONS.map((section) => {
        const override = photos[section.key]
        const hasOverride = !!override
        const draft = drafts[section.key] ?? ''
        // Preview: live draft if it looks like a URL, else current override, else fallback.
        const previewUrl = draft.trim() || override?.url || section.fallbackUrl
        const isSaving = saving === section.key
        const dirty = draft.trim() !== (override?.url ?? '')

        return (
          <div key={section.key} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="relative h-48 bg-gray-100">
              <SectionPreview key={previewUrl} url={previewUrl} alt={section.label} />
              <span
                className={`absolute top-2 left-2 text-[9px] px-2 py-1 rounded uppercase tracking-wider font-bold text-white ${
                  hasOverride ? 'bg-orange-500' : 'bg-black/60'
                }`}
              >
                {hasOverride ? 'Personalizată' : 'Implicită'}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm font-bold mb-1 text-gray-900">{section.label}</p>
              <p className="text-xs text-gray-500 mb-3">{section.description}</p>

              <input
                type="url"
                value={draft}
                onChange={(e) => setDrafts((prev) => ({ ...prev, [section.key]: e.target.value }))}
                placeholder="https://... (link extern, ex: Facebook)"
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(section.key)}
                  disabled={isSaving || !dirty}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-md disabled:opacity-50"
                >
                  <Save size={12} />
                  {isSaving ? 'Se salvează...' : 'Salvează'}
                </button>
                {hasOverride && (
                  <button
                    onClick={() => handleRevert(section.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-md text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 size={12} />
                    Revino la implicit
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Plain <img> preview so any external URL renders; placeholder on error.
// Keyed by url at the call site so error state resets when the URL changes.
function SectionPreview({ url, alt }: { url: string; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (errored) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-1">
        <ImageOff size={22} />
        <span className="text-[10px]">Imaginea nu se încarcă</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className="absolute inset-0 w-full h-full object-cover"
      onError={() => setErrored(true)}
    />
  )
}
