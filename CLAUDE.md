# Little Club Friends — Project Guide

## Business Context

**Brand:** Little Club Friends (previously Little Ski Friends)
**Legal entity:** SC Manuitii SRL
**Location:** Poiana Brașov, Brașov, Romania
**Email:** littleskifriends@yahoo.com
**Phone:** 0770675375
**Website (current):** https://littleskifriends.ro/

Children's outdoor activities school. Expanding from winter-only to year-round.

### Activities

**Winter:** Skiing (beginners to advanced), Snowboarding
**Summer:** Mountain biking, Mountain hiking/walking, Paddleboard

### Pages (from original site)
Home, Activities (seasonal), Instructors, Gallery, About, Booking/Inquiry, Contact, Privacy Policy, Terms

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ App Router, TypeScript strict |
| Database | Neon (serverless PostgreSQL) + Prisma ORM |
| Auth | NextAuth.js v5 — Credentials provider (admin only) |
| Styling | Tailwind CSS + shadcn/ui + CSS variables for dual-theme |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| i18n | next-intl (Romanian default `/ro`, English secondary `/en`) |
| Email | Resend + React Email templates |
| Images | Cloudinary (upload + transform) + next/image |
| Deployment | Vercel |

---

## Key Features

### Dual Theme System (Winter / Summer)
- Owner toggles via admin dashboard → stored in `SiteSettings.activeTheme` in DB
- Triggers `revalidatePath('/')` for instant public reflection
- `<html data-theme="winter|summer">` — CSS variables switch the entire visual identity
- Winter: deep blues + icy whites | Summer: forest green + golden yellow
- Activity ordering on all pages follows the active theme (season-matched activities first)

### Booking / Inquiry Form (public, no payment)
Fields: parent name, email, phone, number of children, children ages, desired activity, preferred date(s), notes
→ Saves to DB + emails owner (littleskifriends@yahoo.com) + sends confirmation to parent

### Admin Dashboard (`/admin`, protected)
- Login: email + bcrypt password (seeded via `prisma/seed.ts`)
- Sections: Activities CRUD, Bookings (view + status), Instructors CRUD, Gallery, Page content editor, Settings (theme toggle)

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env.local

# 3. Push schema to Neon DB
npx prisma db push

# 4. Seed initial admin user + default settings
npx prisma db seed

# 5. Start dev server
npm run dev
```

### Required Environment Variables (see .env.example)

```
DATABASE_URL=            # Neon PostgreSQL connection string
NEXTAUTH_SECRET=         # Random 32+ char string
NEXTAUTH_URL=            # http://localhost:3000 in dev
ADMIN_EMAIL=             # Initial admin email (used by seed)
ADMIN_PASSWORD=          # Initial admin password (used by seed)
RESEND_API_KEY=          # From resend.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=     # http://localhost:3000 in dev
```

---

## Project Structure

```
app/[locale]/            # next-intl locale wrapper (ro | en)
  (public)/              # Navbar + Footer layout — public pages
  (admin)/               # Sidebar layout — protected admin pages
  auth/                  # Login page
  api/                   # Route Handlers
messages/
  ro.json                # Romanian UI strings
  en.json                # English UI strings
components/
  ui/                    # Primitive components (shadcn/ui + custom)
  features/              # Feature-specific components
  emails/                # React Email templates
lib/
  db.ts                  # Prisma singleton
  auth.ts                # NextAuth v5 config
  validations.ts         # Zod schemas
  email.ts               # Resend helpers
  cloudinary.ts          # Image upload helpers
  theme.ts               # getActiveTheme(), sort helpers
  utils.ts               # cn(), slugify(), formatDate()
hooks/                   # Client-side hooks
types/index.ts           # Shared TypeScript types
prisma/
  schema.prisma          # All DB models
  seed.ts                # Initial data (admin user, default settings)
```

---

## Agents & Skills (project-scoped, in `.claude/`)

### Agents (`.claude/agents/`)

| Agent | When to use |
|-------|------------|
| `web-scraper` | Scraping / crawling websites to extract content, assets, colors, fonts |
| `nextjs-developer` | Building or modifying any part of the Next.js app (frontend + backend) |
| `security-auditor` | Auditing the codebase for security vulnerabilities; run before any release |

Invoke by saying: *"use the nextjs-developer agent to..."* or *"run the security-auditor agent on..."*

### Skills (`.claude/skills/`)

| Skill | Invoke with | Purpose |
|-------|-------------|---------|
| `nextjs-best-practices` | `/nextjs-best-practices` | File structure, naming, Server vs Client components, data fetching, TypeScript, testing standards |

---

## Development Rules

- Follow the `/nextjs-best-practices` skill for all code
- Server Components by default — `'use client'` only when strictly needed
- All API routes validate input with Zod before touching the DB
- Never put secrets in `NEXT_PUBLIC_` variables
- All images go through `next/image` — no raw `<img>` tags for content
- Run `security-auditor` agent before any production deployment
- Admin routes protected by both `middleware.ts` and a server-side `auth()` check in `(admin)/layout.tsx`

---

## Activity Ordering Logic

When `activeTheme = WINTER`:
1. Winter-only activities first
2. Both-season activities second
3. Summer-only activities last

When `activeTheme = SUMMER`:
1. Summer-only activities first
2. Both-season activities second
3. Winter-only activities last

Implemented via Prisma `$queryRaw` with `CASE WHEN` ordering — not client-side sort.

---

## i18n Notes

- Default locale: Romanian (`ro`) — all routes start with `/ro/...`
- English: `/en/...`
- Translation files: `messages/ro.json` + `messages/en.json` for static UI strings
- DB `PageContent` stores bilingual content: keys follow `page.field.locale` pattern (e.g., `home.hero_title.ro`)
- Navbar includes a language switcher (RO / EN)

---

## Logo

The owner provides the logo file. Place it at `public/logo.png` (or `public/logo.svg`).
Used in Navbar and Footer via `next/image`. Adapts colors to active theme via CSS filter or theme-aware variants.
