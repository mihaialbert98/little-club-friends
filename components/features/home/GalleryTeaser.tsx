import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'

// Polaroid rotations per position
const ROTATIONS = ['-3deg', '2.2deg', '-1.5deg', '2.8deg', '-2deg', '1.6deg', '-2.5deg']
// Vertical offsets to create a scattered feel
const OFFSETS = ['0px', '12px', '-8px', '18px', '-4px', '14px', '-10px']

export default async function GalleryTeaser() {
  const t = await getTranslations('home')
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos(
    theme === Theme.WINTER ? Season.WINTER : Season.SUMMER
  )
  const displayed = photos.slice(0, 7)

  if (displayed.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base)' }} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Ambient light */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '40vw', height: '40vw',
          top: '20%', right: '5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-glow-accent) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-16 lg:mb-20">
          <div>
            <p className="section-label mb-3">{t('gallery_label')}</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              {t('gallery_title')}
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-all duration-200 group rounded-full px-5 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t('gallery_cta')}
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>→</span>
          </Link>
        </div>

        {/* Polaroid grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {displayed.map((photo, i) => {
            const isHero = i === 0
            const rotation = ROTATIONS[i % ROTATIONS.length]
            const offset = OFFSETS[i % OFFSETS.length]

            return (
              <div
                key={photo.id}
                className={`group relative cursor-pointer polaroid-item ${isHero ? 'col-span-2 sm:col-span-2 lg:col-span-2' : 'col-span-1'}`}
                style={{
                  transform: `rotate(${rotation}) translateY(${offset})`,
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  zIndex: 1,
                }}
              >
                {/* Polaroid frame */}
                <div
                  style={{
                    backgroundColor: 'rgba(248, 248, 245, 0.95)',
                    padding: isHero ? '10px 10px 40px' : '8px 8px 32px',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
                    borderRadius: '2px',
                    transition: 'box-shadow 0.35s ease',
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
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ backgroundColor: 'rgba(232,116,107,0.08)' }}
                    />
                  </div>
                  {/* Handwriting-style scribble lines */}
                  <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
                    <div style={{ width: '20px', height: '1.5px', backgroundColor: '#aaa', borderRadius: '2px', opacity: 0.45 }} />
                    <div style={{ width: '32px', height: '1.5px', backgroundColor: '#aaa', borderRadius: '2px', opacity: 0.3 }} />
                    <div style={{ width: '16px', height: '1.5px', backgroundColor: '#aaa', borderRadius: '2px', opacity: 0.45 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-16 flex justify-center sm:hidden">
          <Link href="/gallery" className="btn-coral">
            {t('gallery_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
