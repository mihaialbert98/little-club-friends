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

// Turn a name into a URL-safe slug (handles Romanian diacritics).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
