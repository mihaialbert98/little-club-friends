import type { Metadata } from 'next'
import HeroSection from '@/components/features/home/HeroSection'
import FeaturedActivities from '@/components/features/home/FeaturedActivities'
import AboutTeaser from '@/components/features/home/AboutTeaser'
import GalleryTeaser from '@/components/features/home/GalleryTeaser'
import CTASection from '@/components/features/home/CTASection'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Little Club Friends — Aventuri pentru copii la Poiana Brașov',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedActivities />
      <AboutTeaser />
      <GalleryTeaser />
      <CTASection />
    </>
  )
}
