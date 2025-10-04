// Rundex CRM - Компонент лендинга
// Автор: MagistrTheOne, 2025

import { Navigation } from "./navigation"
import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { VolodyaSection } from "./volodya-section"
import { FeaturesSection } from "./features-section"
import { WhySection } from "./why-section"
import { TestimonialsSection } from "./testimonials-section"
import { CTASection } from "./cta-section"
import { FooterSection } from "./footer-section"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <VolodyaSection />
      <FeaturesSection />
      <WhySection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  )
}
