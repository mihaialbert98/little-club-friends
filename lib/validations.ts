import { z } from 'zod'

export const BookingSchema = z.object({
  parentName: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  email: z.string().email('Email invalid'),
  phone: z.string().min(10, 'Număr de telefon invalid'),
  numberOfChildren: z.coerce.number().int().min(1).max(10),
  childrenAges: z.string().min(1, 'Vârstele copiilor sunt obligatorii'),
  activityId: z.string().optional(),
  preferredDates: z.string().min(1, 'Data preferată este obligatorie'),
  notes: z.string().optional(),
})

export const ContactFormSchema = z.object({
  name: z.string().min(2, 'Numele este obligatoriu'),
  email: z.string().email('Email invalid'),
  message: z.string().min(10, 'Mesajul trebuie să aibă cel puțin 10 caractere'),
})

export const ActivitySchema = z.object({
  slug: z.string().min(1),
  season: z.enum(['WINTER', 'SUMMER', 'BOTH']),
  ageMin: z.coerce.number().int().min(1).max(18),
  ageMax: z.coerce.number().int().min(1).max(18),
  durationMin: z.coerce.number().int().min(15),
  priceFrom: z.coerce.number().positive(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  translations: z.array(
    z.object({
      locale: z.enum(['ro', 'en']),
      name: z.string().min(1),
      description: z.string().min(1),
      shortDesc: z.string().min(1),
    })
  ),
})

export const InstructorSchema = z.object({
  slug: z.string().min(1),
  certifications: z.array(z.string()),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  translations: z.array(
    z.object({
      locale: z.enum(['ro', 'en']),
      name: z.string().min(1),
      bio: z.string().min(1),
    })
  ),
})

export const SiteSettingsSchema = z.object({
  activeTheme: z.enum(['WINTER', 'SUMMER']).optional(),
  siteName: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(1).optional(),
})

export const BookingStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'RESOLVED', 'CANCELLED']),
})

export type BookingInput = z.infer<typeof BookingSchema>
export type ActivityInput = z.infer<typeof ActivitySchema>
export type InstructorInput = z.infer<typeof InstructorSchema>
