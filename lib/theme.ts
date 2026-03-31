import { db } from '@/lib/db'
import { Theme } from '@prisma/client'

export async function getActiveTheme(): Promise<Theme> {
  const settings = await db.siteSettings.findFirst()
  return settings?.activeTheme ?? Theme.WINTER
}

export async function getSiteSettings() {
  const settings = await db.siteSettings.findFirst()
  return settings
}

/**
 * Returns ordered activities with season-matching first.
 * When theme = WINTER: winter activities → both → summer
 * When theme = SUMMER: summer activities → both → winter
 */
export function getActivityOrderSQL(theme: Theme): string {
  if (theme === Theme.WINTER) {
    return `CASE WHEN season = 'WINTER' THEN 0 WHEN season = 'BOTH' THEN 1 ELSE 2 END`
  }
  return `CASE WHEN season = 'SUMMER' THEN 0 WHEN season = 'BOTH' THEN 1 ELSE 2 END`
}
