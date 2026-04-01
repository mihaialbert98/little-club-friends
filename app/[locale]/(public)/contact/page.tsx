import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-32 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            {t('hero_label')}
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
          >
            {t('page_title')}
          </h1>
          <p className="text-white/40 text-sm mt-4">{t('page_subtitle')}</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact details */}
          <div>
            <p className="text-[9px] tracking-[3px] uppercase font-bold mb-10" style={{ color: 'var(--brand-coral)' }}>
              {t('contact_title')}
            </p>
            <ul className="flex flex-col gap-0 border-t border-white/6">
              {[
                {
                  icon: <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />,
                  label: t('address_label'),
                  value: 'Poiana Brașov, Brașov, România',
                  href: undefined,
                },
                {
                  icon: <Phone className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />,
                  label: t('phone_label'),
                  value: '0770 675 375',
                  href: 'tel:0770675375',
                },
                {
                  icon: <Mail className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />,
                  label: t('email_label'),
                  value: 'littleskifriends@yahoo.com',
                  href: 'mailto:littleskifriends@yahoo.com',
                },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-5 py-6 border-b border-white/6"
                >
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/30 mb-2">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-white/70">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Map */}
            <div
              className="mt-10 overflow-hidden border border-white/8"
              style={{ height: '240px' }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.3!2d25.5568!3d45.5942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35b0000000001%3A0x0!2sPoiana+Bra%C8%99ov!5e0!3m2!1sro!2sro!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) opacity(0.7)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Quick booking card */}
          <div className="flex flex-col justify-center">
            <div
              className="p-10 border border-white/8"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="font-display text-white/8 leading-none mb-8 select-none"
                style={{ fontSize: '5rem' }}
                aria-hidden
              >
                📞
              </div>
              <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
                Quick booking
              </p>
              <h3
                className="font-display text-white leading-none mb-5"
                style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}
              >
                {t('book_card_title')}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-[340px]">
                {t('book_card_desc')}
              </p>
              <Link href="/booking" className="btn-coral inline-block">
                {t('book_card_cta')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
