import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { revalidatePath } from 'next/cache'
import { Season } from '@prisma/client'

const uploadSchema = z.object({
  imageData: z.string().min(1),
  caption: z.string().optional(),
  season: z.nativeEnum(Season).nullable().optional(),
})

const deleteSchema = z.object({
  id: z.string().cuid(),
})

const patchSchema = z.object({
  id: z.string().cuid(),
  caption: z.string().optional(),
  season: z.nativeEnum(Season).nullable().optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const photos = await db.galleryPhoto.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(photos)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = uploadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { imageData, caption, season } = parsed.data

  const uploaded = await uploadImage(imageData, { folder: 'little-club-friends/gallery' })

  const maxOrder = await db.galleryPhoto.aggregate({ _max: { sortOrder: true } })
  const nextOrder = (maxOrder._max.sortOrder ?? 0) + 1

  const photo = await db.galleryPhoto.create({
    data: {
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      caption: caption ?? null,
      season: season ?? null,
      sortOrder: nextOrder,
    },
  })

  revalidatePath('/ro/gallery')
  revalidatePath('/en/gallery')
  revalidatePath('/ro')
  revalidatePath('/en')

  return NextResponse.json(photo)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { id, ...updates } = parsed.data

  const photo = await db.galleryPhoto.update({ where: { id }, data: updates })

  revalidatePath('/ro/gallery')
  revalidatePath('/en/gallery')
  revalidatePath('/ro')
  revalidatePath('/en')

  return NextResponse.json(photo)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = deleteSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const photo = await db.galleryPhoto.findUnique({ where: { id: parsed.data.id } })
  if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deleteImage(photo.publicId)
  await db.galleryPhoto.delete({ where: { id: parsed.data.id } })

  revalidatePath('/ro/gallery')
  revalidatePath('/en/gallery')
  revalidatePath('/ro')
  revalidatePath('/en')

  return NextResponse.json({ success: true })
}
