import { Link } from '@/i18n/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { getActiveTheme } from '@/lib/theme'
import { Season, Theme } from '@prisma/client'
import type { Activity, ActivityTranslation } from '@prisma/client'

type ActivityWithTranslations = Activity & { translations: ActivityTranslation[] }

const SEASON_EMOJIS: Record<string, string> = {
  skiing: '⛷️',
  snowboard: '🏂',
  biking: '🚵',
  hiking: '🥾',
  paddleboard: '🏄',
}

function getEmoji(slug: string): string {
  for (const [key, emoji] of Object.entries(SEASON_EMOJIS)) {
    if (slug.includes(key)) return emoji
  }
  return '🏔️'
}

function sortActivities(activities: ActivityWithTranslations[], theme: Theme): ActivityWithTranslations[] {
  const order = (season: Season): number => {
    if (theme === Theme.WINTER) {
      if (season === Season.WINTER) return 0
      if (season === Season.BOTH) return 1
      return 2
    } else {
      if (season === Season.SUMMER) return 0
      if (season === Season.BOTH) return 1
      return 2
    }
  }

  return [...activities].sort((a, b) => {
    const diff = order(a.season) - order(b.season)
    if (diff !== 0) return diff
    return a.sortOrder - b.sortOrder
  })
}

export default async function FeaturedActivities() {
  const t = await getTranslations('home')
  const locale = await getLocale()
  const theme = await getActiveTheme()

  const raw = await db.activity.findMany({
    where: { isActive: true },
    include: { translations: true },
    orderBy: { sortOrder: 'asc' },
  })

  const activities = sortActivities(raw, theme).slice(0, 6)

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
              {t('featured_label')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t('featured_title')}
            </h2>
          </div>
          <Link
            href="/activities"
            className="hidden sm:block text-[10px] tracking-[1px] uppercase font-bold border border-white/15 px-4 py-2 rounded-sm text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Activity rows */}
        <div className="flex flex-col gap-2">
          {activities.map((activity) => {
            const translation =
              activity.translations.find((tr) => tr.locale === locale) ??
              activity.translations[0]

            const isWinterActivity = activity.season === Season.WINTER
            const isSummerActivity = activity.season === Season.SUMMER
            const badgeColor = isWinterActivity
              ? { color: '#7ec8e3', bg: 'rgba(13,43,78,0.8)', border: 'rgba(126,200,227,0.3)' }
              : isSummerActivity
              ? { color: '#90ee90', bg: 'rgba(26,71,49,0.8)', border: 'rgba(144,238,144,0.3)' }
              : { color: 'var(--brand-coral)', bg: 'var(--brand-coral-muted)', border: 'var(--brand-coral-border)' }

            const seasonLabel = isWinterActivity ? 'Winter' : isSummerActivity ? 'Summer' : 'Year-round'

            return (
              <Link
                key={activity.id}
                href="/activities"
                className="group flex items-center justify-between px-5 py-4 rounded-sm border border-white/6 transition-all duration-200 hover:border-[#E8746B]/25"
                style={{ backgroundColor: 'var(--theme-card-tint, rgba(255,255,255,0.03))' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getEmoji(activity.slug)}</span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white">
                      {translation?.name ?? activity.slug}
                    </p>
                    <p className="text-xs text-white/35 mt-0.5">
                      Ages {activity.ageMin}–{activity.ageMax} · {activity.durationMin} min · From {Number(activity.priceFrom)} RON
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="hidden sm:inline-block text-[9px] tracking-[1px] uppercase font-bold px-2.5 py-1 rounded-sm border"
                    style={{
                      color: badgeColor.color,
                      backgroundColor: badgeColor.bg,
                      borderColor: badgeColor.border,
                    }}
                  >
                    {seasonLabel}
                  </span>
                  <span
                    className="text-sm font-bold transition-transform group-hover:translate-x-1"
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
    </section>
  )
}
