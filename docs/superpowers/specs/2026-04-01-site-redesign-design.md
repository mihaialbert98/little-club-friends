# Little Club Friends — Full Site Redesign Spec

**Date:** 2026-04-01  
**Status:** Approved  

---

## Context

The current site (littleskifriends.ro) is a basic WordPress/Elementor site that looks generic and unpolished. The brand is evolving from "Little Ski Friends" (winter-only) to "Little Club Friends" (year-round: ski, snowboard, biking, hiking, paddleboard). The goal is a professional, distinctive Next.js site that makes parents trust the school and book confidently. 59 real photos have been scraped from the original site and are available at `public/scraped/`.

---

## Design Direction: Bold & Adventurous

Dark background (`#0a0f1e` base), strong uppercase typography, coral red (`#E8746B`) as the fixed accent colour across both themes. Inspired by premium outdoor/adventure brands — confident, energetic, trustworthy.

**The one constant:** coral `#E8746B` never changes between themes. It is the brand colour.

---

## Dual Theme System

The admin toggles Winter/Summer from the dashboard. This changes `data-theme` on `<html>`, which flips all CSS variables instantly via `revalidatePath`. The coral accent stays fixed.

| Token | Winter | Summer |
|---|---|---|
| `--theme-primary` | `#0d2b4e` (deep blue) | `#1a4731` (forest green) |
| `--theme-primary-mid` | `#1a5276` | `#2e7d5a` |
| `--theme-primary-light` | `#2e86c1` | `#6dbb8a` |
| `--theme-hero-bg` | `linear-gradient(170deg, #060c18, #0d2448, #0a1f3d)` | `linear-gradient(170deg, #060e08, #0d2418, #0a1f10)` |
| `--theme-card-tint` | `rgba(13,43,78,0.8)` | `rgba(26,71,49,0.8)` |
| `--theme-badge-color` | `#7ec8e3` | `#90ee90` |
| `--theme-season-label` | `❄️ Winter Season` | `☀️ Summer Season` |
| `--theme-season-icon` | `❄️` | `☀️` |

---

## Typography

- **Headings:** Nunito, weight 900, uppercase, tight letter-spacing (`-0.5px` to `-1px`)
- **Body:** Nunito Sans, weight 400–600
- **Labels/badges:** 9–10px, `letter-spacing: 2px`, `text-transform: uppercase`
- **Accent label pattern:** coral colour, small caps, above every major heading

---

## Global Layout Patterns

- Max content width: `1280px`, centered, `px-6 lg:px-8`
- Section padding: `py-20 lg:py-28`
- Dark sections: `bg-[#0a0f1e]` or `bg-[#070c16]`
- Light break sections: `bg-white` or `bg-gray-50` (used sparingly for contrast)

---

## Navbar

**Style:** Transparent over hero, transitions to solid dark (`bg-[#0a0f1e]/95 backdrop-blur`) on scroll.

**Left:** Logo PNG (`public/logo.png`) — `height: 42px`, `border-radius: 6px`, `box-shadow: 0 2px 16px rgba(0,0,0,0.4)`. Logo only, no wordmark beside it (the name is in the logo).

**Right nav links:** `Activities · Instructors · Gallery · About · Contact` — `text-[10px] tracking-[1.5px] uppercase text-white/70 hover:text-white`

**CTA button:** `BOOK NOW` — solid coral `bg-[#E8746B]`, `text-white`, `text-[9px] tracking-[1.5px] uppercase font-bold px-4 py-2 rounded-sm`

**Language switcher:** `RO / EN` — `text-[9px] border border-white/20 px-2 py-1 rounded-sm text-white/50`

**Mobile:** Hamburger → full-screen dark overlay menu with same links + coral Book Now button.

---

## Home Page

### 1. Hero Section (`HeroSection.tsx`)

Full viewport height (`min-h-screen`). Background: `--theme-hero-bg` gradient (shifts with theme). Real photo (`public/scraped/home/f8a62b65-*.webp`) as a background layer with `opacity-20` dark overlay — adds depth without obscuring text.

**Layout:** Centered content column.

```
[season badge]          ← coral border, theme icon + "Winter Season · Poiana Brașov"
[H1 headline]           ← "WHERE KIDS" / "CONQUER" (coral) / "MOUNTAINS"
[subtitle]              ← "Professional outdoor instruction for children 4–14"
[activity pills row]    ← ⛷️ Skiing  🏂 Snowboard  🚵 Biking  🥾 Hiking  🏄 Paddle
[CTA buttons]           ← BOOK ADVENTURE (coral filled) + DISCOVER ↓ (outline)
```

**Season badge:** changes icon and label with theme. Coral border + background `rgba(232,116,107,0.12)`.

**Activity pills:** show all 5 activities. In winter theme, skiing/snowboard pills have blue tint border; biking/hiking/paddle have green tint. In summer theme, reversed. Clicking a pill scrolls to activities section.

**Wave/diagonal divider** at bottom to transition into activities section.

**Animations:** `animate-fade-in-up` with staggered delays (existing utility classes).

---

### 2. Activities Section (`FeaturedActivities.tsx`)

Dark background continuing from hero (`bg-[#070c16]`). Full-width horizontal activity rows (Option C from brainstorming).

**Section header:**
```
WHAT WE OFFER          ← coral label
OUR ACTIVITIES         ← white H2, uppercase bold
```

Each activity row:
- Full-width, dark card: `bg-[--theme-card-tint]/40 border border-white/8`
- Left: emoji icon + activity name (white bold uppercase) + age/duration/price (muted)
- Right: season badge (blue for winter, green for summer, both for year-round) + coral `→` arrow
- Hover: `border-[#E8746B]/30 bg-[#E8746B]/5` — subtle coral glow
- Click: navigates to `/activities`

**Season-aware ordering:** Winter activities listed first in winter theme, summer first in summer theme (matches existing DB ordering logic via Prisma `$queryRaw`).

**"View all activities →"** link in top-right of section header.

---

### 3. About / Trust Strip (`AboutTeaser.tsx`)

Dark section. Two-column grid: `grid-cols-1 lg:grid-cols-2`.

**Left column — image:**  
`public/scraped/api-media/IMG_1787-scaled.webp` (instructor high-fiving unicorn-suit child).  
Image in a styled frame: slight rotation (`rotate-1`), coral border accent `border-2 border-[#E8746B]/30`, `rounded-sm overflow-hidden`. Stat overlay badges absolute-positioned on the image:
- `500+ Kids trained`
- `10+ Years experience`
- `5 Activities`

**Right column — text:**
```
WHY CHOOSE US          ← coral label
Trusted by hundreds    ← H2 white bold uppercase
of families            
```
3–4 value propositions as rows: icon + title + one-line description.
- ✓ Certified instructors
- ✓ Ages 4–14, all levels
- ✓ Poiana Brașov, year-round
- ✓ Personal attention, small groups

CTA: `MEET OUR TEAM →` outline coral button → `/instructors`

---

### 4. Gallery Teaser (`GalleryTeaser.tsx`)

Dark section. Masonry-style grid of 6 photos pulled from `public/scraped/` — filtered by active theme (winter photos when winter, summer when summer, plus instructor/both-season shots always).

**Featured images (winter):**
1. `scraped/home/f8a62b65-*.webp` — two girls on slope
2. `scraped/api-media/IMG_1633-scaled.webp` — tiny girl huge smile
3. `scraped/galerie-foto/IMG_1907-scaled.webp` — diploma ceremony
4. `scraped/galerie-foto/IMG_3611-scaled.jpeg` — boy skiing
5. `scraped/api-media/IMG_1892-scaled.webp` — instructor + 3 girls
6. `scraped/api-media/IMG_1680-scaled.webp` — girl in pink gear

**Featured images (summer):**
1. `scraped/scoala-de-vara/IMG_6555-scaled.jpg` — hiking group
2. `scraped/scoala-de-vara/IMG_6700-scaled.jpg` — adventure course
3. `scraped/api-media/IMG_8818-scaled.jpg` — boy hiking
4. `scraped/api-media/IMG_8819-1-scaled.jpg` — girl in forest
5. `scraped/api-media/IMG_9489-scaled.jpg` — siblings in forest
6. `scraped/scoala-de-vara/146870B7-*.jpg` — arts activity

Grid layout: first image spans 2 rows (tall), rest fill a 3-column grid. Hover: `scale-105` + coral overlay `opacity-0 hover:opacity-100`.

**"See all photos →"** link → `/gallery`

---

### 5. CTA Section (`CTASection.tsx`)

Full-width. Background: `--theme-hero-bg` gradient (matches hero, bookends the page).

```
READY FOR AN ADVENTURE?    ← H2 white uppercase
Book a lesson today...     ← subtitle muted
[BOOK NOW]                 ← large coral button
```

---

### 6. Footer (`Footer.tsx`)

Dark (`bg-[#060c12]`). 3-column grid:

**Col 1 — Brand:** Logo PNG (white drop shadow) + tagline "Adventures for children in the heart of the mountains" + social links (if any).

**Col 2 — Quick Links:** Activities, Instructors, Gallery, About, Contact, Booking

**Col 3 — Contact:**  
📍 Poiana Brașov, Brașov, Romania  
📞 0770 675 375  
✉️ littleskifriends@yahoo.com

**Bottom bar:** copyright + Privacy Policy + Terms — `text-white/30 text-xs`

**Top border:** `border-t border-white/8`

---

## Activities Page (`/activities`)

Hero header (dark, no full-height): page title + subtitle. Theme-coloured gradient strip.

Activity grid: same horizontal row cards as homepage, but showing all activities with full descriptions, duration, age range, price. Season filter tabs: `All · Winter · Summer`.

Each card expands or links to a detail view.

**Images used:**
- Skiing: `scraped/cursuri/IMG_2460-scaled.jpeg`
- Snowboard: `scraped/galerie-foto/IMG_3611-scaled.jpeg`
- Group lesson: `scraped/api-media/IMG_1892-scaled.webp`
- Private lesson: `scraped/api-media/35FACBBF-*.webp`
- Hiking: `scraped/scoala-de-vara/IMG_6555-scaled.jpg`
- Adventure: `scraped/scoala-de-vara/IMG_6700-scaled.jpg`

---

## Instructors Page (`/instructors`)

Dark hero header.

Instructor cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Each card:
- Photo (square, `object-cover`, coral border accent on hover)
- Name (white bold)
- Bio (muted)
- Certifications as small badges

**Team photo** (`scraped/instructori/IMG_1392-scaled-*.jpg`) used as the page hero background with dark overlay.

**Instructor action photos** scattered as section breaks:
- `scraped/home/IMG_1790-scaled.jpeg` — gondola warmth shot
- `scraped/api-media/IMG_1787-scaled.webp` — high-five

---

## Gallery Page (`/gallery`)

Dark background. Masonry grid (`columns-2 md:columns-3 lg:columns-4`). All scraped photos displayed. Season filter: `All · Winter · Summer` — filters by photo season tag.

Lightbox on click (use a lightweight library or CSS-only approach).

Winter photos: all `scraped/galerie-foto/` + winter `scraped/api-media/` shots.  
Summer photos: all `scraped/scoala-de-vara/` + summer `scraped/api-media/` shots.

---

## About Page (`/about`)

**Hero:** `scraped/despre-noi/149d3d6f-*.webp` (two instructors hugging) as full-width background with overlay.

**Sections:**
1. Our Story — text + `scraped/despre-noi/IMG_3878-scaled.jpeg` (child learning to ski)
2. Our Values — 4 cards: Safety, Professionalism, Passion, Inclusion
3. Meet the Team CTA → `/instructors`

---

## Booking Page (`/booking`)

Dark background. Single-column centered form (`max-w-2xl`).

Form fields (existing Zod/RHF schema unchanged):
- Parent name + Email (2-col)
- Phone + Number of children (2-col)
- Children ages
- Activity (dropdown)
- Preferred dates
- Notes

**Styling:** Dark card `bg-white/5 border border-white/10 rounded-sm`. Input fields: `bg-white/8 border-white/15 text-white placeholder:text-white/30`. Focus: `border-[#E8746B]`. Submit button: solid coral.

Success state: coral checkmark + thank you message.

---

## Contact Page (`/contact`)

Two-column layout.

**Left:** Contact details (address, phone, email with icons) + Google Maps iframe (dark-styled or standard).

**Right:** Dark card with "Want to book?" heading + coral Book Now button → `/booking`.

---

## CSS Architecture

All theme variables in `globals.css` under `[data-theme="winter"]` and `[data-theme="summer"]` selectors. The existing variable structure is extended — no new utility classes needed beyond what's already defined.

Key additions needed:
```css
[data-theme="winter"] {
  --theme-hero-gradient: linear-gradient(170deg, #060c18 0%, #0d2448 50%, #0a1f3d 100%);
  --theme-card-tint: rgba(13, 43, 78, 0.8);
  --theme-badge-color: #7ec8e3;
  --theme-badge-bg: rgba(13, 43, 78, 0.8);
  --theme-season-emoji: "❄️";
}
[data-theme="summer"] {
  --theme-hero-gradient: linear-gradient(170deg, #060e08 0%, #0d2418 50%, #0a1f10 100%);
  --theme-card-tint: rgba(26, 71, 49, 0.8);
  --theme-badge-color: #90ee90;
  --theme-badge-bg: rgba(26, 71, 49, 0.8);
  --theme-season-emoji: "☀️";
}
```

Coral is **never** in a theme variable — always hardcoded as `#E8746B` or `text-[#E8746B]`.

---

## Image Strategy

Scraped images in `public/scraped/` serve as the **default/fallback** images for each section. When the admin uploads a replacement via Cloudinary, the DB record takes precedence. If no DB record exists, the scraped static file is used.

**No `<img>` tags** — all images use `next/image` for optimisation.

---

## Admin CMS — Content Management

The admin dashboard (`/admin`) gains two new capabilities: **section photo management** and **page text editing**. These sit alongside the existing Activities, Instructors, Bookings, and Settings sections.

### Editable Text (`PageContent` model — already in schema)

The existing `PageContent` model stores bilingual content as `page.key.locale` keys. The admin gets a simple page content editor UI for the following keys:

| Page | Keys (bilingual ro+en each) |
|---|---|
| `home` | `hero_title`, `hero_subtitle`, `about_title`, `about_subtitle`, `about_body`, `cta_title`, `cta_subtitle` |
| `about` | `hero_title`, `story_title`, `story_body`, `values_title` |
| `instructors` | `hero_title`, `hero_subtitle` |
| `gallery` | `hero_title`, `hero_subtitle` |
| `activities` | `hero_title`, `hero_subtitle` |
| `booking` | `hero_title`, `hero_subtitle` |
| `contact` | `hero_title`, `hero_subtitle` |

**Admin UI:** `/admin/content` — lists pages as tabs. Each page shows a list of text fields with RO/EN inputs side by side. Save button calls `PUT /api/admin/content` which upserts `PageContent` rows. After save: `revalidatePath` for the affected page.

**Public pages:** fetch content via `getPageContent(page, locale)` helper in `lib/content.ts` — falls back to hardcoded default strings if no DB record exists.

---

### Section Photo Management (`SectionPhoto` model — new)

A new `SectionPhoto` model stores per-section photo overrides. Each section has a stable `sectionKey` string. The admin can upload a photo for a section; the public page uses it instead of the scraped fallback.

**New Prisma model:**
```prisma
model SectionPhoto {
  id        String   @id @default(cuid())
  sectionKey String  @unique  // e.g. "home.hero_bg", "home.about_strip", "about.hero_bg"
  url       String
  publicId  String            // Cloudinary public ID for deletion
  alt       String  @default("")
  updatedAt DateTime @updatedAt
}
```

**Section keys and their fallback images:**

| `sectionKey` | Section | Fallback |
|---|---|---|
| `home.hero_bg` | Home hero background photo | `scraped/home/f8a62b65-*.webp` |
| `home.about_strip` | About teaser left-column image | `scraped/api-media/IMG_1787-scaled.webp` |
| `instructors.hero_bg` | Instructors page hero background | `scraped/instructori/IMG_1392-scaled-*.jpg` |
| `instructors.action` | Instructors page action photo | `scraped/home/IMG_1790-scaled.jpeg` |
| `about.hero_bg` | About page hero background | `scraped/despre-noi/149d3d6f-*.webp` |
| `about.story` | About page story section photo | `scraped/despre-noi/IMG_3878-scaled.jpeg` |

**Admin UI:** `/admin/photos` — grid of section cards. Each card shows:
- Section name + current photo (DB or fallback)
- Upload button → Cloudinary upload → saves to `SectionPhoto` via `POST /api/admin/section-photos`
- Delete/revert button → deletes Cloudinary asset + DB record → falls back to scraped image

**Public pages:** fetch via `getSectionPhoto(sectionKey)` helper in `lib/content.ts`. Returns `{ url, alt }` — either from DB or the hardcoded fallback path.

---

### Gallery Management (existing `GalleryPhoto` model)

The `GalleryPhoto` model already exists. The admin gallery section (`/admin/gallery`) allows:
- **Upload new photos** via Cloudinary → stored in `GalleryPhoto` with `season` tag (WINTER / SUMMER / null for both)
- **Delete photos** → removes from Cloudinary + DB
- **Reorder** via `sortOrder`
- **Season tag** — determines which theme filter shows the photo

**Public gallery page:** queries `GalleryPhoto` from DB first (ordered by `sortOrder`). If DB gallery is empty, falls back to serving the scraped photos from `public/scraped/` as a static list. Once the admin uploads even one photo, DB takes over completely.

**Homepage GalleryTeaser:** shows the 6 most recently added/sorted gallery photos matching the active theme. Queries `GalleryPhoto` where `season = activeTheme OR season = null`, ordered by `sortOrder`, limit 6. Falls back to static scraped set if DB is empty.

---

## Pages to Create/Modify

| File | Action |
|---|---|
| `prisma/schema.prisma` | Add `SectionPhoto` model |
| `app/globals.css` | Extend theme variables, add new tokens |
| `lib/content.ts` | New — `getPageContent()`, `getSectionPhoto()` helpers |
| `components/features/layout/Navbar.tsx` | Full rewrite — transparent/scroll behavior, logo-only |
| `components/features/layout/Footer.tsx` | Redesign — dark, 3-col, styled |
| `components/features/home/HeroSection.tsx` | Redesign — cinematic, season badge, activity pills, bg photo from `getSectionPhoto` |
| `components/features/home/FeaturedActivities.tsx` | Redesign — horizontal row cards |
| `components/features/home/AboutTeaser.tsx` | Redesign — 2-col with image from `getSectionPhoto`, text from `getPageContent` |
| `components/features/home/GalleryTeaser.tsx` | New — 6-photo grid, queries `GalleryPhoto` DB with static fallback |
| `components/features/home/CTASection.tsx` | Redesign — text from `getPageContent` |
| `app/[locale]/(public)/page.tsx` | Add GalleryTeaser, wire `getPageContent` for hero/about/cta text |
| `app/[locale]/(public)/activities/page.tsx` | Redesign + text from `getPageContent` |
| `app/[locale]/(public)/booking/page.tsx` | Restyle form to dark theme |
| `app/[locale]/(public)/contact/page.tsx` | Restyle to dark theme |
| `app/[locale]/(public)/about/page.tsx` | Create — text + photos from DB with fallbacks |
| `app/[locale]/(public)/instructors/page.tsx` | Create — text from DB, photos from DB |
| `app/[locale]/(public)/gallery/page.tsx` | Create — queries `GalleryPhoto` with static fallback |
| `app/api/admin/content/route.ts` | New — GET/PUT page content |
| `app/api/admin/section-photos/route.ts` | New — POST/DELETE section photo overrides |
| `app/[locale]/(admin)/content/page.tsx` | New admin page — bilingual text editor |
| `app/[locale]/(admin)/photos/page.tsx` | New admin page — section photo upload/replace/revert |
| `app/[locale]/(admin)/gallery/page.tsx` | New admin page — gallery photo upload/delete/reorder/season-tag |

---

## Verification

1. `npm run dev` — check all pages render without errors
2. Toggle Winter ↔ Summer from admin dashboard (`/admin/settings`) — verify entire site colour identity switches: hero gradient, nav scroll color, card tints, season badge, activity pill borders
3. Coral `#E8746B` remains identical in both themes on all CTAs and accents
4. Navbar: transparent on hero load → solid dark on scroll
5. Logo (`public/logo.png`) visible in navbar with drop shadow, no white box
6. All `next/image` images load correctly from `public/scraped/` as fallbacks
7. Booking form submits → DB entry created + email sent
8. Mobile responsive: check navbar hamburger, stacked cards, form
9. Bilingual: switch RO ↔ EN, verify all translated strings render
10. **Admin content editor:** edit hero title in `/admin/content` → save → visit homepage → text updated
11. **Admin section photos:** upload a photo for `home.about_strip` → visit homepage → new photo shown instead of scraped fallback
12. **Admin gallery:** upload a photo tagged WINTER → visit `/gallery` → photo appears; tag it SUMMER → appears under summer filter
13. **Gallery fallback:** with empty `GalleryPhoto` table, `/gallery` still shows scraped photos
14. `npx prisma db push` with new `SectionPhoto` model applies without errors
