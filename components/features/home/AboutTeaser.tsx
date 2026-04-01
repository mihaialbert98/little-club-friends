import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getSectionPhoto } from '@/lib/content'
import { Link } from '@/i18n/navigation'

export default async function AboutTeaser() {
  const t = await getTranslations('home')
  const photo = await getSectionPhoto('home.about_strip')

  const stats = [
    { value: t('stat_kids'), label: t('stat_kids_label'), color: 'var(--brand-coral)', rotate: '-2.5deg' },
    { value: t('stat_years'), label: t('stat_years_label'), color: 'var(--activity-ski)', rotate: '2deg' },
    { value: t('stat_activities'), label: t('stat_activities_label'), color: 'var(--activity-bike)', rotate: '-1.5deg' },
  ]

  const values = [
    { icon: t('value_1_icon'), title: t('value_1_title'), desc: t('value_1_desc') },
    { icon: t('value_2_icon'), title: t('value_2_title'), desc: t('value_2_desc') },
    { icon: t('value_3_icon'), title: t('value_3_title'), desc: t('value_3_desc') },
    { icon: t('value_4_icon'), title: t('value_4_title'), desc: t('value_4_desc') },
  ]

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base)' }} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Ambient glow — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '50vw', height: '50vw',
          bottom: '-10%', left: '-10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--theme-glow-accent) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — image with floating stat badges */}
          <div className="relative">
            {/* Slightly tilted image frame */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                aspectRatio: '4/5',
                transform: 'rotate(-1.5deg)',
                border: '2px solid rgba(232,116,107,0.2)',
                boxShadow: '0 32px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* Bottom gradient overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
            </div>

            {/* Glow behind image */}
            <div
              className="absolute inset-0 -z-10 rounded-3xl"
              style={{
                transform: 'rotate(-1.5deg) scale(1.05)',
                background: 'radial-gradient(circle at 50% 50%, var(--theme-glow-primary) 0%, transparent 70%)',
                filter: 'blur(30px)',
              }}
            />

            {/* Floating stat badges */}
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="absolute rounded-2xl px-5 py-3.5 text-center animate-float"
                style={{
                  backgroundColor: 'rgba(8,12,25,0.92)',
                  border: `1.5px solid ${stat.color}40`,
                  backdropFilter: 'blur(16px)',
                  transform: `rotate(${stat.rotate})`,
                  boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 24px ${stat.color}20`,
                  '--float-rotate': stat.rotate,
                  animationDuration: ['3.5s', '4.2s', '3.8s'][i],
                  animationDelay: `${i * 0.4}s`,
                  ...(i === 0 ? { top: '8%', right: '-5%' } : {}),
                  ...(i === 1 ? { bottom: '28%', right: '-8%' } : {}),
                  ...(i === 2 ? { bottom: '6%', left: '6%' } : {}),
                } as React.CSSProperties}
              >
                <div
                  className="stat-number"
                  style={{ fontSize: '2.2rem', color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[9px] font-bold uppercase tracking-widest mt-1"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Right — content */}
          <div className="flex flex-col gap-6">
            <p className="section-label">{t('about_label')}</p>

            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              {t('about_title')}
            </h2>

            {/* Accent divider */}
            <div className="glow-line w-20" />

            <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', maxWidth: '440px' }}>
              {t('about_body')}
            </p>

            {/* Value items */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="glass-card rounded-2xl p-4 flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    borderColor: 'var(--theme-border-subtle)',
                  }}
                >
                  <span className="text-xl">{v.icon}</span>
                  <p
                    className="text-xs font-bold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {v.title}
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/instructors" className="btn-coral self-start mt-2">
              {t('about_cta')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
