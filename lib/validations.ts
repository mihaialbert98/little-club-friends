import { z } from 'zod'

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Numele este obligatoriu'),
  email: z.string().email('Email invalid'),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
})

// ─── ACTIVITIES ─────────────────────────────────────────────────────────────
// Romanian (ro) content is required; English (en) is optional and falls back
// to Romanian when empty. Price and age recommendation are optional.

const ActivityImageInput = z.object({
  url: z.string().url('URL invalid'),
  alt: z.string().default(''),
  isPrimary: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
})

const ActivityTranslationInput = z.object({
  name: z.string().trim(),
  description: z.string().default(''),
  shortDesc: z.string().default(''),
})

export const ActivitySchema = z.object({
  season: z.enum(['WINTER', 'SUMMER', 'BOTH']),
  ageMin: z.coerce.number().int().min(1).max(18).optional(),
  ageMax: z.coerce.number().int().min(1).max(18).optional(),
  durationHours: z.coerce.number().int().min(1).max(24).nullable().optional(),
  priceFrom: z.coerce.number().positive().nullable().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  // RO is the source of truth — name required. EN optional.
  ro: ActivityTranslationInput.extend({ name: z.string().trim().min(1, 'Numele (RO) este obligatoriu') }),
  en: ActivityTranslationInput.optional(),
  images: z.array(ActivityImageInput).default([]),
})

// ─── INSTRUCTORS ────────────────────────────────────────────────────────────

const InstructorTranslationInput = z.object({
  name: z.string().trim(),
  bio: z.string().default(''),
})

export const InstructorSchema = z.object({
  certifications: z.array(z.string()).default([]),
  imageUrl: z.string().url('URL invalid').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  ro: InstructorTranslationInput.extend({ name: z.string().trim().min(1, 'Numele (RO) este obligatoriu') }),
  en: InstructorTranslationInput.optional(),
})

export const SiteSettingsSchema = z.object({
  activeTheme: z.enum(['WINTER', 'SUMMER']).optional(),
  siteName: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(1).optional(),
})

// ─── EVENTS (Tabere & Activități de weekend) ──────────────────────────────────
// Shared shape for both Camp and WeekendActivity: bilingual name/description +
// external-link images + an OPTIONAL date range. RO required, EN optional.

const EventImageInput = z.object({
  url: z.string().url('URL invalid'),
  alt: z.string().default(''),
  isPrimary: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
})

const EventTranslationInput = z.object({
  name: z.string().trim(),
  description: z.string().default(''),
  shortDesc: z.string().default(''),
})

// Accepts "" / null / undefined (date not set) or an ISO date string (YYYY-MM-DD).
const optionalDate = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => (v && v.trim() ? v : null))

export const EventSchema = z.object({
  startDate: optionalDate,
  endDate: optionalDate,
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  ro: EventTranslationInput.extend({ name: z.string().trim().min(1, 'Numele (RO) este obligatoriu') }),
  en: EventTranslationInput.optional(),
  images: z.array(EventImageInput).default([]),
})

export type ActivityInput = z.infer<typeof ActivitySchema>
export type InstructorInput = z.infer<typeof InstructorSchema>
export type EventInput = z.infer<typeof EventSchema>
