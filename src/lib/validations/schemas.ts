// Rundex CRM - Схемы валидации данных с Zod
// Автор: MagistrTheOne, 2025

import { z } from 'zod'

// Перечисления из Prisma схемы
const LeadSourceEnum = z.enum(['WEBSITE', 'SOCIAL_MEDIA', 'REFERRAL', 'COLD_CALL', 'EMAIL', 'TRADE_SHOW', 'PARTNER', 'OTHER'])
const LeadStatusEnum = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'])
const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
const OpportunityStageEnum = z.enum(['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'])
const AccountStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT', 'CUSTOMER', 'FORMER_CUSTOMER'])
const TaskStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
const TaskTypeEnum = z.enum(['CALL', 'EMAIL', 'MEETING', 'TASK', 'FOLLOW_UP'])
const UserRoleEnum = z.enum(['ADMIN', 'MANAGER', 'SALES', 'USER'])

// Базовые схемы валидации
export const uuidSchema = z.string().uuid('Некорректный UUID')

export const emailSchema = z.string()
  .email('Некорректный email адрес')
  .max(255, 'Email слишком длинный')

export const phoneSchema = z.string()
  .regex(/^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 'Некорректный номер телефона')
  .max(20, 'Номер телефона слишком длинный')

export const urlSchema = z.string()
  .url('Некорректный URL')
  .max(500, 'URL слишком длинный')

export const passwordSchema = z.string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .max(100, 'Пароль слишком длинный')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать заглавные и строчные буквы, а также цифры')

// Схема создания пользователя
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Имя обязательно').max(100, 'Имя слишком длинное'),
  phone: phoneSchema.optional(),
  position: z.string().max(100, 'Должность слишком длинная').optional(),
  department: z.string().max(100, 'Отдел слишком длинный').optional(),
  role: UserRoleEnum.default('USER')
})

// Схема создания лида
export const createLeadSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
  lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  company: z.string().max(100, 'Название компании слишком длинное').optional(),
  position: z.string().max(100, 'Должность слишком длинная').optional(),
  website: urlSchema.optional(),
  address: z.string().max(255, 'Адрес слишком длинный').optional(),
  city: z.string().max(100, 'Город слишком длинный').optional(),
  region: z.string().max(100, 'Регион слишком длинный').optional(),
  source: LeadSourceEnum.default('OTHER'),
  status: LeadStatusEnum.default('NEW'),
  priority: PriorityEnum.default('MEDIUM'),
  budget: z.number().positive('Бюджет должен быть положительным').max(999999999, 'Бюджет слишком большой').optional(),
  notes: z.string().max(1000, 'Заметки слишком длинные').optional(),
  score: z.number().min(0, 'Скор должен быть >= 0').max(100, 'Скор должен быть <= 100').optional()
})

// Схема обновления лида
export const updateLeadSchema = createLeadSchema.partial()

// Схема создания контакта
export const createContactSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').max(50, 'Имя слишком длинное'),
  lastName: z.string().min(1, 'Фамилия обязательна').max(50, 'Фамилия слишком длинная'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  mobile: phoneSchema.optional(),
  position: z.string().max(100, 'Должность слишком длинная').optional(),
  company: z.string().max(100, 'Название компании слишком длинное').optional(),
  address: z.string().max(255, 'Адрес слишком длинный').optional(),
  city: z.string().max(100, 'Город слишком длинный').optional(),
  region: z.string().max(100, 'Регион слишком длинный').optional(),
  birthday: z.string().datetime('Некорректная дата рождения').optional(),
  notes: z.string().max(1000, 'Заметки слишком длинные').optional()
})

// Схема обновления контакта
export const updateContactSchema = createContactSchema.partial()

// Схема создания аккаунта
export const createAccountSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
  website: urlSchema.optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  address: z.string().max(255, 'Адрес слишком длинный').optional(),
  city: z.string().max(100, 'Город слишком длинный').optional(),
  region: z.string().max(100, 'Регион слишком длинный').optional(),
  industry: z.string().max(100, 'Отрасль слишком длинная').optional(),
  employees: z.number().int().positive('Количество сотрудников должно быть положительным').max(1000000, 'Слишком большое количество').optional(),
  revenue: z.number().positive('Доход должен быть положительным').max(999999999999, 'Доход слишком большой').optional(),
  description: z.string().max(1000, 'Описание слишком длинное').optional(),
  status: AccountStatusEnum.default('ACTIVE')
})

// Схема обновления аккаунта
export const updateAccountSchema = createAccountSchema.partial()

// Схема создания возможности
export const createOpportunitySchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100, 'Название слишком длинное'),
  description: z.string().max(1000, 'Описание слишком длинное').optional(),
  amount: z.number().positive('Сумма должна быть положительной').max(999999999, 'Сумма слишком большая'),
  currency: z.string().length(3, 'Код валюты должен быть 3 символа').default('RUB'),
  stage: OpportunityStageEnum.default('PROSPECTING'),
  probability: z.number().min(0, 'Вероятность >= 0').max(100, 'Вероятность <= 100').default(0),
  closeDate: z.string().datetime('Некорректная дата').optional(),
  leadId: uuidSchema.optional(),
  accountId: uuidSchema.optional(),
  assignedToId: uuidSchema.optional()
})

// Схема обновления возможности
export const updateOpportunitySchema = createOpportunitySchema.partial()

// Схема создания задачи
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(100, 'Заголовок слишком длинный'),
  description: z.string().max(1000, 'Описание слишком длинное').optional(),
  status: TaskStatusEnum.default('OPEN'),
  priority: PriorityEnum.default('MEDIUM'),
  type: TaskTypeEnum.default('TASK'),
  dueDate: z.string().datetime('Некорректная дата').optional(),
  assignedToId: uuidSchema.optional(),
  opportunityId: uuidSchema.optional(),
  leadId: uuidSchema.optional()
})

// Схема обновления задачи
export const updateTaskSchema = createTaskSchema.partial()

// Схема отправки сообщения
export const sendMessageSchema = z.object({
  recipientId: uuidSchema,
  content: z.string().min(1, 'Сообщение не может быть пустым').max(1000, 'Сообщение слишком длинное'),
  type: z.enum(['TEXT', 'FILE', 'IMAGE', 'SYSTEM']).default('TEXT')
})

// Схема фильтрации лидов
export const leadsFilterSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().max(100, 'Поисковый запрос слишком длинный').optional()
})

// Схема фильтрации контактов
export const contactsFilterSchema = z.object({
  search: z.string().max(100, 'Поисковый запрос слишком длинный').optional()
})

// Схема пагинации
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Страница должна быть >= 1').default(1),
  limit: z.number().int().min(1, 'Лимит должен быть >= 1').max(100, 'Лимит должен быть <= 100').default(10)
})

// Типы для TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>
export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>
export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type LeadsFilterInput = z.infer<typeof leadsFilterSchema>
export type ContactsFilterInput = z.infer<typeof contactsFilterSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
