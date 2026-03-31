'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2 } from 'lucide-react'

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
  { key: 'home.hero_bg', label: 'Home — Hero Background', description: 'Full-screen photo behind the hero headline', fallbackUrl: '/scraped/home/f8a62b65-4386-45c8-b880-6bb8b0c1bbaa-scaled.webp' },
  { key: 'home.about_strip', label: 'Home — About Strip', description: 'Photo in the About/Trust section (instructor + child)', fallbackUrl: '/scraped/api-media/IMG_1787-scaled.webp' },
  { key: 'instructors.hero_bg', label: 'Instructors — Hero Background', description: 'Background photo on the Instructors page header', fallbackUrl: '/scraped/instructori/IMG_1392-scaled-e1735057973622.jpg' },
  { key: 'instructors.action', label: 'Instructors — Action Photo', description: 'Strip photo at the bottom of the Instructors page', fallbackUrl: '/scraped/home/IMG_1790-scaled.jpeg' },
  { key: 'about.hero_bg', label: 'About — Hero Background', description: 'Background photo on the About page header', fallbackUrl: '/scraped/despre-noi/149d3d6f-7898-48f0-b00b-d1cf11ee27fa.webp' },
  { key: 'about.story', label: 'About — Story Photo', description: 'Photo beside the Our Story text section', fallbackUrl: '/scraped/despre-noi/IMG_3878-scaled.jpeg' },
]

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

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
  const [uploading, setUploading] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleUpload = async (sectionKey: string, file: File) => {
    setUploading(sectionKey)
    try {
      const imageData = await toBase64(file)
      const res = await fetch('/api/admin/section-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, imageData, alt: '' }),
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setPhotos((prev) => ({
        ...prev,
        [sectionKey]: { sectionKey, url: data.url, publicId: '', alt: '' },
      }))
      toast.success('Photo updated!')
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleRevert = async (sectionKey: string) => {
    try {
      const res = await fetch('/api/admin/section-photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setPhotos((prev) => {
        const next = { ...prev }
        delete next[sectionKey]
        return next
      })
      toast.success('Reverted to default photo.')
    } catch {
      toast.error('Failed to revert.')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SECTIONS.map((section) => {
        const override = photos[section.key]
        const currentUrl = override?.url ?? section.fallbackUrl
        const hasOverride = !!override
        const isUploading = uploading === section.key

        return (
          <div key={section.key} className="border rounded-sm overflow-hidden">
            <div className="relative h-48 bg-muted">
              <Image src={currentUrl} alt={section.label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              {!hasOverride && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider">
                  Default
                </div>
              )}
              {hasOverride && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider">
                  Custom
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-bold mb-1">{section.label}</p>
              <p className="text-xs text-muted-foreground mb-4">{section.description}</p>
              <div className="flex gap-2">
                <input
                  ref={(el) => { inputRefs.current[section.key] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(section.key, file)
                  }}
                />
                <button
                  onClick={() => inputRefs.current[section.key]?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
                >
                  <Upload size={12} />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                {hasOverride && (
                  <button
                    onClick={() => handleRevert(section.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 size={12} />
                    Revert
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
