import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'

// Slight rotations for the polaroid effect — alternating left/right per position
const POLAROID_ROTATIONS = ['-2.5deg', '1.8deg', '-1.2deg', '2.2deg', '-1.8deg', '1.4deg', '-2deg']

export default async function GalleryTeaser() {
  const t = await getTranslations('home')
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos(
    theme === Theme.WINTER ? Season.WINTER : Season.SUMMER
  )
  const displayed = photos.slice(0, 7)

  if (displayed.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base)' }} className="py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-14 lg:mb-20">
          <div>
            <p className="section-label mb-3">{t('gallery_label')}</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.15 }}
            >
              {t('gallery_title')}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-colors group rounded-full px-5 py-2 border border-white/10 hover:border-white/25"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t('gallery_cta')}
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>→</span>
          </Link>
        </div>

        {/* Polaroid grid — 2 rows, staggered sizes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayed.map((photo, i) => {
            // First photo is larger — spans 2 cols on desktop
            const isHero = i === 0
            return (
              <div
                key={photo.id}
                className={`group relative ${isHero ? 'col-span-2 sm:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                style={{
                  transform: `rotate(${POLAROID_ROTATIONS[i % POLAROID_ROTATIONS.length]})`,
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={undefined}
              >
                {/* Polaroid frame */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    padding: isHero ? '10px 10px 36px 10px' : '8px 8px 28px 8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                    borderRadius: '2px',
                  }}
                >
                  {/* Photo */}
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: isHero ? '4/3' : '1/1' }}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || 'Gallery photo'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isHero ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    />
                  </div>
                  {/* Polaroid caption strip */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center"
                    style={{ height: isHero ? '36px' : '28px' }}
                  >
                    <div
                      className="w-8 h-0.5 rounded-full opacity-30"
                      style={{ backgroundColor: '#000' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA row */}
        <div className="mt-16 flex justify-center sm:hidden">
          <Link href="/gallery" className="btn-coral">
            {t('gallery_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
