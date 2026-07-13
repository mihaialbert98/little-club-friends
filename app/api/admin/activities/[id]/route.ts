import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ActivitySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

type Params = { params: Promise<{ id: string }> }

function buildTranslations(data: { ro: { name: string; description: string; shortDesc: string }; en?: { name: string; description: string; shortDesc: string } }) {
  const translations = [{ locale: 'ro', ...data.ro }]
  if (data.en && data.en.name.trim()) {
    translations.push({ locale: 'en', ...data.en })
  }
  return translations
}

async function uniqueSlug(base: string, excludeId: string): Promise<string> {
  const root = slugify(base) || 'activitate'
  let slug = root
  let n = 1
  while (true) {
    const existing = await db.activity.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${root}-${++n}`
  }
}

// PUT — update an activity (replaces translations + images)
export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await db.activity.findUnique({ where: { id }, include: { translations: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = ActivitySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  // Re-slug only if the RO name changed, to keep existing public URLs stable.
  const roName = existing.translations.find((t) => t.locale === 'ro')?.name
  const slug = roName === d.ro.name ? existing.slug : await uniqueSlug(d.ro.name, id)

  const activity = await db.$transaction(async (tx) => {
    await tx.activityTranslation.deleteMany({ where: { activityId: id } })
    await tx.activityImage.deleteMany({ where: { activityId: id } })
    return tx.activity.update({
      where: { id },
      data: {
        slug,
        season: d.season,
        ageMin: d.ageMin ?? 4,
        ageMax: d.ageMax ?? 16,
        durationMin: d.durationMin ?? null,
        priceFrom: d.priceFrom ?? null,
        isActive: d.isActive,
        sortOrder: d.sortOrder,
        translations: { create: buildTranslations(d) },
        images: {
          create: d.images.map((img, i) => ({
            url: img.url,
            publicId: '', // external URLs — no Cloudinary publicId
            alt: img.alt,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder || i,
          })),
        },
      },
      include: { translations: true, images: true },
    })
  })

  revalidatePath('/ro/activities')
  revalidatePath('/en/activities')
  revalidatePath(`/ro/activities/${slug}`)
  revalidatePath(`/en/activities/${slug}`)
  return NextResponse.json(activity)
}

// DELETE — remove an activity (translations + images cascade)
export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await db.activity.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.activity.delete({ where: { id } })

  revalidatePath('/ro/activities')
  revalidatePath('/en/activities')
  return NextResponse.json({ success: true })
}
