import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import ContentEditor from './ContentEditor'

export default async function ContentPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const rows = await db.pageContent.findMany()

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Page Content</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Edit the text shown on public pages. Changes are saved per-field and take effect immediately.
      </p>
      <ContentEditor initialRows={rows} />
    </div>
  )
}
