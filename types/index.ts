import type { Activity, ActivityImage, ActivityTranslation, Instructor, InstructorTranslation, Booking, GalleryPhoto, Season, Theme, BookingStatus } from '@prisma/client'

export type { Season, Theme, BookingStatus }

export type ActivityWithTranslations = Activity & {
  translations: ActivityTranslation[]
  images: ActivityImage[]
}

export type InstructorWithTranslations = Instructor & {
  translations: InstructorTranslation[]
}

export type BookingWithActivity = Booking & {
  activity: (Activity & { translations: ActivityTranslation[] }) | null
}

export type LocalizedActivity = {
  id: string
  slug: string
  season: Season
  ageMin: number
  ageMax: number
  durationMin: number
  priceFrom: number
  isActive: boolean
  name: string
  description: string
  shortDesc: string
  images: ActivityImage[]
}

export type LocalizedInstructor = {
  id: string
  slug: string
  certifications: string[]
  imageUrl: string | null
  isActive: boolean
  name: string
  bio: string
}

export type Locale = 'ro' | 'en'

export interface SiteConfig {
  siteName: string
  contactEmail: string
  contactPhone: string
  activeTheme: Theme
}
