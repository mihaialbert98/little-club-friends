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
  skiing:     { emoji: '⛷️', color: 'var(--activity-ski)',     bg: 'rgba(79,195,247,0.07)' },
  snowboard:  { emoji: '🏂', color: 'var(--activity-snow)',    bg: 'rgba(179,157,219,0.07)' },
  biking:     { emoji: '🚵', color: 'var(--activity-bike)',    bg: 'rgba(129,199,132,0.07)' },
  hiking:     { emoji: '🥾', color: 'var(--activity-hike)',    bg: 'rgba(255,183,77,0.07)' },
  paddleboard:{ emoji: '🏄', color: 'var(--activity-paddle)',  bg: 'rgba(77,208,225,0.07)' },
}

function getActivityConfig(slug: string) {
  for (const [key, cfg] of Object.entries(ACTIVITY_CONFIG)) {
    if (slug.includes(key)) return cfg
  }
  return { emoji: '🏔️', color: 'var(--brand-coral)', bg: 'rgba(232,116,107,0.07)' }
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
    <section style={{ backgroundColor: 'var(--theme-dark-mid)' }} className="relative py-20 lg:py-28 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60vw', height: '40vw',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-glow-primary) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-3">{t('featured_label')}</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              {t('featured_title')}
            </h2>
          </div>
          <Link
            href="/activities"
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-all duration-200 group rounded-full px-5 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            View all
            <span className="transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>→</span>
          </Link>
        </div>

        {/* Activity cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
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
                className="adventure-card group block rounded-2xl overflow-hidden relative"
                style={{
                  backgroundColor: cfg.bg,
                  border: `1px solid ${cfg.color}22`,
                  boxShadow: `0 0 0 0 ${cfg.color}00`,
                }}
              >
                {/* Top accent strip with glow */}
                <div
                  className="h-[3px] w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${cfg.color} 40%, ${cfg.color}66 100%)`,
                  }}
                />

                {/* Subtle inner glow on hover — done via bg overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${cfg.color}12 0%, transparent 70%)`,
                  }}
                />

                <div className="relative p-6">
                  {/* Emoji + season tag row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                      style={{
                        backgroundColor: `${cfg.color}15`,
                        border: `1.5px solid ${cfg.color}30`,
                        boxShadow: `0 4px 20px ${cfg.color}20`,
                      }}
                    >
                      {cfg.emoji}
                    </div>
                    <span
                      className="sticker text-[9px]"
                      style={{ color: cfg.color, borderColor: `${cfg.color}40`, backgroundColor: `${cfg.color}12` }}
                    >
                      {seasonLabel}
                    </span>
                  </div>

                  {/* Activity name */}
                  <h3
                    className="font-display text-white mb-2 group-hover:text-white/95 transition-colors"
                    style={{ fontSize: 'clamp(1.25rem, 2vw, 1.65rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
                  >
                    {translation?.name ?? activity.slug}
                  </h3>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{
                        color: 'rgba(255,255,255,0.45)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      Ages {activity.ageMin}–{activity.ageMax}
                    </span>
                    <span
                      className="text-[11px] px-2.5 py-1 rounded-full"
                      style={{
                        color: 'rgba(255,255,255,0.45)',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {activity.durationMin} min
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="h-px mb-5" style={{ background: `linear-gradient(90deg, ${cfg.color}30, transparent)` }} />

                  {/* Price + arrow footer */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-white/30" style={{ fontFamily: 'var(--font-body)' }}>from </span>
                      <span
                        className="font-display"
                        style={{ fontSize: '1.6rem', color: cfg.color, letterSpacing: '-0.02em' }}
                      >
                        {price}
                      </span>
                      <span className="text-sm text-white/25 ml-1" style={{ fontFamily: 'var(--font-body)' }}>RON</span>
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:shadow-lg"
                      style={{
                        backgroundColor: cfg.color,
                        color: '#000',
                        boxShadow: `0 4px 16px ${cfg.color}40`,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link href="/activities" className="btn-coral">
            View all activities →
          </Link>
        </div>
      </div>
    </section>
  )
}
