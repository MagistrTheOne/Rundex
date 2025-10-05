// Rundex CRM - Сервис для работы с лидами
// Автор: MagistrTheOne, 2025

import { BaseService, PaginationOptions, PaginationResult } from './base-service'
import { CreateLeadInput, UpdateLeadInput, LeadsFilterInput } from '@/lib/validations/schemas'
import { LeadStatus, LeadSource, Priority } from '@prisma/client'

export interface LeadWithRelations {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  company: string | null
  position: string | null
  status: LeadStatus
  priority: Priority
  source: LeadSource
  score: number
  createdAt: Date
  updatedAt: Date
  assignedTo?: {
    name: string | null
    email: string
  } | null
  activities?: Array<{
    id: string
    type: string
    subject: string
    createdAt: Date
  }>
}

export class LeadsService extends BaseService {
  /**
   * Получить все лиды пользователя с фильтрацией
   */
  async getLeads(
    userEmail: string,
    filters: LeadsFilterInput,
    pagination?: PaginationOptions
  ): Promise<PaginationResult<LeadWithRelations> | LeadWithRelations[]> {
    const user = await this.getCurrentUser(userEmail)
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const where: any = {
      assignedToId: userEmail
    }

    // Применяем фильтры
    if (filters.status && filters.status !== "ALL") {
      where.status = filters.status as LeadStatus
    }

    if (filters.priority && filters.priority !== "ALL") {
      where.priority = filters.priority as Priority
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { company: { contains: filters.search, mode: "insensitive" } }
      ]
    }

    const queryOptions = {
      where,
      include: {
        assignedTo: {
          select: { name: true, email: true }
        },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 3,
          select: {
            id: true,
            type: true,
            subject: true,
            createdAt: true
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    }

    if (pagination) {
      // С пагинацией
      const { skip, take } = this.createPaginationParams(pagination)
      const [leads, total] = await Promise.all([
        this.prisma.lead.findMany({
          ...queryOptions,
          skip,
          take
        }),
        this.prisma.lead.count({ where })
      ])

      return this.createPaginationResult(leads, total, pagination)
    } else {
      // Без пагинации
      return await this.prisma.lead.findMany(queryOptions)
    }
  }

  /**
   * Получить лид по ID
   */
  async getLeadById(
    leadId: string,
    userEmail: string
  ): Promise<LeadWithRelations> {
    await this.checkRecordOwnership(leadId, userEmail, this.prisma.lead)

    const lead = await this.prisma.lead.findUnique({
      where: { id: leadId },
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
      throw new Error('Лид не найден')
    }

    return lead
  }

  /**
   * Создать новый лид
   */
  async createLead(
    leadData: CreateLeadInput,
    userEmail: string
  ): Promise<LeadWithRelations> {
    const user = await this.getCurrentUser(userEmail)
    if (!user) {
      throw new Error('Пользователь не найден')
    }

    const lead = await this.prisma.lead.create({
      data: {
        ...leadData,
        assignedToId: userEmail,
        score: leadData.score || Math.floor(Math.random() * 40) + 60 // Простой алгоритм скоринга
      },
      include: {
        assignedTo: {
          select: { name: true, email: true }
        }
      }
    })

    // Создаем активность
    await this.prisma.activity.create({
      data: {
        type: "LEAD_CREATED",
        subject: `Создан лид: ${lead.firstName} ${lead.lastName}`,
        userId: userEmail,
        leadId: lead.id
      }
    })

    return lead
  }

  /**
   * Обновить лид
   */
  async updateLead(
    leadId: string,
    leadData: UpdateLeadInput,
    userEmail: string
  ): Promise<LeadWithRelations> {
    await this.checkRecordOwnership(leadId, userEmail, this.prisma.lead)

    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: leadData,
      include: {
        assignedTo: {
          select: { name: true, email: true }
        }
      }
    })

    // Создаем активность
    await this.prisma.activity.create({
      data: {
        type: "STATUS_CHANGED",
        subject: `Обновлён лид: ${lead.firstName} ${lead.lastName}`,
        description: `Статус изменён на: ${lead.status}`,
        userId: userEmail,
        leadId: lead.id
      }
    })

    return lead
  }

  /**
   * Удалить лид
   */
  async deleteLead(
    leadId: string,
    userEmail: string
  ): Promise<void> {
    await this.checkRecordOwnership(leadId, userEmail, this.prisma.lead)

    await this.prisma.lead.delete({
      where: { id: leadId }
    })
  }

  /**
   * Рассчитать скор лида (бизнес-логика скоринга)
   */
  calculateLeadScore(leadData: Partial<CreateLeadInput>): number {
    let score = 50 // Базовый скор

    // Увеличиваем скор за наличие контактных данных
    if (leadData.email) score += 10
    if (leadData.phone) score += 10
    if (leadData.company) score += 5

    // Увеличиваем скор за качественные источники
    if (leadData.source === 'REFERRAL') score += 15
    else if (leadData.source === 'TRADE_SHOW') score += 10
    else if (leadData.source === 'WEBSITE') score += 5

    // Увеличиваем скор за высокий приоритет
    if (leadData.priority === 'HIGH') score += 5
    else if (leadData.priority === 'URGENT') score += 10

    // Ограничиваем диапазон
    return Math.min(Math.max(score, 0), 100)
  }
}

// Экспорт экземпляра сервиса
export const leadsService = new LeadsService()
