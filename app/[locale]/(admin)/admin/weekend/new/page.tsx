import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EventForm from '@/components/features/admin/EventForm'

export default async function NewWeekendPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div>
      <Link
        href={`/${locale}/admin/weekend`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la activități de weekend
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activitate de weekend nouă</h1>
      <EventForm
        apiBase="/api/admin/weekend"
        listPath={`/${locale}/admin/weekend`}
        labels={{ singular: 'Activitate', namePlaceholder: 'ex: Drumeție de weekend' }}
      />
    </div>
  )
}
