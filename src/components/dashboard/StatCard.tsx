// Rundex CRM - Компонент карточки статистики
// Автор: MagistrTheOne, 2025

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { StatCard } from "@/data/dashboard"

interface StatCardProps {
  stat: StatCard
  index: number
}

export function DashboardStatCard({ stat, index }: StatCardProps) {
  return (
    <motion.div
      key={index}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="group h-full"
    >
      <Card className={`relative overflow-hidden border ${stat.borderColor} bg-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 h-full`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3 relative">
          <CardTitle className="text-xs md:text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors truncate">
            {stat.title}
          </CardTitle>
          <div className={`p-1.5 md:p-2 rounded-lg bg-black/20 backdrop-blur-sm group-hover:scale-105 transition-transform duration-300`}>
            <stat.icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color} group-hover:scale-105 transition-transform duration-300`} />
          </div>
        </CardHeader>
        <CardContent className="relative p-3 md:p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl md:text-3xl font-bold text-white group-hover:text-white transition-colors">
              {stat.value}
            </div>
            {stat.trend === 'up' && (
              <div className="flex items-center text-green-400">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">+{stat.change}%</span>
              </div>
            )}
            {stat.trend === 'down' && (
              <div className="flex items-center text-red-400">
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="text-xs md:text-sm font-medium hidden sm:inline">-{stat.change}%</span>
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-white/60 group-hover:text-white/70 transition-colors line-clamp-2">
            {stat.description}
          </p>

          {/* Декоративные элементы */}
          <div className={`absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          <div className="absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 bg-white/10 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
