# Site Redesign — Plan 3: Admin CMS

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three admin sections — Page Content editor (bilingual text), Section Photo manager (upload/replace per-section images), and Gallery manager (upload/tag/reorder/delete photos via Cloudinary).

**Architecture:** Three new admin pages under `app/[locale]/(admin)/admin/`. Each has a Server Component page that fetches current data, and a Client Component form that handles mutations via API route handlers. API routes validate with Zod and use the existing `lib/cloudinary.ts` for image uploads. The existing `lib/db.ts` Prisma singleton is used throughout. `revalidatePath` is called after each mutation.

**Tech Stack:** Next.js App Router, TypeScript strict, Prisma v7/Neon, Cloudinary via `lib/cloudinary.ts`, Zod, React Hook Form (existing), shadcn/ui components (Button, Input, Textarea, Select, Tabs).

**Prerequisite:** Plans 1 and 2 must be complete. `SectionPhoto` model must exist in DB.

---

## File Map

| File | Change |
|---|---|
| `app/api/admin/content/route.ts` | New — GET + PUT page content |
| `app/api/admin/section-photos/route.ts` | New — POST + DELETE section photos |
| `app/api/admin/gallery/route.ts` | New — POST + DELETE + PATCH gallery photos |
| `app/[locale]/(admin)/admin/content/page.tsx` | New — bilingual text editor page |
| `app/[locale]/(admin)/admin/content/ContentEditor.tsx` | New — client component for text editing |
| `app/[locale]/(admin)/admin/photos/page.tsx` | New — section photo manager page |
| `app/[locale]/(admin)/admin/photos/SectionPhotoManager.tsx` | New — client component for photo upload |
| `app/[locale]/(admin)/admin/gallery/page.tsx` | New — gallery manager page |
| `app/[locale]/(admin)/admin/gallery/GalleryManager.tsx` | New — client component for gallery CRUD |
| `lib/cloudinary.ts` | Read-only — use existing `uploadImage` + `deleteImage` |
| `components/features/admin/AdminSidebar.tsx` | Modify — add Content, Photos, Gallery links |

---

### Task 1: Add Content, Photos, Gallery links to AdminSidebar

**Files:**
- Modify: `components/features/admin/AdminSidebar.tsx`

- [ ] **Step 1: Read AdminSidebar.tsx**

Read `components/features/admin/AdminSidebar.tsx` to understand its current structure and how nav links are rendered.

- [ ] **Step 2: Add the three new nav links**

Find the array/list of navigation items and add three new entries. Preserve the existing items (Activities, Bookings, Settings). Add after the existing items:

```tsx
{ href: '/admin/content', label: 'Page Content', icon: FileText },
{ href: '/admin/photos', label: 'Section Photos', icon: ImageIcon },
{ href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
```

Import the new icons from `lucide-react`:
```tsx
import { FileText, Image as ImageIcon, GalleryHorizontal } from 'lucide-react'
```

The exact implementation depends on the current sidebar structure — adapt accordingly without changing the visual style.

- [ ] **Step 3: Commit**

```bash
git add components/features/admin/AdminSidebar.tsx
git commit -m "feat: add Content, Photos, Gallery links to admin sidebar"
```

---

### Task 2: Page Content API route

**Files:**
- Create: `app/api/admin/content/route.ts`

- [ ] **Step 1: Check existing auth pattern**

Read `app/api/admin/` directory or any existing admin API route (e.g. `app/api/admin/settings/route.ts` if it exists, or check `app/[locale]/(admin)/admin/settings/`) to understand how auth is checked in API routes for this project.

- [ ] **Step 2: Read lib/auth.ts**

Read `lib/auth.ts` to confirm the export name for the auth function (likely `auth()`).

- [ ] **Step 3: Create the content API route**

Create `app/api/admin/content/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const updateSchema = z.object({
  page: z.string().min(1),
  key: z.string().min(1),   // format: "field_name.locale" e.g. "hero_title.ro"
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

  // Revalidate the affected public page
  revalidatePath(`/ro/${page === 'home' ? '' : page}`)
  revalidatePath(`/en/${page === 'home' ? '' : page}`)

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/content/route.ts
git commit -m "feat: add GET/PUT /api/admin/content route for bilingual page text"
```

---

### Task 3: Section Photos API route

**Files:**
- Create: `app/api/admin/section-photos/route.ts`

- [ ] **Step 1: Read lib/cloudinary.ts**

Read `lib/cloudinary.ts` to confirm the export signatures for `uploadImage` and `deleteImage`.

- [ ] **Step 2: Create the section photos route**

Create `app/api/admin/section-photos/route.ts`:

```typescript
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
  imageData: z.string().min(1), // base64 data URL
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

  // Delete old Cloudinary asset if one exists
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
  if (!existing) return NextResponse.json({ success: true }) // nothing to delete

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
```

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/section-photos/route.ts
git commit -m "feat: add GET/POST/DELETE /api/admin/section-photos route"
```

---

### Task 4: Gallery API route

**Files:**
- Create: `app/api/admin/gallery/route.ts`

- [ ] **Step 1: Create the gallery route**

Create `app/api/admin/gallery/route.ts`:

```typescript
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

  const uploaded = await uploadImage(imageData, {
    folder: 'little-club-friends/gallery',
  })

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

  const photo = await db.galleryPhoto.update({
    where: { id },
    data: updates,
  })

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
```

- [ ] **Step 2: Commit**

```bash
git add app/api/admin/gallery/route.ts
git commit -m "feat: add GET/POST/PATCH/DELETE /api/admin/gallery route"
```

---

### Task 5: ContentEditor client component

**Files:**
- Create: `app/[locale]/(admin)/admin/content/ContentEditor.tsx`

- [ ] **Step 1: Create ContentEditor.tsx**

```tsx
'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type ContentRow = { page: string; key: string; value: string }

const PAGE_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  home: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)', multiline: false },
    { key: 'hero_title.en', label: 'Hero Title (EN)', multiline: false },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
    { key: 'about_title.ro', label: 'About Title (RO)' },
    { key: 'about_title.en', label: 'About Title (EN)' },
    { key: 'about_body.ro', label: 'About Body (RO)', multiline: true },
    { key: 'about_body.en', label: 'About Body (EN)', multiline: true },
    { key: 'cta_title.ro', label: 'CTA Title (RO)' },
    { key: 'cta_title.en', label: 'CTA Title (EN)' },
    { key: 'cta_subtitle.ro', label: 'CTA Subtitle (RO)' },
    { key: 'cta_subtitle.en', label: 'CTA Subtitle (EN)' },
  ],
  about: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'story_body.ro', label: 'Story Body (RO)', multiline: true },
    { key: 'story_body.en', label: 'Story Body (EN)', multiline: true },
  ],
  activities: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
  ],
  instructors: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
  ],
  gallery: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
  ],
  booking: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
  ],
  contact: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
  ],
}

const PAGES = Object.keys(PAGE_FIELDS)

export default function ContentEditor({ initialRows }: { initialRows: ContentRow[] }) {
  const [activePage, setActivePage] = useState('home')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const row of initialRows) {
      map[`${row.page}.${row.key}`] = row.value
    }
    return map
  })
  const [isPending, startTransition] = useTransition()

  const handleSave = (page: string, key: string) => {
    const fullKey = `${page}.${key}`
    const value = values[fullKey] ?? ''
    startTransition(async () => {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, key, value }),
      })
      if (res.ok) {
        toast.success('Saved!')
      } else {
        toast.error('Failed to save.')
      }
    })
  }

  const fields = PAGE_FIELDS[activePage] ?? []

  return (
    <div>
      {/* Page tabs */}
      <div className="flex gap-1 mb-8 flex-wrap">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-sm transition-colors ${
              activePage === page
                ? 'bg-orange-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {fields.map((field) => {
          const fullKey = `${activePage}.${field.key}`
          return (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-sm bg-background resize-y"
                  value={values[fullKey] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [fullKey]: e.target.value }))}
                />
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-background"
                  value={values[fullKey] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [fullKey]: e.target.value }))}
                />
              )}
              <button
                onClick={() => handleSave(activePage, field.key)}
                disabled={isPending}
                className="self-end px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
              >
                Save
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/content/ContentEditor.tsx"
git commit -m "feat: add ContentEditor client component for bilingual page text"
```

---

### Task 6: Page Content admin page

**Files:**
- Create: `app/[locale]/(admin)/admin/content/page.tsx`

- [ ] **Step 1: Create content page**

```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import ContentEditor from './ContentEditor'

export default async function ContentPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const rows = await db.pageContent.findMany()

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Page Content</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Edit the text shown on public pages. Changes are saved per-field and take effect immediately.
      </p>
      <ContentEditor initialRows={rows} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/content/page.tsx"
git commit -m "feat: add admin Page Content editor page"
```

---

### Task 7: SectionPhotoManager client component

**Files:**
- Create: `app/[locale]/(admin)/admin/photos/SectionPhotoManager.tsx`

- [ ] **Step 1: Create SectionPhotoManager.tsx**

```tsx
'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2 } from 'lucide-react'

type SectionPhoto = {
  sectionKey: string
  url: string
  publicId: string
  alt: string
}

type SectionDef = {
  key: string
  label: string
  description: string
  fallbackUrl: string
}

const SECTIONS: SectionDef[] = [
  { key: 'home.hero_bg', label: 'Home — Hero Background', description: 'Full-screen photo behind the hero headline', fallbackUrl: '/scraped/home/f8a62b65-4386-45c8-b880-6bb8b0c1bbaa-scaled.webp' },
  { key: 'home.about_strip', label: 'Home — About Strip', description: 'Photo in the About/Trust section (instructor + child)', fallbackUrl: '/scraped/api-media/IMG_1787-scaled.webp' },
  { key: 'instructors.hero_bg', label: 'Instructors — Hero Background', description: 'Background photo on the Instructors page header', fallbackUrl: '/scraped/instructori/IMG_1392-scaled-e1735057973622.jpg' },
  { key: 'instructors.action', label: 'Instructors — Action Photo', description: 'Strip photo at the bottom of the Instructors page', fallbackUrl: '/scraped/home/IMG_1790-scaled.jpeg' },
  { key: 'about.hero_bg', label: 'About — Hero Background', description: 'Background photo on the About page header', fallbackUrl: '/scraped/despre-noi/149d3d6f-7898-48f0-b00b-d1cf11ee27fa.webp' },
  { key: 'about.story', label: 'About — Story Photo', description: 'Photo beside the Our Story text section', fallbackUrl: '/scraped/despre-noi/IMG_3878-scaled.jpeg' },
]

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function SectionPhotoManager({
  initialPhotos,
}: {
  initialPhotos: SectionPhoto[]
}) {
  const [photos, setPhotos] = useState<Record<string, SectionPhoto>>(() => {
    const map: Record<string, SectionPhoto> = {}
    for (const p of initialPhotos) map[p.sectionKey] = p
    return map
  })
  const [uploading, setUploading] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleUpload = async (sectionKey: string, file: File) => {
    setUploading(sectionKey)
    try {
      const imageData = await toBase64(file)
      const res = await fetch('/api/admin/section-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey, imageData, alt: '' }),
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setPhotos((prev) => ({
        ...prev,
        [sectionKey]: { sectionKey, url: data.url, publicId: '', alt: '' },
      }))
      toast.success('Photo updated!')
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(null)
    }
  }

  const handleRevert = async (sectionKey: string) => {
    try {
      const res = await fetch('/api/admin/section-photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionKey }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setPhotos((prev) => {
        const next = { ...prev }
        delete next[sectionKey]
        return next
      })
      toast.success('Reverted to default photo.')
    } catch {
      toast.error('Failed to revert.')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {SECTIONS.map((section) => {
        const override = photos[section.key]
        const currentUrl = override?.url ?? section.fallbackUrl
        const hasOverride = !!override
        const isUploading = uploading === section.key

        return (
          <div key={section.key} className="border rounded-sm overflow-hidden">
            {/* Photo preview */}
            <div className="relative h-48 bg-muted">
              <Image src={currentUrl} alt={section.label} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              {!hasOverride && (
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider">
                  Default
                </div>
              )}
              {hasOverride && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider">
                  Custom
                </div>
              )}
            </div>

            {/* Info + actions */}
            <div className="p-4">
              <p className="text-sm font-bold mb-1">{section.label}</p>
              <p className="text-xs text-muted-foreground mb-4">{section.description}</p>
              <div className="flex gap-2">
                <input
                  ref={(el) => { inputRefs.current[section.key] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUpload(section.key, file)
                  }}
                />
                <button
                  onClick={() => inputRefs.current[section.key]?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
                >
                  <Upload size={12} />
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                {hasOverride && (
                  <button
                    onClick={() => handleRevert(section.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-sm text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 size={12} />
                    Revert
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/photos/SectionPhotoManager.tsx"
git commit -m "feat: add SectionPhotoManager client component"
```

---

### Task 8: Section Photos admin page

**Files:**
- Create: `app/[locale]/(admin)/admin/photos/page.tsx`

- [ ] **Step 1: Create photos page**

```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import SectionPhotoManager from './SectionPhotoManager'

export default async function SectionPhotosPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const photos = await db.sectionPhoto.findMany()

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Section Photos</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Upload custom photos for specific sections. Deleting a photo reverts to the default scraped image.
      </p>
      <SectionPhotoManager initialPhotos={photos} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/photos/page.tsx"
git commit -m "feat: add admin Section Photos management page"
```

---

### Task 9: GalleryManager client component

**Files:**
- Create: `app/[locale]/(admin)/admin/gallery/GalleryManager.tsx`

- [ ] **Step 1: Create GalleryManager.tsx**

```tsx
'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Upload, Trash2, Tag } from 'lucide-react'
import { Season } from '@prisma/client'

type GalleryPhoto = {
  id: string
  url: string
  publicId: string
  caption: string | null
  season: Season | null
  sortOrder: number
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const SEASON_LABELS: Record<string, string> = {
  WINTER: '❄️ Winter',
  SUMMER: '☀️ Summer',
  BOTH: '🌍 Both',
}

export default function GalleryManager({
  initialPhotos,
}: {
  initialPhotos: GalleryPhoto[]
}) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [uploadSeason, setUploadSeason] = useState<Season | 'BOTH'>('BOTH')
  const [uploadCaption, setUploadCaption] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleUpload = async (files: FileList) => {
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const imageData = await toBase64(file)
        const res = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData,
            caption: uploadCaption || undefined,
            season: uploadSeason === 'BOTH' ? null : uploadSeason,
          }),
        })
        if (!res.ok) throw new Error('Upload failed')
        const newPhoto = await res.json()
        setPhotos((prev) => [...prev, newPhoto])
      }
      toast.success('Photo(s) uploaded!')
      setUploadCaption('')
    } catch {
      toast.error('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this photo permanently?')) return
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => prev.filter((p) => p.id !== id))
      toast.success('Photo deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  const handleSeasonChange = async (id: string, season: Season | null) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, season }),
      })
      if (!res.ok) throw new Error()
      setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, season } : p)))
      toast.success('Season updated.')
    } catch {
      toast.error('Failed to update.')
    }
  }

  return (
    <div>
      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-sm p-6 mb-8 flex flex-col gap-4">
        <p className="text-sm font-semibold">Upload new photos</p>
        <div className="flex gap-3 flex-wrap items-end">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Season tag</label>
            <select
              value={uploadSeason}
              onChange={(e) => setUploadSeason(e.target.value as Season | 'BOTH')}
              className="text-sm border rounded-sm px-2 py-1.5 bg-background"
            >
              <option value="BOTH">🌍 Both seasons</option>
              <option value="WINTER">❄️ Winter only</option>
              <option value="SUMMER">☀️ Summer only</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Caption (optional)</label>
            <input
              type="text"
              value={uploadCaption}
              onChange={(e) => setUploadCaption(e.target.value)}
              placeholder="e.g. Skiing lesson in Poiana Brașov"
              className="w-full text-sm border rounded-sm px-3 py-1.5 bg-background"
            />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose Photos'}
          </button>
        </div>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <p className="text-muted-foreground text-sm">No photos uploaded yet. The gallery will show default scraped photos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group border rounded-sm overflow-hidden">
              <div className="relative h-40">
                <Image src={photo.url} alt={photo.caption ?? ''} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="p-2 bg-background">
                {/* Season tag selector */}
                <select
                  value={photo.season ?? 'BOTH'}
                  onChange={(e) => {
                    const val = e.target.value
                    handleSeasonChange(photo.id, val === 'BOTH' ? null : (val as Season))
                  }}
                  className="w-full text-xs border rounded-sm px-1.5 py-1 bg-background mb-2"
                >
                  <option value="BOTH">🌍 Both</option>
                  <option value="WINTER">❄️ Winter</option>
                  <option value="SUMMER">☀️ Summer</option>
                </select>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="w-full flex items-center justify-center gap-1 py-1 text-xs text-destructive border border-destructive/20 rounded-sm hover:bg-destructive/10"
                >
                  <Trash2 size={10} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/gallery/GalleryManager.tsx"
git commit -m "feat: add GalleryManager client component with upload/delete/season-tag"
```

---

### Task 10: Gallery admin page

**Files:**
- Create: `app/[locale]/(admin)/admin/gallery/page.tsx`

- [ ] **Step 1: Create gallery admin page**

```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import GalleryManager from './GalleryManager'

export default async function AdminGalleryPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const photos = await db.galleryPhoto.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Gallery</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Upload and manage gallery photos. Tag each photo with a season so it appears under the correct theme. 
        If no photos are uploaded here, the public gallery will show the default scraped photos.
      </p>
      <GalleryManager initialPhotos={photos} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(admin)/admin/gallery/page.tsx"
git commit -m "feat: add admin Gallery management page"
```

---

### Task 11: Final verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Verify admin pages load**

Log into admin at http://localhost:3000/ro/admin.

Visit each new admin page:
- http://localhost:3000/ro/admin/content — should show page tabs and text fields
- http://localhost:3000/ro/admin/photos — should show 6 section photo cards with current/default images
- http://localhost:3000/ro/admin/gallery — should show upload area and "No photos uploaded yet" message

- [ ] **Step 3: Test content editing flow**

On `/admin/content`, change the Home hero title (RO field). Click Save. Visit http://localhost:3000/ro — verify the hero title has changed.

- [ ] **Step 4: Test section photo flow**

On `/admin/photos`, click Upload on "Home — About Strip". Upload any image. Verify the preview changes from the default scraped photo to your uploaded image. Visit http://localhost:3000/ro and confirm the About section shows the new photo. Click Revert — confirm it goes back to the default.

- [ ] **Step 5: Test gallery flow**

On `/admin/gallery`, upload a photo tagged "Winter". Visit http://localhost:3000/ro/gallery — the gallery should now show DB photos. The uploaded photo should appear. Back in admin, change the season tag to "Summer" — verify the gallery teaser on the homepage and gallery page update accordingly.

- [ ] **Step 6: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete admin CMS — content editor, section photos, gallery manager"
```

---

**Plan 3 complete.** Full site redesign done across all three plans.

## Summary of all changes across 3 plans

| Plan | What it delivers |
|---|---|
| Plan 1 — Foundation | Extended CSS theme tokens, `SectionPhoto` DB model, `lib/content.ts` helpers |
| Plan 2 — Public UI | All public pages redesigned: navbar, footer, hero, activities, about, instructors, gallery, booking, contact |
| Plan 3 — Admin CMS | Content editor, section photo manager, gallery manager with Cloudinary |
