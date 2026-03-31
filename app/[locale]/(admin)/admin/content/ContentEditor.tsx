'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type ContentRow = { page: string; key: string; value: string }

const PAGE_FIELDS: Record<string, { key: string; label: string; multiline?: boolean }[]> = {
  home: [
    { key: 'hero_title.ro', label: 'Hero Title (RO)' },
    { key: 'hero_title.en', label: 'Hero Title (EN)' },
    { key: 'hero_subtitle.ro', label: 'Hero Subtitle (RO)' },
    { key: 'hero_subtitle.en', label: 'Hero Subtitle (EN)' },
    { key: 'about_title.ro', label: 'About Title (RO)' },
    { key: 'about_title.en', label: 'About Title (EN)' },
    { key: 'about_body.ro', label: 'About Body (RO)', multiline: true },
    { key: 'about_body.en', label: 'About Body (EN)', multiline: true },
    { key: 'cta_title.ro', label: 'CTA Title (RO)' },
    { key: 'cta_title.en', label: 'CTA Title (EN)' },
    { key: 'cta_subtitle.ro', label: 'CTA Subtitle (RO)' },
    { key: 'cta_subtitle.en', label: 'CTA Subtitle (EN)' },
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
  booking: [
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
