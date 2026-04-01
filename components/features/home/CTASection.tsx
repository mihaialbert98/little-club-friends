import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function CTASection() {
  const t = await getTranslations('home')

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--theme-dark-mid)' }}
    >
      {/* Mountain silhouette top divider */}
      <div className="pointer-events-none select-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ display: 'block' }}>
          <path
            d="M0,100 L0,70 L60,50 L120,65 L200,30 L280,55 L360,18 L440,45 L520,22 L600,48 L680,8 L760,38 L840,20 L920,44 L1000,15 L1080,42 L1160,25 L1240,50 L1320,32 L1440,55 L1440,100 Z"
            style={{ fill: 'var(--theme-dark-base)' }}
          />
        </svg>
      </div>

      {/* Content area */}
      <div className="relative py-20 lg:py-32">
        {/* Coral radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(232,116,107,0.2) 0%, transparent 65%)',
          }}
        />

        {/* Large ghost text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
          aria-hidden
        >
          <span
            className="font-display leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(5rem, 16vw, 14rem)', color: 'rgba(255,255,255,0.025)' }}
          >
            BOOK NOW
          </span>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-7">
          <p className="section-label">{t('cta_label')}</p>

          <h2
            className="font-display text-white leading-none max-w-[800px]"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)' }}
          >
            {t('cta_title')}
          </h2>

          <p
            className="text-sm max-w-[380px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
          >
            {t('cta_subtitle')}
          </p>

          <Link
            href="/booking"
            className="btn-coral mt-2"
            style={{ padding: '1rem 3rem', fontSize: '0.75rem' }}
          >
            {t('cta_button')} →
          </Link>

          {/* Coral accent line */}
          <div
            className="w-px mt-4"
            style={{
              height: '60px',
              background: 'linear-gradient(to bottom, rgba(232,116,107,0.5), transparent)',
            }}
          />
        </div>
      </div>

      {/* Mountain silhouette bottom divider — inverted */}
      <div className="pointer-events-none select-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ display: 'block', transform: 'scaleY(-1)' }}>
          <path
            d="M0,80 L0,55 L80,35 L160,50 L220,25 L300,45 L380,15 L450,38 L520,20 L600,42 L680,10 L760,35 L840,18 L920,40 L1000,22 L1080,44 L1160,20 L1240,38 L1320,28 L1440,45 L1440,80 Z"
            style={{ fill: 'var(--theme-dark-base)' }}
          />
        </svg>
      </div>
    </section>
  )
}
