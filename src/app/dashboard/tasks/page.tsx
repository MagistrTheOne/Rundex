// Rundex CRM - Страница управления задачами
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, MoreHorizontal, CheckSquare, Calendar, Clock, User, Target } from "lucide-react"
import { TaskForm } from "@/components/tasks/task-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для задач
interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  lead?: {
    id: string
    firstName: string
    lastName: string
  }
  deal?: {
    id: string
    title: string
  }
}

const statusLabels = {
  TODO: { label: "К выполнению", color: "bg-gray-500/20 text-gray-400" },
  IN_PROGRESS: { label: "В процессе", color: "bg-blue-500/20 text-blue-400" },
  COMPLETED: { label: "Завершена", color: "bg-green-500/20 text-green-400" },
  CANCELLED: { label: "Отменена", color: "bg-red-500/20 text-red-400" }
}

const priorityLabels = {
  LOW: { label: "Низкий", color: "bg-gray-500/20 text-gray-400" },
  MEDIUM: { label: "Средний", color: "bg-yellow-500/20 text-yellow-400" },
  HIGH: { label: "Высокий", color: "bg-red-500/20 text-red-400" },
  URGENT: { label: "Срочный", color: "bg-red-600/20 text-red-400" }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка задач из API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== "ALL") params.append("status", statusFilter)
        if (priorityFilter !== "ALL") params.append("priority", priorityFilter)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/tasks?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки задач")

        const data = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [statusFilter, priorityFilter, searchQuery])

  const handleCreateTask = async (taskData: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) throw new Error('Ошибка создания задачи')

      const newTask = await response.json()
      setTasks([newTask, ...tasks])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания задачи")
    }
  }

  const handleEditTask = async (taskData: any) => {
    try {
      const response = await fetch(`/api/tasks/${editingTask?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) throw new Error('Ошибка обновления задачи')

      const updatedTask = await response.json()
      setTasks(tasks.map(task =>
        task.id === editingTask?.id ? updatedTask : task
      ))
      setEditingTask(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления задачи")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления задачи')

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления задачи")
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Ошибка обновления статуса')

      const updatedTask = await response.json()
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления статуса")
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Управление задачами</h2>
          <p className="text-white/70 mt-1">
            Организуйте свою работу и отслеживайте прогресс
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новая задача
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать новую задачу</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте задачу для отслеживания
              </DialogDescription>
            </DialogHeader>
            <TaskForm onSubmit={handleCreateTask} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <Input
                  placeholder="Поиск по названию или описанию..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="ALL" className="text-white">Все статусы</SelectItem>
                <SelectItem value="TODO" className="text-white">К выполнению</SelectItem>
                <SelectItem value="IN_PROGRESS" className="text-white">В процессе</SelectItem>
                <SelectItem value="COMPLETED" className="text-white">Завершена</SelectItem>
                <SelectItem value="CANCELLED" className="text-white">Отменена</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Приоритет" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="ALL" className="text-white">Все приоритеты</SelectItem>
                <SelectItem value="LOW" className="text-white">Низкий</SelectItem>
                <SelectItem value="MEDIUM" className="text-white">Средний</SelectItem>
                <SelectItem value="HIGH" className="text-white">Высокий</SelectItem>
                <SelectItem value="URGENT" className="text-white">Срочный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Таблица задач */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Задачи ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-white/70 text-center py-8">Загрузка задач...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Название</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Приоритет</TableHead>
                  <TableHead className="text-white">Срок</TableHead>
                  <TableHead className="text-white">Связь</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleStatusChange(task.id, value)}
                      >
                        <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                          <Badge className={statusLabels[task.status as keyof typeof statusLabels].color}>
                            {statusLabels[task.status as keyof typeof statusLabels].label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          <SelectItem value="TODO" className="text-white">К выполнению</SelectItem>
                          <SelectItem value="IN_PROGRESS" className="text-white">В процессе</SelectItem>
                          <SelectItem value="COMPLETED" className="text-white">Завершена</SelectItem>
                          <SelectItem value="CANCELLED" className="text-white">Отменена</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityLabels[task.priority as keyof typeof priorityLabels].color}>
                        {priorityLabels[task.priority as keyof typeof priorityLabels].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {task.dueDate ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                        </div>
                      ) : (
                        <span className="text-white/50">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        {task.lead && (
                          <div className="flex items-center text-sm">
                            <User className="w-3 h-3 mr-1" />
                            {task.lead.firstName} {task.lead.lastName}
                          </div>
                        )}
                        {task.deal && (
                          <div className="flex items-center text-sm">
                            <Target className="w-3 h-3 mr-1" />
                            {task.deal.title}
                          </div>
                        )}
                        {!task.lead && !task.deal && (
                          <span className="text-white/50 text-sm">Без связи</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black/90 border-white/20">
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => setEditingTask(task)}
                          >
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать задачу</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о задаче
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              initialData={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
