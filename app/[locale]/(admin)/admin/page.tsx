import { db } from '@/lib/db'
import { getSiteSettings } from '@/lib/theme'
import { Theme } from '@prisma/client'
import { CalendarDays, Activity, Users, Snowflake, Sun } from 'lucide-react'

export default async function AdminDashboard() {
  const [bookingsCount, newBookingsCount, activitiesCount, instructorsCount, settings] =
    await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: 'NEW' } }),
      db.activity.count({ where: { isActive: true } }),
      db.instructor.count({ where: { isActive: true } }),
      getSiteSettings(),
    ])

  const isWinter = settings?.activeTheme === Theme.WINTER

  const stats = [
    { label: 'Total rezervări', value: bookingsCount, icon: CalendarDays, color: '#3b82f6' },
    { label: 'Rezervări noi', value: newBookingsCount, icon: CalendarDays, color: '#ef4444' },
    { label: 'Activități active', value: activitiesCount, icon: Activity, color: '#10b981' },
    { label: 'Instructori activi', value: instructorsCount, icon: Users, color: '#8b5cf6' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: isWinter ? '#dbeafe' : '#dcfce7',
            color: isWinter ? '#1e3a8a' : '#14532d',
          }}
        >
          {isWinter ? <Snowflake className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          Tema activă: {isWinter ? 'Iarnă' : 'Vară'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Acțiuni rapide</h2>
          <div className="space-y-2">
            {[
              { href: './admin/bookings', label: 'Vezi rezervările noi', badge: newBookingsCount },
              { href: './admin/activities/new', label: 'Adaugă o activitate nouă', badge: null },
              { href: './admin/settings', label: 'Schimbă tema site-ului', badge: null },
              { href: './admin/gallery', label: 'Gestionează galeria foto', badge: null },
            ].map(({ href, label, badge }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
              >
                {label}
                {badge ? (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{badge}</span>
                ) : (
                  <span className="text-gray-400">→</span>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-2">Tema curentă</h2>
          <p className="text-sm text-gray-500 mb-4">
            Tema activă determină aspectul vizual al site-ului și ordinea activităților.
          </p>
          <div
            className="rounded-xl p-4 text-center"
            style={{
              background: isWinter
                ? 'linear-gradient(135deg, #0d2b4e, #2e86c1)'
                : 'linear-gradient(135deg, #1a4731, #6dbb8a)',
            }}
          >
            <span className="text-white font-bold text-lg">
              {isWinter ? '❄️ Tema Iarnă activă' : '☀️ Tema Vară activă'}
            </span>
          </div>
          <a
            href="./admin/settings"
            className="mt-3 w-full block text-center text-sm font-medium text-blue-600 hover:underline"
          >
            Schimbă tema →
          </a>
        </div>
      </div>
    </div>
  )
}
