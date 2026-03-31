import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function CTASection() {
  const t = await getTranslations('home')

  return (
    <section
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: 'var(--theme-hero-gradient)' }}
    >
      {/* Subtle coral radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(232,116,107,0.12) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-6">
        <p className="text-[10px] tracking-[2px] uppercase font-bold" style={{ color: 'var(--brand-coral)' }}>
          {t('cta_label')}
        </p>
        <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
          {t('cta_title')}
        </h2>
        <p className="text-white/50 text-sm max-w-md leading-relaxed">
          {t('cta_subtitle')}
        </p>
        <Link
          href="/booking"
          className="mt-2 px-10 py-4 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-coral)' }}
        >
          {t('cta_button')}
        </Link>
      </div>
    </section>
  )
}
