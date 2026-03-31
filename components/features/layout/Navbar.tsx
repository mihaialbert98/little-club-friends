'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Menu, X } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}/activities`, label: t('activities') },
    { href: `/${locale}/instructors`, label: t('instructors') },
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'navbar-scrolled' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={48}
              height={48}
              className="h-10 w-auto lg:h-12 rounded-md"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.4)' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] tracking-[1.5px] uppercase font-semibold transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              className="text-[9px] tracking-[1.5px] uppercase font-bold px-4 py-2 rounded-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-coral)' }}
            >
              {t('book_now')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0a0f1e]">
          <div className="flex items-center justify-between px-6 h-16">
            <Image src="/logo.png" alt="Little Club Friends" width={44} height={44} className="h-10 w-auto rounded-md" />
            <button className="text-white/80 hover:text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-6 px-6 pt-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-xl font-black uppercase tracking-wider text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/booking`}
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-block text-center text-sm tracking-[1.5px] uppercase font-bold px-6 py-3 rounded-sm text-white"
              style={{ backgroundColor: 'var(--brand-coral)' }}
            >
              {t('book_now')}
            </Link>
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
