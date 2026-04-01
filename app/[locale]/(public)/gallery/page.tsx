import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Gallery' }
export const revalidate = 60

export default async function GalleryPage() {
  const t = await getTranslations('gallery')
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos()

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
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero header */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            {t('hero_label')}
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
          >
            {t('hero_title')}
          </h1>
          <p className="text-white/35 text-sm mt-4">
            {orderedPhotos.length} {orderedPhotos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-10 pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {orderedPhotos.length === 0 ? (
            <p className="text-white/25 text-center py-24 text-sm">No photos yet.</p>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
              {orderedPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden break-inside-avoid"
                >
                  <Image
                    src={photo.url}
                    alt={photo.alt || 'Gallery photo'}
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'linear-gradient(to top, rgba(232,116,107,0.3) 0%, transparent 50%)' }}
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
