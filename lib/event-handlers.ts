import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { EventSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import {
  EventConfig,
  eventModel,
  buildEventTranslations,
  uniqueEventSlug,
  eventRevalidatePaths,
} from '@/lib/events'

// Image rows from the validated payload → Prisma createMany-style input.
function imageCreateData(images: { url: string; alt: string; isPrimary: boolean; sortOrder: number }[]) {
  return images.map((img, i) => ({
    url: img.url,
    publicId: '', // external URLs — no Cloudinary publicId
    alt: img.alt,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder || i,
  }))
}

// Factory: REST handlers for one event entity's collection route.
export function makeEventCollectionHandlers(cfg: EventConfig) {
  async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const items = await eventModel(cfg).findMany({
      include: { translations: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(items)
  }

  async function POST(request: NextRequest) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }

    const d = parsed.data
    const slug = await uniqueEventSlug(cfg, d.ro.name)

    const item = await eventModel(cfg).create({
      data: {
        slug,
        startDate: d.startDate ? new Date(d.startDate) : null,
        endDate: d.endDate ? new Date(d.endDate) : null,
        isActive: d.isActive,
        sortOrder: d.sortOrder,
        translations: { create: buildEventTranslations(d) },
        images: { create: imageCreateData(d.images) },
      },
      include: { translations: true, images: true },
    })

    eventRevalidatePaths(cfg).forEach((p) => revalidatePath(p))
    return NextResponse.json(item, { status: 201 })
  }

  return { GET, POST }
}

// Factory: REST handlers for one event entity's item route (/[id]).
export function makeEventItemHandlers(cfg: EventConfig) {
  type Params = { params: Promise<{ id: string }> }
  const { model, translation, image, fk } = cfg.delegates

  async function PUT(request: NextRequest, { params }: Params) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const existing = await eventModel(cfg).findUnique({ where: { id }, include: { translations: true } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await request.json()
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
    }

    const d = parsed.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const roName = existing.translations.find((t: any) => t.locale === 'ro')?.name
    const slug = roName === d.ro.name ? existing.slug : await uniqueEventSlug(cfg, d.ro.name, id)

    const item = await db.$transaction(async (tx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = tx as any
      await t[translation].deleteMany({ where: { [fk]: id } })
      await t[image].deleteMany({ where: { [fk]: id } })
      return t[model].update({
        where: { id },
        data: {
          slug,
          startDate: d.startDate ? new Date(d.startDate) : null,
          endDate: d.endDate ? new Date(d.endDate) : null,
          isActive: d.isActive,
          sortOrder: d.sortOrder,
          translations: { create: buildEventTranslations(d) },
          images: { create: imageCreateData(d.images) },
        },
        include: { translations: true, images: true },
      })
    })

    eventRevalidatePaths(cfg, slug).forEach((p) => revalidatePath(p))
    return NextResponse.json(item)
  }

  async function DELETE(_request: NextRequest, { params }: Params) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const existing = await eventModel(cfg).findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await eventModel(cfg).delete({ where: { id } })

    eventRevalidatePaths(cfg).forEach((p) => revalidatePath(p))
    return NextResponse.json({ success: true })
  }

  return { PUT, DELETE }
}
