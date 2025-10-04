// Rundex CRM - Компонент рекомендаций Володи в дашборде
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bot,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  Clock,
  RefreshCw,
  MessageSquare,
  Eye,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

interface VolodyaInsight {
  id: string
  type: 'task' | 'trend' | 'kpi' | 'alert' | 'opportunity'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'sales' | 'leads' | 'tasks' | 'analytics' | 'system'
  actionable: boolean
  timestamp: string
}

interface SarcasticComment {
  id: string
  comment: string
  type: 'sarcastic' | 'concerned' | 'amused'
  timestamp: string
}

export function VolodyaInsights() {
  const [insights, setInsights] = useState<VolodyaInsight[]>([])
  const [sarcasticComments, setSarcasticComments] = useState<SarcasticComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Генерация AI-инсайтов на основе анализа данных CRM
  const generateInsights = async () => {
    setIsLoading(true)

    try {
      console.log('🔍 Fetching monitoring data...')
      // Получаем данные из API мониторинга
      const response = await fetch('/api/volodya/monitor')
      const data = await response.json()

      if (!response.ok) {
        console.error('❌ API error:', response.status, data)
        throw new Error('Failed to fetch monitoring data')
      }

      console.log('✅ Got monitoring data:', data)
      const { stats: monitoringStats, report: monitoringReport } = data

      // Генерация инсайтов на основе реальных данных
      const realInsights: VolodyaInsight[] = []
      console.log('📊 Monitoring stats:', monitoringStats)

      // Инсайт о продуктивности
      if (monitoringStats.last24hChanges > 0) {
        realInsights.push({
          id: 'productivity',
          type: 'kpi',
          title: `Активность CRM: ${monitoringStats.last24hChanges} изменений`,
          description: `За последние 24 часа в системе произошло ${monitoringStats.last24hChanges} изменений. ${monitoringStats.criticalIssues > 0 ? `Обнаружено ${monitoringStats.criticalIssues} критических проблем.` : 'Система работает стабильно.'}`,
          impact: monitoringStats.criticalIssues > 0 ? 'high' : 'low',
          category: 'analytics',
          actionable: monitoringStats.criticalIssues > 0,
          timestamp: new Date().toISOString()
        })
      }

      // Инсайты на основе рекомендаций из мониторинга
      monitoringReport.summary.recommendations.forEach((rec: string, index: number) => {
        realInsights.push({
          id: `rec-${index}`,
          type: 'opportunity',
          title: 'Рекомендация по оптимизации',
          description: rec,
          impact: 'medium',
          category: 'system',
          actionable: true,
          timestamp: new Date().toISOString()
        })
      })

      // Добавляем базовые инсайты если данных мало
      if (realInsights.length < 3) {
        realInsights.push(
          {
            id: 'leads-monitoring',
            type: 'alert',
            title: 'Мониторинг лидов',
            description: 'Володя следит за всеми лидами в реальном времени. Критические изменения будут выделены автоматически.',
            impact: 'medium',
            category: 'leads',
            actionable: false,
            timestamp: new Date().toISOString()
          },
          {
            id: 'ai-insights',
            type: 'trend',
            title: 'AI-анализ трендов',
            description: 'Володя анализирует паттерны в ваших данных и предлагает персонализированные рекомендации.',
            impact: 'low',
            category: 'analytics',
            actionable: false,
            timestamp: new Date().toISOString()
          }
        )
      }

      // Получаем саркастичные комментарии через API
      const commentsResponse = await fetch('/api/volodya/comments')
      const commentsData = commentsResponse.ok ? await commentsResponse.json() : { comments: [] }

      const sarcasticCommentsFromMonitor = commentsData.comments.map((msg: any, index: number) => ({
        id: `comment-${msg.timestamp}-${index}`,
        comment: msg.content.replace('😏 ', ''), // Убираем эмодзи
        type: 'sarcastic' as const,
        timestamp: new Date(msg.timestamp).toISOString()
      }))

      // Добавляем дополнительные саркастичные комментарии на основе статистики
      const additionalComments: SarcasticComment[] = []

      if (monitoringStats.criticalIssues > 0) {
        additionalComments.push({
          id: 'critical-sarcasm',
          comment: `${monitoringStats.criticalIssues} критических проблем ждут вашего внимания. Или они сами решатся по волшебству?`,
          type: 'sarcastic',
          timestamp: new Date().toISOString()
        })
      }

      if (monitoringStats.last24hChanges < 5) {
        additionalComments.push({
          id: 'low-activity',
          comment: 'Сегодня как-то тихо в CRM. Все на обеде или просто отдыхаете?',
          type: 'amused',
          timestamp: new Date().toISOString()
        })
      }

      console.log('🎯 Generated insights:', realInsights)
      console.log('💬 Generated comments:', [...sarcasticCommentsFromMonitor, ...additionalComments])

      // Имитация задержки для UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      setInsights(realInsights)
      setSarcasticComments([...sarcasticCommentsFromMonitor, ...additionalComments])
      setLastUpdate(new Date())

    } catch (error) {
      console.error('Error generating insights:', error)

      // Fallback на базовые инсайты
      const fallbackInsights: VolodyaInsight[] = [
        {
          id: 'monitoring-active',
          type: 'kpi',
          title: 'Система мониторинга активна',
          description: 'Володя следит за изменениями в CRM и анализирует эффективность работы.',
          impact: 'low',
          category: 'system',
          actionable: false,
          timestamp: new Date().toISOString()
        }
      ]

      setInsights(fallbackInsights)
      setSarcasticComments([{
        id: 'error-comment',
        comment: 'Что-то пошло не так с анализом данных. Но hey, по крайней мере я стараюсь!',
        type: 'amused',
        timestamp: new Date().toISOString()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    generateInsights()
  }, [])

  const getInsightIcon = (type: VolodyaInsight['type']) => {
    switch (type) {
      case 'task': return Target
      case 'trend': return TrendingUp
      case 'kpi': return DollarSign
      case 'alert': return AlertTriangle
      case 'opportunity': return Lightbulb
      default: return Bot
    }
  }

  const getInsightColor = (type: VolodyaInsight['type']) => {
    switch (type) {
      case 'task': return 'text-blue-400'
      case 'trend': return 'text-green-400'
      case 'kpi': return 'text-purple-400'
      case 'alert': return 'text-red-400'
      case 'opportunity': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getImpactBadge = (impact: VolodyaInsight['impact']) => {
    const variants = {
      high: { variant: 'destructive' as const, text: 'Высокий' },
      medium: { variant: 'default' as const, text: 'Средний' },
      low: { variant: 'secondary' as const, text: 'Низкий' }
    }
    const variant = variants[impact]
    return <Badge variant={variant.variant}>{variant.text}</Badge>
  }

  const getCategoryIcon = (category: VolodyaInsight['category']) => {
    switch (category) {
      case 'sales': return DollarSign
      case 'leads': return Users
      case 'tasks': return Target
      case 'analytics': return TrendingUp
      case 'system': return Bot
      default: return Bot
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/50 backdrop-blur-xl border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-[#7B61FF]/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#7B61FF]" />
              </div>
              {/* Индикатор мониторинга */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-white flex items-center space-x-2">
                <span>Володя следит за CRM</span>
                <Eye className="w-4 h-4 text-[#7B61FF]" />
              </CardTitle>
              <CardDescription className="text-white/60">
                AI-мониторинг и саркастичные комментарии в реальном времени
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Онлайн
            </Badge>
            <span className="text-xs text-white/50">
              {lastUpdate.toLocaleTimeString('ru-RU')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateInsights}
              disabled={isLoading}
              className="text-white/70 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI Инсайты */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-[#7B61FF]" />
              <span>AI-анализ и рекомендации</span>
            </h3>

            <div className="space-y-3">
              {insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type)
                const CategoryIcon = getCategoryIcon(insight.category)

                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-gray-800 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-lg bg-gray-800/50 ${getInsightColor(insight.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-white font-medium">{insight.title}</h4>
                            {getImpactBadge(insight.impact)}
                          </div>
                          <p className="text-white/70 text-sm mb-2">{insight.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-white/50">
                            <div className="flex items-center space-x-1">
                              <CategoryIcon className="w-3 h-3" />
                              <span className="capitalize">{insight.category}</span>
                            </div>
                            {insight.actionable && (
                              <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                                Действие возможно
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      {insight.actionable && (
                        <Button size="sm" variant="ghost" className="text-[#7B61FF] hover:text-[#6B51EF]">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Обсудить
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Саркастичные комментарии Володи */}
          {sarcasticComments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Bot className="w-5 h-5 text-orange-400" />
                <span>Володя комментирует</span>
                <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-xs">
                  {sarcasticComments.length} комментари{['ев', 'й', 'я'][Math.min(sarcasticComments.length - 1, 2)]}
                </Badge>
              </h3>

              <div className="space-y-3">
                {sarcasticComments.slice(0, 3).map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    className={`p-3 border rounded-lg ${
                      comment.type === 'sarcastic'
                        ? 'bg-orange-500/10 border-orange-500/20'
                        : 'bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        comment.type === 'sarcastic'
                          ? 'bg-orange-500/20'
                          : 'bg-blue-500/20'
                      }`}>
                        <Bot className={`w-4 h-4 ${
                          comment.type === 'sarcastic'
                            ? 'text-orange-400'
                            : 'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 text-sm italic">"{comment.comment}"</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-white/50 text-xs">
                            {new Date(comment.timestamp).toLocaleString('ru-RU')}
                          </p>
                          <Badge variant="outline" className={`text-xs border-current ${
                            comment.type === 'sarcastic'
                              ? 'text-orange-400 border-orange-500/50'
                              : 'text-blue-400 border-blue-500/50'
                          }`}>
                            {comment.type === 'sarcastic' ? 'сарказм' : 'развлечение'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {sarcasticComments.length > 3 && (
                  <div className="text-center">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      Показать ещё {sarcasticComments.length - 3} комментари...
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Быстрые действия */}
          <div className="pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-sm">Быстрые действия:</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="ghost" className="text-[#7B61FF] hover:text-[#6B51EF]">
                  <Target className="w-4 h-4 mr-1" />
                  Создать задачу
                </Button>
                <Button size="sm" variant="ghost" className="text-[#7B61FF] hover:text-[#6B51EF]">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Спросить Володю
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
