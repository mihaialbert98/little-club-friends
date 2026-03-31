import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import { getActiveTheme } from '@/lib/theme'
import { Link } from '@/i18n/navigation'
import { Prisma, Theme } from '@prisma/client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Activități' }
export const revalidate = 60

const seasonEmojis: Record<string, string> = {
  'lectii-schi': '⛷️',
  'lectii-snowboard': '🏂',
  'ciclism-montan': '🚵',
  'drumetii-munte': '🥾',
  paddleboard: '🏄',
}

const seasonBadgeStyles: Record<string, { backgroundColor: string; color: string }> = {
  WINTER: { backgroundColor: 'rgba(13,43,78,0.8)', color: '#7ec8e3' },
  SUMMER: { backgroundColor: 'rgba(26,71,49,0.8)', color: '#90ee90' },
  BOTH: { backgroundColor: 'rgba(232,116,107,0.15)', color: 'var(--brand-coral)' },
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

  const seasonLabels: Record<string, string> = {
    WINTER: t('season_winter'),
    SUMMER: t('season_summer'),
    BOTH: t('season_both'),
  }

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            {tHome('featured_label')}
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t('page_title')}
          </h1>
          <p className="text-white/50 text-lg mt-3 max-w-xl">{t('page_subtitle')}</p>
        </div>
      </section>

      {/* Activity list */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-3">
          {activities.map((activity) => {
            const badgeStyle = seasonBadgeStyles[activity.season] ?? seasonBadgeStyles.BOTH
            const emoji = seasonEmojis[activity.slug] ?? '🏔️'

            return (
              <Link
                key={activity.id}
                href={`/activities/${activity.slug}`}
                className="group flex items-center justify-between px-5 py-4 rounded-sm border border-white/[0.06] transition-all duration-200 hover:border-[#E8746B]/25"
                style={{ backgroundColor: 'var(--theme-card-tint, rgba(255,255,255,0.03))' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white">
                      {activity.name}
                    </p>
                    <p className="text-xs text-white/35 mt-0.5 line-clamp-1">
                      {activity.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span
                    className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide"
                    style={badgeStyle}
                  >
                    {seasonLabels[activity.season]}
                  </span>
                  <span
                    className="text-lg leading-none group-hover:translate-x-0.5 transition-transform"
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
