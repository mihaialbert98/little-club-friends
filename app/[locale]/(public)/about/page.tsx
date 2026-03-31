import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSectionPhoto } from '@/lib/content'

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
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <Image src={heroBg.url} alt={heroBg.alt} fill className="object-cover object-top" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-black/50 to-transparent" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 pb-12">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2" style={{ color: 'var(--brand-coral)' }}>
            {t('hero_label')}
          </p>
          <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
            {t('hero_title')}
          </h1>
        </div>
      </section>

      {/* Story section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-[10px] tracking-[2px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
              {t('story_label')}
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-6">
              {t('story_title')}
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{t('story_body_1')}</p>
            <p className="text-white/50 text-sm leading-relaxed">{t('story_body_2')}</p>
          </div>
          <div className="relative h-[460px] overflow-hidden rounded-sm" style={{ border: '2px solid rgba(232,116,107,0.15)' }}>
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

      {/* Values */}
      <section style={{ backgroundColor: 'var(--theme-dark-mid, #070c16)' }} className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <p className="text-[10px] tracking-[2px] uppercase font-bold mb-3" style={{ color: 'var(--brand-coral)' }}>
            {t('values_label')}
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-12">{t('values_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-3 p-6 rounded-sm border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <span className="text-3xl">{v.icon}</span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-white">{v.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the team CTA */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4">{t('team_cta_title')}</h2>
          <p className="text-white/40 text-sm mb-8">{t('team_cta_subtitle')}</p>
          <Link
            href="/instructors"
            className="inline-block px-8 py-3 text-sm tracking-[1.5px] uppercase font-bold text-white rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--brand-coral)' }}
          >
            {t('team_cta_button')} →
          </Link>
        </div>
      </section>
    </div>
  )
}
