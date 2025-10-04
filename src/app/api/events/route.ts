// Rundex CRM - API событий календаря
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/events - Получить события календаря
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const includeRecurring = searchParams.get("includeRecurring") === "true"

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Базовый запрос для событий
    let whereClause: any = {
      userId: user.id,
      status: { not: "CANCELLED" }
    }

    // Если указаны даты, фильтруем по ним
    if (startDate && endDate) {
      whereClause.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Получаем обычные события
    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        lead: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        account: { select: { id: true, name: true } }
      },
      orderBy: { startDate: 'asc' }
    })

    let allEvents = [...events]

    // Если запрошены повторяющиеся события, генерируем их экземпляры
    if (includeRecurring && startDate && endDate) {
      const recurringEvents = await prisma.event.findMany({
        where: {
          userId: user.id,
          isRecurring: true,
          status: { not: "CANCELLED" },
          OR: [
            { recurrenceEndDate: null },
            { recurrenceEndDate: { gte: new Date(startDate) } }
          ]
        },
        include: {
          lead: { select: { id: true, firstName: true, lastName: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          account: { select: { id: true, name: true } }
        }
      })

      // Генерируем экземпляры повторяющихся событий
      const recurringInstances = generateRecurringInstances(recurringEvents, startDate, endDate)
      allEvents = [...allEvents, ...recurringInstances]
    }

    // Преобразуем в формат фронтенда
    const formattedEvents = allEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.startDate.toISOString().split('T')[0],
      time: event.startDate.toTimeString().slice(0, 5),
      location: event.location,
      attendees: event.attendees ? JSON.parse(event.attendees) : [],
      status: event.status,
      isRecurring: event.isRecurring,
      recurrenceType: event.recurrenceType,
      lead: event.lead,
      contact: event.contact,
      account: event.account
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("Ошибка при получении событий:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/events - Создать новое событие
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      startDate,
      startTime,
      endDate,
      endTime,
      location,
      attendees,
      isRecurring,
      recurrenceType,
      recurrenceInterval,
      recurrenceEndDate,
      recurrenceDays
    } = body

    if (!title || !startDate || !startTime) {
      return NextResponse.json(
        { error: "Название, дата и время начала обязательны" },
        { status: 400 }
      )
    }

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Создаем дату начала
    const startDateTime = new Date(`${startDate}T${startTime}`)
    let endDateTime = startDateTime

    if (endDate && endTime) {
      endDateTime = new Date(`${endDate}T${endTime}`)
    } else if (endTime) {
      endDateTime = new Date(`${startDate}T${endTime}`)
    } else {
      // Если время окончания не указано, добавляем 1 час
      endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)
    }

    // Создаем событие
    const event = await (prisma as any).event.create({
      data: {
        title,
        description,
        type: type || "MEETING",
        startDate: startDateTime,
        endDate: endDateTime,
        location,
        attendees: attendees && attendees.length > 0 ? JSON.stringify(attendees) : null,
        status: "CONFIRMED",
        userId: user.id,

        // Повторение
        isRecurring: isRecurring || false,
        recurrenceType: isRecurring ? recurrenceType : null,
        recurrenceInterval: isRecurring ? recurrenceInterval || 1 : null,
        recurrenceEndDate: isRecurring && recurrenceEndDate ? new Date(recurrenceEndDate) : null,
        recurrenceDays: isRecurring && recurrenceDays ? JSON.stringify(recurrenceDays) : null
      },
      include: {
        lead: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        account: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({
      id: event.id,
      title: event.title,
      description: event.description,
      type: event.type,
      date: event.startDate.toISOString().split('T')[0],
      time: event.startDate.toTimeString().slice(0, 5),
      location: event.location,
      attendees: event.attendees ? JSON.parse(event.attendees) : [],
      status: event.status,
      isRecurring: event.isRecurring,
      recurrenceType: event.recurrenceType
    }, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании события:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// Функция для генерации экземпляров повторяющихся событий
function generateRecurringInstances(recurringEvents: any[], startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const instances = []

  for (const event of recurringEvents) {
    const eventStart = new Date(event.startDate)
    const recurrenceEnd = event.recurrenceEndDate ? new Date(event.recurrenceEndDate) : null

    let currentDate = new Date(eventStart)

    // Определяем максимальную дату для генерации
    const maxEnd = recurrenceEnd && recurrenceEnd < end ? recurrenceEnd : end

    while (currentDate <= maxEnd) {
      // Проверяем, находится ли дата в запрашиваемом диапазоне
      if (currentDate >= start && currentDate <= end) {
        // Для еженедельных событий проверяем дни недели
        let shouldInclude = true

        if (event.recurrenceType === 'WEEKLY' && event.recurrenceDays) {
          const weekDays = JSON.parse(event.recurrenceDays)
          const currentDay = currentDate.getDay().toString()
          shouldInclude = weekDays.includes(currentDay)
        }

        if (shouldInclude) {
          instances.push({
            ...event,
            id: `${event.id}_${currentDate.toISOString().split('T')[0]}`,
            startDate: new Date(currentDate),
            endDate: event.endDate ? new Date(currentDate.getTime() + (new Date(event.endDate).getTime() - eventStart.getTime())) : null,
            originalEventId: event.id
          })
        }
      }

      // Переходим к следующему повторению
      switch (event.recurrenceType) {
        case 'DAILY':
          currentDate.setDate(currentDate.getDate() + (event.recurrenceInterval || 1))
          break
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + (event.recurrenceInterval || 1) * 7)
          break
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + (event.recurrenceInterval || 1))
          break
        case 'YEARLY':
          currentDate.setFullYear(currentDate.getFullYear() + (event.recurrenceInterval || 1))
          break
        default:
          break
      }

      // Предотвращаем бесконечный цикл
      if (currentDate.getTime() > end.getTime() + 365 * 24 * 60 * 60 * 1000) {
        break
      }
    }
  }

  return instances
}
