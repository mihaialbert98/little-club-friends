import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { deleteImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'

const VALID_KEYS = [
  'home.hero_bg',
  'home.about_strip',
  'instructors.hero_bg',
  'instructors.action',
  'about.hero_bg',
  'about.story',
] as const

const saveSchema = z.object({
  sectionKey: z.enum(VALID_KEYS),
  url: z.string().url('URL invalid'),
  alt: z.string().default(''),
})

const deleteSchema = z.object({
  sectionKey: z.enum(VALID_KEYS),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const photos = await db.sectionPhoto.findMany()
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { sectionKey, url, alt } = parsed.data

  // If a previous override was a Cloudinary upload, clean it up.
  const existing = await db.sectionPhoto.findUnique({ where: { sectionKey } })
  if (existing?.publicId) {
    await deleteImage(existing.publicId)
  }

  await db.sectionPhoto.upsert({
    where: { sectionKey },
    update: { url, publicId: '', alt },
    create: { sectionKey, url, publicId: '', alt },
  })

  revalidatePath('/ro')
  revalidatePath('/en')
  revalidatePath('/ro/about')
  revalidatePath('/en/about')
  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')

  return NextResponse.json({ success: true, url })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = deleteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { sectionKey } = parsed.data

  const existing = await db.sectionPhoto.findUnique({ where: { sectionKey } })
  if (!existing) return NextResponse.json({ success: true })

  if (existing.publicId) await deleteImage(existing.publicId)
  await db.sectionPhoto.delete({ where: { sectionKey } })

  revalidatePath('/ro')
  revalidatePath('/en')
  revalidatePath('/ro/about')
  revalidatePath('/en/about')
  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')

  return NextResponse.json({ success: true })
}
