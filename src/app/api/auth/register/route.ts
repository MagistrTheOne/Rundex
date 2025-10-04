// Rundex CRM - API для регистрации пользователя
// Автор: MagistrTheOne, 2025

import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, position, department } = await request.json()

    // Проверка обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Имя, email и пароль обязательны" },
        { status: 400 }
      )
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        position,
        department,
        role: "USER", // По умолчанию обычный пользователь
      },
    })

    // Возвращаем пользователя без пароля
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        message: "Пользователь успешно создан",
        user: userWithoutPassword
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Ошибка при регистрации:", error)
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    )
  }
}
