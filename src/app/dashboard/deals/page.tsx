// Rundex CRM - Страница управления сделками
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
import { Plus, Search, MoreHorizontal, Target, Calendar, DollarSign } from "lucide-react"
import { DealForm } from "@/components/deals/deal-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для сделок
interface Deal {
  id: string
  title: string
  description: string
  value: number
  currency: string
  status: string
  priority: string
  stage: string
  expectedCloseDate: string | null
  createdAt: string
  lead: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

const statusLabels = {
  NEW: { label: "Новая", color: "bg-blue-500/20 text-blue-400" },
  QUALIFIED: { label: "Квалифицирована", color: "bg-green-500/20 text-green-400" },
  PROPOSAL: { label: "Предложение", color: "bg-purple-500/20 text-purple-400" },
  NEGOTIATION: { label: "Переговоры", color: "bg-orange-500/20 text-orange-400" },
  CLOSED_WON: { label: "Закрыта успешно", color: "bg-emerald-500/20 text-emerald-400" },
  CLOSED_LOST: { label: "Закрыта неудачно", color: "bg-red-500/20 text-red-400" }
}

const priorityLabels = {
  LOW: { label: "Низкий", color: "bg-gray-500/20 text-gray-400" },
  MEDIUM: { label: "Средний", color: "bg-yellow-500/20 text-yellow-400" },
  HIGH: { label: "Высокий", color: "bg-red-500/20 text-red-400" },
  URGENT: { label: "Срочный", color: "bg-red-600/20 text-red-400" }
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка сделок из API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== "ALL") params.append("status", statusFilter)
        if (priorityFilter !== "ALL") params.append("priority", priorityFilter)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/deals?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки сделок")

        const data = await response.json()
        setDeals(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeals()
  }, [statusFilter, priorityFilter, searchQuery])

  const handleCreateDeal = async (dealData: any) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) throw new Error('Ошибка создания сделки')

      const newDeal = await response.json()
      setDeals([newDeal, ...deals])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания сделки")
    }
  }

  const handleEditDeal = async (dealData: any) => {
    try {
      const response = await fetch(`/api/deals/${editingDeal?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) throw new Error('Ошибка обновления сделки')

      const updatedDeal = await response.json()
      setDeals(deals.map(deal =>
        deal.id === editingDeal?.id ? updatedDeal : deal
      ))
      setEditingDeal(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления сделки")
    }
  }

  const handleDeleteDeal = async (dealId: string) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления сделки')

      setDeals(deals.filter(deal => deal.id !== dealId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления сделки")
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Управление сделками</h2>
          <p className="text-white/70 mt-1">
            Управляйте сделками и отслеживайте продажи
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новая сделка
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать новую сделку</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте информацию о сделке
              </DialogDescription>
            </DialogHeader>
            <DealForm onSubmit={handleCreateDeal} />
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
                <SelectItem value="NEW" className="text-white">Новая</SelectItem>
                <SelectItem value="QUALIFIED" className="text-white">Квалифицирована</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSED_WON" className="text-white">Закрыта успешно</SelectItem>
                <SelectItem value="CLOSED_LOST" className="text-white">Закрыта неудачно</SelectItem>
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

      {/* Таблица сделок */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Сделки ({deals.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-white/70 text-center py-8">Загрузка сделок...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Название</TableHead>
                  <TableHead className="text-white">Лид</TableHead>
                  <TableHead className="text-white">Стоимость</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Приоритет</TableHead>
                  <TableHead className="text-white">Этап</TableHead>
                  <TableHead className="text-white">Дата закрытия</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map((deal) => (
                  <TableRow key={deal.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {deal.title}
                    </TableCell>
                    <TableCell className="text-white">
                      {deal.lead.firstName} {deal.lead.lastName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {deal.value.toLocaleString()} {deal.currency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusLabels[deal.status as keyof typeof statusLabels].color}>
                        {statusLabels[deal.status as keyof typeof statusLabels].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityLabels[deal.priority as keyof typeof priorityLabels].color}>
                        {priorityLabels[deal.priority as keyof typeof priorityLabels].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {deal.stage}
                    </TableCell>
                    <TableCell className="text-white">
                      {deal.expectedCloseDate ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(deal.expectedCloseDate).toLocaleDateString('ru-RU')}
                        </div>
                      ) : (
                        <span className="text-white/50">-</span>
                      )}
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
                            onClick={() => setEditingDeal(deal)}
                          >
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleDeleteDeal(deal.id)}
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
      {editingDeal && (
        <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать сделку</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о сделке
              </DialogDescription>
            </DialogHeader>
            <DealForm
              initialData={editingDeal}
              onSubmit={handleEditDeal}
              onCancel={() => setEditingDeal(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
