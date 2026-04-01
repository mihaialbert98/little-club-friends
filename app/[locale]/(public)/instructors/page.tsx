import Image from 'next/image'
import { getTranslations, getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { getSectionPhoto } from '@/lib/content'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Instructors' }
export const revalidate = 60

export default async function InstructorsPage() {
  const t = await getTranslations('instructors')
  const locale = await getLocale()
  const [heroBg, actionPhoto, instructors] = await Promise.all([
    getSectionPhoto('instructors.hero_bg'),
    getSectionPhoto('instructors.action'),
    db.instructor.findMany({
      where: { isActive: true },
      include: { translations: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return (
    <div style={{ backgroundColor: 'var(--theme-dark-base)' }}>

      {/* Hero */}
      <section className="relative h-[65vh] min-h-[400px] flex items-end overflow-hidden">
        <Image src={heroBg.url} alt={heroBg.alt} fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0f1e 0%, rgba(10,15,30,0.4) 60%, transparent 100%)' }} />
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

      {/* Instructor cards / fallback */}
      <section className="py-20 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {instructors.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: '4/3', borderLeft: '3px solid var(--brand-coral)' }}
              >
                <Image
                  src={actionPhoto.url}
                  alt={actionPhoto.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <p className="text-[9px] tracking-[3px] uppercase font-bold mb-4" style={{ color: 'var(--brand-coral)' }}>
                  {t('fallback_label')}
                </p>
                <h2
                  className="font-display text-white leading-none mb-6"
                  style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
                >
                  {t('fallback_title')}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed mb-8">{t('fallback_desc')}</p>
                <Link href="/booking" className="btn-coral">
                  Book a lesson →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-white/6" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
              {instructors.map((instructor) => {
                const tr = instructor.translations.find((tx) => tx.locale === locale) ?? instructor.translations[0]
                return (
                  <div
                    key={instructor.id}
                    className="group overflow-hidden"
                    style={{ backgroundColor: 'var(--theme-dark-base)' }}
                  >
                    {instructor.imageUrl ? (
                      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                        <Image
                          src={instructor.imageUrl}
                          alt={tr?.name ?? 'Instructor'}
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        {/* Bottom text overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3
                            className="font-display text-white leading-none mb-1"
                            style={{ fontSize: '1.8rem' }}
                          >
                            {tr?.name}
                          </h3>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex flex-col justify-end p-6" style={{ aspectRatio: '3/4', backgroundColor: 'var(--theme-card-tint)' }}>
                        <span className="text-6xl mb-4">👩‍🏫</span>
                        <h3 className="font-display text-white" style={{ fontSize: '1.8rem' }}>{tr?.name}</h3>
                      </div>
                    )}
                    <div className="p-6 border-t border-white/6">
                      <p className="text-xs text-white/40 leading-relaxed mb-4">{tr?.bio}</p>
                      {instructor.certifications && instructor.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {instructor.certifications.map((cert) => (
                            <span
                              key={cert}
                              className="text-[8px] px-2.5 py-1 uppercase tracking-widest font-bold border border-white/10 text-white/25"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Action photo strip */}
      <section className="relative h-72 overflow-hidden">
        <Image src={actionPhoto.url} alt={actionPhoto.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,15,30,0.9) 0%, rgba(10,15,30,0.3) 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8 lg:px-16 max-w-[1280px] mx-auto">
          <p
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}
          >
            {t('strip_text')}
          </p>
        </div>
      </section>
    </div>
  )
}
