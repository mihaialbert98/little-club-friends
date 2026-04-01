import { Link } from '@/i18n/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { getActiveTheme, getActivityOrderSQL } from '@/lib/theme'
import { Season } from '@prisma/client'

interface RawActivityTranslation {
  locale: string
  name: string
  description: string
}

interface RawActivity {
  id: string
  slug: string
  season: string
  ageMin: number
  ageMax: number
  durationMin: number
  priceFrom: unknown
  isActive: boolean
  sortOrder: number
  translations: RawActivityTranslation[] | null
}

const ACTIVITY_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  skiing:     { emoji: '⛷️', color: 'var(--activity-ski)',     bg: 'rgba(79,195,247,0.1)' },
  snowboard:  { emoji: '🏂', color: 'var(--activity-snow)',    bg: 'rgba(179,157,219,0.1)' },
  biking:     { emoji: '🚵', color: 'var(--activity-bike)',    bg: 'rgba(129,199,132,0.1)' },
  hiking:     { emoji: '🥾', color: 'var(--activity-hike)',    bg: 'rgba(255,183,77,0.1)' },
  paddleboard:{ emoji: '🏄', color: 'var(--activity-paddle)',  bg: 'rgba(77,208,225,0.1)' },
}

function getActivityConfig(slug: string) {
  for (const [key, cfg] of Object.entries(ACTIVITY_CONFIG)) {
    if (slug.includes(key)) return cfg
  }
  return { emoji: '🏔️', color: 'var(--brand-coral)', bg: 'rgba(232,116,107,0.1)' }
}

export default async function FeaturedActivities() {
  const t = await getTranslations('home')
  const locale = await getLocale()
  const theme = await getActiveTheme()
  const orderSQL = getActivityOrderSQL(theme)

  const rawActivities = await db.$queryRawUnsafe<RawActivity[]>(`
    SELECT a.id, a.slug, a.season, a."ageMin", a."ageMax", a."durationMin", a."priceFrom", a."isActive", a."sortOrder",
           COALESCE(json_agg(json_build_object('locale', at.locale, 'name', at.name, 'description', at.description))
             FILTER (WHERE at.id IS NOT NULL), '[]') as translations
    FROM "Activity" a
    LEFT JOIN "ActivityTranslation" at ON at."activityId" = a.id
    WHERE a."isActive" = true
    GROUP BY a.id, a.slug, a.season, a."ageMin", a."ageMax", a."durationMin", a."priceFrom", a."isActive", a."sortOrder"
    ORDER BY ${orderSQL}, a."sortOrder"
    LIMIT 6
  `)

  if (rawActivities.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-mid)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">{t('featured_label')}</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.1 }}
            >
              {t('featured_title')}
            </h2>
          </div>
          <Link
            href="/activities"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-colors group rounded-full px-5 py-2 border border-white/10 hover:border-white/25"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            View all
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>→</span>
          </Link>
        </div>

        {/* Activity cards — colorful, tilt on hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rawActivities.map((activity) => {
            const translation = activity.translations?.find((tr) => tr.locale === locale) ?? activity.translations?.[0]
            const cfg = getActivityConfig(activity.slug)
            const price = Number(activity.priceFrom).toFixed(0)
            const isWinterActivity = activity.season === Season.WINTER
            const isSummerActivity = activity.season === Season.SUMMER
            const seasonLabel = isWinterActivity ? 'Winter' : isSummerActivity ? 'Summer' : 'Year-round'

            return (
              <Link
                key={activity.id}
                href={`/activities/${activity.slug}`}
                className="adventure-card group block rounded-2xl overflow-hidden border"
                style={{
                  backgroundColor: cfg.bg,
                  borderColor: `${cfg.color}30`,
                }}
              >
                {/* Top color strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(to right, ${cfg.color}, ${cfg.color}88)` }}
                />

                <div className="p-6">
                  {/* Emoji + season tag row */}
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="text-4xl block"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                    >
                      {cfg.emoji}
                    </span>
                    <span
                      className="sticker text-[9px]"
                      style={{ color: cfg.color, borderColor: `${cfg.color}50`, backgroundColor: `${cfg.color}18` }}
                    >
                      {seasonLabel}
                    </span>
                  </div>

                  {/* Activity name */}
                  <h3
                    className="font-display text-white mb-2 group-hover:opacity-90 transition-opacity"
                    style={{ fontSize: 'clamp(1.3rem, 2vw, 1.7rem)', lineHeight: 1.1 }}
                  >
                    {translation?.name ?? activity.slug}
                  </h3>

                  {/* Meta row */}
                  <p
                    className="text-xs mb-5"
                    style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
                  >
                    Ages {activity.ageMin}–{activity.ageMax} · {activity.durationMin} min
                  </p>

                  {/* Price + arrow footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/30" style={{ fontFamily: 'var(--font-body)' }}>from </span>
                      <span
                        className="font-display"
                        style={{ fontSize: '1.5rem', color: cfg.color }}
                      >
                        {price}
                        <span className="text-sm text-white/30 ml-1">RON</span>
                      </span>
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: cfg.color, color: 'var(--theme-dark-base)' }}
                    >
                      <span className="text-sm font-bold">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/activities"
            className="btn-coral"
          >
            View all activities →
          </Link>
        </div>
      </div>
    </section>
  )
}
