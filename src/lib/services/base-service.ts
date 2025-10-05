// Rundex CRM - Базовый сервис для работы с данными
// Автор: MagistrTheOne, 2025

import { prisma } from '@/lib/prisma'

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class BaseService {
  protected prisma = prisma

  /**
   * Получить текущего пользователя по email из сессии
   */
  protected async getCurrentUser(sessionUserEmail: string) {
    return await this.prisma.user.findUnique({
      where: { email: sessionUserEmail },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })
  }

  /**
   * Проверить права доступа к записи
   */
  protected async checkRecordOwnership(
    recordId: string,
    userEmail: string,
    model: any,
    ownerField: string = 'assignedToId'
  ) {
    const record = await model.findFirst({
      where: {
        id: recordId,
        [ownerField]: userEmail
      }
    })

    if (!record) {
      throw new Error('Запись не найдена или нет доступа')
    }

    return record
  }

  /**
   * Создать пагинированный результат
   */
  protected createPaginationResult<T>(
    data: T[],
    total: number,
    options: PaginationOptions
  ): PaginationResult<T> {
    const page = options.page || 1
    const limit = options.limit || 10
    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }

  /**
   * Создать параметры для Prisma запроса с пагинацией
   */
  protected createPaginationParams(options: PaginationOptions) {
    const page = options.page || 1
    const limit = options.limit || 10
    const skip = (page - 1) * limit

    return {
      skip,
      take: limit
    }
  }
}
