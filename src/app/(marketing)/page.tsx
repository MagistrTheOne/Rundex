// Rundex CRM - Корпоративный лендинг
// Автор: MagistrTheOne, 2025

import { Metadata } from "next"
import { landingContent } from "@/content/landing"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { VolodyaSection } from "@/components/landing/volodya-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { WhySection } from "@/components/landing/why-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { FooterSection } from "@/components/landing/footer-section"

export const metadata: Metadata = {
  title: landingContent.seo.title,
  description: landingContent.seo.description,
  keywords: landingContent.seo.keywords,
  openGraph: {
    title: landingContent.seo.title,
    description: landingContent.seo.description,
    images: [landingContent.seo.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: landingContent.seo.title,
    description: landingContent.seo.description,
    images: [landingContent.seo.ogImage],
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
