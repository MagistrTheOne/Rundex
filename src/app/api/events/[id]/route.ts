// Rundex CRM - API обновления события
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PATCH /api/events/[id] - Обновить событие
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const eventId = params.id
    const body = await request.json()

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем существование события и права доступа
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, startDate: true, endDate: true }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Событие не найдено" }, { status: 404 })
    }

    if (existingEvent.userId !== user.id) {
      return NextResponse.json({ error: "Нет доступа к этому событию" }, { status: 403 })
    }

    // Подготавливаем данные для обновления
    const updateData: any = {}

    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.type !== undefined) updateData.type = body.type
    if (body.location !== undefined) updateData.location = body.location
    if (body.attendees !== undefined) {
      updateData.attendees = body.attendees && body.attendees.length > 0
        ? JSON.stringify(body.attendees)
        : null
    }

    // Обработка даты начала
    if (body.startDate) {
      updateData.startDate = new Date(body.startDate)
    }

    // Обработка даты окончания
    if (body.endDate) {
      updateData.endDate = new Date(body.endDate)
    } else if (body.startDate && !body.endDate) {
      // Если указана только дата начала, устанавливаем время окончания через 1 час
      const startDate = new Date(body.startDate)
      updateData.endDate = new Date(startDate.getTime() + 60 * 60 * 1000)
    }

    // Обновляем событие
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        lead: { select: { id: true, firstName: true, lastName: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
        account: { select: { id: true, name: true } }
      }
    })

    // Логируем изменение
    await prisma.activity.create({
      data: {
        type: "EVENT_UPDATED",
        description: `Обновлено событие: ${updatedEvent.title}`,
        userId: user.id,
        metadata: {
          eventId: updatedEvent.id,
          changes: Object.keys(updateData)
        }
      }
    })

    return NextResponse.json({
      id: updatedEvent.id,
      title: updatedEvent.title,
      description: updatedEvent.description,
      type: updatedEvent.type,
      date: updatedEvent.startDate.toISOString().split('T')[0],
      time: updatedEvent.startDate.toTimeString().slice(0, 5),
      location: updatedEvent.location,
      attendees: updatedEvent.attendees ? JSON.parse(updatedEvent.attendees) : [],
      status: updatedEvent.status,
      isRecurring: updatedEvent.isRecurring,
      recurrenceType: updatedEvent.recurrenceType
    })

  } catch (error) {
    console.error("Ошибка обновления события:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Удалить событие
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const eventId = params.id

    // Получаем пользователя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Проверяем существование события и права доступа
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, title: true }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Событие не найдено" }, { status: 404 })
    }

    if (existingEvent.userId !== user.id) {
      return NextResponse.json({ error: "Нет доступа к этому событию" }, { status: 403 })
    }

    // Удаляем событие
    await prisma.event.delete({
      where: { id: eventId }
    })

    // Логируем удаление
    await prisma.activity.create({
      data: {
        type: "EVENT_DELETED",
        description: `Удалено событие: ${existingEvent.title}`,
        userId: user.id,
        metadata: {
          eventId: eventId
        }
      }
    })

    return NextResponse.json({ message: "Событие удалено" })

  } catch (error) {
    console.error("Ошибка удаления события:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
