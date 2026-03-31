import Image from 'next/image'
import { getTranslations, getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { getSectionPhoto } from '@/lib/content'

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
    <div style={{ backgroundColor: 'var(--theme-dark-base, #0a0f1e)' }}>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[320px] flex items-end overflow-hidden">
        <Image src={heroBg.url} alt={heroBg.alt} fill className="object-cover object-center" priority sizes="100vw" />
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

      {/* Instructor cards */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          {instructors.length === 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative overflow-hidden rounded-sm" style={{ border: '2px solid rgba(232,116,107,0.15)' }}>
                <Image src={heroBg.url} alt={heroBg.alt} width={700} height={500} className="w-full object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div>
                <p className="text-[10px] tracking-[2px] uppercase font-bold mb-3" style={{ color: 'var(--brand-coral)' }}>
                  {t('fallback_label')}
                </p>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
                  {t('fallback_title')}
                </h2>
                <p className="text-white/50 text-sm leading-relaxed">{t('fallback_desc')}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructors.map((instructor) => {
                const tr = instructor.translations.find((tr) => tr.locale === locale) ?? instructor.translations[0]
                return (
                  <div key={instructor.id} className="group rounded-sm overflow-hidden border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    {instructor.imageUrl ? (
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={instructor.imageUrl}
                          alt={tr?.name ?? 'Instructor'}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-6xl" style={{ backgroundColor: 'var(--theme-card-tint)' }}>👩‍🏫</div>
                    )}
                    <div className="p-5">
                      <h3 className="text-sm font-black uppercase tracking-wide text-white mb-1">{tr?.name}</h3>
                      <p className="text-xs text-white/40 leading-relaxed mb-3">{tr?.bio}</p>
                      {instructor.certifications && instructor.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {instructor.certifications.map((cert) => (
                            <span key={cert} className="text-[9px] px-2 py-0.5 rounded-sm border border-white/10 text-white/30 uppercase tracking-wide">
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
      <section className="relative h-64 overflow-hidden">
        <Image src={actionPhoto.url} alt={actionPhoto.alt} fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/70 text-xl font-black uppercase tracking-widest">{t('strip_text')}</p>
        </div>
      </section>
    </div>
  )
}
