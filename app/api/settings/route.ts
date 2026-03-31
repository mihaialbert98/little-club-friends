import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { SiteSettingsSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const settings = await db.siteSettings.findFirst()
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = SiteSettingsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  let settings = await db.siteSettings.findFirst()
  if (!settings) {
    settings = await db.siteSettings.create({ data: {} })
  }

  const updated = await db.siteSettings.update({
    where: { id: settings.id },
    data: parsed.data,
  })

  // Revalidate public pages immediately
  revalidatePath('/ro')
  revalidatePath('/en')
  revalidatePath('/ro/activities')
  revalidatePath('/en/activities')

  return NextResponse.json(updated)
}
