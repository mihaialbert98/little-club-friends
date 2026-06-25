'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'

type Season = 'WINTER' | 'SUMMER' | 'BOTH'

type GalleryPhoto = {
  id: string
  url: string
  publicId: string
  caption: string | null
  season: Season | null
  sortOrder: number
}

export default function GalleryManager({
  initialPhotos,
}: {
  initialPhotos: GalleryPhoto[]
}) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [adding, setAdding] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newSeason, setNewSeason] = useState<Season | 'BOTH'>('BOTH')
  const [newCaption, setNewCaption] = useState('')

  const handleAdd = async () => {
    const url = newUrl.trim()
    if (!url) {
      toast.error('Adaugă un link către imagine.')
      return
    }
    if (!URL.canParse(url)) {
      toast.error('URL invalid.')
      return
    }
    setAdding(true)
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          caption: newCaption || undefined,
          season: newSeason === 'BOTH' ? null : newSeason,
        }),
      })
      if (!res.ok) throw new Error('Add failed')
      const newPhoto = await res.json()
      setPhotos((prev) => [...prev, newPhoto])
      toast.success('Fotografie adăugată!')
      setNewUrl('')
      setNewCaption('')
    } catch {
      toast.error('Adăugarea a eșuat.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ștergi definitiv această fotografie?')) return
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => prev.filter((p) => p.id !== id))
      toast.success('Photo deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  const handleSeasonChange = async (id: string, season: Season | null) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, season }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, season } : p)))
      toast.success('Season updated.')
    } catch {
      toast.error('Failed to update.')
    }
  }

  return (
    <div>
      {/* Add-by-URL area */}
      <div className="border-2 border-dashed border-border rounded-sm p-6 mb-8 flex flex-col gap-4">
        <p className="text-sm font-semibold">Adaugă o fotografie (link extern)</p>
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-[240px]">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Link imagine</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAdd()
                }
              }}
              placeholder="https://... (ex: Facebook)"
              className="w-full text-sm border rounded-sm px-3 py-1.5 bg-background"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Sezon</label>
            <select
              value={newSeason}
              onChange={(e) => setNewSeason(e.target.value as Season | 'BOTH')}
              className="text-sm border rounded-sm px-2 py-1.5 bg-background"
            >
              <option value="BOTH">Ambele sezoane</option>
              <option value="WINTER">Doar iarnă</option>
              <option value="SUMMER">Doar vară</option>
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Descriere (opțional)</label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="ex: Lecție de schi în Poiana Brașov"
              className="w-full text-sm border rounded-sm px-3 py-1.5 bg-background"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider bg-blue-600 text-white rounded-sm disabled:opacity-50"
          >
            <Plus size={14} />
            {adding ? 'Se adaugă...' : 'Adaugă'}
          </button>
        </div>
        {newUrl.trim() && (
          <div className="relative w-40 h-28 rounded-sm overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={newUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <p className="text-muted-foreground text-sm">Nicio fotografie încă. Galeria va afișa fotografiile implicite.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group border rounded-sm overflow-hidden">
              <div className="relative h-40">
                <Image src={photo.url} alt={photo.caption ?? ''} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-2 bg-background">
                <select
                  value={photo.season ?? 'BOTH'}
                  onChange={(e) => {
                    const val = e.target.value
                    handleSeasonChange(photo.id, val === 'BOTH' ? null : (val as Season))
                  }}
                  className="w-full text-xs border rounded-sm px-1.5 py-1 bg-background mb-2"
                >
                  <option value="BOTH">Both</option>
                  <option value="WINTER">Winter</option>
                  <option value="SUMMER">Summer</option>
                </select>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="w-full flex items-center justify-center gap-1 py-1 text-xs text-destructive border border-destructive/20 rounded-sm hover:bg-destructive/10"
                >
                  <Trash2 size={10} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
