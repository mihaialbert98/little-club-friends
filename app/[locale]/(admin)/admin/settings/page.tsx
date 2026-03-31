'use client'

import { useState, useEffect } from 'react'
import { Snowflake, Sun, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Theme = 'WINTER' | 'SUMMER'

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('WINTER')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.activeTheme) setTheme(data.activeTheme)
        setLoading(false)
      })
  }, [])

  const toggleTheme = async (newTheme: Theme) => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeTheme: newTheme }),
      })
      if (!res.ok) throw new Error()
      setTheme(newTheme)
      toast.success(`Tema schimbată la ${newTheme === 'WINTER' ? 'Iarnă' : 'Vară'}!`)
    } catch {
      toast.error('Eroare la salvare.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Setări</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Tema activă a site-ului</h2>
        <p className="text-sm text-gray-500 mb-6">
          Schimbă tema vizuală și ordinea activităților afișate pe site. Modificarea este instantanee.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Winter option */}
          <button
            onClick={() => toggleTheme('WINTER')}
            disabled={saving || theme === 'WINTER'}
            className={`relative rounded-2xl p-6 text-left transition-all border-2 ${
              theme === 'WINTER'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            } disabled:opacity-60`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #0d2b4e, #2e86c1)' }}
            >
              <Snowflake className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Iarnă</h3>
            <p className="text-xs text-gray-500 mt-1">Schi, snowboard · Albastru închis & alb</p>
            {theme === 'WINTER' && (
              <span className="absolute top-3 right-3 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                Activ
              </span>
            )}
          </button>

          {/* Summer option */}
          <button
            onClick={() => toggleTheme('SUMMER')}
            disabled={saving || theme === 'SUMMER'}
            className={`relative rounded-2xl p-6 text-left transition-all border-2 ${
              theme === 'SUMMER'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
            } disabled:opacity-60`}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #1a4731, #6dbb8a)' }}
            >
              <Sun className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Vară</h3>
            <p className="text-xs text-gray-500 mt-1">Ciclism, drumeții, paddleboard · Verde & auriu</p>
            {theme === 'SUMMER' && (
              <span className="absolute top-3 right-3 text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                Activ
              </span>
            )}
          </button>
        </div>

        {saving && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Se salvează...
          </div>
        )}
      </div>
    </div>
  )
}
