'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2 } from 'lucide-react'

type Season = 'WINTER' | 'SUMMER' | 'BOTH'

type GalleryPhoto = {
  id: string
  url: string
  publicId: string
  caption: string | null
  season: Season | null
  sortOrder: number
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function GalleryManager({
  initialPhotos,
}: {
  initialPhotos: GalleryPhoto[]
}) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [uploadSeason, setUploadSeason] = useState<Season | 'BOTH'>('BOTH')
  const [uploadCaption, setUploadCaption] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const imageData = await toBase64(file)
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData,
            caption: uploadCaption || undefined,
            season: uploadSeason === 'BOTH' ? null : uploadSeason,
          }),
        })
        if (!res.ok) throw new Error('Upload failed')
        const newPhoto = await res.json()
        setPhotos((prev) => [...prev, newPhoto])
      }
      toast.success('Photo(s) uploaded!')
      setUploadCaption('')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo permanently?')) return
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
      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-sm p-6 mb-8 flex flex-col gap-4">
        <p className="text-sm font-semibold">Upload new photos</p>
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Season tag</label>
            <select
              value={uploadSeason}
              onChange={(e) => setUploadSeason(e.target.value as Season | 'BOTH')}
              className="text-sm border rounded-sm px-2 py-1.5 bg-background"
            >
              <option value="BOTH">Both seasons</option>
              <option value="WINTER">Winter only</option>
              <option value="SUMMER">Summer only</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Caption (optional)</label>
            <input
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Skiing lesson in Poiana Brasov"
              className="w-full text-sm border rounded-sm px-3 py-1.5 bg-background"
            />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose Photos'}
          </button>
        </div>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <p className="text-muted-foreground text-sm">No photos uploaded yet. The gallery will show default scraped photos.</p>
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
