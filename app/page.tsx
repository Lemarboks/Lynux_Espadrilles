import Hero from '@/components/home/Hero'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import StatsStrip from '@/components/home/StatsStrip'
import BrandBanner from '@/components/home/BrandBanner'
import InstagramSection from '@/components/home/InstagramSection'
import ValuesSection from '@/components/home/ValuesSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <StatsStrip />
      <BrandBanner />
      <InstagramSection />
      <ValuesSection />
    </>
  )
}
