// Rundex CRM - Страница воронки продаж
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
import { Progress } from "@/components/ui/progress"
import { Plus, Search, MoreHorizontal, Target, Calendar, DollarSign, TrendingUp, Users, Building2 } from "lucide-react"
import { OpportunityForm } from "@/components/opportunities/opportunity-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для возможностей
interface Opportunity {
  id: string
  name: string
  description?: string
  amount: number
  currency: string
  stage: string
  probability: number
  closeDate?: string
  createdAt: string
  lead?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  account?: {
    id: string
    name: string
  }
  assignedTo?: {
    id: string
    name: string
  }
}

const stageLabels = {
  PROSPECTING: { label: "Поиск", color: "bg-gray-500/20 text-gray-400", progress: 10 },
  QUALIFICATION: { label: "Квалификация", color: "bg-blue-500/20 text-blue-400", progress: 25 },
  PROPOSAL: { label: "Предложение", color: "bg-purple-500/20 text-purple-400", progress: 50 },
  NEGOTIATION: { label: "Переговоры", color: "bg-orange-500/20 text-orange-400", progress: 75 },
  CLOSED_WON: { label: "Закрыта успешно", color: "bg-green-500/20 text-green-400", progress: 100 },
  CLOSED_LOST: { label: "Закрыта неудачно", color: "bg-red-500/20 text-red-400", progress: 0 }
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка возможностей из API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (stageFilter !== "ALL") params.append("stage", stageFilter)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/opportunities?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки возможностей")

        const data = await response.json()
        setOpportunities(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOpportunities()
  }, [stageFilter, searchQuery])

  const handleCreateOpportunity = async (opportunityData: any) => {
    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityData),
      })

      if (!response.ok) throw new Error('Ошибка создания возможности')

      const newOpportunity = await response.json()
      setOpportunities([newOpportunity, ...opportunities])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания возможности")
    }
  }

  const handleEditOpportunity = async (opportunityData: any) => {
    try {
      const response = await fetch(`/api/opportunities/${editingOpportunity?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(opportunityData),
      })

      if (!response.ok) throw new Error('Ошибка обновления возможности')

      const updatedOpportunity = await response.json()
      setOpportunities(opportunities.map(opportunity =>
        opportunity.id === editingOpportunity?.id ? updatedOpportunity : opportunity
      ))
      setEditingOpportunity(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления возможности")
    }
  }

  const handleDeleteOpportunity = async (opportunityId: string) => {
    try {
      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления возможности')

      setOpportunities(opportunities.filter(opportunity => opportunity.id !== opportunityId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления возможности")
    }
  }

  // Группировка по этапам для воронки
  const opportunitiesByStage = opportunities.reduce((acc, opp) => {
    if (!acc[opp.stage]) acc[opp.stage] = []
    acc[opp.stage].push(opp)
    return acc
  }, {} as Record<string, Opportunity[]>)

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.amount, 0)
  const totalProbability = opportunities.length > 0
    ? opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length
    : 0

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Воронка продаж</h2>
          <p className="text-white/70 mt-1">
            Управляйте возможностями и отслеживайте продажи
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новая возможность
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать новую возможность</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте информацию о возможности
              </DialogDescription>
            </DialogHeader>
            <OpportunityForm onSubmit={handleCreateOpportunity} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Статистика воронки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Всего возможностей</p>
                <p className="text-2xl font-bold text-white">{opportunities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Общая сумма</p>
                <p className="text-2xl font-bold text-white">{totalValue.toLocaleString()} ₽</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/60">Средняя вероятность</p>
                <p className="text-2xl font-bold text-white">{Math.round(totalProbability)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Этап" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="ALL" className="text-white">Все этапы</SelectItem>
                <SelectItem value="PROSPECTING" className="text-white">Поиск</SelectItem>
                <SelectItem value="QUALIFICATION" className="text-white">Квалификация</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSED_WON" className="text-white">Закрыта успешно</SelectItem>
                <SelectItem value="CLOSED_LOST" className="text-white">Закрыта неудачно</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Воронка продаж */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Графическая воронка */}
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Воронка продаж
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(opportunitiesByStage).map(([stage, opps]) => {
                const stageInfo = stageLabels[stage as keyof typeof stageLabels]
                if (!stageInfo) return null

                return (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={stageInfo.color}>
                          {stageInfo.label}
                        </Badge>
                        <span className="text-sm text-white/60">
                          {opps.length} возможностей
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {opps.reduce((sum, opp) => sum + opp.amount, 0).toLocaleString()} ₽
                      </span>
                    </div>
                    <Progress value={stageInfo.progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Таблица возможностей */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Возможности ({opportunities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-white/70 text-center py-8">Загрузка возможностей...</div>
            ) : opportunities.length === 0 ? (
              <div className="text-white/70 text-center py-8">Нет возможностей для отображения</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {opportunities.slice(0, 10).map((opportunity) => (
                  <div key={opportunity.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{opportunity.name}</h4>
                      <Badge className={stageLabels[opportunity.stage as keyof typeof stageLabels]?.color}>
                        {stageLabels[opportunity.stage as keyof typeof stageLabels]?.label}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-green-400">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {opportunity.amount.toLocaleString()} {opportunity.currency}
                        </div>
                        <div className="flex items-center text-blue-400">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {opportunity.probability}%
                        </div>
                      </div>

                      {opportunity.lead && (
                        <div className="flex items-center text-white/60">
                          <Users className="w-3 h-3 mr-1" />
                          {opportunity.lead.firstName} {opportunity.lead.lastName}
                        </div>
                      )}
                    </div>

                    {opportunity.closeDate && (
                      <div className="flex items-center text-xs text-white/50 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Закрытие: {new Date(opportunity.closeDate).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                ))}

                {opportunities.length > 10 && (
                  <div className="text-center py-2">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      Показать ещё {opportunities.length - 10} возможностей
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Диалог редактирования */}
      {editingOpportunity && (
        <Dialog open={!!editingOpportunity} onOpenChange={() => setEditingOpportunity(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать возможность</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о возможности
              </DialogDescription>
            </DialogHeader>
            <OpportunityForm
              initialData={editingOpportunity}
              onSubmit={handleEditOpportunity}
              onCancel={() => setEditingOpportunity(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
