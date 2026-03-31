import Image from 'next/image'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'

export const revalidate = 60

export default async function GalleryPage() {
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos()

  // Show active-theme photos first
  const orderedPhotos =
    theme === Theme.WINTER
      ? [
          ...photos.filter((p) => p.season === Season.WINTER),
          ...photos.filter((p) => p.season === null),
          ...photos.filter((p) => p.season === Season.SUMMER),
        ]
      : [
          ...photos.filter((p) => p.season === Season.SUMMER),
          ...photos.filter((p) => p.season === null),
          ...photos.filter((p) => p.season === Season.WINTER),
        ]

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero header */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            Memories
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            Our Gallery
          </h1>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-10 pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {orderedPhotos.length === 0 ? (
            <p className="text-white/40 text-center py-20">No photos yet.</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
              {orderedPhotos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-sm break-inside-avoid">
                  <Image
                    src={photo.url}
                    alt={photo.alt || 'Gallery photo'}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(232,116,107,0.12)' }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
