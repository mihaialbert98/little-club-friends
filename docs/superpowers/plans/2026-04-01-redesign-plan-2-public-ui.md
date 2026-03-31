# Site Redesign — Plan 2: Public UI

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every public-facing page and component to the Bold & Adventurous dark design with full winter/summer dual-theme support, transparent-to-solid navbar, cinematic hero, and all 59 scraped photos placed correctly.

**Architecture:** All components are Server Components by default. The `useTheme()` hook (client) is used only where runtime theme-reactive behaviour is needed (activity pill borders). Everything else reads theme via CSS variables on `data-theme`. Text comes from `getPageContent()` with hardcoded fallbacks. Photos come from `getSectionPhoto()` / `getGalleryPhotos()` from Plan 1's `lib/content.ts`.

**Tech Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS v4, Framer Motion (existing), next/image, next-intl, Prisma via `lib/content.ts`.

**Prerequisite:** Plan 1 must be complete (`lib/content.ts` exists, new CSS vars in `globals.css`).

---

## File Map

| File | Change |
|---|---|
| `components/features/layout/Navbar.tsx` | Full rewrite — transparent/scroll, logo-only |
| `components/features/layout/Footer.tsx` | Redesign — dark 3-col |
| `components/features/home/HeroSection.tsx` | Redesign — cinematic centered |
| `components/features/home/FeaturedActivities.tsx` | Redesign — horizontal rows |
| `components/features/home/AboutTeaser.tsx` | Redesign — 2-col image+text |
| `components/features/home/GalleryTeaser.tsx` | New component |
| `components/features/home/CTASection.tsx` | Redesign |
| `app/[locale]/(public)/page.tsx` | Wire new components + GalleryTeaser |
| `app/[locale]/(public)/activities/page.tsx` | Redesign |
| `app/[locale]/(public)/booking/page.tsx` | Restyle dark |
| `app/[locale]/(public)/contact/page.tsx` | Restyle dark |
| `app/[locale]/(public)/about/page.tsx` | Create |
| `app/[locale]/(public)/instructors/page.tsx` | Create |
| `app/[locale]/(public)/gallery/page.tsx` | Create |

---

### Task 1: Navbar — transparent/scroll + logo-only

**Files:**
- Modify: `components/features/layout/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar.tsx**

Replace the entire file with:

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}/activities`, label: t('activities') },
    { href: `/${locale}/instructors`, label: t('instructors') },
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-scrolled' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={48}
              height={48}
              className="h-10 w-auto lg:h-12 rounded-md"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] tracking-[1.5px] uppercase font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              className="text-[9px] tracking-[1.5px] uppercase font-bold px-4 py-2 rounded-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-coral)' }}
            >
              {t('book_now')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0f1e]">
          <div className="flex items-center justify-between px-6 h-16">
            <Image src="/logo.png" alt="Little Club Friends" width={44} height={44} className="h-10 w-auto rounded-md" />
            <button className="text-white/80 hover:text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 pt-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-black uppercase tracking-wider text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/booking`}
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-block text-center text-sm tracking-[1.5px] uppercase font-bold px-6 py-3 rounded-sm text-white"
              style={{ backgroundColor: 'var(--brand-coral)' }}
            >
              {t('book_now')}
            </Link>
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Add missing i18n keys**

Open `messages/en.json`. Ensure the `nav` object has these keys (add any missing):
```json
"nav": {
  "activities": "Activities",
  "instructors": "Instructors",
  "gallery": "Gallery",
  "about": "About",
  "contact": "Contact",
  "book_now": "Book Now",
  "admin": "Admin"
}
```

Open `messages/ro.json`. Ensure:
```json
"nav": {
  "activities": "Activități",
  "instructors": "Instructori",
  "gallery": "Galerie",
  "about": "Despre noi",
  "contact": "Contact",
  "book_now": "Rezervă",
  "admin": "Admin"
}
```

- [ ] **Step 3: Verify dev server — check navbar transparent on load, solid on scroll**

```bash
npm run dev
```

Visit http://localhost:3000/ro — navbar should be transparent on load. Scroll down — navbar should become dark/blurred. No TypeScript errors in terminal.

- [ ] **Step 4: Commit**

```bash
git add components/features/layout/Navbar.tsx messages/en.json messages/ro.json
git commit -m "feat: redesign navbar — transparent/scroll, logo-only, mobile overlay"
```

---

### Task 2: Footer

**Files:**
- Modify: `components/features/layout/Footer.tsx`

- [ ] **Step 1: Rewrite Footer.tsx**

Replace the entire file with:

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer style={{ backgroundColor: '#060c12' }} className="border-t border-white/8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-4">
          <Link href={`/${locale}`}>
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={56}
              height={56}
              className="h-14 w-auto rounded-md"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
            />
          </Link>
          <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
            {t('tagline')}
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-[10px] tracking-[2px] uppercase font-bold text-white/30 mb-4">
            {t('quick_links')}
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { href: `/${locale}/activities`, label: nav('activities') },
              { href: `/${locale}/instructors`, label: nav('instructors') },
              { href: `/${locale}/gallery`, label: nav('gallery') },
              { href: `/${locale}/about`, label: nav('about') },
              { href: `/${locale}/contact`, label: nav('contact') },
              { href: `/${locale}/booking`, label: nav('book_now') },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <h4 className="text-[10px] tracking-[2px] uppercase font-bold text-white/30 mb-4">
            {t('contact')}
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3 text-white/50 text-sm">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <span>Poiana Brașov, Brașov, Romania</span>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Phone size={14} className="flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <a href="tel:0770675375" className="hover:text-white transition-colors">0770 675 375</a>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Mail size={14} className="flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <a href="mailto:littleskifriends@yahoo.com" className="hover:text-white transition-colors">
                littleskifriends@yahoo.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 px-6 lg:px-8 py-4 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Little Club Friends · SC Manuitii SRL
        </p>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`} className="text-white/25 hover:text-white/50 text-xs transition-colors">
            {t('privacy')}
          </Link>
          <Link href={`/${locale}/terms`} className="text-white/25 hover:text-white/50 text-xs transition-colors">
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Add footer i18n keys**

In `messages/en.json`, ensure `footer` has:
```json
"footer": {
  "tagline": "Adventures for children in the heart of the mountains",
  "quick_links": "Quick Links",
  "contact": "Contact",
  "privacy": "Privacy Policy",
  "terms": "Terms"
}
```

In `messages/ro.json`:
```json
"footer": {
  "tagline": "Aventuri pentru copii în inima munților",
  "quick_links": "Link-uri rapide",
  "contact": "Contact",
  "privacy": "Politică de confidențialitate",
  "terms": "Termeni"
}
```

- [ ] **Step 3: Commit**

```bash
git add components/features/layout/Footer.tsx messages/en.json messages/ro.json
git commit -m "feat: redesign footer — dark 3-col with contact and quick links"
```

---

### Task 3: HeroSection

**Files:**
- Modify: `components/features/home/HeroSection.tsx`

- [ ] **Step 1: Rewrite HeroSection.tsx**

Replace the entire file with:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getActiveTheme } from '@/lib/theme'
import { getSectionPhoto } from '@/lib/content'
import { Theme } from '@prisma/client'

export default async function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [theme, heroBg] = await Promise.all([
    getActiveTheme(),
    getSectionPhoto('home.hero_bg'),
  ])

  const isWinter = theme === Theme.WINTER
  const seasonLabel = isWinter ? '❄️  Winter Season · Poiana Brașov' : '☀️  Summer Season · Poiana Brașov'

  const pills = isWinter
    ? [
        { emoji: '⛷️', label: 'Skiing', season: 'winter' },
        { emoji: '🏂', label: 'Snowboard', season: 'winter' },
        { emoji: '🚵', label: 'Biking', season: 'summer' },
        { emoji: '🥾', label: 'Hiking', season: 'summer' },
        { emoji: '🏄', label: 'Paddle', season: 'summer' },
      ]
    : [
        { emoji: '🚵', label: 'Biking', season: 'summer' },
        { emoji: '🥾', label: 'Hiking', season: 'summer' },
        { emoji: '🏄', label: 'Paddle', season: 'summer' },
        { emoji: '⛷️', label: 'Skiing', season: 'winter' },
        { emoji: '🏂', label: 'Snowboard', season: 'winter' },
      ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--theme-hero-gradient)' }}
      />

      {/* Background photo overlay */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src={heroBg.url}
          alt={heroBg.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Diagonal light sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, rgba(232,116,107,0.04) 70%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-6">
        {/* Season badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] tracking-[2px] uppercase font-bold animate-fade-in-up"
          style={{
            border: '1px solid var(--brand-coral-border)',
            backgroundColor: 'var(--brand-coral-muted)',
            color: 'var(--brand-coral)',
          }}
        >
          {seasonLabel}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-white animate-fade-in-up animation-delay-200">
          {t('hero_line1')}<br />
          <span style={{ color: 'var(--brand-coral)' }}>{t('hero_line2')}</span><br />
          {t('hero_line3')}
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-sm sm:text-base max-w-md leading-relaxed animate-fade-in-up animation-delay-400">
          {t('hero_subtitle')}
        </p>

        {/* Activity pills */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up animation-delay-400">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] tracking-[1px] uppercase font-semibold text-white/60"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${pill.season === 'winter' ? 'rgba(126,200,227,0.2)' : 'rgba(144,238,144,0.2)'}`,
              }}
            >
              <span>{pill.emoji}</span>
              {pill.label}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-600">
          <Link
            href={`/${locale}/booking`}
            className="px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-coral)' }}
          >
            {t('hero_cta_primary')}
          </Link>
          <Link
            href={`/${locale}/activities`}
            className="px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white/70 rounded-sm border border-white/25 hover:text-white hover:border-white/50 transition-colors"
          >
            {t('hero_cta_secondary')} ↓
          </Link>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z" style={{ fill: 'var(--theme-dark-mid, #070c16)' }} />
        </svg>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add hero i18n keys**

In `messages/en.json`, add/update the `home` section:
```json
"home": {
  "hero_line1": "Where Kids",
  "hero_line2": "Conquer",
  "hero_line3": "Mountains",
  "hero_subtitle": "Professional outdoor instruction for children ages 4–14 in Poiana Brașov",
  "hero_cta_primary": "Book Adventure",
  "hero_cta_secondary": "Discover",
  "featured_title": "Our Activities",
  "featured_label": "What We Offer",
  "about_label": "Why Choose Us",
  "about_title": "Trusted by hundreds of families",
  "about_body": "For over 10 years, Little Club Friends has been shaping confident, happy children on the slopes and trails of Poiana Brașov. Certified instructors, personalised attention, and a genuine love for the mountains.",
  "about_cta": "Meet Our Team",
  "gallery_label": "Memories",
  "gallery_title": "See Our Adventures",
  "gallery_cta": "See All Photos",
  "cta_label": "Ready?",
  "cta_title": "Ready for an Adventure?",
  "cta_subtitle": "Book a lesson today and let your child discover the mountains.",
  "cta_button": "Book Now"
}
```

In `messages/ro.json`:
```json
"home": {
  "hero_line1": "Unde Copiii",
  "hero_line2": "Cuceresc",
  "hero_line3": "Munții",
  "hero_subtitle": "Instruire profesională în aer liber pentru copii de 4–14 ani în Poiana Brașov",
  "hero_cta_primary": "Rezervă Aventura",
  "hero_cta_secondary": "Descoperă",
  "featured_title": "Activitățile noastre",
  "featured_label": "Ce oferim",
  "about_label": "De ce noi",
  "about_title": "De încredere pentru sute de familii",
  "about_body": "De peste 10 ani, Little Club Friends formează copii fericiți și încrezători pe pârtiile și potecile din Poiana Brașov. Instructori certificați, atenție personalizată și o dragoste autentică pentru munte.",
  "about_cta": "Cunoaște echipa",
  "gallery_label": "Amintiri",
  "gallery_title": "Aventurile noastre",
  "gallery_cta": "Vezi toate pozele",
  "cta_label": "Pregătit?",
  "cta_title": "Gata de aventură?",
  "cta_subtitle": "Rezervă o lecție astăzi și lasă copilul tău să descopere munții.",
  "cta_button": "Rezervă acum"
}
```

- [ ] **Step 3: Commit**

```bash
git add components/features/home/HeroSection.tsx messages/en.json messages/ro.json
git commit -m "feat: redesign HeroSection — cinematic dark hero with season badge and activity pills"
```

---

### Task 4: FeaturedActivities — horizontal rows

**Files:**
- Modify: `components/features/home/FeaturedActivities.tsx`

- [ ] **Step 1: Rewrite FeaturedActivities.tsx**

Replace the entire file:

```tsx
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { db } from '@/lib/db'
import { getActiveTheme, getActivityOrderSQL } from '@/lib/theme'
import { Activity, ActivityTranslation, Season } from '@prisma/client'

type ActivityWithTranslation = Activity & { translations: ActivityTranslation[] }

const SEASON_EMOJIS: Record<string, string> = {
  skiing: '⛷️',
  snowboard: '🏂',
  biking: '🚵',
  hiking: '🥾',
  paddleboard: '🏄',
}

function getEmoji(slug: string): string {
  for (const [key, emoji] of Object.entries(SEASON_EMOJIS)) {
    if (slug.includes(key)) return emoji
  }
  return '🏔️'
}

export default async function FeaturedActivities() {
  const t = useTranslations('home')
  const locale = useLocale()
  const theme = await getActiveTheme()
  const orderSQL = getActivityOrderSQL(theme)

  const activities = await db.$queryRawUnsafe<ActivityWithTranslation[]>(`
    SELECT a.*, 
           json_agg(at.*) as translations
    FROM "Activity" a
    LEFT JOIN "ActivityTranslation" at ON at."activityId" = a.id
    WHERE a."isActive" = true
    GROUP BY a.id
    ORDER BY ${orderSQL}, a."sortOrder"
    LIMIT 6
  `)

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
              {t('featured_label')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t('featured_title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/activities`}
            className="hidden sm:block text-[10px] tracking-[1px] uppercase font-bold border border-white/15 px-4 py-2 rounded-sm text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Activity rows */}
        <div className="flex flex-col gap-2">
          {activities.map((activity) => {
            const translation = activity.translations.find(
              (tr) => tr.locale === locale
            ) ?? activity.translations[0]

            const isWinterActivity = activity.season === Season.WINTER
            const isSummerActivity = activity.season === Season.SUMMER
            const badgeColor = isWinterActivity
              ? { color: '#7ec8e3', bg: 'rgba(13,43,78,0.8)', border: 'rgba(126,200,227,0.3)' }
              : isSummerActivity
              ? { color: '#90ee90', bg: 'rgba(26,71,49,0.8)', border: 'rgba(144,238,144,0.3)' }
              : { color: 'var(--brand-coral)', bg: 'var(--brand-coral-muted)', border: 'var(--brand-coral-border)' }

            const seasonLabel = isWinterActivity ? 'Winter' : isSummerActivity ? 'Summer' : 'Year-round'

            return (
              <Link
                key={activity.id}
                href={`/${locale}/activities`}
                className="group flex items-center justify-between px-5 py-4 rounded-sm border border-white/6 transition-all duration-200 hover:border-[#E8746B]/25"
                style={{ backgroundColor: 'var(--theme-card-tint, rgba(255,255,255,0.03))' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getEmoji(activity.slug)}</span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-white">
                      {translation?.name ?? activity.slug}
                    </p>
                    <p className="text-xs text-white/35 mt-0.5">
                      Ages {activity.ageMin}–{activity.ageMax} · {activity.durationMin} min · From {Number(activity.priceFrom)} RON
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="hidden sm:inline-block text-[9px] tracking-[1px] uppercase font-bold px-2.5 py-1 rounded-sm border"
                    style={{ color: badgeColor.color, backgroundColor: badgeColor.bg, borderColor: badgeColor.border }}
                  >
                    {seasonLabel}
                  </span>
                  <span className="text-sm font-bold transition-transform group-hover:translate-x-1" style={{ color: 'var(--brand-coral)' }}>
                    →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/features/home/FeaturedActivities.tsx
git commit -m "feat: redesign FeaturedActivities — horizontal dark rows with season badges"
```

---

### Task 5: AboutTeaser

**Files:**
- Modify: `components/features/home/AboutTeaser.tsx`

- [ ] **Step 1: Rewrite AboutTeaser.tsx**

Replace the entire file:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSectionPhoto } from '@/lib/content'
import { CheckCircle } from 'lucide-react'

const STATS = [
  { value: '500+', label: 'Kids trained' },
  { value: '10+', label: 'Years experience' },
  { value: '5', label: 'Activities' },
]

const VALUES = [
  { icon: '🏅', title: 'Certified instructors', desc: 'All instructors are professionally certified and trained' },
  { icon: '👦', title: 'Ages 4–14, all levels', desc: 'From first-timers to advanced — we meet every child where they are' },
  { icon: '🏔️', title: 'Poiana Brașov, year-round', desc: 'The most beautiful mountain resort in Romania, every season' },
  { icon: '👐', title: 'Personal attention', desc: 'Small groups and private lessons for real progress' },
]

export default async function AboutTeaser() {
  const t = useTranslations('home')
  const locale = useLocale()
  const photo = await getSectionPhoto('home.about_strip')

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left: image with stat overlays */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-sm"
            style={{
              transform: 'rotate(1deg)',
              border: '2px solid rgba(232,116,107,0.2)',
            }}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              width={600}
              height={700}
              className="w-full object-cover"
              style={{ maxHeight: '520px' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Stat badges */}
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="absolute flex flex-col items-center justify-center px-4 py-2 rounded-sm"
              style={{
                backgroundColor: 'rgba(10,15,30,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                ...(i === 0 ? { top: '16px', right: '-16px' } : {}),
                ...(i === 1 ? { bottom: '60px', right: '-16px' } : {}),
                ...(i === 2 ? { bottom: '16px', left: '16px' } : {}),
              }}
            >
              <span className="text-xl font-black" style={{ color: 'var(--brand-coral)' }}>{stat.value}</span>
              <span className="text-[9px] tracking-[1px] uppercase text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Right: text */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] tracking-[2px] uppercase font-bold" style={{ color: 'var(--brand-coral)' }}>
            {t('about_label')}
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {t('about_title')}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            {t('about_body')}
          </p>

          <ul className="flex flex-col gap-4 mt-2">
            {VALUES.map((v) => (
              <li key={v.title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{v.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{v.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/instructors`}
            className="mt-2 self-start px-6 py-2.5 text-[10px] tracking-[1.5px] uppercase font-bold rounded-sm border transition-colors hover:text-white"
            style={{
              color: 'var(--brand-coral)',
              borderColor: 'var(--brand-coral-border)',
            }}
          >
            {t('about_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/features/home/AboutTeaser.tsx
git commit -m "feat: redesign AboutTeaser — 2-col with stat overlays and value props"
```

---

### Task 6: GalleryTeaser (new component)

**Files:**
- Create: `components/features/home/GalleryTeaser.tsx`

- [ ] **Step 1: Create GalleryTeaser.tsx**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme } from '@prisma/client'

export default async function GalleryTeaser() {
  const t = useTranslations('home')
  const locale = useLocale()
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos(
    theme === Theme.WINTER ? Theme.WINTER : Theme.SUMMER
  )
  const displayed = photos.slice(0, 6)

  if (displayed.length === 0) return null

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
              {t('gallery_label')}
            </p>
            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              {t('gallery_title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="hidden sm:block text-[10px] tracking-[1px] uppercase font-bold border border-white/15 px-4 py-2 rounded-sm text-white/50 hover:text-white hover:border-white/30 transition-colors"
          >
            {t('gallery_cta')} →
          </Link>
        </div>

        {/* Photo grid — first image tall, rest 2x3 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2" style={{ gridAutoRows: '200px' }}>
          {displayed.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-sm group ${i === 0 ? 'row-span-2' : ''}`}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Coral hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(232,116,107,0.15)' }}
              />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/gallery`}
            className="text-[10px] tracking-[1.5px] uppercase font-bold border border-white/15 px-6 py-2.5 rounded-sm text-white/50 hover:text-white transition-colors"
          >
            {t('gallery_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/features/home/GalleryTeaser.tsx
git commit -m "feat: add GalleryTeaser component — themed photo grid with DB+fallback"
```

---

### Task 7: CTASection

**Files:**
- Modify: `components/features/home/CTASection.tsx`

- [ ] **Step 1: Rewrite CTASection.tsx**

Replace the entire file:

```tsx
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function CTASection() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: 'var(--theme-hero-gradient)' }}
    >
      {/* Subtle coral sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(232,116,107,0.12) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        <p className="text-[10px] tracking-[2px] uppercase font-bold" style={{ color: 'var(--brand-coral)' }}>
          {t('cta_label')}
        </p>
        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          {t('cta_title')}
        </h2>
        <p className="text-white/50 text-sm max-w-md leading-relaxed">
          {t('cta_subtitle')}
        </p>
        <Link
          href={`/${locale}/booking`}
          className="mt-2 px-10 py-4 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-coral)' }}
        >
          {t('cta_button')}
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/features/home/CTASection.tsx
git commit -m "feat: redesign CTASection — theme gradient with coral radial glow"
```

---

### Task 8: Wire home page

**Files:**
- Modify: `app/[locale]/(public)/page.tsx`

- [ ] **Step 1: Read the current home page**

Read `app/[locale]/(public)/page.tsx` to see what's currently imported and rendered.

- [ ] **Step 2: Update home page to add GalleryTeaser**

The home page should render in this order: `HeroSection → FeaturedActivities → AboutTeaser → GalleryTeaser → CTASection`. Add the `GalleryTeaser` import and render it between `AboutTeaser` and `CTASection`. Example structure:

```tsx
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedActivities from '@/components/features/home/FeaturedActivities'
import AboutTeaser from '@/components/features/home/AboutTeaser'
import GalleryTeaser from '@/components/features/home/GalleryTeaser'
import CTASection from '@/components/features/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedActivities />
      <AboutTeaser />
      <GalleryTeaser />
      <CTASection />
    </>
  )
}
```

Keep any existing `generateMetadata` or `revalidate` exports unchanged.

- [ ] **Step 3: Verify the full homepage renders**

```bash
npm run dev
```

Visit http://localhost:3000/ro — check all sections render without errors. Check http://localhost:3000/en too.

- [ ] **Step 4: Commit**

```bash
git add app/\[locale\]/\(public\)/page.tsx
git commit -m "feat: wire GalleryTeaser into home page"
```

---

### Task 9: About page (new)

**Files:**
- Create: `app/[locale]/(public)/about/page.tsx`

- [ ] **Step 1: Create the About page**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { getSectionPhoto } from '@/lib/content'

export const revalidate = 60

const VALUES = [
  { icon: '🛡️', title: 'Safety first', desc: 'Every lesson starts with safety. Certified instructors, quality equipment, and constant attention to each child.' },
  { icon: '🏅', title: 'Professionalism', desc: 'Our instructors are nationally certified and continuously trained.' },
  { icon: '❤️', title: 'Passion', desc: 'We genuinely love the mountains and pass that love to every child.' },
  { icon: '🤝', title: 'Inclusion', desc: 'Every child is welcome, regardless of experience, age, or ability.' },
]

export default async function AboutPage() {
  const locale = useLocale()
  const [heroBg, storyPhoto] = await Promise.all([
    getSectionPhoto('about.hero_bg'),
    getSectionPhoto('about.story'),
  ])

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <Image src={heroBg.url} alt={heroBg.alt} fill className="object-cover object-top" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-black/50 to-transparent" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pb-12">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            Our Story
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            About Us
          </h1>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
              Our Journey
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-6">
              Born from a love of mountains
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Little Club Friends started as Little Ski Friends — a small winter ski school in Poiana Brașov run by two passionate instructors. Over the years, it grew into a year-round adventure school that has trained over 500 children.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Today we offer skiing, snowboarding, mountain biking, hiking, and paddleboarding — all taught by certified professionals who truly care about every child's progress and safety.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-sm" style={{ border: '2px solid rgba(232,116,107,0.15)' }}>
            <Image src={storyPhoto.url} alt={storyPhoto.alt} width={600} height={700} className="w-full object-cover" style={{ maxHeight: '460px' }} sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-3" style={{ color: 'var(--brand-coral)' }}>
            What drives us
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => (
              <div key={v.title} className="flex flex-col gap-3 p-6 rounded-sm border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <span className="text-3xl">{v.icon}</span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">{v.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the team CTA */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">
            Meet Our Instructors
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Dedicated, certified, and passionate about teaching children.
          </p>
          <Link
            href={`/${locale}/instructors`}
            className="inline-block px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-coral)' }}
          >
            Our Team →
          </Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(public)/about/page.tsx"
git commit -m "feat: create About page with hero, story, values, and team CTA"
```

---

### Task 10: Instructors page (new)

**Files:**
- Create: `app/[locale]/(public)/instructors/page.tsx`

- [ ] **Step 1: Create the Instructors page**

```tsx
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { db } from '@/lib/db'
import { getSectionPhoto } from '@/lib/content'

export const revalidate = 60

export default async function InstructorsPage() {
  const locale = useLocale()
  const [heroBg, actionPhoto, instructors] = await Promise.all([
    getSectionPhoto('instructors.hero_bg'),
    getSectionPhoto('instructors.action'),
    db.instructor.findMany({
      where: { isActive: true },
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <Image src={heroBg.url} alt={heroBg.alt} fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-black/50 to-transparent" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pb-12">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            Our Team
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            Instructors
          </h1>
        </div>
      </section>

      {/* Instructor cards */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {instructors.length === 0 ? (
            /* Fallback — show team photo if no DB records yet */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative overflow-hidden rounded-sm" style={{ border: '2px solid rgba(232,116,107,0.15)' }}>
                <Image src={heroBg.url} alt={heroBg.alt} width={700} height={500} className="w-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div>
                <p className="text-[10px] tracking-[2px] uppercase font-bold mb-3" style={{ color: 'var(--brand-coral)' }}>
                  Certified & Passionate
                </p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
                  Professional instructors
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  Our team of certified instructors brings years of experience and genuine passion to every lesson. Safety, fun, and real progress — that's our promise to every child and family.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => {
                const tr = instructor.translations.find((t) => t.locale === locale) ?? instructor.translations[0]
                return (
                  <div key={instructor.id} className="group rounded-sm overflow-hidden border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    {instructor.imageUrl ? (
                      <div className="relative h-64 overflow-hidden">
                        <Image src={instructor.imageUrl} alt={tr?.name ?? 'Instructor'} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-6xl" style={{ backgroundColor: 'var(--theme-card-tint)' }}>👩‍🏫</div>
                    )}
                    <div className="p-5">
                      <h3 className="text-sm font-black uppercase tracking-wide text-white mb-1">{tr?.name}</h3>
                      <p className="text-xs text-white/40 leading-relaxed mb-3">{tr?.bio}</p>
                      {instructor.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {instructor.certifications.map((cert) => (
                            <span key={cert} className="text-[9px] px-2 py-0.5 rounded-sm border border-white/10 text-white/30 uppercase tracking-wide">
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Action photo strip */}
      <section className="relative h-64 overflow-hidden">
        <Image src={actionPhoto.url} alt={actionPhoto.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/70 text-xl font-black uppercase tracking-widest">
            Every lesson, a memory
          </p>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(public)/instructors/page.tsx"
git commit -m "feat: create Instructors page with DB records and static photo fallback"
```

---

### Task 11: Gallery page (new)

**Files:**
- Create: `app/[locale]/(public)/gallery/page.tsx`

- [ ] **Step 1: Create the Gallery page**

```tsx
import Image from 'next/image'
import { getActiveTheme } from '@/lib/theme'
import { getGalleryPhotos } from '@/lib/content'
import { Theme, Season } from '@prisma/client'

export const revalidate = 60

export default async function GalleryPage() {
  const theme = await getActiveTheme()
  const photos = await getGalleryPhotos()

  const winterPhotos = photos.filter((p) => p.season === Season.WINTER || p.season === null)
  const summerPhotos = photos.filter((p) => p.season === Season.SUMMER || p.season === null)

  // Show active-theme photos first
  const orderedPhotos =
    theme === Theme.WINTER
      ? [...photos.filter((p) => p.season === Season.WINTER), ...photos.filter((p) => p.season === null), ...photos.filter((p) => p.season === Season.SUMMER)]
      : [...photos.filter((p) => p.season === Season.SUMMER), ...photos.filter((p) => p.season === null), ...photos.filter((p) => p.season === Season.WINTER)]

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero header */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            Memories
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            Our Gallery
          </h1>
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-10 pb-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
            {orderedPhotos.map((photo) => (
              <div key={photo.id} className="group relative overflow-hidden rounded-sm break-inside-avoid">
                <Image
                  src={photo.url}
                  alt={photo.alt}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: 'rgba(232,116,107,0.12)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/[locale]/(public)/gallery/page.tsx"
git commit -m "feat: create Gallery page with masonry grid, theme-ordered photos"
```

---

### Task 12: Restyle Booking and Contact pages

**Files:**
- Modify: `app/[locale]/(public)/booking/page.tsx`
- Modify: `app/[locale]/(public)/contact/page.tsx`

- [ ] **Step 1: Read current booking page**

Read `app/[locale]/(public)/booking/page.tsx` to understand its current structure, what components it uses, and what imports it has.

- [ ] **Step 2: Update booking page wrapper styling**

The `BookingForm` component handles form logic — don't touch it. Only update the page wrapper and header styling:

Find the outermost `<div>` or `<section>` and update it to use the dark theme. The page should have:
- Background: `style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}`
- A hero header section with theme gradient background, coral label, and white H1 "Book a Lesson"
- The form centered in a `max-w-2xl mx-auto` container with dark card styling: `className="bg-white/5 border border-white/10 rounded-sm p-8"`

- [ ] **Step 3: Read current contact page**

Read `app/[locale]/(public)/contact/page.tsx`.

- [ ] **Step 4: Update contact page wrapper styling**

Apply the same dark theme pattern — `backgroundColor: 'var(--theme-dark-base, #0a0f1e)'` on the outer wrapper. Ensure the contact info cards and map section use `bg-white/5 border-white/10` instead of light backgrounds.

- [ ] **Step 5: Commit**

```bash
git add "app/[locale]/(public)/booking/page.tsx" "app/[locale]/(public)/contact/page.tsx"
git commit -m "feat: restyle booking and contact pages to dark theme"
```

---

### Task 13: Activities page redesign

**Files:**
- Modify: `app/[locale]/(public)/activities/page.tsx`

- [ ] **Step 1: Read current activities page**

Read `app/[locale]/(public)/activities/page.tsx` to see its current structure.

- [ ] **Step 2: Update activities page**

Replace the page with a dark-themed version that uses the same horizontal row card style as `FeaturedActivities` but shows all activities with full descriptions and a season filter. Update the page wrapper background to `var(--theme-dark-base)`, add a hero header matching the design pattern (theme gradient + coral label + white H1), and keep the existing DB query logic. The activity cards should match the horizontal row style from Task 4.

- [ ] **Step 3: Commit**

```bash
git add "app/[locale]/(public)/activities/page.tsx"
git commit -m "feat: redesign Activities page — dark theme, horizontal rows, season filter"
```

---

### Task 14: Final check

- [ ] **Step 1: Run dev server and check all public pages**

```bash
npm run dev
```

Visit each page and verify no errors:
- http://localhost:3000/ro (home)
- http://localhost:3000/ro/activities
- http://localhost:3000/ro/about
- http://localhost:3000/ro/instructors
- http://localhost:3000/ro/gallery
- http://localhost:3000/ro/booking
- http://localhost:3000/ro/contact

- [ ] **Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Check winter/summer theme switch**

The admin settings page is at `http://localhost:3000/ro/admin/settings`. Toggle the theme and revisit the home page — hero gradient, card tints, season badge, and activity pill borders should all change.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete public UI redesign — Bold & Adventurous dark design, all pages"
```

---

**Plan 2 complete.** Public site redesign done. Proceed to Plan 3 (Admin CMS).
