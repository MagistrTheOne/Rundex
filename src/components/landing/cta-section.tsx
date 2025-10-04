// Rundex CRM - CTA секция
// Автор: MagistrTheOne, 2025

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { landingContent } from "@/content/landing"

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {landingContent.cta.title}
          </h2>

          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {landingContent.cta.subtitle}
          </p>

          <div className="mb-8">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white px-12 py-4 text-lg font-semibold transition-all duration-300"
              >
                {landingContent.cta.primaryCTA}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-white/60 text-sm">
            {landingContent.cta.trialText}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
