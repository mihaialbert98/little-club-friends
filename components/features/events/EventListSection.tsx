import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { formatDateRange } from '@/lib/utils'
import type { PublicEventListItem } from '@/lib/events'

// Public list section for an event entity (Tabere / Activități weekend).
// Mirrors the visual language of the Activities list.
export default function EventListSection({
  items,
  basePath,
  label,
  title,
  subtitle,
  emptyText,
  locale,
  fallbackEmoji,
}: {
  items: PublicEventListItem[]
  basePath: string // "tabere" | "weekend"
  label: string
  title: string
  subtitle: string
  emptyText: string
  locale: string
  fallbackEmoji: string
}) {
  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            {label}
          </p>
          <h1 className="font-display text-white leading-none" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
            {title}
          </h1>
          <p className="text-white/40 text-sm mt-4 max-w-xl">{subtitle}</p>
        </div>
      </section>

      {/* List */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {items.length === 0 ? (
          <p className="text-white/40 text-sm">{emptyText}</p>
        ) : (
          <div className="flex flex-col border-t border-white/6">
            {items.map((item, index) => {
              const range = formatDateRange(item.startDate, item.endDate, locale)
              return (
                <Link
                  key={item.id}
                  href={`/${basePath}/${item.slug}`}
                  className="card-hover-line group flex items-center gap-6 lg:gap-8 py-7 border-b border-white/6 transition-all duration-300 hover:bg-white/[0.02]"
                >
                  <span
                    className="font-display text-white/6 select-none flex-shrink-0 leading-none w-14 text-right hidden sm:block"
                    style={{ fontSize: '3rem' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {item.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-white/5">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <span className="text-2xl flex-shrink-0 w-16 text-center">{fallbackEmoji}</span>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-white leading-none mb-2" style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}>
                      {item.name}
                    </p>
                    <p className="text-xs text-white/30 line-clamp-1">{item.shortDesc}</p>
                  </div>

                  {range && (
                    <span
                      className="hidden md:block text-[9px] tracking-[2px] uppercase font-bold px-3 py-1.5 flex-shrink-0 border"
                      style={{
                        color: 'var(--brand-coral)',
                        borderColor: 'rgba(232,116,107,0.2)',
                        backgroundColor: 'rgba(232,116,107,0.06)',
                      }}
                    >
                      {range}
                    </span>
                  )}

                  <span
                    className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0"
                    style={{ color: 'var(--brand-coral)' }}
                  >
                    →
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
