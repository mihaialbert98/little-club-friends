import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { getActiveTheme } from '@/lib/theme'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedActivities from '@/components/features/home/FeaturedActivities'
import CTASection from '@/components/features/home/CTASection'
import { Theme } from '@prisma/client'
import type { LocalizedActivity } from '@/types'
import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Little Club Friends — Aventuri pentru copii la Poiana Brașov',
}

async function getHomeData(locale: string) {
  const theme = await getActiveTheme()

  // Theme-ordered activities via raw SQL
  const seasonPriority =
    theme === Theme.WINTER
      ? `CASE WHEN a.season = 'WINTER' THEN 0 WHEN a.season = 'BOTH' THEN 1 ELSE 2 END`
      : `CASE WHEN a.season = 'SUMMER' THEN 0 WHEN a.season = 'BOTH' THEN 1 ELSE 2 END`

  const rawActivities = await db.$queryRawUnsafe<
    {
      id: string
      slug: string
      season: string
      ageMin: number
      ageMax: number
      durationMin: number
      priceFrom: string
      isActive: boolean
      name: string
      description: string
      shortDesc: string
    }[]
  >(`
    SELECT
      a.id, a.slug, a.season, a."ageMin", a."ageMax", a."durationMin", a."priceFrom", a."isActive",
      t.name, t.description, t."shortDesc"
    FROM "Activity" a
    JOIN "ActivityTranslation" t ON t."activityId" = a.id AND t.locale = $1
    WHERE a."isActive" = true
    ORDER BY ${seasonPriority}, a."sortOrder"
    LIMIT 6
  `, locale)

  const activities: LocalizedActivity[] = rawActivities.map((row) => ({
    id: row.id,
    slug: row.slug,
    season: row.season as LocalizedActivity['season'],
    ageMin: row.ageMin,
    ageMax: row.ageMax,
    durationMin: row.durationMin,
    priceFrom: parseFloat(row.priceFrom),
    isActive: row.isActive,
    name: row.name,
    description: row.description,
    shortDesc: row.shortDesc,
    images: [],
  }))

  const aboutText = await db.pageContent.findUnique({
    where: { page_key: { page: 'home', key: `about_text.${locale}` } },
  })

  return { theme, activities, aboutText }
}

export default async function HomePage() {
  const locale = await getLocale()
  const { theme, activities, aboutText } = await getHomeData(locale)

  return (
    <>
      <HeroSection />
      <FeaturedActivities />
      <AboutTeaser aboutText={aboutText?.value} locale={locale} theme={theme} />
      <CTASection theme={theme} />
    </>
  )
}

// Inline AboutTeaser to keep the file self-contained
function AboutTeaser({
  aboutText,
  locale,
  theme,
}: {
  aboutText?: string
  locale: string
  theme: Theme
}) {
  const defaultText =
    locale === 'ro'
      ? 'Little Club Friends este locul unde copiii descoperă bucuria sportului în natură. Cu instructori pasionați și certificați, oferim o experiență sigură, distractivă și de neuitat la Poiana Brașov.'
      : 'Little Club Friends is the place where children discover the joy of sport in nature. With passionate and certified instructors, we offer a safe, fun and unforgettable experience in Poiana Brașov.'

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'white' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className="h-72 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, var(--theme-hero-from), var(--theme-hero-via))`,
            }}
          />
          <div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--theme-primary)', fontFamily: 'var(--font-nunito)' }}
            >
              {locale === 'ro' ? 'Despre Little Club Friends' : 'About Little Club Friends'}
            </h2>
            <p className="leading-relaxed mb-6" style={{ color: 'var(--theme-text-muted)' }}>
              {aboutText ?? defaultText}
            </p>
            <a
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 font-semibold transition-colors"
              style={{ color: 'var(--theme-primary)' }}
            >
              {locale === 'ro' ? 'Află mai multe' : 'Learn more'} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
