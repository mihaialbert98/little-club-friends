import { db } from '@/lib/db'
import { Season } from '@prisma/client'

// ─── PAGE CONTENT ─────────────────────────────────────────────────────────
// Keys follow "page.field.locale" pattern stored in PageContent model.
// Falls back to the provided default if no DB record exists.

export async function getPageContent(
  page: string,
  locale: string
): Promise<Record<string, string>> {
  const rows = await db.pageContent.findMany({
    where: { page },
  })

  const result: Record<string, string> = {}
  for (const row of rows) {
    // row.key is like "hero_title.ro" — split off the locale suffix
    const [field, rowLocale] = row.key.split('.')
    if (rowLocale === locale) {
      result[field] = row.value
    }
  }
  return result
}

// ─── SECTION PHOTO ────────────────────────────────────────────────────────
// Returns { url, alt } for a named section.
// When no DB override exists, returns the static fallback path.

const SECTION_PHOTO_FALLBACKS: Record<string, { url: string; alt: string }> = {
  'home.hero_bg': {
    url: '/scraped/home/f8a62b65-4386-45c8-b880-6bb8b0c1bbaa-scaled.webp',
    alt: 'Two children skiing in Poiana Brasov',
  },
  'home.about_strip': {
    url: '/scraped/api-media/IMG_1787-scaled.webp',
    alt: 'Instructor high-fiving a child in a ski lesson',
  },
  'instructors.hero_bg': {
    url: '/scraped/instructori/IMG_1392-scaled-e1735057973622.jpg',
    alt: 'Little Club Friends instructors at the ski resort',
  },
  'instructors.action': {
    url: '/scraped/home/IMG_1790-scaled.jpeg',
    alt: 'Instructor and child in a gondola',
  },
  'about.hero_bg': {
    url: '/scraped/despre-noi/149d3d6f-7898-48f0-b00b-d1cf11ee27fa.webp',
    alt: 'Little Club Friends instructors',
  },
  'about.story': {
    url: '/scraped/despre-noi/IMG_3878-scaled.jpeg',
    alt: 'Child learning to ski',
  },
}

export async function getSectionPhoto(
  sectionKey: string
): Promise<{ url: string; alt: string }> {
  const override = await db.sectionPhoto.findUnique({
    where: { sectionKey },
  })

  if (override) {
    return { url: override.url, alt: override.alt }
  }

  return (
    SECTION_PHOTO_FALLBACKS[sectionKey] ?? {
      url: '/scraped/home/f8a62b65-4386-45c8-b880-6bb8b0c1bbaa-scaled.webp',
      alt: 'Little Club Friends',
    }
  )
}

// ─── GALLERY PHOTOS ────────────────────────────────────────────────────────
// Returns gallery photos from DB. Falls back to a curated static list
// if the DB gallery table is empty.

const STATIC_GALLERY_WINTER = [
  { url: '/scraped/galerie-foto/IMG_1907-scaled.webp', alt: 'Diploma ceremony', season: Season.WINTER },
  { url: '/scraped/api-media/IMG_1633-scaled.webp', alt: 'Girl in pink snowsuit', season: Season.WINTER },
  { url: '/scraped/galerie-foto/IMG_3611-scaled.jpeg', alt: 'Boy skiing on slope', season: Season.WINTER },
  { url: '/scraped/galerie-foto/IMG_2938-scaled.jpeg', alt: 'Children skiing down slope', season: Season.WINTER },
  { url: '/scraped/api-media/IMG_1892-scaled.webp', alt: 'Instructor with group of girls', season: Season.WINTER },
  { url: '/scraped/api-media/IMG_1680-scaled.webp', alt: 'Girl in pink ski gear', season: Season.WINTER },
  { url: '/scraped/galerie-foto/IMG_3874-scaled.jpeg', alt: 'Children in gondola', season: Season.WINTER },
  { url: '/scraped/galerie-foto/IMG_3960-scaled.jpeg', alt: 'Instructor with toddler', season: Season.WINTER },
  { url: '/scraped/api-media/IMG_1787-scaled.webp', alt: 'Instructor high-five', season: Season.BOTH },
  { url: '/scraped/home/IMG_1790-scaled.jpeg', alt: 'Gondola lesson moment', season: Season.BOTH },
]

const STATIC_GALLERY_SUMMER = [
  { url: '/scraped/scoala-de-vara/IMG_6555-scaled.jpg', alt: 'Hiking group at mountain trail', season: Season.SUMMER },
  { url: '/scraped/scoala-de-vara/IMG_6700-scaled.jpg', alt: 'Adventure course in forest', season: Season.SUMMER },
  { url: '/scraped/api-media/IMG_8818-scaled.jpg', alt: 'Boy hiking in forest', season: Season.SUMMER },
  { url: '/scraped/api-media/IMG_8819-1-scaled.jpg', alt: 'Girl in forest', season: Season.SUMMER },
  { url: '/scraped/api-media/IMG_9489-scaled.jpg', alt: 'Siblings in autumn forest', season: Season.SUMMER },
  { url: '/scraped/api-media/IMG_1787-scaled.webp', alt: 'Instructor high-five', season: Season.BOTH },
]

export type GalleryItem = {
  id: string
  url: string
  alt: string
  season: Season | null
}

export async function getGalleryPhotos(
  seasonFilter?: Season
): Promise<GalleryItem[]> {
  const count = await db.galleryPhoto.count()

  if (count === 0) {
    // DB is empty — serve static fallback set
    const staticSet =
      seasonFilter === Season.SUMMER
        ? STATIC_GALLERY_SUMMER
        : STATIC_GALLERY_WINTER

    return staticSet.map((p, i) => ({
      id: `static-${i}`,
      url: p.url,
      alt: p.alt,
      season: p.season,
    }))
  }

  const where =
    seasonFilter
      ? { OR: [{ season: seasonFilter }, { season: null }] }
      : {}

  const photos = await db.galleryPhoto.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
  })

  return photos.map((p) => ({
    id: p.id,
    url: p.url,
    alt: p.caption ?? '',
    season: p.season,
  }))
}
