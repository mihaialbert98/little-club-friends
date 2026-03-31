import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'

export default async function GalleryTeaser() {
  const t = await getTranslations('home')
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos(
    theme === Theme.WINTER ? Season.WINTER : Season.SUMMER
  )
  const displayed = photos.slice(0, 6)

  if (displayed.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
              {t('gallery_label')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t('gallery_title')}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:block text-[10px] tracking-[1px] uppercase font-bold border border-white/15 px-4 py-2 rounded-sm text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            {t('gallery_cta')} →
          </Link>
        </div>

        {/* Photo grid — first image tall, rest 2x3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ gridAutoRows: '200px' }}>
          {displayed.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-sm group ${i === 0 ? 'row-span-2' : ''}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt || 'Gallery photo'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Coral hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(232,116,107,0.15)' }}
              />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href="/gallery"
            className="text-[10px] tracking-[1.5px] uppercase font-bold border border-white/15 px-6 py-2.5 rounded-sm text-white/50 hover:text-white transition-colors"
          >
            {t('gallery_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
