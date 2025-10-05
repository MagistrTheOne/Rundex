// Rundex CRM - API для AI-ассистента Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SberAdapter, VolodyaMessage } from "@/lib/volodya/sberAdapter"
import { cacheService, CACHE_KEYS, CACHE_TTL, clearUserCache } from "@/lib/cache/cache-service"
import OpenAI from "openai"

// Инициализация AI клиентов
const sberAdapter = new SberAdapter()
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Сообщение обязательно" }, { status: 400 })
    }

    // Получение данных пользователя для контекста (с кешированием)
    const userData = await cacheService.getOrSet(
      CACHE_KEYS.user(session.user!.email!),
      () => getUserCRMData(session.user!.email!),
      CACHE_TTL.user
    )

    // Преобразование контекста в формат для AI
    const conversationHistory: VolodyaMessage[] = context?.previousMessages?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
      timestamp: Date.now()
    })) || []

    // Генерация ответа через AI
    const aiResponse = await generateAIResponse(message, userData, conversationHistory)

    // Анализ запроса для дополнительных данных
    const queryAnalysis = await analyzeQueryIntent(message, userData)

    // Сохранение активности
    await prisma.activity.create({
      data: {
        type: "NOTE",
        subject: "Запрос к AI-ассистенту Володе",
        description: `Вопрос: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
        userId: session.user.email
      }
    })

    // Создание/обновление сессии чата
    let chatSession = await (prisma as any).chatSession.findFirst({
      where: {
        userId: session.user.email,
        updatedAt: {
          gte: new Date(Date.now() - 30 * 60 * 1000) // Активная сессия в последние 30 минут
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    if (!chatSession) {
      // Создаем новую сессию чата
      chatSession = await (prisma as any).chatSession.create({
        data: {
          userId: session.user.email,
          title: `Чат с Володей - ${new Date().toLocaleDateString('ru-RU')}`
        }
      })
    }

    // Сохранение сообщений пользователя и ассистента
    await (prisma as any).chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'user',
        content: message
      }
    })

    await (prisma as any).chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: 'assistant',
        content: aiResponse.response,
        confidence: aiResponse.confidence,
        source: aiResponse.source,
        data: queryAnalysis.data ? JSON.stringify(queryAnalysis.data) : null
      }
    })

    // Обновление времени сессии
    await (prisma as any).chatSession.update({
      where: { id: chatSession.id },
      data: { updatedAt: new Date() }
    })

    // Очистка кеша истории чатов пользователя
    await cacheService.clearByPrefix(`chat_history:${session.user.email}`)
    await cacheService.clearByPrefix(`chat_count:${session.user.email}`)

    return NextResponse.json({
      response: aiResponse.response,
      suggestions: queryAnalysis.suggestions,
      data: queryAnalysis.data,
      confidence: aiResponse.confidence,
      source: aiResponse.source
    })

  } catch (error) {
    console.error("Ошибка в AI-ассистенте:", error)
    return NextResponse.json(
      {
        error: "Произошла ошибка при обработке запроса",
        response: "Извините, произошла ошибка. Попробуйте позже.",
        suggestions: ["Попробовать снова", "Связаться с поддержкой"]
      },
      { status: 500 }
    )
  }
}

// Получение данных CRM пользователя для контекста
async function getUserCRMData(userId: string) {
  const [
    leads,
    contacts,
    opportunities,
    tasks,
    recentActivities
  ] = await Promise.all([
    prisma.lead.findMany({
      where: { assignedToId: userId },
      take: 50,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.contact.findMany({
      where: { createdById: userId },
      take: 50,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.opportunity.findMany({
      where: { assignedToId: userId },
      include: { products: true },
      take: 30,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.task.findMany({
      where: { assignedToId: userId },
      take: 30,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.activity.findMany({
      where: { userId },
      take: 20,
      orderBy: { createdAt: "desc" }
    })
  ])

  // Расчёт статистики
  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(l => l.status === "NEW").length,
    qualifiedLeads: leads.filter(l => l.status === "QUALIFIED").length,
    totalContacts: contacts.length,
    activeOpportunities: opportunities.filter(o => o.stage !== "CLOSED_WON" && o.stage !== "CLOSED_LOST").length,
    totalRevenue: opportunities
      .filter(o => o.stage === "CLOSED_WON")
      .reduce((sum, o) => sum + o.amount, 0),
    pendingTasks: tasks.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").length,
    completedTasks: tasks.filter(t => t.status === "COMPLETED").length
  }

  return {
    leads,
    contacts,
    opportunities,
    tasks,
    activities: recentActivities,
    stats
  }
}

// Генерация ответа от Володи
async function generateVolodyaResponse(message: string, userData: any, context?: any) {
  const lowerMessage = message.toLowerCase()

  // Анализ типа запроса
  const queryType = analyzeQueryType(lowerMessage)

  let response = ""
  let suggestions: string[] = []
  let data: any = null

  switch (queryType) {
    case "leads_analysis":
      response = generateLeadsAnalysis(userData)
      suggestions = [
        "Показать высоко-приоритетные лиды",
        "Создать задачу для контакта с лидами",
        "Анализ источников лидов"
      ]
      data = { leads: userData.leads.slice(0, 10) }
      break

    case "sales_performance":
      response = generateSalesAnalysis(userData)
      suggestions = [
        "Детальный отчёт по продажам",
        "Анализ конверсии по этапам",
        "Прогноз на следующий месяц"
      ]
      data = { opportunities: userData.opportunities }
      break

    case "tasks_management":
      response = generateTasksAnalysis(userData)
      suggestions = [
        "Показать просроченные задачи",
        "Распределить задачи по приоритетам",
        "Отчёт по продуктивности"
      ]
      data = { tasks: userData.tasks }
      break

    case "contacts_search":
      response = generateContactsAnalysis(userData)
      suggestions = [
        "Создать сегмент контактов",
        "Экспорт контактов",
        "Анализ по регионам"
      ]
      data = { contacts: userData.contacts.slice(0, 10) }
      break

    case "statistics_overview":
      response = generateStatsOverview(userData)
      suggestions = [
        "Подробная статистика",
        "Сравнение с прошлым периодом",
        "Рекомендации по улучшению"
      ]
      data = userData.stats
      break

    default:
      // Использование OpenAI если доступен, иначе общий ответ
      if (openai) {
        try {
          const systemPrompt = `Ты Володя, дружелюбный и профессиональный AI-ассистент в российской CRM-системе Rundex.
          Ты всегда отвечаешь на русском языке. Ты помогаешь анализировать данные о лидах, контактах, продажах и задачах.
          Будь полезным, конкретным и давай практические рекомендации.

          Контекст данных пользователя:
          - Лиды: ${userData.stats.totalLeads} (новых: ${userData.stats.newLeads})
          - Контакты: ${userData.stats.totalContacts}
          - Сделки: ${userData.stats.activeOpportunities} активных
          - Задачи: ${userData.stats.pendingTasks} в работе`

          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            max_tokens: 500,
            temperature: 0.7
          })

          response = completion.choices[0]?.message?.content || "Извините, не удалось сгенерировать ответ."
        } catch (error) {
          console.error("Ошибка OpenAI:", error)
          response = generateFallbackResponse(message, userData)
        }
      } else {
        response = generateFallbackResponse(message, userData)
      }

      suggestions = [
        "Показать статистику лидов",
        "Анализ продаж",
        "Управление задачами"
      ]
  }

  return { content: response, suggestions, data }
}

// Анализ типа запроса
function analyzeQueryType(message: string): string {
  if (message.includes("лид") || message.includes("lead") || message.includes("потенциал")) {
    return "leads_analysis"
  }
  if (message.includes("продаж") || message.includes("воронк") || message.includes("сделк") || message.includes("доход")) {
    return "sales_performance"
  }
  if (message.includes("задач") || message.includes("task") || message.includes("работ")) {
    return "tasks_management"
  }
  if (message.includes("контакт") || message.includes("contact") || message.includes("клиент")) {
    return "contacts_search"
  }
  if (message.includes("статистик") || message.includes("анализ") || message.includes("отчёт")) {
    return "statistics_overview"
  }
  return "general"
}

// Генерация ответов для разных типов запросов
function generateLeadsAnalysis(userData: any): string {
  const { stats, leads } = userData
  const highPriorityLeads = leads.filter((l: any) => l.priority === "HIGH" || l.priority === "URGENT")

  return `Анализ ваших лидов:

📊 **Общая статистика:**
• Всего лидов: ${stats.totalLeads}
• Новых: ${stats.newLeads}
• Квалифицированных: ${stats.qualifiedLeads}

🎯 **Приоритетные лиды:** ${highPriorityLeads.length}
${highPriorityLeads.slice(0, 3).map((lead: any) =>
  `• ${lead.firstName} ${lead.lastName} (${lead.company || 'Без компании'}) - ${lead.status}`
).join('\n')}

💡 **Рекомендации:**
• Свяжитесь с ${stats.newLeads} новыми лидами в ближайшие 24 часа
• Фокусируйтесь на ${highPriorityLeads.length} высоко-приоритетных контактах`
}

function generateSalesAnalysis(userData: any): string {
  const { stats, opportunities } = userData
  const activeOpps = opportunities.filter((o: any) => o.stage !== "CLOSED_WON" && o.stage !== "CLOSED_LOST")
  const wonOpps = opportunities.filter((o: any) => o.stage === "CLOSED_WON")

  const avgDealSize = wonOpps.length > 0
    ? wonOpps.reduce((sum: number, o: any) => sum + o.amount, 0) / wonOpps.length
    : 0

  return `Анализ продаж:

📈 **Текущие показатели:**
• Активных сделок: ${stats.activeOpportunities}
• Закрытых успешно: ${wonOpps.length}
• Общий доход: ${stats.totalRevenue.toLocaleString('ru-RU')} ₽
• Средний размер сделки: ${avgDealSize.toLocaleString('ru-RU')} ₽

🎯 **Воронка продаж:**
${activeOpps.slice(0, 3).map((opp: any) =>
  `• ${opp.name}: ${opp.amount.toLocaleString('ru-RU')} ₽ (${opp.stage})`
).join('\n')}

💡 **Рекомендации:**
• Увеличьте конверсию на этапе переговоров
• Фокусируйтесь на сделках с вероятностью >70%`
}

function generateTasksAnalysis(userData: any): string {
  const { stats, tasks } = userData
  const pendingTasks = tasks.filter((t: any) => t.status === "OPEN" || t.status === "IN_PROGRESS")
  const urgentTasks = pendingTasks.filter((t: any) => t.priority === "HIGH" || t.priority === "URGENT")

  return `Анализ задач:

📋 **Статус задач:**
• Всего задач: ${tasks.length}
• В работе: ${stats.pendingTasks}
• Выполнено: ${stats.completedTasks}
• Срочных: ${urgentTasks.length}

⚡ **Приоритетные задачи:**
${urgentTasks.slice(0, 3).map((task: any) =>
  `• ${task.title} (${task.priority})`
).join('\n')}

💡 **Рекомендации:**
• Завершите ${urgentTasks.length} срочных задач сегодня
• Перераспределите нагрузку между командой`
}

function generateContactsAnalysis(userData: any): string {
  const { stats, contacts } = userData
  const recentContacts = contacts.slice(0, 5)

  return `Анализ контактов:

👥 **База контактов:**
• Всего контактов: ${stats.totalContacts}
• Недавно добавленных: ${recentContacts.length}

📍 **Последние контакты:**
${recentContacts.map((contact: any) =>
  `• ${contact.firstName} ${contact.lastName} (${contact.company || 'Без компании'})`
).join('\n')}

💡 **Рекомендации:**
• Активизируйте неактивные контакты
• Создайте сегменты для targeted коммуникаций`
}

function generateStatsOverview(userData: any): string {
  const { stats } = userData

  return `Обзор статистики Rundex CRM:

📊 **Ключевые метрики:**
• Лиды: ${stats.totalLeads} (новых: ${stats.newLeads})
• Контакты: ${stats.totalContacts}
• Активные сделки: ${stats.activeOpportunities}
• Задачи в работе: ${stats.pendingTasks}
• Общий доход: ${stats.totalRevenue.toLocaleString('ru-RU')} ₽

📈 **Продуктивность:**
• Выполнено задач: ${stats.completedTasks}
• Конверсия лидов: ${stats.totalLeads > 0 ? Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) : 0}%

💡 **Рекомендации:**
• Увеличьте скорость обработки новых лидов
• Оптимизируйте процесс квалификации`
}

function generateFallbackResponse(message: string, userData: any): string {
  return `Я понимаю ваш запрос "${message}", но мне нужно больше контекста для точного ответа.

У вас в системе:
• ${userData.stats?.totalLeads || 0} лидов
• ${userData.stats?.totalContacts || 0} контактов
• ${userData.stats?.activeOpportunities || 0} активных сделок

Попробуйте спросить конкретнее:
• "Показать статистику лидов"
• "Какие задачи просрочены"
• "Анализ продаж за месяц"`
}

function getSuggestionsForType(queryType: string): string[] {
  switch (queryType) {
    case "leads_analysis":
      return ["Показать высоко-приоритетные лиды", "Создать задачу для контакта с лидами", "Анализ источников лидов"]
    case "sales_performance":
      return ["Детальный отчёт по продажам", "Анализ конверсии по этапам", "Прогноз на следующий месяц"]
    case "tasks_management":
      return ["Показать просроченные задачи", "Распределить задачи по приоритетам", "Отчёт по продуктивности"]
    case "contacts_search":
      return ["Создать сегмент контактов", "Экспорт контактов", "Анализ по регионам"]
    case "statistics_overview":
      return ["Подробная статистика", "Сравнение с прошлым периодом", "Рекомендации по улучшению"]
    default:
      return ["Показать статистику лидов", "Анализ продаж", "Управление задачами"]
  }
}

// Генерация ответа через AI (Sber или OpenAI)
async function generateAIResponse(
  message: string,
  userData: any,
  conversationHistory: VolodyaMessage[]
): Promise<{ response: string; confidence: number; source: 'gigachat' | 'openai' | 'fallback' }> {
  try {
    // Пытаемся использовать Sber GigaChat
    const sberResponse = await SberAdapter.generateResponse(message, userData, conversationHistory)
    if (sberResponse.confidence > 0.7) {
      return {
        response: sberResponse.response,
        confidence: sberResponse.confidence,
        source: 'gigachat'
      }
    }
  } catch (error) {
    console.error('Sber AI error:', error)
  }

  // Fallback на OpenAI
  if (openai) {
    try {
      const systemPrompt = `Ты Володя, дружелюбный и профессиональный AI-ассистент в российской CRM-системе Rundex.
      Ты всегда отвечаешь на русском языке. Ты помогаешь анализировать данные о лидах, контактах, продажах и задачах.
      Будь полезным, конкретным и давай практические рекомендации.

      Контекст данных пользователя:
      - Лиды: ${userData.stats.totalLeads} (новых: ${userData.stats.newLeads})
      - Контакты: ${userData.stats.totalContacts}
      - Сделки: ${userData.stats.activeOpportunities} активных, доход: ${userData.stats.totalRevenue}₽
      - Задачи: ${userData.stats.pendingTasks} в работе`

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...conversationHistory.slice(-3).map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        { role: "user" as const, content: message }
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 500,
        temperature: 0.7
      })

      const response = completion.choices[0]?.message?.content || "Извините, не удалось сгенерировать ответ."

      return {
        response,
        confidence: 0.8,
        source: 'openai'
      }
    } catch (error) {
      console.error('OpenAI error:', error)
    }
  }

  // Последний fallback - синхронный анализ
  const analysisResult = analyzeQueryType(message)
  const response = {
    content: generateFallbackResponse(message, userData),
    suggestions: getSuggestionsForType(analysisResult),
    data: null
  }
  return {
    response: response.content,
    confidence: 0.5,
    source: 'fallback'
  }
}

// Анализ намерения запроса для дополнительных данных и предложений
async function analyzeQueryIntent(message: string, userData: any): Promise<{
  suggestions: string[];
  data: any;
  intent: string;
}> {
  const lowerMessage = message.toLowerCase()
  let intent = 'general'
  let suggestions: string[] = []
  let data: any = null

  // Анализ лидов
  if (lowerMessage.includes('лид') || lowerMessage.includes('lead') || lowerMessage.includes('потенциал')) {
    intent = 'leads'
    suggestions = [
      'Показать квалифицированные лиды',
      'Создать задачу для контакта с лидом',
      'Анализ источников лидов',
      'Экспорт лидов в CSV'
    ]
    data = {
      leads: userData.leads.slice(0, 5),
      stats: {
        total: userData.stats.totalLeads,
        new: userData.stats.newLeads,
        qualified: userData.stats.qualifiedLeads
      }
    }
  }

  // Анализ продаж
  else if (lowerMessage.includes('продаж') || lowerMessage.includes('воронк') || lowerMessage.includes('сделк') || lowerMessage.includes('доход')) {
    intent = 'sales'
    suggestions = [
      'Детальный отчёт по продажам',
      'Анализ конверсии по этапам',
      'Показать крупные сделки',
      'Прогноз дохода на месяц'
    ]
    data = {
      opportunities: userData.opportunities.slice(0, 5),
      stats: {
        active: userData.stats.activeOpportunities,
        revenue: userData.stats.totalRevenue,
        avgDealSize: userData.opportunities.filter((o: any) => o.stage === 'CLOSED_WON').length > 0
          ? userData.opportunities.filter((o: any) => o.stage === 'CLOSED_WON').reduce((sum: number, o: any) => sum + o.amount, 0) /
            userData.opportunities.filter((o: any) => o.stage === 'CLOSED_WON').length
          : 0
      }
    }
  }

  // Анализ задач
  else if (lowerMessage.includes('задач') || lowerMessage.includes('task') || lowerMessage.includes('работ')) {
    intent = 'tasks'
    suggestions = [
      'Показать просроченные задачи',
      'Распределить задачи по приоритетам',
      'Создать новую задачу',
      'Отчёт по продуктивности'
    ]
    data = {
      tasks: userData.tasks.slice(0, 5),
      stats: {
        pending: userData.stats.pendingTasks,
        completed: userData.stats.completedTasks,
        urgent: userData.tasks.filter((t: any) => t.priority === 'HIGH' || t.priority === 'URGENT').length
      }
    }
  }

  // Анализ контактов
  else if (lowerMessage.includes('контакт') || lowerMessage.includes('contact') || lowerMessage.includes('клиент')) {
    intent = 'contacts'
    suggestions = [
      'Найти контакты из Москвы',
      'Создать сегмент контактов',
      'Экспорт контактов',
      'Связать контакты с лидами'
    ]
    data = {
      contacts: userData.contacts.slice(0, 5),
      stats: {
        total: userData.stats.totalContacts
      }
    }
  }

  // Общая статистика
  else {
    intent = 'stats'
    suggestions = [
      'Показать все KPI',
      'Сравнить с прошлым месяцем',
      'Экспорт отчёта',
      'Рекомендации по улучшению'
    ]
    data = userData.stats
  }

  return { suggestions, data, intent }
}
