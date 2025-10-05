// Rundex CRM - Главная страница дашборда
// Автор: MagistrTheOne, 2025

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from "next/dynamic"

const VolodyaInsights = dynamic(() => import("@/components/dashboard/volodya-insights").then(mod => ({ default: mod.VolodyaInsights })), { ssr: false })
import { DashboardStatCard } from "@/components/dashboard/StatCard"
import { DashboardAchievementCard } from "@/components/dashboard/AchievementCard"
import { DashboardDailyChallengeItem } from "@/components/dashboard/DailyChallengeItem"
import {
  Users,
  UserPlus,
  Target,
  CheckSquare,
  Calendar,
  Bot,
  Plus,
  Trophy,
  Star,
  Sparkles,
  Zap,
  Crown,
  Flame,
  MessageSquare,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"
import { useMemo, useState } from "react"
import {
  stats,
  achievements,
  dailyChallenges,
  recentActivities,
  upcomingTasks,
  userLevel
} from "@/data/dashboard"



export default function DashboardPage() {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)

  // Мемоизированные вычисления
  const earnedAchievements = useMemo(() => achievements.filter(a => a.earned), [])
  const totalPoints = useMemo(() => earnedAchievements.reduce((sum, a) => sum + a.points, 0), [earnedAchievements])
  const completedChallenges = useMemo(() => dailyChallenges.filter(c => c.completed).length, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-4 md:space-y-6 lg:space-y-8 px-2 sm:px-4 md:px-6 lg:px-8 min-h-screen container-padding"
    >
      {/* Профиль и уровень пользователя */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative"
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7B61FF]/5 via-transparent to-[#7B61FF]/5" />
          <CardContent className="relative p-4 md:p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#7B61FF]/50">
                    <AvatarImage src="/avatars/admin.png" alt="Администратор" />
                    <AvatarFallback className="bg-[#7B61FF]/20 text-white text-lg md:text-xl font-bold">АС</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-[#7B61FF] rounded-full flex items-center justify-center border-2 border-black">
                    <Crown className="w-2 h-2 md:w-3 md:h-3 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <h2 className="text-lg md:text-2xl font-bold text-white truncate">Администратор Системы</h2>
                    <Badge variant="outline" className="border-[#7B61FF]/50 text-[#7B61FF] bg-[#7B61FF]/10 w-fit">
                      <Star className="w-3 h-3 mr-1" />
                      {userLevel.title}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm md:text-base">Уровень {userLevel.level} • {userLevel.experience.toLocaleString()} XP</p>
                  <div className="mt-2">
                    <Progress
                      value={(userLevel.experience / userLevel.experienceToNext) * 100}
                      className="w-full md:w-64 h-2"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Ещё {(userLevel.experienceToNext - userLevel.experience).toLocaleString()} XP до уровня {userLevel.level + 1}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 md:space-x-6 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-[#7B61FF]">{earnedAchievements.length}</div>
                  <div className="text-xs text-white/50">Достижений</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-green-400">{totalPoints}</div>
                  <div className="text-xs text-white/50">Очков</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-yellow-400 flex items-center">
                    <Flame className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                    7
                  </div>
                  <div className="text-xs text-white/50">Дней подряд</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Заголовок дашборда */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0"
      >
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Добро пожаловать в Rundex CRM
          </h1>
          <p className="text-white/70 mt-1 md:mt-2 text-sm md:text-lg">Обзор вашей CRM-системы и текущих показателей</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <Button
            variant="ghost"
            onClick={() => window.open('/dashboard/volodya', '_blank')}
            className="text-[#7B61FF] hover:bg-[#7B61FF]/10 border border-[#7B61FF]/20 backdrop-blur-sm justify-center sm:justify-start"
          >
            <Bot className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Спросить Володю</span>
            <span className="sm:hidden">Володя</span>
          </Button>
          <Button
            onClick={() => setIsQuickActionsOpen(true)}
            className="bg-gradient-to-r from-[#7B61FF] to-[#6B51EF] hover:from-[#6B51EF] hover:to-[#5A41DF] text-white shadow-lg hover:shadow-xl transition-all duration-300 justify-center"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Быстрое действие</span>
            <span className="sm:hidden">Действие</span>
          </Button>
        </div>
      </motion.div>

      {/* Статистика */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6"
      >
        {stats.map((stat, index) => (
          <DashboardStatCard key={stat.title} stat={stat} index={index} />
        ))}
      </motion.div>

      {/* Достижения и геймификация */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6"
      >
        {/* Достижения */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                Достижения
              </CardTitle>
              <CardDescription className="text-white/70">
                Ваши достижения в работе с CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
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
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-medium ${
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
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Ежедневные вызовы */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-400" />
                Ежедневные вызовы
              </CardTitle>
              <CardDescription className="text-white/70">
                Выполняйте задания для опыта и наград
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 md:space-y-3">
              <div className="space-y-2 md:space-y-3">
                {dailyChallenges.map((challenge, index) => (
                  <DashboardDailyChallengeItem key={challenge.id} challenge={challenge} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Статистика дня */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Flame className="w-5 h-5 mr-2 text-orange-400" />
                Статистика дня
              </CardTitle>
              <CardDescription className="text-white/70">
                Ваш прогресс сегодня
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{recentActivities.length}</div>
                  <div className="text-xs text-white/60">Действий</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{completedChallenges}</div>
                  <div className="text-xs text-white/60">Завершено</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">45</div>
                  <div className="text-xs text-white/60">Минут</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">85%</div>
                  <div className="text-xs text-white/60">Эффект.</div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Получено XP сегодня:</span>
                  <span className="text-yellow-400 font-medium">+125 XP</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-white/70">Серия дней:</span>
                  <div className="flex items-center text-orange-400">
                    <Flame className="w-4 h-4 mr-1" />
                    <span className="font-medium">7 дней</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Недавняя активность */}
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Недавняя активность
            </CardTitle>
            <CardDescription className="text-white/70">
              Последние действия в системе
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-white/70">{activity.subject}</span>
                  </p>
                  <p className="text-xs text-white/50">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Предстоящие задачи */}
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Предстоящие задачи
            </CardTitle>
            <CardDescription className="text-white/70">
              Ваши ближайшие задачи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-white/50">{task.time}</p>
                </div>
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                  {task.priority === 'high' ? 'Высокий' :
                   task.priority === 'medium' ? 'Средний' : 'Низкий'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Быстрые действия</CardTitle>
          <CardDescription className="text-white/70">
            Часто используемые функции системы
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <Button
              variant="outline"
              className="h-16 md:h-20 flex-col border-white/20 hover:bg-white/10 transition-all duration-200"
              onClick={() => window.open('/dashboard/leads/new', '_blank')}
            >
              <UserPlus className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm text-center leading-tight">Новый лид</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex-col border-white/20 hover:bg-white/10 transition-all duration-200"
              onClick={() => window.open('/dashboard/contacts/new', '_blank')}
            >
              <Users className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm text-center leading-tight">Добавить контакт</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex-col border-white/20 hover:bg-white/10 transition-all duration-200"
              onClick={() => window.open('/dashboard/opportunities/new', '_blank')}
            >
              <Target className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm text-center leading-tight">Создать сделку</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 md:h-20 flex-col border-white/20 hover:bg-white/10 transition-all duration-200"
              onClick={() => window.open('/dashboard/tasks/new', '_blank')}
            >
              <CheckSquare className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm text-center leading-tight">Новая задача</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Рекомендации от Володи */}
      <VolodyaInsights />

      {/* Модальное окно быстрых действий */}
      <Dialog open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
        <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Быстрые действия</DialogTitle>
            <DialogDescription className="text-white/70">
              Выберите действие для быстрого выполнения
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 flex-col border-white/20 hover:bg-white/10"
              onClick={() => {
                window.open('/dashboard/leads/new', '_blank')
                setIsQuickActionsOpen(false)
              }}
            >
              <UserPlus className="w-5 h-5 mb-2" />
              <span className="text-sm">Новый лид</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col border-white/20 hover:bg-white/10"
              onClick={() => {
                window.open('/dashboard/contacts/new', '_blank')
                setIsQuickActionsOpen(false)
              }}
            >
              <Users className="w-5 h-5 mb-2" />
              <span className="text-sm">Контакт</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col border-white/20 hover:bg-white/10"
              onClick={() => {
                window.open('/dashboard/opportunities/new', '_blank')
                setIsQuickActionsOpen(false)
              }}
            >
              <Target className="w-5 h-5 mb-2" />
              <span className="text-sm">Сделка</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex-col border-white/20 hover:bg-white/10"
              onClick={() => {
                window.open('/dashboard/tasks/new', '_blank')
                setIsQuickActionsOpen(false)
              }}
            >
              <CheckSquare className="w-5 h-5 mb-2" />
              <span className="text-sm">Задача</span>
            </Button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-white/70 mb-3">Быстрый анализ</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-white/20 hover:bg-white/10"
                onClick={() => {
                  window.open('/dashboard/analytics', '_blank')
                  setIsQuickActionsOpen(false)
                }}
              >
                📊 Аналитика
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-white/20 hover:bg-white/10"
                onClick={() => {
                  window.open('/dashboard/reports', '_blank')
                  setIsQuickActionsOpen(false)
                }}
              >
                📋 Отчеты
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
