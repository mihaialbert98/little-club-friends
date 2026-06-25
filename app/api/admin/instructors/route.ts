import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { InstructorSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const instructors = await db.instructor.findMany({
    include: { translations: true },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(instructors)
}

function buildTranslations(data: { ro: { name: string; bio: string }; en?: { name: string; bio: string } }) {
  const translations = [{ locale: 'ro', ...data.ro }]
  if (data.en && data.en.name.trim()) {
    translations.push({ locale: 'en', ...data.en })
  }
  return translations
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || 'instructor'
  let slug = root
  let n = 1
  while (true) {
    const existing = await db.instructor.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${root}-${++n}`
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = InstructorSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  const slug = await uniqueSlug(d.ro.name)

  const instructor = await db.instructor.create({
    data: {
      slug,
      certifications: d.certifications,
      imageUrl: d.imageUrl || null,
      isActive: d.isActive,
      sortOrder: d.sortOrder,
      translations: { create: buildTranslations(d) },
    },
    include: { translations: true },
  })

  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')
  return NextResponse.json(instructor, { status: 201 })
}
