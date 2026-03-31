import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getSectionPhoto } from '@/lib/content'
import { Link } from '@/i18n/navigation'

const STATS = [
  { value: '500+', label: 'Kids trained' },
  { value: '10+', label: 'Years experience' },
  { value: '5', label: 'Activities' },
]

const VALUES = [
  { icon: '🏅', title: 'Certified instructors', desc: 'All instructors are professionally certified and trained' },
  { icon: '👦', title: 'Ages 4–14, all levels', desc: 'From first-timers to advanced — we meet every child where they are' },
  { icon: '🏔️', title: 'Poiana Brașov, year-round', desc: 'The most beautiful mountain resort in Romania, every season' },
  { icon: '👐', title: 'Personal attention', desc: 'Small groups and private lessons for real progress' },
]

export default async function AboutTeaser() {
  const t = await getTranslations('home')
  const photo = await getSectionPhoto('home.about_strip')

  return (
    <section style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }} className="py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left: image with stat overlays */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-sm"
            style={{
              transform: 'rotate(1deg)',
              border: '2px solid rgba(232,116,107,0.2)',
            }}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              width={600}
              height={700}
              className="w-full object-cover"
              style={{ maxHeight: '520px' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Stat badges */}
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="absolute flex flex-col items-center justify-center px-4 py-2 rounded-sm"
              style={{
                backgroundColor: 'rgba(10,15,30,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
                ...(i === 0 ? { top: '16px', right: '-16px' } : {}),
                ...(i === 1 ? { bottom: '60px', right: '-16px' } : {}),
                ...(i === 2 ? { bottom: '16px', left: '16px' } : {}),
              }}
            >
              <span className="text-xl font-black" style={{ color: 'var(--brand-coral)' }}>{stat.value}</span>
              <span className="text-[9px] tracking-[1px] uppercase text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Right: text */}
        <div className="flex flex-col gap-6">
          <p className="text-[10px] tracking-[2px] uppercase font-bold" style={{ color: 'var(--brand-coral)' }}>
            {t('about_label')}
          </p>
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            {t('about_title')}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            {t('about_body')}
          </p>

          <ul className="flex flex-col gap-4 mt-2">
            {VALUES.map((v) => (
              <li key={v.title} className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{v.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{v.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{v.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/instructors"
            className="mt-2 self-start px-6 py-2.5 text-[10px] tracking-[1.5px] uppercase font-bold rounded-sm border transition-colors hover:text-white"
            style={{
              color: 'var(--brand-coral)',
              borderColor: 'var(--brand-coral-border)',
            }}
          >
            {t('about_cta')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
