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

      {/* Ambient light blobs — drifting slowly */}
      <div
        className="absolute pointer-events-none animate-drift"
        style={{
          width: '70vw', height: '70vw',
          top: '-20%', left: '-15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-ambient-blob-1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '22s',
        }}
      />
      <div
        className="absolute pointer-events-none animate-drift"
        style={{
          width: '50vw', height: '50vw',
          bottom: '-10%', right: '-10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-ambient-blob-2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDuration: '28s',
          animationDelay: '-8s',
        }}
      />

      {/* Subtle grid overlay */}
      <div className="grid-overlay opacity-60" />

      {/* Full-bleed photo — right side on desktop */}
      <div className="absolute inset-0 lg:left-[42%]">
        <Image
          src={heroBg.url}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
        {/* Diagonal mask */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(108deg, var(--theme-dark-base) 0%, var(--theme-dark-base) 28%, rgba(6,10,20,0.82) 48%, transparent 72%)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, var(--theme-dark-base) 0%, transparent 30%)' }}
        />
        {/* Right edge vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.3) 0%, transparent 30%)' }}
        />
      </div>

      {/* Mobile photo */}
      <div className="absolute inset-0 lg:hidden">
        <Image src={heroBg.url} alt="" fill className="object-cover object-center opacity-12" priority sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--theme-dark-base) 0%, transparent 60%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center min-h-screen py-28 lg:py-0">
        <div className="max-w-[640px]">

          {/* Season sticker badge */}
          <div className="animate-bounce-in mb-8">
            <div
              className="sticker inline-flex"
              style={{
                color: seasonAccent,
                borderColor: `${seasonAccent}45`,
                backgroundColor: `${seasonAccent}14`,
                marginTop: '80px',
                boxShadow: `0 0 20px ${seasonAccent}20`,
              }}
            >
              <span>{seasonEmoji}</span>
              <span>{seasonText} · Poiana Brașov</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="animate-fade-in-up delay-100 mb-6">
            <h1
              className="font-display text-white"
              style={{
                fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.95,
              }}
            >
              {t('hero_line1')}<br />
              <span
                style={{
                  color: 'var(--brand-coral)',
                  textShadow: '0 0 80px rgba(232,116,107,0.5), 0 0 160px rgba(232,116,107,0.2)',
                }}
              >
                {t('hero_line2')}
              </span><br />
              {t('hero_line3')}
            </h1>
          </div>

          {/* Glow divider line */}
          <div className="animate-fade-in-up delay-200 mb-8">
            <div className="glow-line w-24 mb-6" />
            <p
              className="text-white/50 text-base leading-relaxed max-w-[400px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('hero_subtitle')}
            </p>
          </div>

          {/* Activity pills */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap gap-2 mb-10">
            {pills.map((pill, i) => (
              <div
                key={pill.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${pill.color}15`,
                  border: `1.5px solid ${pill.color}45`,
                  color: pill.color,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  boxShadow: i === 0 ? `0 0 14px ${pill.color}25` : undefined,
                }}
              >
                <span>{pill.emoji}</span>
                {pill.label}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row gap-3">
            <Link href="/booking" className="btn-coral inline-flex items-center justify-center gap-2">
              {t('hero_cta_primary')} →
            </Link>
            <Link href="/activities" className="btn-ghost inline-flex items-center justify-center gap-2">
              {t('hero_cta_secondary')} ↓
            </Link>
          </div>

          {/* Trust signal */}
          <div className="animate-fade-in-up delay-600 mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[0,1,2].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                  style={{
                    borderColor: 'var(--theme-dark-base)',
                    backgroundColor: `${seasonAccent}25`,
                    color: seasonAccent,
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {['👧','👦','👧'][i]}
                </div>
              ))}
            </div>
            <p className="text-xs text-white/35" style={{ fontFamily: 'var(--font-body)' }}>
              <span className="text-white/60 font-bold">500+</span> kids trained this season
            </p>
          </div>
        </div>
      </div>

      {/* Mountain silhouette divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ display: 'block' }}>
          {/* Glow layer */}
          <path
            d="M0,90 L0,60 L80,40 L160,55 L220,28 L300,50 L380,18 L450,42 L520,22 L600,46 L680,12 L760,38 L840,20 L920,44 L1000,24 L1080,48 L1160,22 L1240,42 L1320,30 L1440,50 L1440,90 Z"
            style={{ fill: 'var(--theme-season-accent)', opacity: 0.06 }}
          />
          <path
            d="M0,90 L0,60 L80,40 L160,55 L220,28 L300,50 L380,18 L450,42 L520,22 L600,46 L680,12 L760,38 L840,20 L920,44 L1000,24 L1080,48 L1160,22 L1240,42 L1320,30 L1440,50 L1440,90 Z"
            style={{ fill: 'var(--theme-dark-mid)' }}
          />
        </svg>
      </div>
    </section>
  )
}
