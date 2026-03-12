import LandingNav from '@/components/landing/LandingNav'
import HeroSection from '@/components/landing/HeroSection'
import ProblemSection from '@/components/landing/ProblemSection'
import FeatureShowcase from '@/components/landing/FeatureShowcase'
import HowItWorks from '@/components/landing/HowItWorks'
import StatsSection from '@/components/landing/StatsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CTABanner from '@/components/landing/CTABanner'
import LandingFooter from '@/components/landing/LandingFooter'

export default function LandingPage() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <FeatureShowcase />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <CTABanner />
      <LandingFooter />
    </main>
  )
}
