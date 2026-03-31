'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTransition } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggle = () => {
    const nextLocale = locale === 'ro' ? 'en' : 'ro'
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="text-white/80 hover:text-white text-sm font-semibold px-2 py-1 rounded transition-colors disabled:opacity-50"
      aria-label="Switch language"
    >
      {locale === 'ro' ? 'EN' : 'RO'}
    </button>
  )
}
