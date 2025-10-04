// Rundex CRM - API для AI-ассистента Володи
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

// Инициализация OpenAI (если ключ предоставлен)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Сообщение обязательно" }, { status: 400 })
    }

    // Получение данных пользователя для контекста
    const userData = await getUserCRMData(session.user.email)

    // Анализ запроса и генерация ответа
    const response = await generateVolodyaResponse(message, userData, context)

    // Сохранение активности
    await prisma.activity.create({
      data: {
        type: "NOTE",
        subject: "Запрос к AI-ассистенту Володе",
        description: `Вопрос: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
        userId: session.user.email
      }
    })

    return NextResponse.json({
      response: response.content,
      suggestions: response.suggestions,
      data: response.data
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
• ${userData.stats.totalLeads} лидов
• ${userData.stats.totalContacts} контактов
• ${userData.stats.activeOpportunities} активных сделок

Попробуйте спросить конкретнее:
• "Показать статистику лидов"
• "Какие задачи просрочены"
• "Анализ продаж за месяц"`
}
