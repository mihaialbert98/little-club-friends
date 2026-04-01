'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  const navLinks = [
    { href: '/activities', label: nav('activities') },
    { href: '/instructors', label: nav('instructors') },
    { href: '/gallery', label: nav('gallery') },
    { href: '/about', label: nav('about') },
    { href: '/contact', label: nav('contact') },
    { href: '/booking', label: nav('book_now') },
  ]

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: '#030608' }}
    >
      {/* Ambient glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '60vw', height: '30vw',
          background: 'radial-gradient(ellipse, var(--theme-glow-primary) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Top glow line */}
      <div className="glow-line" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Little Club Friends"
                width={56}
                height={56}
                className="h-14 w-auto rounded-md transition-opacity hover:opacity-80"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}
              />
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-[220px]" style={{ fontFamily: 'var(--font-body)' }}>
              {t('tagline')}
            </p>
            {/* Social proof mini-chip */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full self-start"
              style={{
                backgroundColor: 'rgba(232,116,107,0.1)',
                border: '1px solid rgba(232,116,107,0.25)',
              }}
            >
              <span className="text-xs">⭐</span>
              <span className="text-[11px] font-bold text-white/60" style={{ fontFamily: 'var(--font-body)' }}>
                500+ happy kids
              </span>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4
              className="text-[9px] tracking-[2.5px] uppercase font-bold mb-5"
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}
            >
              {t('quick_links')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    <span
                      className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200 group-hover:scale-150"
                      style={{ backgroundColor: 'var(--brand-coral)', opacity: 0.5 }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4
              className="text-[9px] tracking-[2.5px] uppercase font-bold mb-5"
              style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}
            >
              {t('contact')}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-white/40 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: 'rgba(232,116,107,0.12)', border: '1px solid rgba(232,116,107,0.2)' }}
                >
                  <MapPin size={12} style={{ color: 'var(--brand-coral)' }} />
                </div>
                <span>Poiana Brașov, Brașov, Romania</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(232,116,107,0.12)', border: '1px solid rgba(232,116,107,0.2)' }}
                >
                  <Phone size={12} style={{ color: 'var(--brand-coral)' }} />
                </div>
                <a href="tel:0770675375" className="hover:text-white transition-colors">0770 675 375</a>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(232,116,107,0.12)', border: '1px solid rgba(232,116,107,0.2)' }}
                >
                  <Mail size={12} style={{ color: 'var(--brand-coral)' }} />
                </div>
                <a href="mailto:littleskifriends@yahoo.com" className="hover:text-white transition-colors break-all">
                  littleskifriends@yahoo.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="glow-line mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/20 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
            © {new Date().getFullYear()} Little Club Friends · SC Manuitii SRL
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-white/20 hover:text-white/45 text-xs transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-white/20 hover:text-white/45 text-xs transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
              {t('terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
