// Rundex CRM - Система мониторинга изменений для Володи
// Автор: MagistrTheOne, 2025

import { SberAdapter } from './sberAdapter'
import { ContextManager } from './contextManager'

interface CrmChange {
  id: string
  type: 'lead_created' | 'lead_updated' | 'deal_created' | 'deal_updated' | 'task_created' | 'task_completed' | 'contact_added'
  entityId: string
  description: string
  timestamp: number
  userId?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface MonitoringReport {
  period: {
    start: number
    end: number
  }
  changes: CrmChange[]
  summary: {
    totalChanges: number
    criticalIssues: number
    recommendations: string[]
    sarcasticComments: string[]
  }
  insights: {
    productivityScore: number
    riskLevel: 'low' | 'medium' | 'high'
    opportunities: string[]
  }
}

class CrmMonitor {
  private changes: CrmChange[] = []
  private readonly MONITORING_INTERVAL = 60 * 60 * 1000 // 1 час
  private readonly MAX_CHANGES = 1000

  constructor() {
    // Запускаем периодический мониторинг
    setInterval(() => this.generateReport(), this.MONITORING_INTERVAL)
  }

  /**
   * Регистрация изменения в CRM
   */
  logChange(change: Omit<CrmChange, 'id' | 'timestamp'>): void {
    const newChange: CrmChange = {
      ...change,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    }

    this.changes.push(newChange)

    // Ограничиваем количество хранимых изменений
    if (this.changes.length > this.MAX_CHANGES) {
      this.changes = this.changes.slice(-this.MAX_CHANGES)
    }

    // Немедленная реакция на критические изменения
    if (change.severity === 'critical') {
      this.reactToCriticalChange(newChange)
    }
  }

  /**
   * Генерация отчета о мониторинге
   */
  async generateReport(hours: number = 24): Promise<MonitoringReport> {
    const now = Date.now()
    const startTime = now - (hours * 60 * 60 * 1000)

    const relevantChanges = this.changes.filter(change => change.timestamp >= startTime)

    // Анализ изменений
    const summary = this.analyzeChanges(relevantChanges)
    const insights = await this.generateInsights(relevantChanges)

    const report: MonitoringReport = {
      period: { start: startTime, end: now },
      changes: relevantChanges,
      summary,
      insights
    }

    // Генерация уведомлений
    await this.generateNotifications(report)

    return report
  }

  /**
   * Анализ изменений
   */
  private analyzeChanges(changes: CrmChange[]) {
    const totalChanges = changes.length
    const criticalIssues = changes.filter(c => c.severity === 'critical').length

    const recommendations: string[] = []
    const sarcasticComments: string[] = []

    // Анализ паттернов
    const changeTypes = changes.reduce((acc, change) => {
      acc[change.type] = (acc[change.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Генерация рекомендаций
    if (changeTypes.lead_created && changeTypes.lead_created > 20) {
      recommendations.push("Большой приток лидов! Рассмотрите автоматизацию первичной квалификации.")
      sarcasticComments.push("Ого, лиды сыпятся как из рога изобилия! Вы точно сможете обработать их все, или это просто коллекция?")
    }

    if (criticalIssues > 0) {
      recommendations.push(`Обнаружено ${criticalIssues} критических проблем требующих внимания.`)
      sarcasticComments.push("Критические проблемы множатся быстрее кроликов. Может пора что-то предпринять?")
    }

    if (changeTypes.task_completed && changeTypes.task_completed < changeTypes.task_created) {
      const overdueTasks = (changeTypes.task_created || 0) - (changeTypes.task_completed || 0)
      recommendations.push(`У вас ${overdueTasks} невыполненных задач. Рекомендую перераспределить нагрузку.`)
      sarcasticComments.push(`${overdueTasks} задач висят в воздухе. Они сами себя выполнят со временем?`)
    }

    // Анализ времени активности
    const hourDistribution = changes.reduce((acc, change) => {
      const hour = new Date(change.timestamp).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const peakHour = Object.keys(hourDistribution).reduce((a, b) =>
      hourDistribution[Number(a)] > hourDistribution[Number(b)] ? a : b
    )

    if (peakHour) {
      recommendations.push(`Пик активности приходится на ${peakHour}:00. Оптимизируйте расписание под это время.`)
    }

    return {
      totalChanges,
      criticalIssues,
      recommendations,
      sarcasticComments
    }
  }

  /**
   * Генерация инсайтов на основе изменений
   */
  private async generateInsights(changes: CrmChange[]): Promise<MonitoringReport['insights']> {
    let productivityScore = 85 // Базовый уровень

    // Расчет продуктивности на основе выполненных задач
    const completedTasks = changes.filter(c => c.type === 'task_completed').length
    const createdTasks = changes.filter(c => c.type === 'task_created').length

    if (createdTasks > 0) {
      productivityScore = Math.min(100, (completedTasks / createdTasks) * 100)
    }

    // Оценка рисков
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    const criticalCount = changes.filter(c => c.severity === 'critical').length
    const overdueTasks = createdTasks - completedTasks

    if (criticalCount > 5 || overdueTasks > 10) {
      riskLevel = 'high'
    } else if (criticalCount > 2 || overdueTasks > 5) {
      riskLevel = 'medium'
    }

    // Генерация возможностей через AI
    const opportunities: string[] = []

    if (productivityScore > 90) {
      opportunities.push("Команда показывает отличную продуктивность! Рассмотрите расширение отдела продаж.")
    }

    if (changes.filter(c => c.type === 'deal_created').length > 10) {
      opportunities.push("Высокая активность по сделкам. Рекомендую усилить маркетинговые кампании.")
    }

    // AI-генерация дополнительных инсайтов
    try {
      const aiInsights = await SberAdapter.getVolodyaResponse(
        `Проанализируй эти изменения в CRM и дай 2-3 конкретных рекомендации по улучшению: ${changes.slice(-10).map(c => c.description).join('; ')}`,
        [] // Новая сессия для анализа
      )

      if (aiInsights.source === 'gigachat') {
        opportunities.push(`AI-анализ: ${aiInsights.response.split('.')[0]}`)
      }
    } catch (error) {
      console.warn('Failed to generate AI insights:', error)
    }

    return {
      productivityScore: Math.round(productivityScore),
      riskLevel,
      opportunities
    }
  }

  /**
   * Реакция на критические изменения
   */
  private async reactToCriticalChange(change: CrmChange): Promise<void> {
    try {
      // Создаем саркастичное уведомление
      const sarcasticComment = await this.generateSarcasticComment(change)

      // Сохраняем в контексте для показа пользователю
      ContextManager.addMessage('system-monitoring', {
        role: 'assistant',
        content: `🚨 Критическое изменение: ${change.description}\n\n${sarcasticComment}`
      })

      console.log(`[CrmMonitor] Critical change detected: ${change.description}`)
    } catch (error) {
      console.error('Failed to react to critical change:', error)
    }
  }

  /**
   * Генерация саркастичных комментариев
   */
  private async generateSarcasticComment(change: CrmChange): Promise<string> {
    const sarcasticResponses = {
      lead_created: [
        "Очередной лид пожаловал! Надеюсь, вы не планируете его игнорировать как предыдущие 47 штук?",
        "Новый лид! Может на этот раз вы даже позвоните ему в этом месяце?",
        "Лиды прибывают, а вы всё ещё думаете, что CRM - это просто красивая табличка?"
      ],
      deal_updated: [
        "Сделка обновилась! Или это просто способ показать, что вы ещё работаете?",
        "Обновление сделки - лучший способ создать иллюзию продуктивности!",
        "Сделка изменилась. Надеюсь, это изменение не такое же бесполезное, как предыдущие 12."
      ],
      task_created: [
        "Новая задача создана! Ещё одна причина притвориться занятым.",
        "Задача добавлена в список. Главное, чтобы она не осталась там навсегда.",
        "Создание задач - это искусство. Главное не переусердствовать с их выполнением."
      ]
    }

    const responses = sarcasticResponses[change.type] || [
      "Что-то изменилось в системе. Надеюсь, это не очередная попытка показать активность?",
      "Изменение зафиксировано. Может пора уже что-то сделать с этими данными?",
      "Система отметила изменение. Или это просто способ сказать 'я работаю'?"
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Генерация уведомлений на основе отчета
   */
  private async generateNotifications(report: MonitoringReport): Promise<void> {
    if (report.summary.criticalIssues > 0) {
      // Создаем уведомление о критических проблемах
      const notification = {
        type: 'critical_alert',
        message: `Обнаружено ${report.summary.criticalIssues} критических проблем. Требуется немедленное внимание!`,
        timestamp: Date.now()
      }

      ContextManager.addMessage('system-notifications', {
        role: 'assistant',
        content: `🚨 ${notification.message}\n\nРекомендации: ${report.summary.recommendations.join('; ')}`
      })
    }

    // Саркастичные комментарии
    if (report.summary.sarcasticComments.length > 0) {
      const randomComment = report.summary.sarcasticComments[
        Math.floor(Math.random() * report.summary.sarcasticComments.length)
      ]

      ContextManager.addMessage('sarcastic-comments', {
        role: 'assistant',
        content: `😏 ${randomComment}`
      })
    }
  }

  /**
   * Получение статистики мониторинга
   */
  getStats() {
    const now = Date.now()
    const last24h = this.changes.filter(c => c.timestamp > now - 24 * 60 * 60 * 1000)
    const lastHour = this.changes.filter(c => c.timestamp > now - 60 * 60 * 1000)

    return {
      totalChanges: this.changes.length,
      last24hChanges: last24h.length,
      lastHourChanges: lastHour.length,
      criticalIssues: this.changes.filter(c => c.severity === 'critical').length,
      changeTypes: this.changes.reduce((acc, change) => {
        acc[change.type] = (acc[change.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  }

  /**
   * Имитация создания тестовых изменений (для демонстрации)
   */
  simulateChanges(): void {
    const changeTypes: CrmChange['type'][] = [
      'lead_created', 'deal_updated', 'task_created', 'task_completed',
      'contact_added', 'lead_updated'
    ]

    const severities: CrmChange['severity'][] = ['low', 'medium', 'high', 'critical']

    // Создаем несколько случайных изменений
    for (let i = 0; i < 5; i++) {
      const change: Omit<CrmChange, 'id' | 'timestamp'> = {
        type: changeTypes[Math.floor(Math.random() * changeTypes.length)],
        entityId: `entity-${Math.random().toString(36).substr(2, 9)}`,
        description: `Тестовое изменение ${i + 1} в системе CRM`,
        severity: severities[Math.floor(Math.random() * severities.length)]
      }

      this.logChange(change)
    }
  }
}

// Singleton instance
const crmMonitor = new CrmMonitor()

export default crmMonitor
export type { CrmChange, MonitoringReport }
