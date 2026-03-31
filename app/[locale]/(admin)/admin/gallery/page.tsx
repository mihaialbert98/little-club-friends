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
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Gallery</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Upload and manage gallery photos. Tag each photo with a season so it appears under the correct theme.
        If no photos are uploaded here, the public gallery will show the default scraped photos.
      </p>
      <GalleryManager initialPhotos={photos} />
    </div>
  )
}
