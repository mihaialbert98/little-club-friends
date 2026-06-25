import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import EventForm from '@/components/features/admin/EventForm'
import { EVENT_CONFIG, getEventForEdit } from '@/lib/events'

export default async function EditTabaraPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const initial = await getEventForEdit(EVENT_CONFIG.camps, id)
  if (!initial) notFound()

  return (
    <div>
      <Link
        href={`/${locale}/admin/tabere`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la tabere
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editează tabăra</h1>
      <EventForm
        initial={initial}
        apiBase="/api/admin/tabere"
        listPath={`/${locale}/admin/tabere`}
        labels={{ singular: 'Tabără', namePlaceholder: 'ex: Tabără de schi' }}
      />
    </div>
  )
}
