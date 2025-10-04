// Rundex CRM - API для управления индивидуальной возможностью
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/opportunities/[id] - Получить возможность по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const opportunity = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        account: {
          select: { id: true, name: true, industry: true }
        },
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!opportunity) {
      return NextResponse.json({ error: "Возможность не найдена" }, { status: 404 })
    }

    return NextResponse.json(opportunity)
  } catch (error) {
    console.error("Ошибка при получении возможности:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/opportunities/[id] - Обновить возможность
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Проверяем что возможность принадлежит пользователю
    const existingOpportunity = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      }
    })

    if (!existingOpportunity) {
      return NextResponse.json({ error: "Возможность не найдена" }, { status: 404 })
    }

    // Обновление возможности
    const opportunity = await prisma.opportunity.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        currency: data.currency,
        stage: data.stage,
        probability: data.probability,
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
        leadId: data.leadId,
        accountId: data.accountId,
        assignedToId: data.assignedToId
      },
      include: {
        lead: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        account: {
          select: { id: true, name: true, industry: true }
        }
      }
    })

    return NextResponse.json(opportunity)
  } catch (error) {
    console.error("Ошибка при обновлении возможности:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/opportunities/[id] - Удалить возможность
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем что возможность принадлежит пользователю
    const existingOpportunity = await prisma.opportunity.findFirst({
      where: {
        id: params.id,
        assignedToId: session.user.email
      }
    })

    if (!existingOpportunity) {
      return NextResponse.json({ error: "Возможность не найдена" }, { status: 404 })
    }

    await prisma.opportunity.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Возможность удалена" })
  } catch (error) {
    console.error("Ошибка при удалении возможности:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
