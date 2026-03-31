import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const updateSchema = z.object({
  page: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = req.nextUrl.searchParams.get('page')
  if (!page) return NextResponse.json({ error: 'page param required' }, { status: 400 })

  const rows = await db.pageContent.findMany({ where: { page } })
  return NextResponse.json(rows)
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { page, key, value } = parsed.data

  await db.pageContent.upsert({
    where: { page_key: { page, key } },
    update: { value },
    create: { page, key, value },
  })

  revalidatePath(`/ro/${page === 'home' ? '' : page}`)
  revalidatePath(`/en/${page === 'home' ? '' : page}`)

  return NextResponse.json({ success: true })
}
