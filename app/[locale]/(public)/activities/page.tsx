import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { getActiveTheme } from '@/lib/theme'
import { Link } from '@/i18n/navigation'
import { Prisma, Theme } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Activities' }
export const revalidate = 60

const seasonEmojis: Record<string, string> = {
  'lectii-schi': '⛷️',
  'lectii-snowboard': '🏂',
  'ciclism-montan': '🚵',
  'drumetii-munte': '🥾',
  paddleboard: '🏄',
}

export default async function ActivitiesPage() {
  const locale = await getLocale()
  const t = await getTranslations('activities')
  const tHome = await getTranslations('home')
  const theme = await getActiveTheme()

  const seasonPriority =
    theme === Theme.WINTER
      ? Prisma.raw(`CASE WHEN a.season = 'WINTER' THEN 0 WHEN a.season = 'BOTH' THEN 1 ELSE 2 END`)
      : Prisma.raw(`CASE WHEN a.season = 'SUMMER' THEN 0 WHEN a.season = 'BOTH' THEN 1 ELSE 2 END`)

  const activities = await db.$queryRaw<
    {
      id: string; slug: string; season: string; ageMin: number; ageMax: number;
      durationMin: number; priceFrom: string; name: string; shortDesc: string;
    }[]
  >`
    SELECT a.id, a.slug, a.season, a."ageMin", a."ageMax", a."durationMin", a."priceFrom",
           t.name, t."shortDesc"
    FROM "Activity" a
    JOIN "ActivityTranslation" t ON t."activityId" = a.id AND t.locale = ${locale}
    WHERE a."isActive" = true
    ORDER BY ${seasonPriority}, a."sortOrder"
  `

  const seasonColors: Record<string, string> = {
    WINTER: '#7ec8e3',
    SUMMER: '#90ee90',
    BOTH: 'var(--brand-coral)',
  }

  const seasonLabels: Record<string, string> = {
    WINTER: t('season_winter'),
    SUMMER: t('season_summer'),
    BOTH: t('season_both'),
  }

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            {tHome('featured_label')}
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
          >
            {t('page_title')}
          </h1>
          <p className="text-white/40 text-sm mt-4 max-w-xl">{t('page_subtitle')}</p>
        </div>
      </section>

      {/* Activity list */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col border-t border-white/6">
          {activities.map((activity, index) => {
            const emoji = seasonEmojis[activity.slug] ?? '🏔️'
            const seasonColor = seasonColors[activity.season] ?? 'var(--brand-coral)'
            const price = Number(activity.priceFrom).toFixed(0)

            return (
              <Link
                key={activity.id}
                href={`/activities/${activity.slug}`}
                className="card-hover-line group flex items-center gap-6 lg:gap-8 py-7 border-b border-white/6 transition-all duration-300 hover:bg-white/[0.02]"
              >
                {/* Index */}
                <span
                  className="font-display text-white/6 select-none flex-shrink-0 leading-none w-14 text-right hidden sm:block"
                  style={{ fontSize: '3rem' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Emoji */}
                <span className="text-2xl flex-shrink-0">{emoji}</span>

                {/* Name + desc */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display text-white leading-none mb-2"
                    style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}
                  >
                    {activity.name}
                  </p>
                  <p className="text-xs text-white/30 line-clamp-1">
                    {activity.shortDesc}
                  </p>
                </div>

                {/* Season badge */}
                <span
                  className="hidden md:block text-[9px] tracking-[2px] uppercase font-bold px-3 py-1.5 flex-shrink-0 border"
                  style={{
                    color: seasonColor,
                    borderColor: `${seasonColor}33`,
                    backgroundColor: `${seasonColor}10`,
                  }}
                >
                  {seasonLabels[activity.season]}
                </span>

                {/* Price + arrow */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-white/30 hidden lg:block">
                    {price} <span className="text-white/15">RON</span>
                  </span>
                  <span
                    className="text-xl font-bold transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: 'var(--brand-coral)' }}
                  >
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
