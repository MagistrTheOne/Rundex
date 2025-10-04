// Rundex CRM - Страница аналитики
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Calendar,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"

// Моковые данные для аналитики
const analyticsData = {
  kpis: [
    {
      title: "Общий доход",
      value: "2.4M ₽",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-400"
    },
    {
      title: "Новые лиды",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "text-blue-400"
    },
    {
      title: "Конверсия",
      value: "24.3%",
      change: "-2.1%",
      trend: "down",
      icon: Target,
      color: "text-purple-400"
    },
    {
      title: "Активные сделки",
      value: "89",
      change: "+5.7%",
      trend: "up",
      icon: Activity,
      color: "text-orange-400"
    }
  ],
  salesByMonth: [
    { month: "Янв", revenue: 180000, deals: 12 },
    { month: "Фев", revenue: 220000, deals: 15 },
    { month: "Мар", revenue: 195000, deals: 14 },
    { month: "Апр", revenue: 280000, deals: 18 },
    { month: "Май", revenue: 320000, deals: 22 },
    { month: "Июн", revenue: 295000, deals: 19 }
  ],
  leadsBySource: [
    { source: "Органический поиск", count: 45, percentage: 28.7 },
    { source: "Реклама", count: 38, percentage: 24.2 },
    { source: "Социальные сети", count: 32, percentage: 20.4 },
    { source: "Рефералы", count: 25, percentage: 15.9 },
    { source: "Прямой трафик", count: 17, percentage: 10.8 }
  ],
  pipelineStages: [
    { stage: "Поиск", deals: 45, value: 1200000, probability: 10 },
    { stage: "Квалификация", deals: 32, value: 980000, probability: 25 },
    { stage: "Предложение", deals: 18, value: 650000, probability: 50 },
    { stage: "Переговоры", deals: 12, value: 450000, probability: 75 },
    { stage: "Закрыта успешно", deals: 8, value: 320000, probability: 100 }
  ]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = async () => {
    setIsLoading(true)
    // Имитация загрузки данных
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  useEffect(() => {
    refreshData()
  }, [timeRange])

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Аналитика</h2>
          <p className="text-white/70 mt-1">
            Анализ продаж и эффективности бизнеса
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              <SelectItem value="1month" className="text-white">Последний месяц</SelectItem>
              <SelectItem value="3months" className="text-white">3 месяца</SelectItem>
              <SelectItem value="6months" className="text-white">6 месяцев</SelectItem>
              <SelectItem value="1year" className="text-white">Год</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={refreshData}
            disabled={isLoading}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
          <Button className="bg-white text-black hover:bg-white/90">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* KPI Карточки */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {analyticsData.kpis.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title} className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">{kpi.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{kpi.value}</p>
                    <div className="flex items-center mt-2">
                      {kpi.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpi.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График продаж по месяцам */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-blue-400" />
                Продажи по месяцам
              </CardTitle>
              <CardDescription className="text-white/70">
                Динамика доходов и количества сделок
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.salesByMonth.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 text-sm font-medium text-white/70">{month.month}</div>
                      <div className="flex-1">
                        <Progress
                          value={(month.revenue / 350000) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        {(month.revenue / 1000).toFixed(0)}k ₽
                      </div>
                      <div className="text-xs text-white/50">
                        {month.deals} сделок
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Источники лидов */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-purple-400" />
                Источники лидов
              </CardTitle>
              <CardDescription className="text-white/70">
                Распределение по каналам привлечения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.leadsBySource.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
                      <span className="text-sm text-white flex-1">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-white/70">{source.count}</span>
                      <Badge variant="outline" className="border-white/20 text-white/70">
                        {source.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Воронка продаж */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
              Воронка продаж
            </CardTitle>
            <CardDescription className="text-white/70">
              Распределение сделок по этапам и прогнозируемый доход
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.pipelineStages.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${
                        index === 0 ? 'bg-gray-500/20 text-gray-400' :
                        index === 1 ? 'bg-blue-500/20 text-blue-400' :
                        index === 2 ? 'bg-purple-500/20 text-purple-400' :
                        index === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {stage.stage}
                      </Badge>
                      <span className="text-sm text-white/70">
                        {stage.deals} сделок
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">
                        {(stage.value / 1000).toFixed(0)}k ₽
                      </div>
                      <div className="text-xs text-white/50">
                        Вероятность: {stage.probability}%
                      </div>
                    </div>
                  </div>
                  <Progress value={stage.probability} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Дополнительные метрики */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Среднее время цикла</p>
                <p className="text-xl font-bold text-white">24 дня</p>
                <p className="text-xs text-white/50">-3 дня от цели</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Target className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Достигнутые цели</p>
                <p className="text-xl font-bold text-white">78%</p>
                <p className="text-xs text-white/50">+5% за месяц</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Активность команды</p>
                <p className="text-xl font-bold text-white">92%</p>
                <p className="text-xs text-white/50">Среднее по отрасли</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
