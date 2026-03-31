import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminSidebar from '@/components/features/layout/AdminSidebar'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const session = await auth()
  const { locale } = await params

  if (!session) {
    redirect(`/${locale}/auth/login`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar locale={locale} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user?.email}</span>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
