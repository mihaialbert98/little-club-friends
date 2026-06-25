import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import InstructorForm from '../InstructorForm'

export default async function NewInstructorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <div>
      <Link
        href={`/${locale}/admin/instructors`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la instructori
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Instructor nou</h1>
      <InstructorForm locale={locale} />
    </div>
  )
}
