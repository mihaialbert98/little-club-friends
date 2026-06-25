import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { db } from '@/lib/db'
import ActivityForm, { type ActivityFormValues } from '../../ActivityForm'

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  const activity = await db.activity.findUnique({
    where: { id },
    include: { translations: true, images: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!activity) notFound()

  const ro = activity.translations.find((t) => t.locale === 'ro')
  const en = activity.translations.find((t) => t.locale === 'en')

  const initial: ActivityFormValues = {
    id: activity.id,
    season: activity.season as 'WINTER' | 'SUMMER' | 'BOTH',
    ageMin: String(activity.ageMin),
    ageMax: String(activity.ageMax),
    priceFrom: activity.priceFrom !== null ? String(Number(activity.priceFrom)) : '',
    isActive: activity.isActive,
    sortOrder: String(activity.sortOrder),
    ro: { name: ro?.name ?? '', shortDesc: ro?.shortDesc ?? '', description: ro?.description ?? '' },
    en: { name: en?.name ?? '', shortDesc: en?.shortDesc ?? '', description: en?.description ?? '' },
    images: activity.images.map((im) => ({ url: im.url, alt: im.alt, isPrimary: im.isPrimary })),
  }

  return (
    <div>
      <Link
        href={`/${locale}/admin/activities`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={15} /> Înapoi la activități
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editează activitatea</h1>
      <ActivityForm locale={locale} initial={initial} />
    </div>
  )
}
