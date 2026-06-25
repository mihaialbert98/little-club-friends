import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default phone number clients call to book. The admin-editable value lives in
// SiteSettings.contactPhone; these are the fallback when none is set.
export const CONTACT_PHONE = '0770 675 375'
export const CONTACT_PHONE_TEL = 'tel:0770675375'

// Build a tel: href from a display phone number (strips spaces and separators).
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

// Format an optional date range for display. Returns null when no dates set.
// e.g. "12 iulie – 18 iulie 2026" / "12 iulie 2026" / null
export function formatDateRange(
  start: string | null,
  end: string | null,
  locale: string
): string | null {
  if (!start && !end) return null
  const loc = locale === 'en' ? 'en-GB' : 'ro-RO'
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' })
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  return fmt((start ?? end)!)
}

// Turn a name into a URL-safe slug (handles Romanian diacritics).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
