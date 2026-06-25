import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EventForm from '@/components/features/admin/EventForm'

export default async function NewTabaraPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div>
      <Link
        href={`/${locale}/admin/tabere`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la tabere
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tabără nouă</h1>
      <EventForm
        apiBase="/api/admin/tabere"
        listPath={`/${locale}/admin/tabere`}
        labels={{ singular: 'Tabără', namePlaceholder: 'ex: Tabără de schi' }}
      />
    </div>
  )
}
