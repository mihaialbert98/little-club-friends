import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import InstructorForm, { type InstructorFormValues } from '../../InstructorForm'

export default async function EditInstructorPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  const instructor = await db.instructor.findUnique({
    where: { id },
    include: { translations: true },
  })
  if (!instructor) notFound()

  const ro = instructor.translations.find((t) => t.locale === 'ro')
  const en = instructor.translations.find((t) => t.locale === 'en')

  const initial: InstructorFormValues = {
    id: instructor.id,
    imageUrl: instructor.imageUrl ?? '',
    isActive: instructor.isActive,
    sortOrder: String(instructor.sortOrder),
    certifications: instructor.certifications,
    ro: { name: ro?.name ?? '', bio: ro?.bio ?? '' },
    en: { name: en?.name ?? '', bio: en?.bio ?? '' },
  }

  return (
    <div>
      <Link
        href={`/${locale}/admin/instructors`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la instructori
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editează instructorul</h1>
      <InstructorForm locale={locale} initial={initial} />
    </div>
  )
}
