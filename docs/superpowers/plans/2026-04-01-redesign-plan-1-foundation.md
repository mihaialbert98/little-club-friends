# Site Redesign — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the CSS theme system, add the `SectionPhoto` DB model, and create the `lib/content.ts` helper that all public pages will use to fetch editable text and section photos.

**Architecture:** Theme variables extended in `globals.css` to add the new dark-mode tokens needed by the Bold & Adventurous design. New `SectionPhoto` Prisma model added. `lib/content.ts` provides two async helpers — `getPageContent(page, locale)` and `getSectionPhoto(sectionKey)` — each with hardcoded fallbacks so pages work with an empty DB.

**Tech Stack:** Tailwind CSS v4 (inline `@theme`), Prisma v7 with Neon adapter, TypeScript strict.

---

## File Map

| File | Change |
|---|---|
| `app/globals.css` | Add new theme variables for dark design + `navbar-solid` transition class |
| `prisma/schema.prisma` | Add `SectionPhoto` model |
| `lib/content.ts` | New — `getPageContent()` + `getSectionPhoto()` with fallbacks |

---

### Task 1: Extend CSS theme variables

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add new theme variables for dark design**

Open `app/globals.css`. Find the `[data-theme="winter"]` block and replace the entire winter + summer blocks with the expanded version below. This adds the new dark-design-specific tokens (`--theme-dark-base`, `--theme-hero-gradient`, `--theme-card-tint`, `--theme-badge-color`, `--theme-badge-bg-dark`, `--theme-season-label`) while keeping all existing tokens so nothing breaks.

```css
/* ─── WINTER THEME (default) ─────────────────────────────────────────────── */
:root,
[data-theme="winter"] {
  --theme-primary: oklch(0.28 0.12 250);       /* deep blue */
  --theme-primary-light: oklch(0.55 0.14 250);
  --theme-accent: oklch(0.75 0.15 210);        /* icy cyan */
  --theme-accent-warm: oklch(0.90 0.06 210);
  --theme-bg: oklch(0.98 0.01 240);            /* near-white cool */
  --theme-text: oklch(0.18 0.04 250);
  --theme-text-muted: oklch(0.50 0.04 250);
  --theme-hero-from: #0d2b4e;
  --theme-hero-via: #1a5276;
  --theme-hero-to: #2e86c1;
  --theme-card-border: oklch(0.88 0.03 240);
  --theme-badge-bg: oklch(0.88 0.06 210);
  --theme-badge-text: oklch(0.25 0.10 250);
  /* ── new dark-design tokens ── */
  --theme-dark-base: #0a0f1e;
  --theme-dark-mid: #070c16;
  --theme-hero-gradient: linear-gradient(170deg, #060c18 0%, #0d2448 50%, #0a1f3d 100%);
  --theme-card-tint: rgba(13, 43, 78, 0.5);
  --theme-card-tint-border: rgba(13, 43, 78, 0.8);
  --theme-badge-color: #7ec8e3;
  --theme-badge-bg-dark: rgba(13, 43, 78, 0.8);
  --theme-season-label: "❄️  Winter Season";
  --theme-nav-solid: rgba(10, 15, 30, 0.95);
}

/* ─── SUMMER THEME ───────────────────────────────────────────────────────── */
[data-theme="summer"] {
  --theme-primary: oklch(0.32 0.12 155);       /* forest green */
  --theme-primary-light: oklch(0.55 0.14 155);
  --theme-accent: oklch(0.78 0.16 85);         /* golden yellow */
  --theme-accent-warm: oklch(0.94 0.08 85);
  --theme-bg: oklch(0.98 0.01 90);             /* warm cream */
  --theme-text: oklch(0.18 0.04 120);
  --theme-text-muted: oklch(0.48 0.05 130);
  --theme-hero-from: #1a4731;
  --theme-hero-via: #2e7d5a;
  --theme-hero-to: #6dbb8a;
  --theme-card-border: oklch(0.88 0.04 120);
  --theme-badge-bg: oklch(0.90 0.08 85);
  --theme-badge-text: oklch(0.28 0.10 120);
  /* ── new dark-design tokens ── */
  --theme-dark-base: #060e0a;
  --theme-dark-mid: #060d08;
  --theme-hero-gradient: linear-gradient(170deg, #060e08 0%, #0d2418 50%, #0a1f10 100%);
  --theme-card-tint: rgba(26, 71, 49, 0.5);
  --theme-card-tint-border: rgba(26, 71, 49, 0.8);
  --theme-badge-color: #90ee90;
  --theme-badge-bg-dark: rgba(26, 71, 49, 0.8);
  --theme-season-label: "☀️  Summer Season";
  --theme-nav-solid: rgba(6, 14, 10, 0.95);
}
```

- [ ] **Step 2: Add coral constant and navbar scroll utility**

Directly after the summer theme block, add:

```css
/* ─── BRAND CONSTANTS (never theme-dependent) ────────────────────────────── */
:root {
  --brand-coral: #E8746B;
  --brand-coral-hover: #d4635a;
  --brand-coral-muted: rgba(232, 116, 107, 0.12);
  --brand-coral-border: rgba(232, 116, 107, 0.3);
}

/* ─── NAVBAR SCROLL STATE ────────────────────────────────────────────────── */
.navbar-scrolled {
  background-color: var(--theme-nav-solid) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 3: Verify the app still starts**

```bash
cd /Users/mihaialbert/Projects/little-club-friends
npm run dev
```

Expected: server starts on http://localhost:3000 with no CSS errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: extend theme CSS variables for dark Bold & Adventurous design"
```

---

### Task 2: Add SectionPhoto model to Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add the SectionPhoto model**

Open `prisma/schema.prisma`. After the `GalleryPhoto` model block, add:

```prisma
// ─── SECTION PHOTOS ───────────────────────────────────────────────────────
// Per-section photo overrides. When present, used instead of static fallback.
// sectionKey values: "home.hero_bg" | "home.about_strip" |
//   "instructors.hero_bg" | "instructors.action" |
//   "about.hero_bg" | "about.story"

model SectionPhoto {
  id         String   @id @default(cuid())
  sectionKey String   @unique
  url        String
  publicId   String
  alt        String   @default("")
  updatedAt  DateTime @updatedAt
}
```

- [ ] **Step 2: Push schema to DB**

```bash
cd /Users/mihaialbert/Projects/little-club-friends
npx prisma db push
```

Expected output includes: `Your database is now in sync with your Prisma schema.`

- [ ] **Step 3: Regenerate Prisma client**

```bash
npx prisma generate
```

Expected: `✔ Generated Prisma Client` with no errors.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add SectionPhoto model for per-section admin photo overrides"
```

---

### Task 3: Create lib/content.ts with getPageContent and getSectionPhoto

**Files:**
- Create: `lib/content.ts`

The fallback images below are static paths under `public/` served by Next.js. The DB record, when present, takes precedence.

- [ ] **Step 1: Create the file**

Create `lib/content.ts` with the following content:

```typescript
import { db } from '@/lib/db'

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

import { Season } from '@prisma/client'

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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/mihaialbert/Projects/little-club-friends
npx tsc --noEmit
```

Expected: no errors. If `sectionPhoto` is flagged as unknown on `db`, run `npx prisma generate` first.

- [ ] **Step 3: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add getPageContent, getSectionPhoto, getGalleryPhotos helpers with static fallbacks"
```

---

**Plan 1 complete.** Foundation is in place. Proceed to Plan 2 (public site redesign).
