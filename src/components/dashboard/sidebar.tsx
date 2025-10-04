// Rundex CRM - Боковая панель навигации
// Автор: MagistrTheOne, 2025

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  UserPlus,
  Target,
  CheckSquare,
  Calendar,
  TrendingUp,
  Bot,
  Settings,
  Home,
  Building2,
  FileText,
  MessageSquare,
  User
} from "lucide-react"

const navigation = [
  {
    name: "Главная",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Лиды",
    href: "/dashboard/leads",
    icon: UserPlus,
  },
  {
    name: "Контакты",
    href: "/dashboard/contacts",
    icon: Users,
  },
  {
    name: "Компании",
    href: "/dashboard/accounts",
    icon: Building2,
  },
  {
    name: "Воронка продаж",
    href: "/dashboard/opportunities",
    icon: Target,
  },
  {
    name: "Задачи",
    href: "/dashboard/tasks",
    icon: CheckSquare,
  },
  {
    name: "Календарь",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    name: "Аналитика",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Отчёты",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Володя AI",
    href: "/dashboard/volodya",
    icon: Bot,
  },
  {
    name: "Сообщения",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    name: "Профиль",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 min-w-64 max-w-64 min-h-screen glass-nav border-r border-white/10 sidebar-width">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Rundex CRM</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-8 pt-4 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Настройки</span>
          </Link>
        </div>

      </div>
    </div>
  )
}
