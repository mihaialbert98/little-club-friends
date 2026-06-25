import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { formatDateRange } from '@/lib/utils'
import { EVENT_CONFIG, getPublicEventList, type EventKind } from '@/lib/events'

// Homepage teaser for an event entity (Tabere / Activități de weekend):
// a small grid of image thumbnails. Renders nothing when there are no items,
// so the homepage stays clean until the owner adds some.
export default async function EventTeaser({
  kind,
  basePath,
  ns,
  fallbackEmoji,
}: {
  kind: EventKind
  basePath: string // "tabere" | "weekend"
  ns: 'tabere' | 'weekend' // translation namespace
  fallbackEmoji: string
}) {
  const locale = await getLocale()
  const t = await getTranslations(ns)
  const items = (await getPublicEventList(EVENT_CONFIG[kind], locale)).slice(0, 3)

  if (items.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base)' }} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '50vw', height: '40vw',
          top: '40%', right: '-5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-glow-accent) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">{t('label')}</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              {t('home_title')}
            </h2>
          </div>
          <Link
            href={`/${basePath}`}
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-all duration-200 group rounded-full px-5 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t('home_cta')}
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>→</span>
          </Link>
        </div>

        {/* Thumbnail cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {items.map((item) => {
            const range = formatDateRange(item.startDate, item.endDate, locale)
            return (
              <Link
                key={item.id}
                href={`/${basePath}/${item.slug}`}
                className="group block rounded-2xl overflow-hidden relative border transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderColor: 'var(--theme-border-subtle)',
                }}
              >
                {/* Thumbnail */}
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl" style={{ backgroundColor: 'var(--theme-card-tint)' }}>
                      {fallbackEmoji}
                    </div>
                  )}
                  {/* Bottom gradient for legibility */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,10,20,0.85) 0%, transparent 55%)' }} />
                  {/* Date badge */}
                  {range && (
                    <span
                      className="absolute top-3 left-3 text-[9px] tracking-[1px] uppercase font-bold px-2.5 py-1 rounded-full"
                      style={{
                        color: 'var(--brand-coral)',
                        backgroundColor: 'rgba(6,10,20,0.7)',
                        border: '1px solid rgba(232,116,107,0.3)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      📅 {range}
                    </span>
                  )}
                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                      className="font-display text-white leading-tight"
                      style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)' }}
                    >
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-white/35 line-clamp-2 flex-1" style={{ fontFamily: 'var(--font-body)' }}>
                    {item.shortDesc}
                  </p>
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                    style={{ backgroundColor: 'var(--brand-coral)', color: '#000' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href={`/${basePath}`} className="btn-coral">
            {t('home_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
