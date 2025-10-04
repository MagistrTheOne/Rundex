// Rundex CRM - Секция "Почему Rundex"
// Автор: MagistrTheOne, 2025

"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { landingContent } from "@/content/landing"

export function WhySection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent to-purple-900/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {landingContent.why.title}
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            {landingContent.why.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {landingContent.why.reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-lg border-gray-800 hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {reason.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Статистика */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
            <div className="text-white/70">Компаний</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-white/70">Лиды обработано</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">98%</div>
            <div className="text-white/70">Удовлетворённость</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
            <div className="text-white/70">Техподдержка</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
