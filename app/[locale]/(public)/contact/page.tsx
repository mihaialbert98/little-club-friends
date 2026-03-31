import { getTranslations } from 'next-intl/server'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }

export default async function ContactPage() {
  const t = await getTranslations('contact')

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--theme-hero-gradient)' }} className="pt-28 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            {t('hero_label')}
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t('page_title')}
          </h1>
          <p className="text-white/50 text-lg mt-3">{t('page_subtitle')}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact details */}
          <div>
            <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-white">
              {t('contact_title') ?? 'Contact'}
            </h2>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
                <div>
                  <p className="font-medium text-sm mb-0.5 text-white">
                    {t('address_label')}
                  </p>
                  <p className="text-white/50">Poiana Brașov, Brașov, România</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
                <div>
                  <p className="font-medium text-sm mb-0.5 text-white">
                    {t('phone_label')}
                  </p>
                  <a href="tel:0770675375" className="text-white/50 hover:text-white transition-colors">
                    0770 675 375
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-coral)' }} />
                <div>
                  <p className="font-medium text-sm mb-0.5 text-white">
                    {t('email_label')}
                  </p>
                  <a href="mailto:littleskifriends@yahoo.com" className="text-white/50 hover:text-white transition-colors">
                    littleskifriends@yahoo.com
                  </a>
                </div>
              </li>
            </ul>

            {/* Map embed */}
            <div className="mt-8 rounded-sm overflow-hidden h-52 border border-white/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2788.3!2d25.5568!3d45.5942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b35b0000000001%3A0x0!2sPoiana+Bra%C8%99ov!5e0!3m2!1sro!2sro!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Quick booking card */}
          <div className="bg-white/5 border border-white/10 rounded-sm p-8 flex flex-col justify-center items-center text-center">
            <div className="text-6xl mb-4">📞</div>
            <h3 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">
              {t('book_card_title')}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              {t('book_card_desc')}
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--brand-coral)' }}
            >
              {t('book_card_cta')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
