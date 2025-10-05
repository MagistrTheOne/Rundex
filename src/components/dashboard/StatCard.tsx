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
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        delay: 0.2 + index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { duration: 0.2 }
      }}
      className="group h-full card-hover"
    >
      <Card className={`relative overflow-hidden border ${stat.borderColor} glass-card hover:shadow-2xl transition-all duration-300 h-full`}>
        {/* Background gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
            {stat.title}
          </CardTitle>
          <div className="p-2 rounded-xl bg-white/5 backdrop-blur-sm group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300 glow-primary">
            <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
          </div>
        </CardHeader>

        <CardContent className="relative p-6 z-10">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className="text-3xl font-bold text-white group-hover:text-white transition-colors"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
            >
              {stat.value}
            </motion.div>
            {stat.trend === 'up' && (
              <motion.div
                className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+{stat.change}%</span>
              </motion.div>
            )}
            {stat.trend === 'down' && (
              <motion.div
                className="flex items-center text-red-400 bg-red-500/10 px-2 py-1 rounded-lg"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">-{stat.change}%</span>
              </motion.div>
            )}
          </div>

          <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors line-clamp-2 mb-4">
            {stat.description}
          </p>

          {/* Progress bar for trend visualization */}
          <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
            <motion.div
              className={`h-full ${stat.trend === 'up' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                               stat.trend === 'down' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                               'bg-gradient-to-r from-blue-400 to-cyan-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(stat.change) * 2, 100)}%` }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Enhanced decorative elements */}
          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.bgGradient} rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
          <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />

          {/* Animated particles */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-4 right-4 w-1 h-1 bg-white/40 rounded-full animate-ping" />
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-8 left-8 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
