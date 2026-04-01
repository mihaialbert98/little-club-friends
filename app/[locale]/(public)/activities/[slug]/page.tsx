import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

const seasonBadgeStyles: Record<string, { backgroundColor: string; color: string }> = {
  WINTER: { backgroundColor: 'rgba(13,43,78,0.8)', color: '#7ec8e3' },
  SUMMER: { backgroundColor: 'rgba(26,71,49,0.8)', color: '#90ee90' },
  BOTH: { backgroundColor: 'rgba(232,116,107,0.15)', color: 'var(--brand-coral)' },
}

const seasonEmojis: Record<string, string> = {
  'lectii-schi': '⛷️',
  'lectii-snowboard': '🏂',
  'ciclism-montan': '🚵',
  'drumetii-munte': '🥾',
  paddleboard: '🏄',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const activity = await db.activity.findUnique({
    where: { slug },
    include: { translations: true },
  })
  if (!activity) return { title: 'Activity Not Found' }

  const translation =
    activity.translations.find((t) => t.locale === locale) ??
    activity.translations[0]

  return { title: translation?.name ?? slug }
}

export async function generateStaticParams() {
  const activities = await db.activity.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return activities.map((a) => ({ slug: a.slug }))
}

export const revalidate = 60

export default async function ActivityDetailPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations('activities')

  const activity = await db.activity.findUnique({
    where: { slug },
    include: { translations: true },
  })

  if (!activity || !activity.isActive) {
    notFound()
  }

  const translation =
    activity.translations.find((tr) => tr.locale === locale) ??
    activity.translations[0]

  if (!translation) {
    notFound()
  }

  const badgeStyle = seasonBadgeStyles[activity.season] ?? seasonBadgeStyles.BOTH
  const emoji = seasonEmojis[slug] ?? '🏔️'

  const seasonLabelKey =
    activity.season === 'WINTER'
      ? 'season_label_winter'
      : activity.season === 'SUMMER'
        ? 'season_label_summer'
        : 'season_label_both'

  const price = Number(activity.priceFrom).toFixed(0)

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section
        style={{ background: 'var(--theme-hero-gradient)' }}
        className="pt-28 pb-16"
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/activities"
            className="inline-flex items-center text-xs font-bold tracking-[1px] uppercase mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'var(--brand-coral)' }}
          >
            {t('back_link')}
          </Link>

          {/* Season badge */}
          <div className="mb-4">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest"
              style={badgeStyle}
            >
              <span>{emoji}</span>
              {t(seasonLabelKey)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none mb-4">
            {translation.name}
          </h1>

          {/* Short description */}
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            {translation.shortDesc}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Description — 2/3 */}
          <div className="lg:col-span-2">
            <div
              className="text-white/70 leading-relaxed text-base space-y-4"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {translation.description}
            </div>
          </div>

          {/* Info card — 1/3 */}
          <div className="lg:col-span-1">
            <div
              className="rounded-sm border p-6 flex flex-col gap-5 sticky top-28"
              style={{
                backgroundColor: 'var(--theme-card-tint, rgba(255,255,255,0.03))',
                borderColor: 'var(--brand-coral-border, rgba(232,116,107,0.3))',
              }}
            >
              {/* Age range */}
              <div className="flex flex-col gap-1">
                <p
                  className="text-[10px] tracking-[2px] uppercase font-bold"
                  style={{ color: 'var(--brand-coral)' }}
                >
                  {t('age')}
                </p>
                <p className="text-white font-semibold text-sm">
                  {t('age_range', { min: activity.ageMin, max: activity.ageMax })}
                </p>
              </div>

              <div
                className="border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              />

              {/* Duration */}
              <div className="flex flex-col gap-1">
                <p
                  className="text-[10px] tracking-[2px] uppercase font-bold"
                  style={{ color: 'var(--brand-coral)' }}
                >
                  {t('duration')}
                </p>
                <p className="text-white font-semibold text-sm">
                  {t('duration', { min: activity.durationMin })}
                </p>
              </div>

              <div
                className="border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              />

              {/* Price */}
              <div className="flex flex-col gap-1">
                <p
                  className="text-[10px] tracking-[2px] uppercase font-bold"
                  style={{ color: 'var(--brand-coral)' }}
                >
                  {t('price_from', { price })}
                </p>
                <p
                  className="text-3xl font-black"
                  style={{ color: 'var(--brand-coral)' }}
                >
                  {price}{' '}
                  <span className="text-base font-semibold text-white/50">RON</span>
                </p>
              </div>

              <div
                className="border-t"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              />

              {/* CTA */}
              <Link
                href="/booking"
                className="w-full py-4 rounded-sm text-center text-sm tracking-[1.5px] uppercase font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] block"
                style={{ backgroundColor: 'var(--brand-coral)' }}
              >
                {t('book_cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
