import Navbar from '@/components/features/layout/Navbar'
import Footer from '@/components/features/layout/Footer'
import { getContactPhone } from '@/lib/theme'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const phone = await getContactPhone()
  return (
    <>
      <Navbar phone={phone} />
      <main className="flex-1">{children}</main>
      <Footer phone={phone} />
    </>
  )
}
