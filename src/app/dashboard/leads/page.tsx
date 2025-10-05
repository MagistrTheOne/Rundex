// Rundex CRM - Страница управления лидами
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
import { Plus, Search, Filter, MoreHorizontal, UserPlus, Phone, Mail, Building } from "lucide-react"
import { LeadForm } from "@/components/leads/lead-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для лидов
interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  status: string
  priority: string
  source: string
  score: number
  createdAt: string
  assignedTo?: {
    name: string
    email: string
  }
}

const statusLabels = {
  NEW: { label: "Новый", color: "bg-blue-500/20 text-blue-400" },
  CONTACTED: { label: "Связались", color: "bg-yellow-500/20 text-yellow-400" },
  QUALIFIED: { label: "Квалифицирован", color: "bg-green-500/20 text-green-400" },
  PROPOSAL: { label: "Предложение", color: "bg-purple-500/20 text-purple-400" },
  NEGOTIATION: { label: "Переговоры", color: "bg-orange-500/20 text-orange-400" },
  CLOSED_WON: { label: "Закрыто успешно", color: "bg-emerald-500/20 text-emerald-400" },
  CLOSED_LOST: { label: "Закрыто неудачно", color: "bg-red-500/20 text-red-400" }
}

const priorityLabels = {
  LOW: { label: "Низкий", color: "bg-gray-500/20 text-gray-400" },
  MEDIUM: { label: "Средний", color: "bg-yellow-500/20 text-yellow-400" },
  HIGH: { label: "Высокий", color: "bg-red-500/20 text-red-400" },
  URGENT: { label: "Срочный", color: "bg-red-600/20 text-red-400" }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка лидов из API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== "ALL") params.append("status", statusFilter)
        if (priorityFilter !== "ALL") params.append("priority", priorityFilter)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/v1/leads?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки лидов")

        const data = await response.json()
        setLeads(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [statusFilter, priorityFilter, searchQuery])

  // Фильтрация теперь происходит на сервере, но оставляем для клиентской фильтрации если нужно
  const filteredLeads = leads

  const handleCreateLead = async (leadData: any) => {
    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) throw new Error('Ошибка создания лида')

      const newLead = await response.json()
      setLeads([newLead, ...leads])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания лида")
    }
  }

  const handleEditLead = async (leadData: any) => {
    try {
      const response = await fetch(`/api/v1/leads/${editingLead?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) throw new Error('Ошибка обновления лида')

      const updatedLead = await response.json()
      setLeads(leads.map(lead =>
        lead.id === editingLead?.id ? updatedLead : lead
      ))
      setEditingLead(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления лида")
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      const response = await fetch(`/api/v1/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления лида')

      setLeads(leads.filter(lead => lead.id !== leadId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления лида")
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Управление лидами</h2>
          <p className="text-white/70 mt-1">
            Управляйте потенциальными клиентами и отслеживайте их прогресс
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новый лид
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать нового лида</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте информацию о потенциальном клиенте
              </DialogDescription>
            </DialogHeader>
            <LeadForm onSubmit={handleCreateLead} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры и поиск */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <Input
                  placeholder="Поиск по имени, email или компании..."
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
                <SelectItem value="NEW" className="text-white">Новый</SelectItem>
                <SelectItem value="CONTACTED" className="text-white">Связались</SelectItem>
                <SelectItem value="QUALIFIED" className="text-white">Квалифицирован</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSED_WON" className="text-white">Закрыто успешно</SelectItem>
                <SelectItem value="CLOSED_LOST" className="text-white">Закрыто неудачно</SelectItem>
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

      {/* Таблица лидов */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Лиды ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-white/70 text-center py-8">Загрузка лидов...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Имя</TableHead>
                  <TableHead className="text-white">Компания</TableHead>
                  <TableHead className="text-white">Контакты</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Приоритет</TableHead>
                  <TableHead className="text-white">Скор</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-white/10">
                  <TableCell className="text-white font-medium">
                    {lead.firstName} {lead.lastName}
                  </TableCell>
                  <TableCell className="text-white">
                    <div>
                      <div className="font-medium">{lead.company}</div>
                      <div className="text-sm text-white/50">{lead.position}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusLabels[lead.status as keyof typeof statusLabels].color}>
                      {statusLabels[lead.status as keyof typeof statusLabels].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={priorityLabels[lead.priority as keyof typeof priorityLabels].color}>
                      {priorityLabels[lead.priority as keyof typeof priorityLabels].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center">
                      <span className="font-medium">{lead.score}</span>
                      <span className="text-white/50 ml-1">/100</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="glass-card border-white/20">
                        <DropdownMenuItem
                          className="text-white hover:bg-white/10"
                          onClick={() => setEditingLead(lead)}
                        >
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-white/10"
                          onClick={() => handleDeleteLead(lead.id)}
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
      {editingLead && (
        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать лида</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о лиде
              </DialogDescription>
            </DialogHeader>
            <LeadForm
              initialData={editingLead}
              onSubmit={handleEditLead}
              onCancel={() => setEditingLead(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
