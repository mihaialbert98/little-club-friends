import type { Activity, ActivityImage, ActivityTranslation, Instructor, InstructorTranslation, Season, Theme } from '@prisma/client'

export type { Season, Theme }

export type ActivityWithTranslations = Activity & {
  translations: ActivityTranslation[]
  images: ActivityImage[]
}

export type InstructorWithTranslations = Instructor & {
  translations: InstructorTranslation[]
}

export type LocalizedActivity = {
  id: string
  slug: string
  season: Season
  ageMin: number
  ageMax: number
  durationMin: number | null
  priceFrom: number | null
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
