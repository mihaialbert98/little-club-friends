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
    const onScroll = () => setScrolled(window.scrollY > 60)
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

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'navbar-scrolled'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0 flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={52}
              height={52}
              className="h-14 w-auto lg:h-16 rounded-sm transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7 lg:gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[9px] tracking-[2px] uppercase font-bold transition-colors pb-0.5 ${
                  isActive(link.href)
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/80'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ backgroundColor: 'var(--brand-coral)' }}
                  />
                )}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              href={`/${locale}/booking`}
              className="btn-coral"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.65rem' }}
            >
              {t('book_now')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{ backgroundColor: '#060912' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/6">
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={52}
              height={52}
              className="h-12 w-auto rounded-sm"
            />
            <button
              className="text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col flex-1 px-6 pt-12 pb-8 justify-between">
            <nav className="flex flex-col gap-0">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-5 border-b border-white/6 group"
                >
                  <span
                    className="font-display text-white/70 group-hover:text-white transition-colors"
                    style={{ fontSize: 'clamp(1.8rem, 7vw, 2.5rem)' }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="text-xl text-white/20 group-hover:text-white/60 transition-all group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-4 pt-8">
              <Link
                href={`/${locale}/booking`}
                onClick={() => setMobileOpen(false)}
                className="btn-coral text-center"
                style={{ padding: '1rem', fontSize: '0.7rem' }}
              >
                {t('book_now')}
              </Link>
              <div>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
