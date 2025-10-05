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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

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
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)
  const [kpiData, setKpiData] = useState<any>(null)
  const [salesTrends, setSalesTrends] = useState<any>(null)
  const [leadsBySource, setLeadsBySource] = useState<any>(null)
  const [pipelineData, setPipelineData] = useState<any>(null)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      // Загружаем все данные аналитики параллельно
      const [kpisResponse, trendsResponse, sourcesResponse, pipelineResponse] = await Promise.all([
        fetch(`/api/v1/analytics/kpis?period=${timeRange}`),
        fetch(`/api/v1/analytics/sales-trends?period=${timeRange === '30d' ? '3m' : timeRange === '90d' ? '6m' : '1y'}`),
        fetch(`/api/v1/analytics/leads-by-source?period=${timeRange}`),
        fetch(`/api/v1/analytics/pipeline?period=${timeRange}`)
      ])

      if (kpisResponse.ok) {
        const kpis = await kpisResponse.json()
        setKpiData(kpis)
      }

      if (trendsResponse.ok) {
        const trends = await trendsResponse.json()
        setSalesTrends(trends)
      }

      if (sourcesResponse.ok) {
        const sources = await sourcesResponse.json()
        setLeadsBySource(sources)
      }

      if (pipelineResponse.ok) {
        const pipeline = await pipelineResponse.json()
        setPipelineData(pipeline)
      }

    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
    }
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
        {kpiData ? (
          <>
            {/* Общий доход */}
            <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Общий доход</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {kpiData.totalRevenue ? `${(kpiData.totalRevenue.value / 1000).toFixed(0)}k ₽` : '0 ₽'}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpiData.totalRevenue?.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpiData.totalRevenue?.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}>
                        {kpiData.totalRevenue?.change ? `${kpiData.totalRevenue.change}%` : '0%'}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Новые лиды */}
            <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Новые лиды</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {kpiData.leadsCount?.value || 0}
                    </p>
                    <div className="flex items-center mt-2">
                      {kpiData.leadsCount?.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        kpiData.leadsCount?.trend === "up" ? "text-green-400" : "text-red-400"
                      }`}>
                        {kpiData.leadsCount?.change ? `${kpiData.leadsCount.change}%` : '0%'}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Конверсия */}
            <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Конверсия</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {kpiData.conversionRate?.value ? `${kpiData.conversionRate.value.toFixed(1)}%` : '0%'}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-blue-400">
                        За период
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Активные сделки */}
            <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Активные сделки</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {kpiData.opportunitiesCount?.value || 0}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-orange-400">
                        В работе
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-white/5`}>
                    <Activity className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Заглушки при загрузке
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="bg-black/80 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-8 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
            {salesTrends ? (
              <div className="h-64">
                <Line
                  data={{
                    labels: salesTrends.data?.map((item: any) => item.month) || [],
                    datasets: [
                      {
                        label: 'Доход (₽)',
                        data: salesTrends.data?.map((item: any) => item.value) || [],
                        borderColor: '#7B61FF',
                        backgroundColor: 'rgba(123, 97, 255, 0.1)',
                        tension: 0.4,
                        fill: true,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                          label: (context) => `${context.parsed.y.toLocaleString()} ₽`
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#ffffff'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#ffffff',
                          callback: (value) => `${(Number(value) / 1000).toFixed(0)}k ₽`
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-white/60">Загрузка данных...</div>
              </div>
            )}
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
            {leadsBySource ? (
              <div className="h-64">
                <Pie
                  data={{
                    labels: leadsBySource.data?.map((item: any) => item.label) || [],
                    datasets: [
                      {
                        data: leadsBySource.data?.map((item: any) => item.count) || [],
                        backgroundColor: [
                          '#7B61FF',
                          '#6B51EF',
                          '#5A41DF',
                          '#4A31CF',
                          '#3A21BF',
                          '#2A11AF',
                          '#1A019F',
                          '#0A008F'
                        ],
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                        labels: {
                          color: '#ffffff',
                          padding: 20,
                          usePointStyle: true
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                          label: (context) => {
                            const data = leadsBySource.data?.[context.dataIndex]
                            return `${data?.count} лидов (${data?.percentage}%)`
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-white/60">Загрузка данных...</div>
              </div>
            )}
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
            {pipelineData ? (
              <div className="space-y-4">
                {pipelineData.data?.map((stage: any, index: number) => (
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
                          {stage.label}
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

                {/* Статистика воронки */}
                {pipelineData.summary && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">
                          {pipelineData.summary.winRate}%
                        </div>
                        <div className="text-white/60">Конверсия</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">
                          {(pipelineData.summary.weightedValue / 1000).toFixed(0)}k ₽
                        </div>
                        <div className="text-white/60">Прогноз</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-6 bg-white/20 rounded"></div>
                        <div className="w-16 h-4 bg-white/20 rounded"></div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="w-12 h-4 bg-white/20 rounded ml-auto"></div>
                        <div className="w-16 h-3 bg-white/20 rounded ml-auto"></div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded"></div>
                  </div>
                ))}
              </div>
            )}
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

