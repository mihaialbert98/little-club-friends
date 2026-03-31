'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  Mountain, LayoutDashboard, Calendar, Users,
  Image, FileText, Settings, LogOut, Activity
} from 'lucide-react'

interface AdminSidebarProps {
  locale: string
}

export default function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname()

  const base = `/${locale}/admin`
  const navItems = [
    { href: base, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${base}/activities`, label: 'Activități', icon: Activity },
    { href: `${base}/bookings`, label: 'Rezervări', icon: Calendar },
    { href: `${base}/instructors`, label: 'Instructori', icon: Users },
    { href: `${base}/gallery`, label: 'Galerie', icon: Image },
    { href: `${base}/pages`, label: 'Pagini', icon: FileText },
    { href: `${base}/settings`, label: 'Setări', icon: Settings },
  ]

  return (
    <aside className="w-60 bg-gray-900 flex flex-col min-h-screen flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Mountain className="w-7 h-7 text-blue-400" />
          <div>
            <p className="text-white font-bold text-sm leading-tight">Little Club</p>
            <p className="text-blue-400 text-xs">Friends Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== base && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Deconectare
        </button>
      </div>
    </aside>
  )
}
