import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSectionPhoto } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }
export const revalidate = 60

export default async function AboutPage() {
  const t = await getTranslations('about')
  const [heroBg, storyPhoto] = await Promise.all([
    getSectionPhoto('about.hero_bg'),
    getSectionPhoto('about.story'),
  ])

  const values = [
    { icon: '🛡️', title: t('value_1_title'), desc: t('value_1_desc') },
    { icon: '🏅', title: t('value_2_title'), desc: t('value_2_desc') },
    { icon: '❤️', title: t('value_3_title'), desc: t('value_3_desc') },
    { icon: '🤝', title: t('value_4_title'), desc: t('value_4_desc') },
  ]

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero — full-bleed photo with text overlay */}
      <section className="relative h-[65vh] min-h-[400px] flex items-end overflow-hidden">
        <Image
          src={heroBg.url}
          alt={heroBg.alt}
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0f1e 0%, rgba(10,15,30,0.5) 50%, transparent 100%)' }} />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pb-16 w-full">
          <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
            {t('hero_label')}
          </p>
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
          >
            {t('hero_title')}
          </h1>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <p className="text-[9px] tracking-[3px] uppercase font-bold mb-6" style={{ color: 'var(--brand-coral)' }}>
              {t('story_label')}
            </p>
            <h2
              className="font-display text-white leading-none mb-8"
              style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
            >
              {t('story_title')}
            </h2>
            <div className="space-y-5">
              <p className="text-white/50 text-sm leading-relaxed">{t('story_body_1')}</p>
              <p className="text-white/50 text-sm leading-relaxed">{t('story_body_2')}</p>
            </div>
          </div>
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '4/5',
              borderLeft: '3px solid var(--brand-coral)',
            }}
          >
            <Image
              src={storyPhoto.url}
              alt={storyPhoto.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Values — horizontal cards with index numbers */}
      <section style={{ backgroundColor: 'var(--theme-dark-mid)' }} className="py-20 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14 border-b border-white/8 pb-8">
            <div>
              <p className="text-[9px] tracking-[3px] uppercase font-bold mb-3" style={{ color: 'var(--brand-coral)' }}>
                {t('values_label')}
              </p>
              <h2
                className="font-display text-white leading-none"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                {t('values_title')}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/6">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="card-hover-line flex flex-col gap-4 p-8 border-b sm:border-b-0 border-white/6"
                style={{
                  borderRight: i < values.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined,
                  backgroundColor: 'rgba(255,255,255,0.01)',
                }}
              >
                <span
                  className="font-display text-white/6 leading-none select-none"
                  style={{ fontSize: '3rem' }}
                >
                  0{i + 1}
                </span>
                <span className="text-2xl">{v.icon}</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">{v.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the team CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2
            className="font-display text-white leading-none mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {t('team_cta_title')}
          </h2>
          <p className="text-white/35 text-sm mb-10 max-w-md mx-auto leading-relaxed">{t('team_cta_subtitle')}</p>
          <Link href="/instructors" className="btn-coral">
            {t('team_cta_button')} →
          </Link>
        </div>
      </section>
    </div>
  )
}
