// Rundex CRM - Компонент элемента ежедневного вызова
// Автор: MagistrTheOne, 2025

import { Progress } from "@/components/ui/progress"
import { DailyChallenge } from "@/data/dashboard"

interface DailyChallengeItemProps {
  challenge: DailyChallenge
  index: number
}

export function DashboardDailyChallengeItem({ challenge, index }: DailyChallengeItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className={`w-8 h-8 ${challenge.color.replace('text-', 'bg-').replace('-400', '-500/20')} rounded-full flex items-center justify-center flex-shrink-0`}>
          <challenge.icon className={`w-4 h-4 ${challenge.color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white font-medium text-sm truncate">{challenge.title}</p>
          <p className="text-white/60 text-xs">Прогресс: {challenge.progress}/{challenge.target}</p>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-1 w-full sm:w-auto">
        <div className="text-yellow-400 font-medium text-sm">+{challenge.points} XP</div>
        <Progress value={(challenge.progress / challenge.target) * 100} className="w-full sm:w-16 h-1" />
      </div>
    </div>
  )
}
