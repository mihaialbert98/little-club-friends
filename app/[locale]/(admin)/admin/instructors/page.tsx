import { db } from '@/lib/db'
import InstructorsList from './InstructorsList'

export default async function AdminInstructorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const instructors = await db.instructor.findMany({
    include: { translations: true },
    orderBy: { sortOrder: 'asc' },
  })

  const rows = instructors.map((i) => {
    const ro = i.translations.find((t) => t.locale === 'ro') ?? i.translations[0]
    return {
      id: i.id,
      name: ro?.name ?? i.slug,
      imageUrl: i.imageUrl,
      isActive: i.isActive,
      certCount: i.certifications.length,
    }
  })

  return <InstructorsList rows={rows} locale={locale} />
}
