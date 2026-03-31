import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'

const VALID_KEYS = [
  'home.hero_bg',
  'home.about_strip',
  'instructors.hero_bg',
  'instructors.action',
  'about.hero_bg',
  'about.story',
] as const

const uploadSchema = z.object({
  sectionKey: z.enum(VALID_KEYS),
  imageData: z.string().min(1),
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
  const parsed = uploadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { sectionKey, imageData, alt } = parsed.data

  const existing = await db.sectionPhoto.findUnique({ where: { sectionKey } })
  if (existing?.publicId) {
    await deleteImage(existing.publicId)
  }

  const uploaded = await uploadImage(imageData, {
    folder: 'little-club-friends/sections',
    public_id: sectionKey.replace('.', '-'),
  })

  await db.sectionPhoto.upsert({
    where: { sectionKey },
    update: { url: uploaded.secure_url, publicId: uploaded.public_id, alt },
    create: { sectionKey, url: uploaded.secure_url, publicId: uploaded.public_id, alt },
  })

  revalidatePath('/ro')
  revalidatePath('/en')
  revalidatePath('/ro/about')
  revalidatePath('/en/about')
  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')

  return NextResponse.json({ success: true, url: uploaded.secure_url })
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

  await deleteImage(existing.publicId)
  await db.sectionPhoto.delete({ where: { sectionKey } })

  revalidatePath('/ro')
  revalidatePath('/en')
  revalidatePath('/ro/about')
  revalidatePath('/en/about')
  revalidatePath('/ro/instructors')
  revalidatePath('/en/instructors')

  return NextResponse.json({ success: true })
}
