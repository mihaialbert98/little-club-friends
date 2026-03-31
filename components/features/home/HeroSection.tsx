import Image from 'next/image'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { getActiveTheme } from '@/lib/theme'
import { getSectionPhoto } from '@/lib/content'
import { Theme } from '@prisma/client'

export default async function HeroSection() {
  const t = await getTranslations('home')
  const locale = await getLocale()
  const [theme, heroBg] = await Promise.all([
    getActiveTheme(),
    getSectionPhoto('home.hero_bg'),
  ])

  const isWinter = theme === Theme.WINTER
  const seasonLabel = isWinter ? '❄️  Winter Season · Poiana Brașov' : '☀️  Summer Season · Poiana Brașov'

  const pills = isWinter
    ? [
        { emoji: '⛷️', label: 'Skiing', season: 'winter' },
        { emoji: '🏂', label: 'Snowboard', season: 'winter' },
        { emoji: '🚵', label: 'Biking', season: 'summer' },
        { emoji: '🥾', label: 'Hiking', season: 'summer' },
        { emoji: '🏄', label: 'Paddle', season: 'summer' },
      ]
    : [
        { emoji: '🚵', label: 'Biking', season: 'summer' },
        { emoji: '🥾', label: 'Hiking', season: 'summer' },
        { emoji: '🏄', label: 'Paddle', season: 'summer' },
        { emoji: '⛷️', label: 'Skiing', season: 'winter' },
        { emoji: '🏂', label: 'Snowboard', season: 'winter' },
      ]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--theme-hero-gradient)' }}
      />

      {/* Background photo overlay */}
      <div className="absolute inset-0 opacity-15">
        <Image
          src={heroBg.url}
          alt={heroBg.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Diagonal light sweep */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 40%, rgba(232,116,107,0.04) 70%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center gap-6">
        {/* Season badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] tracking-[2px] uppercase font-bold"
          style={{
            border: '1px solid var(--brand-coral-border)',
            backgroundColor: 'var(--brand-coral-muted)',
            color: 'var(--brand-coral)',
          }}
        >
          {seasonLabel}
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-none tracking-tighter text-white">
          {t('hero_line1')}<br />
          <span style={{ color: 'var(--brand-coral)' }}>{t('hero_line2')}</span><br />
          {t('hero_line3')}
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-sm sm:text-base max-w-md leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* Activity pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {pills.map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] tracking-[1px] uppercase font-semibold text-white/60"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: `1px solid ${pill.season === 'winter' ? 'rgba(126,200,227,0.2)' : 'rgba(144,238,144,0.2)'}`,
              }}
            >
              <span>{pill.emoji}</span>
              {pill.label}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/${locale}/booking`}
            className="px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-coral)' }}
          >
            {t('hero_cta_primary')}
          </Link>
          <Link
            href={`/${locale}/activities`}
            className="px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white/70 rounded-sm border border-white/25 hover:text-white hover:border-white/50 transition-colors"
          >
            {t('hero_cta_secondary')} ↓
          </Link>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 0 0 30L0 60Z" style={{ fill: 'var(--theme-dark-mid, #070c16)' }} />
        </svg>
      </div>
    </section>
  )
}
