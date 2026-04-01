import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

const seasonColors: Record<string, string> = {
  WINTER: '#7ec8e3',
  SUMMER: '#90ee90',
  BOTH: 'var(--brand-coral)',
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

  if (!activity || !activity.isActive) notFound()

  const translation =
    activity.translations.find((tr) => tr.locale === locale) ??
    activity.translations[0]

  if (!translation) notFound()

  const seasonLabelKey =
    activity.season === 'WINTER'
      ? 'season_label_winter'
      : activity.season === 'SUMMER'
      ? 'season_label_summer'
      : 'season_label_both'

  const seasonColor = seasonColors[activity.season] ?? 'var(--brand-coral)'
  const emoji = seasonEmojis[slug] ?? '🏔️'
  const price = Number(activity.priceFrom).toFixed(0)

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-[9px] tracking-[2px] uppercase font-bold mb-10 transition-opacity hover:opacity-60"
            style={{ color: 'var(--brand-coral)' }}
          >
            ← {t('back_link').replace('← ', '')}
          </Link>

          {/* Season badge */}
          <div className="mb-5">
            <span
              className="inline-flex items-center gap-2 text-[9px] tracking-[2px] uppercase font-bold px-3 py-1.5 border"
              style={{
                color: seasonColor,
                borderColor: `${seasonColor}33`,
                backgroundColor: `${seasonColor}10`,
              }}
            >
              <span>{emoji}</span>
              {t(seasonLabelKey)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-white leading-none mb-5"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
          >
            {translation.name}
          </h1>

          <p className="text-white/50 text-base max-w-2xl leading-relaxed">
            {translation.shortDesc}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Description */}
          <div className="lg:col-span-2">
            <p
              className="text-[9px] tracking-[3px] uppercase font-bold mb-6"
              style={{ color: 'var(--brand-coral)' }}
            >
              About this activity
            </p>
            <div
              className="text-white/60 leading-relaxed text-sm space-y-4"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {translation.description}
            </div>
          </div>

          {/* Info card */}
          <div className="lg:col-span-1">
            <div
              className="flex flex-col gap-0 sticky top-28 border"
              style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              {/* Price — prominent */}
              <div
                className="p-6 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/30 mb-2">Price from</p>
                <p
                  className="font-display leading-none"
                  style={{ fontSize: '3.5rem', color: 'var(--brand-coral)' }}
                >
                  {price}
                  <span className="text-lg text-white/30 ml-2">RON</span>
                </p>
              </div>

              {/* Details */}
              <div
                className="p-6 flex flex-col gap-5 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div>
                  <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/30 mb-1">Age</p>
                  <p className="text-white font-semibold text-sm">
                    {t('age_range', { min: activity.ageMin, max: activity.ageMax })}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/30 mb-1">Duration</p>
                  <p className="text-white font-semibold text-sm">
                    {activity.durationMin} min
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="p-6">
                <Link
                  href="/booking"
                  className="btn-coral w-full text-center block"
                >
                  {t('book_cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
