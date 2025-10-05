// Rundex CRM - API для операций с конкретным лидом
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { updateLeadSchema, uuidSchema } from "@/lib/validations/schemas"

interface RouteParams {
  params: { id: string }
}

// GET /api/leads/[id] - Получить лид по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Валидируем UUID
    const uuidResult = uuidSchema.safeParse(params.id)
    if (!uuidResult.success) {
      return NextResponse.json({ error: "Некорректный ID лида" }, { status: 400 })
    }

    const lead = await prisma.lead.findFirst({
      where: {
        id: uuidResult.data,
        assignedToId: session.user.email
      },
      include: {
        assignedTo: {
          select: { name: true, email: true }
        },
        activities: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        opportunities: {
          include: {
            assignedTo: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!lead) {
      return NextResponse.json({ error: "Лид не найден" }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Ошибка при получении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/leads/[id] - Обновить лид
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Валидируем UUID
    const uuidResult = uuidSchema.safeParse(params.id)
    if (!uuidResult.success) {
      return NextResponse.json({ error: "Некорректный ID лида" }, { status: 400 })
    }

    const data = await request.json()

    // Валидируем входные данные
    const validationResult = updateLeadSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Некорректные данные", details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Проверка существования лида (защита от IDOR)
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: uuidResult.data,
        assignedToId: session.user.email
      }
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Лид не найден или нет доступа" }, { status: 404 })
    }

    // Обновление лида
    const lead = await prisma.lead.update({
      where: { id: uuidResult.data },
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        position: validatedData.position,
        website: validatedData.website,
        address: validatedData.address,
        city: validatedData.city,
        region: validatedData.region,
        source: validatedData.source,
        status: validatedData.status,
        priority: validatedData.priority,
        budget: validatedData.budget,
        notes: validatedData.notes,
        score: validatedData.score || existingLead.score
      },
      include: {
        assignedTo: {
          select: { name: true, email: true }
        }
      }
    })

    // Создание активности
    await prisma.activity.create({
      data: {
        type: "STATUS_CHANGED",
        subject: `Обновлён лид: ${lead.firstName} ${lead.lastName}`,
        description: `Статус изменён на: ${lead.status}`,
        userId: session.user.email,
        leadId: lead.id
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Ошибка при обновлении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[id] - Удалить лид
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Валидируем UUID
    const uuidResult = uuidSchema.safeParse(params.id)
    if (!uuidResult.success) {
      return NextResponse.json({ error: "Некорректный ID лида" }, { status: 400 })
    }

    // Проверка существования лида (защита от IDOR)
    const existingLead = await prisma.lead.findFirst({
      where: {
        id: uuidResult.data,
        assignedToId: session.user.email
      }
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Лид не найден или нет доступа" }, { status: 404 })
    }

    // Удаление лида (каскадное удаление связанных данных)
    await prisma.lead.delete({
      where: { id: uuidResult.data }
    })

    return NextResponse.json({ message: "Лид успешно удалён" })
  } catch (error) {
    console.error("Ошибка при удалении лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
