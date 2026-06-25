import { db } from '@/lib/db'
import { slugify } from '@/lib/utils'

// Shared server-side logic for the two "event" entities (Camps & Weekend
// Activities). They have identical shape, so we parameterize by EventKind
// instead of duplicating the API/query code.

export type EventKind = 'camps' | 'weekend'

// Prisma delegate property names (on db / tx) for this entity's 3 tables.
type Delegates = {
  model: 'camp' | 'weekendActivity'
  translation: 'campTranslation' | 'weekendActivityTranslation'
  image: 'campImage' | 'weekendActivityImage'
  fk: 'campId' | 'weekendId'
}

export type EventConfig = {
  kind: EventKind
  // public + admin route base (without locale), e.g. "tabere"
  publicPath: string
  // default slug root when name has no usable characters
  slugRoot: string
  delegates: Delegates
}

export const EVENT_CONFIG: Record<EventKind, EventConfig> = {
  camps: {
    kind: 'camps',
    publicPath: 'tabere',
    slugRoot: 'tabara',
    delegates: {
      model: 'camp',
      translation: 'campTranslation',
      image: 'campImage',
      fk: 'campId',
    },
  },
  weekend: {
    kind: 'weekend',
    publicPath: 'weekend',
    slugRoot: 'activitate-weekend',
    delegates: {
      model: 'weekendActivity',
      translation: 'weekendActivityTranslation',
      image: 'weekendActivityImage',
      fk: 'weekendId',
    },
  },
}

// Resolve the Prisma model delegate for an entity from a client (db or a tx).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function eventModel(cfg: EventConfig, client: any = db) {
  return client[cfg.delegates.model]
}

export type EventTranslationData = { name: string; description: string; shortDesc: string }

// RO required + EN only when an English name was provided.
export function buildEventTranslations(data: { ro: EventTranslationData; en?: EventTranslationData }) {
  const translations = [{ locale: 'ro', ...data.ro }]
  if (data.en && data.en.name.trim()) {
    translations.push({ locale: 'en', ...data.en })
  }
  return translations
}

// Unique slug across the given entity (RO name is the basis).
export async function uniqueEventSlug(
  cfg: EventConfig,
  base: string,
  excludeId?: string
): Promise<string> {
  const root = slugify(base) || cfg.slugRoot
  let slug = root
  let n = 1
  const model = eventModel(cfg)
  while (true) {
    const existing = await model.findUnique({ where: { slug }, select: { id: true } })
    if (!existing || existing.id === excludeId) return slug
    slug = `${root}-${++n}`
  }
}

// Public revalidation paths for an entity (list + detail).
export function eventRevalidatePaths(cfg: EventConfig, slug?: string): string[] {
  const paths = [`/ro/${cfg.publicPath}`, `/en/${cfg.publicPath}`]
  if (slug) {
    paths.push(`/ro/${cfg.publicPath}/${slug}`, `/en/${cfg.publicPath}/${slug}`)
  }
  return paths
}

// ─── Admin data shaping (server-side) ─────────────────────────────────────────

export type EventListRow = {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  isActive: boolean
  imageCount: number
  thumbnail: string | null
}

// Rows for the admin list view (RO name, primary thumbnail, date range).
export async function getEventListRows(cfg: EventConfig): Promise<EventListRow[]> {
  const items = await eventModel(cfg).findMany({
    include: { translations: true, images: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.map((it: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ro = it.translations.find((t: any) => t.locale === 'ro') ?? it.translations[0]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const primary = it.images.find((im: any) => im.isPrimary) ?? it.images[0]
    return {
      id: it.id,
      name: ro?.name ?? it.slug,
      startDate: it.startDate ? it.startDate.toISOString() : null,
      endDate: it.endDate ? it.endDate.toISOString() : null,
      isActive: it.isActive,
      imageCount: it.images.length,
      thumbnail: primary?.url ?? null,
    }
  })
}

export type EventFormInitial = {
  id: string
  startDate: string
  endDate: string
  isActive: boolean
  sortOrder: string
  ro: { name: string; shortDesc: string; description: string }
  en: { name: string; shortDesc: string; description: string }
  images: { url: string; alt: string; isPrimary: boolean }[]
}

// ─── Public data shaping ──────────────────────────────────────────────────────

export type PublicEventListItem = {
  id: string
  slug: string
  name: string
  shortDesc: string
  startDate: string | null
  endDate: string | null
  imageUrl: string | null
}

// Active items for the public list, localized (RO fallback), primary image first.
export async function getPublicEventList(cfg: EventConfig, locale: string): Promise<PublicEventListItem[]> {
  const items = await eventModel(cfg).findMany({
    where: { isActive: true },
    include: { translations: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } },
    orderBy: { sortOrder: 'asc' },
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.map((it: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tr = it.translations.find((t: any) => t.locale === locale)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ?? it.translations.find((t: any) => t.locale === 'ro')
      ?? it.translations[0]
    return {
      id: it.id,
      slug: it.slug,
      name: tr?.name ?? it.slug,
      shortDesc: tr?.shortDesc ?? '',
      startDate: it.startDate ? it.startDate.toISOString() : null,
      endDate: it.endDate ? it.endDate.toISOString() : null,
      imageUrl: it.images[0]?.url ?? null,
    }
  })
}

export type PublicEventDetail = {
  name: string
  shortDesc: string
  description: string
  startDate: string | null
  endDate: string | null
  images: { id: string; url: string; alt: string }[]
}

// One active item for the public detail page (RO fallback), or null.
export async function getPublicEventDetail(
  cfg: EventConfig,
  slug: string,
  locale: string
): Promise<PublicEventDetail | null> {
  const item = await eventModel(cfg).findUnique({
    where: { slug },
    include: { translations: true, images: { orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }] } },
  })
  if (!item || !item.isActive) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tr = item.translations.find((t: any) => t.locale === locale)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ?? item.translations.find((t: any) => t.locale === 'ro')
    ?? item.translations[0]
  if (!tr) return null
  return {
    name: tr.name,
    shortDesc: tr.shortDesc,
    description: tr.description,
    startDate: item.startDate ? item.startDate.toISOString() : null,
    endDate: item.endDate ? item.endDate.toISOString() : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: item.images.map((im: any) => ({ id: im.id, url: im.url, alt: im.alt })),
  }
}

// Active slugs for generateStaticParams.
export async function getActiveEventSlugs(cfg: EventConfig): Promise<string[]> {
  const items = await eventModel(cfg).findMany({ where: { isActive: true }, select: { slug: true } })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return items.map((i: any) => i.slug)
}

// One item's data shaped for the edit form (or null if not found).
export async function getEventForEdit(cfg: EventConfig, id: string): Promise<EventFormInitial | null> {
  const item = await eventModel(cfg).findUnique({
    where: { id },
    include: { translations: true, images: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!item) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ro = item.translations.find((t: any) => t.locale === 'ro')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const en = item.translations.find((t: any) => t.locale === 'en')
  const toDateInput = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : '')
  return {
    id: item.id,
    startDate: toDateInput(item.startDate),
    endDate: toDateInput(item.endDate),
    isActive: item.isActive,
    sortOrder: String(item.sortOrder),
    ro: { name: ro?.name ?? '', shortDesc: ro?.shortDesc ?? '', description: ro?.description ?? '' },
    en: { name: en?.name ?? '', shortDesc: en?.shortDesc ?? '', description: en?.description ?? '' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    images: item.images.map((im: any) => ({ url: im.url, alt: im.alt, isPrimary: im.isPrimary })),
  }
}
