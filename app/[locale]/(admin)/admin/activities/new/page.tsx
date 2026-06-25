import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ActivityForm from '../ActivityForm'

export default async function NewActivityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div>
      <Link
        href={`/${locale}/admin/activities`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la activități
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Activitate nouă</h1>
      <ActivityForm locale={locale} />
    </div>
  )
}
