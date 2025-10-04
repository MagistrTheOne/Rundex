// Rundex CRM - Компонент карточки достижения
// Автор: MagistrTheOne, 2025

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { Achievement } from "@/data/dashboard"

interface AchievementCardProps {
  achievement: Achievement
  index: number
}

export function DashboardAchievementCard({ achievement, index }: AchievementCardProps) {
  return (
    <motion.div
      key={achievement.id}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className={`flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-2 md:p-3 rounded-lg border backdrop-blur-sm h-full ${
        achievement.earned
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-gray-500/10 border-gray-500/30 opacity-60'
      }`}
    >
      <div className={`p-2 rounded-lg ${
        achievement.earned
          ? 'bg-green-500/20'
          : 'bg-gray-500/20'
      }`}>
        <achievement.icon className={`w-4 h-4 ${
          achievement.earned
            ? 'text-green-400'
            : 'text-gray-400'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className={`font-medium text-sm md:text-base ${
            achievement.earned ? 'text-white' : 'text-white/50'
          }`}>
            {achievement.title}
          </h4>
          <Badge variant="outline" className={`text-xs ${
            achievement.rarity === 'legendary' ? 'border-yellow-500/50 text-yellow-400' :
            achievement.rarity === 'epic' ? 'border-purple-500/50 text-purple-400' :
            achievement.rarity === 'rare' ? 'border-blue-500/50 text-blue-400' :
            'border-gray-500/50 text-gray-400'
          }`}>
            {achievement.rarity}
          </Badge>
        </div>
        <p className={`text-sm ${
          achievement.earned ? 'text-white/70' : 'text-white/40'
        }`}>
          {achievement.description}
        </p>
        {achievement.earned && (
          <div className="flex items-center mt-1">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="text-xs text-yellow-400 font-medium">
              +{achievement.points} очков
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
