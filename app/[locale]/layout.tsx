import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getActiveTheme } from '@/lib/theme'
import { ThemeProvider } from '@/components/features/theme/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'ro' | 'en')) {
    notFound()
  }

  const messages = await getMessages()
  const activeTheme = await getActiveTheme()

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider initialTheme={activeTheme}>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
