import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import BookingForm from '@/components/features/booking/BookingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Book Now' }

export default async function BookingPage() {
  const locale = await getLocale()
  const t = await getTranslations('booking')

  const activities = await db.activity.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: 'asc' },
  })

  const activityOptions = activities.map((a) => ({
    id: a.id,
    name: a.translations[0]?.name ?? a.slug,
  }))

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            Book Now
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
          >
            {t('page_title')}
          </h1>
          <p className="text-white/40 text-sm mt-4">{t('page_subtitle')}</p>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-[720px] mx-auto py-16 lg:py-24 px-6">
        <div
          className="border border-white/8 p-8 lg:p-12"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <BookingForm activities={activityOptions} />
        </div>
      </div>
    </div>
  )
}
