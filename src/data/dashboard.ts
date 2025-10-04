// Rundex CRM - Данные дашборда
// Автор: MagistrTheOne, 2025

import {
  Users,
  UserPlus,
  Target,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Calendar,
  Bot,
  Plus,
  Trophy,
  Star,
  Sparkles,
  Zap,
  Crown,
  Flame,
  MessageSquare
} from "lucide-react"

export interface StatCard {
  title: string
  value: string
  description: string
  icon: any
  color: string
  bgGradient: string
  borderColor: string
  trend: 'up' | 'down' | 'neutral'
  change: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  earned: boolean
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points: number
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  icon: any
  color: string
  progress: number
  target: number
  points: number
  completed: boolean
}

export interface ActivityItem {
  id: number
  action: string
  subject: string
  time: string
  type: 'lead' | 'task' | 'contact' | 'deal'
}

export interface TaskItem {
  id: number
  title: string
  time: string
  priority: 'high' | 'medium' | 'low'
}

export const stats: StatCard[] = [
  {
    title: "Активные лиды",
    value: "24",
    description: "+12% от прошлого месяца",
    icon: UserPlus,
    color: "text-blue-400",
    bgGradient: "bg-black/80",
    borderColor: "border-blue-500/20",
    trend: "up",
    change: 12
  },
  {
    title: "Контакты",
    value: "156",
    description: "+8 новых за неделю",
    icon: Users,
    color: "text-green-400",
    bgGradient: "bg-black/80",
    borderColor: "border-green-500/20",
    trend: "up",
    change: 8
  },
  {
    title: "Сделки в работе",
    value: "12",
    description: "На сумму 2.4M ₽",
    icon: Target,
    color: "text-amber-400",
    bgGradient: "bg-black/80",
    borderColor: "border-amber-500/20",
    trend: "neutral",
    change: 0
  },
  {
    title: "Завершённые задачи",
    value: "89%",
    description: "Эффективность команды",
    icon: CheckSquare,
    color: "text-purple-400",
    bgGradient: "bg-black/80",
    borderColor: "border-purple-500/20",
    trend: "up",
    change: 5
  }
]

export const achievements: Achievement[] = [
  {
    id: "first_lead",
    title: "Первый лид",
    description: "Создан первый лид в системе",
    icon: Trophy,
    earned: true,
    rarity: "common",
    points: 10
  },
  {
    id: "deal_master",
    title: "Мастер сделок",
    description: "Закрыто 10 сделок",
    icon: Crown,
    earned: true,
    rarity: "rare",
    points: 50
  },
  {
    id: "volodya_friend",
    title: "Друг Володи",
    description: "Общение с AI-ассистентом",
    icon: Bot,
    earned: true,
    rarity: "epic",
    points: 25
  },
  {
    id: "productivity_hero",
    title: "Герой продуктивности",
    description: "100% выполнение задач за месяц",
    icon: Flame,
    earned: false,
    rarity: "legendary",
    points: 100
  }
]

export const dailyChallenges: DailyChallenge[] = [
  {
    id: "create_leads",
    title: "Создать 3 лида",
    description: "Создать новые лиды в системе",
    icon: Target,
    color: "text-green-400",
    progress: 1,
    target: 3,
    points: 25,
    completed: false
  },
  {
    id: "ask_volodya",
    title: "Спросить Володю 5 раз",
    description: "Общение с AI-ассистентом",
    icon: MessageSquare,
    color: "text-blue-400",
    progress: 2,
    target: 5,
    points: 50,
    completed: false
  },
  {
    id: "complete_tasks",
    title: "Завершить все задачи",
    description: "Выполнить все поставленные задачи",
    icon: CheckSquare,
    color: "text-purple-400",
    progress: 0,
    target: 1,
    points: 100,
    completed: false
  }
]

export const recentActivities: ActivityItem[] = [
  { id: 1, action: "Создан новый лид", subject: "Иванов Иван", time: "2 мин назад", type: "lead" },
  { id: 2, action: "Завершена задача", subject: "Подготовить презентацию", time: "15 мин назад", type: "task" },
  { id: 3, action: "Обновлён контакт", subject: "ООО 'ТехноСервис'", time: "1 час назад", type: "contact" },
  { id: 4, action: "Закрыта сделка", subject: "Контракт на 500K ₽", time: "2 часа назад", type: "deal" },
]

export const upcomingTasks: TaskItem[] = [
  { id: 1, title: "Звонок клиенту", time: "Сегодня, 14:00", priority: "high" },
  { id: 2, title: "Подготовить отчёт", time: "Сегодня, 16:30", priority: "medium" },
  { id: 3, title: "Встреча с командой", time: "Завтра, 10:00", priority: "medium" },
]

export const userLevel = {
  level: 15,
  experience: 2850,
  experienceToNext: 3200,
  title: "Мастер продаж"
}
