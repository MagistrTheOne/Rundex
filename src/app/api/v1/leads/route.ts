// Rundex CRM - API для управления лидами (v1)
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createLeadSchema, leadsFilterSchema } from "@/lib/validations/schemas"
import { leadsService } from "@/lib/services/leads-service"

// GET /api/leads - Получить все лиды пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)

    // Валидируем параметры фильтрации
    const filterResult = leadsFilterSchema.safeParse({
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined
    })

    if (!filterResult.success) {
      return NextResponse.json(
        { error: "Некорректные параметры фильтрации", details: filterResult.error.format() },
        { status: 400 }
      )
    }

    const filters = filterResult.data

    // Используем сервис для получения лидов
    const leads = await leadsService.getLeads(session.user.email, filters)

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Ошибка при получении лидов:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// POST /api/leads - Создать нового лида
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const data = await request.json()

    // Валидируем входные данные
    const validationResult = createLeadSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Некорректные данные", details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Используем сервис для создания лида
    const lead = await leadsService.createLead(validatedData, session.user.email)

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error("Ошибка при создании лида:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
