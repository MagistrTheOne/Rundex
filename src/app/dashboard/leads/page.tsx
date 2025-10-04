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

// Моковые данные лидов (позже будут загружаться из API)
const mockLeads = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Иванов",
    email: "ivan.ivanov@example.com",
    phone: "+7 (999) 123-45-67",
    company: "ООО 'ТехноСервис'",
    position: "Директор",
    status: "NEW",
    priority: "HIGH",
    source: "WEBSITE",
    score: 85,
    createdAt: "2025-01-15"
  },
  {
    id: "2",
    firstName: "Мария",
    lastName: "Петрова",
    email: "maria.petrova@example.com",
    phone: "+7 (999) 234-56-78",
    company: "ИП Петрова",
    position: "Владелец",
    status: "CONTACTED",
    priority: "MEDIUM",
    source: "SOCIAL_MEDIA",
    score: 72,
    createdAt: "2025-01-14"
  },
  {
    id: "3",
    firstName: "Алексей",
    lastName: "Сидоров",
    email: "alexey.sidorov@example.com",
    phone: "+7 (999) 345-67-89",
    company: "ЗАО 'СтройИнвест'",
    position: "Менеджер",
    status: "QUALIFIED",
    priority: "HIGH",
    source: "REFERRAL",
    score: 91,
    createdAt: "2025-01-13"
  }
]

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
  const [leads, setLeads] = useState(mockLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [priorityFilter, setPriorityFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter
    const matchesPriority = priorityFilter === "ALL" || lead.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateLead = (leadData: any) => {
    // В будущем здесь будет API вызов
    const newLead = {
      id: Date.now().toString(),
      ...leadData,
      score: Math.floor(Math.random() * 40) + 60, // Случайный скор от 60 до 100
      createdAt: new Date().toISOString().split('T')[0]
    }
    setLeads([newLead, ...leads])
    setIsCreateDialogOpen(false)
  }

  const handleEditLead = (leadData: any) => {
    // В будущем здесь будет API вызов
    setLeads(leads.map(lead =>
      lead.id === editingLead.id ? { ...lead, ...leadData } : lead
    ))
    setEditingLead(null)
  }

  const handleDeleteLead = (leadId: string) => {
    // В будущем здесь будет API вызов
    setLeads(leads.filter(lead => lead.id !== leadId))
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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Лиды ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Диалог редактирования */}
      {editingLead && (
        <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
          <DialogContent className="glass-card border-white/20 max-w-2xl">
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
