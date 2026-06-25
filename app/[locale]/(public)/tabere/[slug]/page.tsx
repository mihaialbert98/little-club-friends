import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import EventDetailSection from '@/components/features/events/EventDetailSection'
import { EVENT_CONFIG, getPublicEventDetail, getActiveEventSlugs } from '@/lib/events'
import { getContactPhone } from '@/lib/theme'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getActiveEventSlugs(EVENT_CONFIG.camps)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const item = await getPublicEventDetail(EVENT_CONFIG.camps, slug, locale)
  return { title: item?.name ?? 'Tabără' }
}

export default async function TabaraDetailPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = await getTranslations('tabere')
  const [item, phone] = await Promise.all([
    getPublicEventDetail(EVENT_CONFIG.camps, slug, locale),
    getContactPhone(),
  ])
  if (!item) notFound()

  return (
    <EventDetailSection
      item={item}
      basePath="tabere"
      backLabel={t('back_link')}
      aboutLabel={t('about_label')}
      datesLabel={t('dates_label')}
      ctaLabel={t('cta')}
      phone={phone}
      locale={locale}
    />
  )
}
