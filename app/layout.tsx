import type { Metadata } from 'next'
import { Righteous, Nunito } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const righteous = Righteous({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Little Club Friends',
    default: 'Little Club Friends — Aventuri pentru copii la Poiana Brașov',
  },
  description:
    'Lecții de schi, snowboard, ciclism montan și drumeții pentru copii la Poiana Brașov. Instructori certificați, experiențe sigure și de neuitat.',
  keywords: ['lecții schi copii', 'snowboard copii', 'activități copii Poiana Brasov', 'Little Club Friends'],
  openGraph: {
    siteName: 'Little Club Friends',
    locale: 'ro_RO',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${righteous.variable} ${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  )
}
