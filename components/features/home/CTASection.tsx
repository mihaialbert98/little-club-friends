import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function CTASection() {
  const t = await getTranslations('home')
  const tNav = await getTranslations('nav')

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--theme-dark-mid)' }}
    >
      {/* Mountain silhouette top divider */}
      <div className="pointer-events-none select-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ display: 'block' }}>
          {/* Glow echo */}
          <path
            d="M0,100 L0,70 L60,50 L120,65 L200,30 L280,55 L360,18 L440,45 L520,22 L600,48 L680,8 L760,38 L840,20 L920,44 L1000,15 L1080,42 L1160,25 L1240,50 L1320,32 L1440,55 L1440,100 Z"
            style={{ fill: 'var(--theme-season-accent)', opacity: 0.05 }}
          />
          <path
            d="M0,100 L0,70 L60,50 L120,65 L200,30 L280,55 L360,18 L440,45 L520,22 L600,48 L680,8 L760,38 L840,20 L920,44 L1000,15 L1080,42 L1160,25 L1240,50 L1320,32 L1440,55 L1440,100 Z"
            style={{ fill: 'var(--theme-dark-base)' }}
          />
        </svg>
      </div>

      {/* Content area */}
      <div className="relative py-24 lg:py-40">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary coral glow from bottom center */}
          <div
            style={{
              position: 'absolute',
              bottom: '-20%', left: '50%',
              transform: 'translateX(-50%)',
              width: '80vw', height: '60vw',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(232,116,107,0.18) 0%, transparent 65%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Theme accent top left */}
          <div
            style={{
              position: 'absolute',
              top: '-10%', left: '-5%',
              width: '40vw', height: '40vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--theme-glow-primary) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          {/* Theme accent top right */}
          <div
            style={{
              position: 'absolute',
              top: '-10%', right: '-5%',
              width: '35vw', height: '35vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--theme-glow-accent) 0%, transparent 70%)',
              filter: 'blur(70px)',
            }}
          />
        </div>

        {/* Grid overlay */}
        <div className="grid-overlay opacity-40" />

        {/* Large ghost text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
          aria-hidden
        >
          <span
            className="font-display leading-none whitespace-nowrap"
            style={{ fontSize: 'clamp(6rem, 18vw, 17rem)', color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.04em' }}
          >
            BOOK NOW
          </span>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-8">
          <p className="section-label">{t('cta_label')}</p>

          <h2
            className="font-display text-white leading-none max-w-[820px]"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)', letterSpacing: '-0.03em' }}
          >
            {t('cta_title')}
          </h2>

          {/* Coral glow divider */}
          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--brand-coral), transparent)', opacity: 0.7 }} />

          <p
            className="text-sm max-w-[380px] leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-body)' }}
          >
            {t('cta_subtitle')}
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mt-2">
            <Link
              href="/booking"
              className="btn-coral animate-pulse-glow"
              style={{ padding: '1.1rem 3.2rem', fontSize: '0.78rem' }}
            >
              {t('cta_button')} →
            </Link>
            <Link
              href="/contact"
              className="btn-ghost"
              style={{ padding: '1.05rem 2.4rem', fontSize: '0.75rem' }}
            >
              {tNav('contact')}
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {[
              { icon: '⭐', text: '5-star rated' },
              { icon: '🏔️', text: 'Poiana Brașov' },
              { icon: '👶', text: 'Ages 3–16' },
              { icon: '✅', text: 'Certified instructors' },
            ].map((chip) => (
              <div
                key={chip.text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span>{chip.icon}</span>
                {chip.text}
              </div>
            ))}
          </div>

          {/* Bottom accent line */}
          <div className="w-px mt-4" style={{ height: '56px', background: 'linear-gradient(to bottom, rgba(232,116,107,0.6), transparent)' }} />
        </div>
      </div>

      {/* Mountain silhouette bottom divider — flipped */}
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
