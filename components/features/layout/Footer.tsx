import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer style={{ backgroundColor: '#060c12' }} className="border-t border-white/8">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-4">
          <Link href={`/${locale}`}>
            <Image
              src="/logo.png"
              alt="Little Club Friends"
              width={56}
              height={56}
              className="h-14 w-auto rounded-md"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
            />
          </Link>
          <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
            {t('tagline')}
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <h4 className="text-[10px] tracking-[2px] uppercase font-bold text-white/30 mb-4">
            {t('quick_links')}
          </h4>
          <ul className="flex flex-col gap-2">
            {[
              { href: `/${locale}/activities`, label: nav('activities') },
              { href: `/${locale}/instructors`, label: nav('instructors') },
              { href: `/${locale}/gallery`, label: nav('gallery') },
              { href: `/${locale}/about`, label: nav('about') },
              { href: `/${locale}/contact`, label: nav('contact') },
              { href: `/${locale}/booking`, label: nav('book_now') },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contact */}
        <div>
          <h4 className="text-[10px] tracking-[2px] uppercase font-bold text-white/30 mb-4">
            {t('contact')}
          </h4>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3 text-white/50 text-sm">
              <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <span>Poiana Brașov, Brașov, Romania</span>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Phone size={14} className="flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <a href="tel:0770675375" className="hover:text-white transition-colors">0770 675 375</a>
            </li>
            <li className="flex items-center gap-3 text-white/50 text-sm">
              <Mail size={14} className="flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
              <a href="mailto:littleskifriends@yahoo.com" className="hover:text-white transition-colors">
                littleskifriends@yahoo.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/6 px-6 lg:px-8 py-4 max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} Little Club Friends · SC Manuitii SRL
        </p>
        <div className="flex gap-4">
          <Link href={`/${locale}/privacy`} className="text-white/25 hover:text-white/50 text-xs transition-colors">
            {t('privacy')}
          </Link>
          <Link href={`/${locale}/terms`} className="text-white/25 hover:text-white/50 text-xs transition-colors">
            {t('terms')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
