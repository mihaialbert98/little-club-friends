import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { formatDateRange, telHref } from '@/lib/utils'
import type { PublicEventDetail } from '@/lib/events'

// Public detail section for an event entity. Mirrors the Activity detail layout.
export default function EventDetailSection({
  item,
  basePath,
  backLabel,
  aboutLabel,
  datesLabel,
  ctaLabel,
  phone,
  locale,
}: {
  item: PublicEventDetail
  basePath: string
  backLabel: string
  aboutLabel: string
  datesLabel: string
  ctaLabel: string
  phone: string
  locale: string
}) {
  const range = formatDateRange(item.startDate, item.endDate, locale)
  const heroImage = item.images[0] ?? null
  const galleryRest = item.images.slice(1)

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <Link
            href={`/${basePath}`}
            className="inline-flex items-center gap-2 text-[9px] tracking-[2px] uppercase font-bold mb-10 transition-opacity hover:opacity-60"
            style={{ color: 'var(--brand-coral)' }}
          >
            ← {backLabel}
          </Link>

          {range && (
            <div className="mb-5">
              <span
                className="inline-flex items-center gap-2 text-[9px] tracking-[2px] uppercase font-bold px-3 py-1.5 border"
                style={{
                  color: 'var(--brand-coral)',
                  borderColor: 'rgba(232,116,107,0.2)',
                  backgroundColor: 'rgba(232,116,107,0.06)',
                }}
              >
                📅 {range}
              </span>
            </div>
          )}

          <h1 className="font-display text-white leading-none mb-5" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            {item.name}
          </h1>

          {item.shortDesc && (
            <p className="text-white/50 text-base max-w-2xl leading-relaxed">{item.shortDesc}</p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Description + gallery */}
          <div className="lg:col-span-2">
            {item.description && (
              <>
                <p className="text-[9px] tracking-[3px] uppercase font-bold mb-6" style={{ color: 'var(--brand-coral)' }}>
                  {aboutLabel}
                </p>
                <div className="text-white/60 leading-relaxed text-sm space-y-4" style={{ whiteSpace: 'pre-wrap' }}>
                  {item.description}
                </div>
              </>
            )}

            {heroImage && (
              <div className="mt-10 space-y-3">
                <div className="relative w-full overflow-hidden rounded-md" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt || item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
                {galleryRest.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {galleryRest.map((img) => (
                      <div key={img.id} className="relative overflow-hidden rounded-md" style={{ aspectRatio: '4/3' }}>
                        <Image
                          src={img.url}
                          alt={img.alt || item.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="lg:col-span-1">
            <div
              className="flex flex-col gap-0 sticky top-28 border"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {range && (
                <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/30 mb-2">{datesLabel}</p>
                  <p className="text-white font-semibold text-sm">{range}</p>
                </div>
              )}

              <div className="p-6">
                <a href={telHref(phone)} className="btn-coral w-full text-center block">
                  {ctaLabel}
                </a>
                <p className="text-center text-white/40 text-sm mt-3">{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
