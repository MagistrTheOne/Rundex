// Rundex CRM - API для управления индивидуальной сделкой
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/deals/[id] - Получить сделку по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const deal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        activities: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!deal) {
      return NextResponse.json({ error: "Сделка не найдена" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Ошибка при получении сделки:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/deals/[id] - Обновить сделку
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

    // Проверяем что сделка принадлежит пользователю
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingDeal) {
      return NextResponse.json({ error: "Сделка не найдена" }, { status: 404 })
    }

    // Обновление сделки
    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        value: data.value ? parseFloat(data.value) : 0,
        currency: data.currency,
        status: data.status,
        priority: data.priority,
        stage: data.stage,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : null,
        leadId: data.leadId
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        }
      }
    })

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Ошибка при обновлении сделки:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id] - Удалить сделку
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем что сделка принадлежит пользователю
    const existingDeal = await prisma.deal.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingDeal) {
      return NextResponse.json({ error: "Сделка не найдена" }, { status: 404 })
    }

    await prisma.deal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Сделка удалена" })
  } catch (error) {
    console.error("Ошибка при удалении сделки:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
