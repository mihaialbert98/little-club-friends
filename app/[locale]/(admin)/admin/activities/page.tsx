import { db } from '@/lib/db'
import ActivitiesList from './ActivitiesList'

export default async function AdminActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const activities = await db.activity.findMany({
    include: {
      translations: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  const rows = activities.map((a) => {
    const ro = a.translations.find((t) => t.locale === 'ro') ?? a.translations[0]
    const primary = a.images.find((im) => im.isPrimary) ?? a.images[0]
    return {
      id: a.id,
      slug: a.slug,
      name: ro?.name ?? a.slug,
      season: a.season as 'WINTER' | 'SUMMER' | 'BOTH',
      priceFrom: a.priceFrom ? Number(a.priceFrom) : null,
      isActive: a.isActive,
      imageCount: a.images.length,
      thumbnail: primary?.url ?? null,
    }
  })

  return <ActivitiesList rows={rows} locale={locale} />
}
