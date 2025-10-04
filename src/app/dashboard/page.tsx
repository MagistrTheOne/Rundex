// Rundex CRM - Главная страница дашборда
// Автор: MagistrTheOne, 2025

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  UserPlus,
  Target,
  TrendingUp,
  CheckSquare,
  Calendar,
  Bot,
  Plus
} from "lucide-react"

// Моковые данные для демонстрации (позже будут заменены на реальные из базы данных)
const stats = [
  {
    title: "Активные лиды",
    value: "24",
    description: "+12% от прошлого месяца",
    icon: UserPlus,
    color: "text-blue-400"
  },
  {
    title: "Контакты",
    value: "156",
    description: "+8 новых за неделю",
    icon: Users,
    color: "text-green-400"
  },
  {
    title: "Сделки в работе",
    value: "12",
    description: "На сумму 2.4M ₽",
    icon: Target,
    color: "text-yellow-400"
  },
  {
    title: "Завершённые задачи",
    value: "89%",
    description: "Эффективность команды",
    icon: CheckSquare,
    color: "text-purple-400"
  }
]

const recentActivities = [
  { id: 1, action: "Создан новый лид", subject: "Иванов Иван", time: "2 мин назад", type: "lead" },
  { id: 2, action: "Завершена задача", subject: "Подготовить презентацию", time: "15 мин назад", type: "task" },
  { id: 3, action: "Обновлён контакт", subject: "ООО 'ТехноСервис'", time: "1 час назад", type: "contact" },
  { id: 4, action: "Закрыта сделка", subject: "Контракт на 500K ₽", time: "2 часа назад", type: "opportunity" },
]

const upcomingTasks = [
  { id: 1, title: "Звонок клиенту", time: "Сегодня, 14:00", priority: "high" },
  { id: 2, title: "Подготовить отчёт", time: "Сегодня, 16:30", priority: "medium" },
  { id: 3, title: "Встреча с командой", time: "Завтра, 10:00", priority: "medium" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Дашборд</h2>
          <p className="text-white/70 mt-1">
            Обзор вашей CRM-системы и текущих показателей
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-white text-black hover:bg-white/90">
            <Plus className="w-4 h-4 mr-2" />
            Быстрое действие
          </Button>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Bot className="w-4 h-4 mr-2" />
            Спросить Володю
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-white/50 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Недавняя активность */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
              Недавняя активность
            </CardTitle>
            <CardDescription className="text-white/70">
              Последние действия в системе
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.action}</span>{" "}
                    <span className="text-white/70">{activity.subject}</span>
                  </p>
                  <p className="text-xs text-white/50">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Предстоящие задачи */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-400" />
              Предстоящие задачи
            </CardTitle>
            <CardDescription className="text-white/70">
              Ваши ближайшие задачи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  task.priority === 'high' ? 'bg-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-white/50">{task.time}</p>
                </div>
                <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                  {task.priority === 'high' ? 'Высокий' :
                   task.priority === 'medium' ? 'Средний' : 'Низкий'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Быстрые действия */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Быстрые действия</CardTitle>
          <CardDescription className="text-white/70">
            Часто используемые функции системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col border-white/20 hover:bg-white/10">
              <UserPlus className="w-6 h-6 mb-2" />
              <span className="text-sm">Новый лид</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-white/20 hover:bg-white/10">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">Добавить контакт</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-white/20 hover:bg-white/10">
              <Target className="w-6 h-6 mb-2" />
              <span className="text-sm">Создать сделку</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-white/20 hover:bg-white/10">
              <CheckSquare className="w-6 h-6 mb-2" />
              <span className="text-sm">Новая задача</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
