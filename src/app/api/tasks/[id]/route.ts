// Rundex CRM - API для управления индивидуальной задачей
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/tasks/[id] - Получить задачу по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const task = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        deal: {
          select: { id: true, title: true }
        }
      }
    })

    if (!task) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Ошибка при получении задачи:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Обновить задачу
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Проверяем что задача принадлежит пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 })
    }

    // Обновление задачи
    const task = await prisma.task.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        leadId: data.leadId,
        dealId: data.dealId
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        deal: {
          select: { id: true, title: true }
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Удалить задачу
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем что задача принадлежит пользователю
    const existingTask = await prisma.task.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingTask) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 })
    }

    await prisma.task.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Задача удалена" })
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
