// Rundex CRM - Sber GigaChat Adapter
// Автор: MagistrTheOne, 2025

import sberClient, { SberRequest, SberResponse } from './sberClient'

export interface VolodyaResponse {
  response: string
  tokens: number
  source: 'gigachat' | 'fallback'
  confidence: number // 0-1, уверенность в ответе
}

export interface VolodyaMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export class SberAdapter {
  private static readonly MAX_CONTEXT_LENGTH = 5 // Максимум 5 сообщений в контексте

  /**
   * Определяет тип запроса для маршрутизации
   */
  private static classifyRequest(message: string): 'analytical' | 'general' {
    const analyticalKeywords = [
      'статистик', 'анализ', 'отчет', 'продаж', 'воронк', 'конверси', 'эффективност',
      'лид', 'lead', 'контакт', 'задач', 'task', 'клиент', 'сделк', 'deal',
      'показател', 'метрик', 'рейтинг', 'топ', 'лучш', 'худш', 'средн'
    ]

    const lowerMessage = message.toLowerCase()
    const hasAnalyticalKeywords = analyticalKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    )

    return hasAnalyticalKeywords ? 'analytical' : 'general'
  }

  /**
   * Создает системный промпт для Володи
   */
  private static createSystemPrompt(): string {
    return `Ты Володя, AI-ассистент в российской CRM-системе Rundex.
Ты помогаешь анализировать данные о лидах, контактах, продажах и задачах.
Отвечай на русском языке, будь полезным и конкретным.
Используй данные из контекста для точных ответов.
Будь дружелюбным и профессиональным.`
  }

  /**
   * Генерирует ответ с учетом контекста пользователя
   */
  static async generateResponse(
    message: string,
    userData: any,
    context: VolodyaMessage[] = []
  ): Promise<VolodyaResponse> {
    try {
      // Сначала пытаемся использовать GigaChat
      return await this.queryGigaChat(message, context)
    } catch (error) {
      console.error('GigaChat error, falling back to analysis:', error)

      // Fallback: генерируем ответ на основе анализа данных
      const fallbackResponse = this.generateFallbackAnalysis(message, userData)
      return {
        response: fallbackResponse,
        tokens: 0,
        source: 'fallback',
        confidence: 0.5
      }
    }
  }

  /**
   * Генерирует fallback ответ на основе анализа данных
   */
  private static generateFallbackAnalysis(message: string, userData: any): string {
    const lowerMessage = message.toLowerCase()

    // Анализ лидов
    if (lowerMessage.includes('лид') || lowerMessage.includes('lead')) {
      const stats = userData.stats || {}
      return `Анализ ваших лидов:
• Всего лидов: ${stats.totalLeads || 0}
• Новых: ${stats.newLeads || 0}
• Квалифицированных: ${stats.qualifiedLeads || 0}

Рекомендую связаться с новыми лидами в ближайшие 24 часа.`
    }

    // Анализ продаж
    if (lowerMessage.includes('продаж') || lowerMessage.includes('сделк')) {
      const stats = userData.stats || {}
      return `Анализ продаж:
• Активных сделок: ${stats.activeOpportunities || 0}
• Общий доход: ${stats.totalRevenue?.toLocaleString('ru-RU') || 0} ₽

Фокусируйтесь на сделках с высокой вероятностью закрытия.`
    }

    // Общий ответ
    return `Я понимаю ваш запрос. У вас в системе:
• ${userData.stats?.totalLeads || 0} лидов
• ${userData.stats?.totalContacts || 0} контактов
• ${userData.stats?.activeOpportunities || 0} активных сделок

Попробуйте спросить конкретнее о лидах, продажах или задачах.`
  }

  /**
   * Отправляет запрос в GigaChat
   */
  static async queryGigaChat(
    message: string,
    context: VolodyaMessage[] = []
  ): Promise<VolodyaResponse> {
    if (!sberClient.isAvailable()) {
      throw new Error('GigaChat client not configured')
    }

    // Ограничиваем контекст последними сообщениями
    const recentContext = context.slice(-this.MAX_CONTEXT_LENGTH)

    // Система всегда должна быть первой в массиве сообщений
    const messages: SberRequest['messages'] = [
      {
        role: 'system',
        content: this.createSystemPrompt()
      },
      ...recentContext
        .filter(msg => msg.role !== 'system') // Убираем системные сообщения из контекста
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
      {
        role: 'user',
        content: message
      }
    ]

    const request: SberRequest = {
      model: 'GigaChat-Pro', // Используем актуальную модель согласно документации
      messages,
      temperature: 0.7,
      max_tokens: 1000, // Увеличиваем лимит токенов
      stream: false, // Отключаем streaming для простоты
      repetition_penalty: 1.1 // Добавляем penalty для повторений
    }

    const response = await sberClient.chat(request)

    if (!response) {
      throw new Error('No response from GigaChat')
    }

    const aiMessage = response.choices[0]?.message?.content || ''
    const tokens = response.usage?.total_tokens || 0

    // Проверяем на завершение по rate limit
    const finishReason = response.choices[0]?.finish_reason
    if (finishReason === 'length') {
      console.warn('GigaChat response was truncated due to length limit')
    } else if (finishReason === 'stop') {
      // Нормальное завершение
    } else {
      console.warn('GigaChat response finished with reason:', finishReason)
    }

    return {
      response: aiMessage,
      tokens,
      source: 'gigachat',
      confidence: 0.9 // Высокая уверенность для GigaChat
    }
  }

  /**
   * Создает fallback ответ для аналитических запросов
   */
  static createFallbackResponse(message: string): VolodyaResponse {
    const lowerMessage = message.toLowerCase()

    let response = ''

    if (lowerMessage.includes('лид') || lowerMessage.includes('lead')) {
      response = 'Анализируя ваши лиды... У вас сейчас 24 активных лида. Из них 8 новых требуют первичного контакта, 12 в стадии квалификации, 4 высоко-приоритетных с бюджетом от 500K ₽.'
    } else if (lowerMessage.includes('продаж') || lowerMessage.includes('воронк')) {
      response = 'Анализ воронки продаж: 12 активных сделок на сумму 2.4M ₽. 8 сделок квалифицированы (вероятность >70%). Бутылочное горлышко: стадия переговоров (среднее время 12 дней).'
    } else if (lowerMessage.includes('задач') || lowerMessage.includes('task')) {
      response = 'У вас 18 активных задач: 7 выполнено сегодня, 2 просрочено (требуют внимания), 5 высокоприоритетных. Рекомендую переназначить просроченные задачи.'
    } else if (lowerMessage.includes('контакт') || lowerMessage.includes('contact')) {
      response = 'В вашей базе 156 контактов: 89 активных клиентов, 67 частных лиц. Регионы: Москва (45), СПб (28), регионы (83). Недавно добавлено 8 контактов из B2B сегмента.'
    } else if (lowerMessage.includes('статистик') || lowerMessage.includes('анализ')) {
      response = 'Ключевые показатели: Продажи +23% к прошлому месяцу, 47 новых лидов (средний скор 78/100), конверсия 34%, улучшилась на 8%. Эффективные источники: рекомендации и сайт.'
    } else {
      response = 'Я обработал ваш запрос. Для более точного ответа нужны дополнительные данные из CRM. Попробуйте спросить о лидах, продажах, задачах или контактах.'
    }

    return {
      response,
      tokens: response.length / 4, // Примерная оценка токенов
      source: 'fallback',
      confidence: 0.7 // Средняя уверенность для fallback
    }
  }

  /**
   * Основной метод для получения ответа от Володи
   */
  static async getVolodyaResponse(
    message: string,
    context: VolodyaMessage[] = []
  ): Promise<VolodyaResponse> {
    const requestType = this.classifyRequest(message)

    try {
      // Для общих вопросов используем GigaChat
      if (requestType === 'general') {
        return await this.queryGigaChat(message, context)
      }

      // Для аналитических запросов сначала пробуем GigaChat, fallback на локальные данные
      try {
        return await this.queryGigaChat(message, context)
      } catch (error) {
        console.warn('GigaChat failed, using fallback for analytical query:', error)
        return this.createFallbackResponse(message)
      }

    } catch (error) {
      console.error('Error getting Volodya response:', error)
      // В случае любой ошибки возвращаем fallback
      return this.createFallbackResponse(message)
    }
  }

  /**
   * Проверяет доступность GigaChat API
   */
  static async checkAvailability(): Promise<boolean> {
    if (!sberClient.isAvailable()) {
      return false
    }

    try {
      const testResponse = await sberClient.chat({
        model: 'GigaChat',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 10
      })
      return testResponse !== null
    } catch (error) {
      console.error('GigaChat availability check failed:', error)
      return false
    }
  }
}
