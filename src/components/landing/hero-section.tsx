// Rundex CRM - Hero секция лендинга
// Автор: MagistrTheOne, 2025

"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from "lucide-react"
import { landingContent } from "@/content/landing"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden bg-black">
      {/* Центральный контент */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {landingContent.hero.title}
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {landingContent.hero.subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              {landingContent.hero.primaryCTA}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-800 text-white hover:bg-white/10 px-8 py-4 text-lg"
          >
            {landingContent.hero.secondaryCTA}
          </Button>
        </motion.div>

      </div>

    </section>
  )
}
