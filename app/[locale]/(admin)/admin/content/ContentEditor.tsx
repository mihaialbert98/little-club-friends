'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type ContentRow = { page: string; key: string; value: string }

const PAGE_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  home: [
    // — Hero (titlul mare de pe prima pagină, 3 rânduri) —
    { key: 'hero_line1.ro', label: 'Hero — Rândul 1 (RO)' },
    { key: 'hero_line1.en', label: 'Hero — Line 1 (EN)' },
    { key: 'hero_line2.ro', label: 'Hero — Rândul 2 / accent colorat (RO)' },
    { key: 'hero_line2.en', label: 'Hero — Line 2 / colored accent (EN)' },
    { key: 'hero_line3.ro', label: 'Hero — Rândul 3 (RO)' },
    { key: 'hero_line3.en', label: 'Hero — Line 3 (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero — Subtitlu (RO)', multiline: true },
    { key: 'hero_subtitle.en', label: 'Hero — Subtitle (EN)', multiline: true },

    // — Secțiunea „De ce noi” —
    { key: 'about_title.ro', label: 'De ce noi — Titlu (RO)' },
    { key: 'about_title.en', label: 'De ce noi — Title (EN)' },
    { key: 'about_body.ro', label: 'De ce noi — Text (RO)', multiline: true },
    { key: 'about_body.en', label: 'De ce noi — Body (EN)', multiline: true },

    // — Cele 4 carduri din „De ce noi” (icon = emoji) —
    { key: 'value_1_icon.ro', label: 'Card 1 — Emoji' },
    { key: 'value_1_title.ro', label: 'Card 1 — Titlu (RO)' },
    { key: 'value_1_title.en', label: 'Card 1 — Title (EN)' },
    { key: 'value_1_desc.ro', label: 'Card 1 — Descriere (RO)', multiline: true },
    { key: 'value_1_desc.en', label: 'Card 1 — Description (EN)', multiline: true },
    { key: 'value_2_icon.ro', label: 'Card 2 — Emoji' },
    { key: 'value_2_title.ro', label: 'Card 2 — Titlu (RO)' },
    { key: 'value_2_title.en', label: 'Card 2 — Title (EN)' },
    { key: 'value_2_desc.ro', label: 'Card 2 — Descriere (RO)', multiline: true },
    { key: 'value_2_desc.en', label: 'Card 2 — Description (EN)', multiline: true },
    { key: 'value_3_icon.ro', label: 'Card 3 — Emoji' },
    { key: 'value_3_title.ro', label: 'Card 3 — Titlu (RO)' },
    { key: 'value_3_title.en', label: 'Card 3 — Title (EN)' },
    { key: 'value_3_desc.ro', label: 'Card 3 — Descriere (RO)', multiline: true },
    { key: 'value_3_desc.en', label: 'Card 3 — Description (EN)', multiline: true },
    { key: 'value_4_icon.ro', label: 'Card 4 — Emoji' },
    { key: 'value_4_title.ro', label: 'Card 4 — Titlu (RO)' },
    { key: 'value_4_title.en', label: 'Card 4 — Title (EN)' },
    { key: 'value_4_desc.ro', label: 'Card 4 — Descriere (RO)', multiline: true },
    { key: 'value_4_desc.en', label: 'Card 4 — Description (EN)', multiline: true },

    // — Insignele cu statistici (500+, 10+, 5) —
    { key: 'stat_kids.ro', label: 'Statistică 1 — Valoare (ex: 500+)' },
    { key: 'stat_kids_label.ro', label: 'Statistică 1 — Etichetă (RO)' },
    { key: 'stat_kids_label.en', label: 'Statistică 1 — Label (EN)' },
    { key: 'stat_years.ro', label: 'Statistică 2 — Valoare (ex: 10+)' },
    { key: 'stat_years_label.ro', label: 'Statistică 2 — Etichetă (RO)' },
    { key: 'stat_years_label.en', label: 'Statistică 2 — Label (EN)' },
    { key: 'stat_activities.ro', label: 'Statistică 3 — Valoare (ex: 5)' },
    { key: 'stat_activities_label.ro', label: 'Statistică 3 — Etichetă (RO)' },
    { key: 'stat_activities_label.en', label: 'Statistică 3 — Label (EN)' },
  ],
  about: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'story_body.ro', label: 'Story Body (RO)', multiline: true },
    { key: 'story_body.en', label: 'Story Body (EN)', multiline: true },
  ],
  activities: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
  ],
  instructors: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
  ],
  gallery: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
  ],
  contact: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
  ],
}

const PAGES = Object.keys(PAGE_FIELDS)

export default function ContentEditor({ initialRows }: { initialRows: ContentRow[] }) {
  const [activePage, setActivePage] = useState('home')
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const row of initialRows) {
      map[`${row.page}.${row.key}`] = row.value
    }
    return map
  })
  const [isPending, startTransition] = useTransition()

  const handleSave = (page: string, key: string) => {
    const fullKey = `${page}.${key}`
    const value = values[fullKey] ?? ''
    startTransition(async () => {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, key, value }),
      })
      if (res.ok) {
        toast.success('Saved!')
      } else {
        toast.error('Failed to save.')
      }
    })
  }

  const fields = PAGE_FIELDS[activePage] ?? []

  return (
    <div>
      {/* Page tabs */}
      <div className="flex gap-1 mb-8 flex-wrap">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-bold rounded-sm transition-colors ${
              activePage === page
                ? 'bg-orange-500 text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {fields.map((field) => {
          const fullKey = `${activePage}.${field.key}`
          return (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-sm bg-background resize-y"
                  value={values[fullKey] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [fullKey]: e.target.value }))}
                />
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-background"
                  value={values[fullKey] ?? ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [fullKey]: e.target.value }))}
                />
              )}
              <button
                onClick={() => handleSave(activePage, field.key)}
                disabled={isPending}
                className="self-end px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-sm disabled:opacity-50"
              >
                Save
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
