import EventsList from '@/components/features/admin/EventsList'
import { EVENT_CONFIG, getEventListRows } from '@/lib/events'

export default async function AdminTaberePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const rows = await getEventListRows(EVENT_CONFIG.camps)

  return (
    <EventsList
      rows={rows}
      apiBase="/api/admin/tabere"
      listPath={`/${locale}/admin/tabere`}
      title="Tabere"
      addLabel="Adaugă tabără"
      emptyLabel="Nicio tabără încă."
    />
  )
}
