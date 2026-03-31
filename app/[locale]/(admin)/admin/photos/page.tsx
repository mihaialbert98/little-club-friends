import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import SectionPhotoManager from './SectionPhotoManager'

export default async function SectionPhotosPage() {
  const session = await auth()
  if (!session) redirect('/ro/auth')

  const photos = await db.sectionPhoto.findMany()

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Section Photos</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Upload custom photos for specific sections. Deleting a photo reverts to the default scraped image.
      </p>
      <SectionPhotoManager initialPhotos={photos} />
    </div>
  )
}
