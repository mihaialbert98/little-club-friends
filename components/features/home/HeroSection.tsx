import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { getActiveTheme } from '@/lib/theme'
import { getSectionPhoto } from '@/lib/content'
import { Theme } from '@prisma/client'

export default async function HeroSection() {
  const t = await getTranslations('home')
  const [theme, heroBg] = await Promise.all([
    getActiveTheme(),
    getSectionPhoto('home.hero_bg'),
  ])

  const isWinter = theme === Theme.WINTER
  const seasonEmoji = isWinter ? '❄️' : '☀️'
  const seasonText = isWinter ? 'Winter Season' : 'Summer Season'
  const seasonAccent = isWinter ? 'var(--activity-ski)' : 'var(--activity-bike)'

  const pills = isWinter
    ? [
        { emoji: '⛷️', label: t('activity_skiing'), color: 'var(--activity-ski)' },
        { emoji: '🏂', label: t('activity_snowboard'), color: 'var(--activity-snow)' },
        { emoji: '🚵', label: t('activity_biking'), color: 'var(--activity-bike)' },
        { emoji: '🥾', label: t('activity_hiking'), color: 'var(--activity-hike)' },
        { emoji: '🏄', label: t('activity_paddle'), color: 'var(--activity-paddle)' },
      ]
    : [
        { emoji: '🚵', label: t('activity_biking'), color: 'var(--activity-bike)' },
        { emoji: '🥾', label: t('activity_hiking'), color: 'var(--activity-hike)' },
        { emoji: '🏄', label: t('activity_paddle'), color: 'var(--activity-paddle)' },
        { emoji: '⛷️', label: t('activity_skiing'), color: 'var(--activity-ski)' },
        { emoji: '🏂', label: t('activity_snowboard'), color: 'var(--activity-snow)' },
      ]

  return (
    <section className="relative min-h-screen flex items-stretch overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--theme-hero-gradient)' }} />

      {/* Full-bleed photo — right side on desktop */}
      <div className="absolute inset-0 lg:left-[45%]">
        <Image
          src={heroBg.url}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        {/* Diagonal mask from left */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, var(--theme-dark-base) 0%, var(--theme-dark-base) 30%, rgba(10,15,30,0.85) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--theme-dark-base) 0%, transparent 35%)' }}
        />
      </div>

      {/* Mobile photo */}
      <div className="absolute inset-0 lg:hidden">
        <Image src={heroBg.url} alt="" fill className="object-cover object-center opacity-15" priority sizes="100vw" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center min-h-screen py-28 lg:py-0">
        <div className="max-w-[620px]">

          {/* Season sticker badge — bouncy */}
          <div className="animate-bounce-in mb-8">
            <div
              className="sticker inline-flex"
              style={{ color: seasonAccent, borderColor: `${seasonAccent}55`, backgroundColor: `${seasonAccent}18`, marginTop: '80px' }}
            >
              <span>{seasonEmoji}</span>
              <span>{seasonText} · Poiana Brașov</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="animate-fade-in-up delay-100 mb-6">
            <h1
              className="font-display text-white leading-tight"
              style={{ fontSize: 'clamp(3.5rem, 8.5vw, 7rem)', letterSpacing: '-0.01em' }}
            >
              {t('hero_line1')}<br />
              <span
                style={{
                  color: 'var(--brand-coral)',
                  textShadow: '0 0 60px rgba(232,116,107,0.4)',
                }}
              >
                {t('hero_line2')}
              </span><br />
              {t('hero_line3')}
            </h1>
          </div>

          {/* Subtitle */}
          <div className="animate-fade-in-up delay-200 mb-8">
            <p className="text-white/55 text-base leading-relaxed max-w-[420px]" style={{ fontFamily: 'var(--font-body)' }}>
              {t('hero_subtitle')}
            </p>
          </div>

          {/* Activity pills */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap gap-2 mb-10">
            {pills.map((pill) => (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${pill.color}18`,
                  border: `1.5px solid ${pill.color}50`,
                  color: pill.color,
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                }}
              >
                <span>{pill.emoji}</span>
                {pill.label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-3">
            <Link
              href="/booking"
              className="btn-coral inline-flex items-center justify-center gap-2"
            >
              {t('hero_cta_primary')} →
            </Link>
            <Link
              href="/activities"
              className="inline-flex items-center justify-center gap-2 px-7 py-[0.9rem] rounded-full text-xs font-bold uppercase tracking-[0.08em] text-white/60 border-2 border-white/15 hover:text-white hover:border-white/35 transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('hero_cta_secondary')} ↓
            </Link>
          </div>
        </div>
      </div>

      {/* Mountain silhouette divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ display: 'block' }}>
          <path
            d="M0,80 L0,55 L80,35 L160,50 L220,25 L300,45 L380,15 L450,38 L520,20 L600,42 L680,10 L760,35 L840,18 L920,40 L1000,22 L1080,44 L1160,20 L1240,38 L1320,28 L1440,45 L1440,80 Z"
            style={{ fill: 'var(--theme-dark-mid)' }}
          />
        </svg>
      </div>
    </section>
  )
}
