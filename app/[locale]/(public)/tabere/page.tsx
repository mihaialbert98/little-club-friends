import { getLocale, getTranslations } from 'next-intl/server'
import EventListSection from '@/components/features/events/EventListSection'
import { EVENT_CONFIG, getPublicEventList } from '@/lib/events'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tabere' }
export const revalidate = 60

export default async function TaberePage() {
  const locale = await getLocale()
  const t = await getTranslations('tabere')
  const items = await getPublicEventList(EVENT_CONFIG.camps, locale)

  return (
    <EventListSection
      items={items}
      basePath="tabere"
      label={t('label')}
      title={t('page_title')}
      subtitle={t('page_subtitle')}
      emptyText={t('empty')}
      locale={locale}
      fallbackEmoji="⛺"
    />
  )
}
