// Rundex CRM - API для управления индивидуальным контактом
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/contacts/[id] - Получить контакт по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const contact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      },
      include: {
        leads: {
          select: { id: true, firstName: true, lastName: true, status: true }
        }
      }
    })

    if (!contact) {
      return NextResponse.json({ error: "Контакт не найден" }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Ошибка при получении контакта:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// PUT /api/contacts/[id] - Обновить контакт
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

    // Проверяем что контакт принадлежит пользователю
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingContact) {
      return NextResponse.json({ error: "Контакт не найден" }, { status: 404 })
    }

    // Обновление контакта
    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        website: data.website,
        address: data.address,
        city: data.city,
        region: data.region,
        notes: data.notes
      },
      include: {
        leads: {
          select: { id: true, firstName: true, lastName: true, status: true }
        }
      }
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Ошибка при обновлении контакта:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}

// DELETE /api/contacts/[id] - Удалить контакт
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    // Проверяем что контакт принадлежит пользователю
    const existingContact = await prisma.contact.findFirst({
      where: {
        id: params.id,
        userId: session.user.email
      }
    })

    if (!existingContact) {
      return NextResponse.json({ error: "Контакт не найден" }, { status: 404 })
    }

    await prisma.contact.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Контакт удален" })
  } catch (error) {
    console.error("Ошибка при удалении контакта:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
