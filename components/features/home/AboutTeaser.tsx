import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getSectionPhoto } from '@/lib/content'
import { Link } from '@/i18n/navigation'

export default async function AboutTeaser() {
  const t = await getTranslations('home')
  const photo = await getSectionPhoto('home.about_strip')

  const stats = [
    { value: t('stat_kids'), label: t('stat_kids_label'), color: 'var(--brand-coral)', rotate: '-2deg' },
    { value: t('stat_years'), label: t('stat_years_label'), color: 'var(--activity-ski)', rotate: '1.5deg' },
    { value: t('stat_activities'), label: t('stat_activities_label'), color: 'var(--activity-bike)', rotate: '-1deg' },
  ]

  const values = [
    { icon: t('value_1_icon'), title: t('value_1_title'), desc: t('value_1_desc') },
    { icon: t('value_2_icon'), title: t('value_2_title'), desc: t('value_2_desc') },
    { icon: t('value_3_icon'), title: t('value_3_title'), desc: t('value_3_desc') },
    { icon: t('value_4_icon'), title: t('value_4_title'), desc: t('value_4_desc') },
  ]

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base)' }} className="py-20 lg:py-32 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left — image with floating stat badges */}
          <div className="relative">
            {/* Slightly tilted image frame */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                aspectRatio: '4/5',
                transform: 'rotate(-1.5deg)',
                border: '3px solid rgba(232,116,107,0.25)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
              }}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating stat stickers — each slightly rotated differently */}
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="absolute rounded-2xl px-5 py-3 text-center shadow-xl"
                style={{
                  backgroundColor: 'rgba(10,15,30,0.95)',
                  border: `2px solid ${stat.color}50`,
                  backdropFilter: 'blur(12px)',
                  transform: `rotate(${stat.rotate})`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${stat.color}25`,
                  ...(i === 0 ? { top: '8%', right: '-6%' } : {}),
                  ...(i === 1 ? { bottom: '28%', right: '-8%' } : {}),
                  ...(i === 2 ? { bottom: '6%', left: '8%' } : {}),
                }}
              >
                <div
                  className="font-display leading-none"
                  style={{ fontSize: '2.2rem', color: stat.color }}
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
          <div className="flex flex-col gap-7">
            <p className="section-label">{t('about_label')}</p>

            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', lineHeight: 1.15 }}
            >
              {t('about_title')}
            </h2>

            <p className="leading-relaxed text-sm text-white/55" style={{ fontFamily: 'var(--font-body)' }}>
              {t('about_body')}
            </p>

            {/* Value items — rounded cards */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl p-4 flex flex-col gap-2"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-xl">{v.icon}</span>
                  <p
                    className="text-xs font-bold text-white leading-tight"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {v.title}
                  </p>
                  <p className="text-[11px] text-white/35 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
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
