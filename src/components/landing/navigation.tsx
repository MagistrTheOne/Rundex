// Rundex CRM - Навигация лендинга
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navigation = [
  { name: "О платформе", href: "#about" },
  { name: "Володя AI", href: "#volodya" },
  { name: "Функциональность", href: "#features" },
  { name: "Отзывы", href: "#testimonials" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#7B61FF] rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-xl font-bold text-white">Rundex CRM</span>
          </Link>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                className="text-white/70 hover:text-white transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Кнопки действий */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white"
              onClick={() => ("#cta")}
            >
              Попробовать
            </Button>
            <Link href="/auth/signin">
              <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white">
                Войти
              </Button>
            </Link>
          </div>

          {/* Мобильное меню */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Мобильная навигация */}
        {isOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  className="text-white/70 hover:text-white transition-colors text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white justify-start"
                >
                  Попробовать
                </Button>
                <Link href="/auth/signin">
                  <Button className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white w-full">
                    Войти
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
