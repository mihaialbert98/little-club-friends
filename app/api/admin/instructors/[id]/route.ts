import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { InstructorSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

type Params = { params: Promise<{ id: string }> }

function buildTranslations(data: { ro: { name: string; bio: string }; en?: { name: string; bio: string } }) {
  const translations = [{ locale: 'ro', ...data.ro }]
  if (data.en && data.en.name.trim()) {
    translations.push({ locale: 'en', ...data.en })
  }
  return translations
}

async function uniqueSlug(base: string, excludeId: string): Promise<string> {
  const root = slugify(base) || 'instructor'
  let slug = root
  let n = 1
  while (true) {
    const existing = await db.instructor.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${root}-${++n}`
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await db.instructor.findUnique({ where: { id }, include: { translations: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  const parsed = InstructorSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const d = parsed.data
  const roName = existing.translations.find((t) => t.locale === 'ro')?.name
  const slug = roName === d.ro.name ? existing.slug : await uniqueSlug(d.ro.name, id)

  const instructor = await db.$transaction(async (tx) => {
    await tx.instructorTranslation.deleteMany({ where: { instructorId: id } })
    return tx.instructor.update({
      where: { id },
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
  })

  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')
  return NextResponse.json(instructor)
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await db.instructor.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.instructor.delete({ where: { id } })

  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')
  return NextResponse.json({ success: true })
}
