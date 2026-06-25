import EventsList from '@/components/features/admin/EventsList'
import { EVENT_CONFIG, getEventListRows } from '@/lib/events'

export default async function AdminWeekendPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const rows = await getEventListRows(EVENT_CONFIG.weekend)

  return (
    <EventsList
      rows={rows}
      apiBase="/api/admin/weekend"
      listPath={`/${locale}/admin/weekend`}
      title="Activități de weekend"
      addLabel="Adaugă activitate"
      emptyLabel="Nicio activitate de weekend încă."
    />
  )
}
