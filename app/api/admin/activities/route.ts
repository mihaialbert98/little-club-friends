import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ActivitySchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

// GET — list all activities (admin: includes inactive) with translations + images
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const activities = await db.activity.findMany({
    include: {
      translations: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(activities)
}

// Build the list of translations to create from RO (required) + EN (optional).
function buildTranslations(data: { ro: { name: string; description: string; shortDesc: string }; en?: { name: string; description: string; shortDesc: string } }) {
  const translations = [{ locale: 'ro', ...data.ro }]
  // Only add an EN row when an English name was actually provided.
  if (data.en && data.en.name.trim()) {
    translations.push({ locale: 'en', ...data.en })
  }
  return translations
}

// Generate a slug that is unique across activities (RO name is the basis).
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'activitate'
  let slug = root
  let n = 1
  while (true) {
    const existing = await db.activity.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${root}-${++n}`
  }
}

// POST — create an activity
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = ActivitySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  const slug = await uniqueSlug(d.ro.name)

  const activity = await db.activity.create({
    data: {
      slug,
      season: d.season,
      ageMin: d.ageMin ?? 4,
      ageMax: d.ageMax ?? 16,
      durationMin: d.durationMin ?? 60,
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

  revalidatePath('/ro/activities')
  revalidatePath('/en/activities')
  return NextResponse.json(activity, { status: 201 })
}
