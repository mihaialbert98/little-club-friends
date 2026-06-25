'use client'

import { useState, useEffect } from 'react'
import { Snowflake, Sun, Loader2, Phone } from 'lucide-react'
import { toast } from 'sonner'

type Theme = 'WINTER' | 'SUMMER'

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('WINTER')
  const [phone, setPhone] = useState('')
  const [initialPhone, setInitialPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.activeTheme) setTheme(data.activeTheme)
        if (data?.contactPhone) {
          setPhone(data.contactPhone)
          setInitialPhone(data.contactPhone)
        }
        setLoading(false)
      })
  }, [])

  const savePhone = async () => {
    const trimmed = phone.trim()
    if (!trimmed) {
      toast.error('Numărul de telefon nu poate fi gol.')
      return
    }
    setSavingPhone(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactPhone: trimmed }),
      })
      if (!res.ok) throw new Error()
      setInitialPhone(trimmed)
      toast.success('Număr de telefon salvat!')
    } catch {
      toast.error('Eroare la salvare.')
    } finally {
      setSavingPhone(false)
    }
  }

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

      {/* Contact phone */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
        <div className="flex items-center gap-2 mb-1">
          <Phone className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Număr de telefon</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Numărul afișat pe site și apelat când vizitatorii apasă „Sună acum”. Modificarea apare instant.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label htmlFor="phone" className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
              Telefon de contact
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ex: 0770 675 375"
              className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
          <button
            onClick={savePhone}
            disabled={savingPhone || phone.trim() === initialPhone.trim()}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {savingPhone ? 'Se salvează...' : 'Salvează'}
          </button>
        </div>
      </div>
    </div>
  )
}
