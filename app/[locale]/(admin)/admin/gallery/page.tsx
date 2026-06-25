import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import GalleryManager from './GalleryManager'

export default async function AdminGalleryPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const photos = await db.galleryPhoto.findMany({ orderBy: { sortOrder: 'asc' } })

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Galerie</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Adaugă fotografii prin link extern (ex: Facebook). Etichetează fiecare fotografie cu un sezon
        pentru a apărea sub tema corectă. Dacă nu există fotografii aici, galeria publică afișează imaginile implicite.
      </p>
      <GalleryManager initialPhotos={photos} />
    </div>
  )
}
