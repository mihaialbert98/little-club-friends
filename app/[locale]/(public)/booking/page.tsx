import { getLocale, getTranslations } from 'next-intl/server'
import { db } from '@/lib/db'
import BookingForm from '@/components/features/booking/BookingForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Rezervare' }

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
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            Book Now
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t('page_title')}
          </h1>
        </div>
      </section>

      {/* Form */}
      <div className="max-w-2xl mx-auto py-16 px-6">
        <div className="bg-white/5 border border-white/10 rounded-sm p-8">
          <BookingForm activities={activityOptions} />
        </div>
      </div>
    </div>
  )
}
