// Rundex CRM - Страница управления компаниями
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
import { Plus, Search, MoreHorizontal, Building2, Phone, Mail, Globe, Users, DollarSign } from "lucide-react"
import { AccountForm } from "@/components/accounts/account-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для компаний
interface Account {
  id: string
  name: string
  website?: string
  phone?: string
  email?: string
  industry?: string
  employees?: number
  revenue?: number
  status: string
  createdAt: string
  contacts: Array<{
    id: string
    firstName: string
    lastName: string
    position: string
  }>
  opportunities: Array<{
    id: string
    name: string
    amount: number
    stage: string
  }>
}

const statusLabels = {
  ACTIVE: { label: "Активный", color: "bg-green-500/20 text-green-400" },
  INACTIVE: { label: "Неактивный", color: "bg-gray-500/20 text-gray-400" },
  PROSPECT: { label: "Потенциальный", color: "bg-blue-500/20 text-blue-400" },
  CUSTOMER: { label: "Клиент", color: "bg-purple-500/20 text-purple-400" },
  FORMER_CUSTOMER: { label: "Бывший клиент", color: "bg-red-500/20 text-red-400" }
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка компаний из API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== "ALL") params.append("status", statusFilter)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/accounts?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки компаний")

        const data = await response.json()
        setAccounts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccounts()
  }, [statusFilter, searchQuery])

  const handleCreateAccount = async (accountData: any) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) throw new Error('Ошибка создания компании')

      const newAccount = await response.json()
      setAccounts([newAccount, ...accounts])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания компании")
    }
  }

  const handleEditAccount = async (accountData: any) => {
    try {
      const response = await fetch(`/api/accounts/${editingAccount?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) throw new Error('Ошибка обновления компании')

      const updatedAccount = await response.json()
      setAccounts(accounts.map(account =>
        account.id === editingAccount?.id ? updatedAccount : account
      ))
      setEditingAccount(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления компании")
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления компании')

      setAccounts(accounts.filter(account => account.id !== accountId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления компании")
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Управление компаниями</h2>
          <p className="text-white/70 mt-1">
            Управляйте компаниями и их данными
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новая компания
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать новую компанию</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте информацию о компании
              </DialogDescription>
            </DialogHeader>
            <AccountForm onSubmit={handleCreateAccount} />
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
                  placeholder="Поиск по названию, email или отрасли..."
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
                <SelectItem value="ACTIVE" className="text-white">Активный</SelectItem>
                <SelectItem value="INACTIVE" className="text-white">Неактивный</SelectItem>
                <SelectItem value="PROSPECT" className="text-white">Потенциальный</SelectItem>
                <SelectItem value="CUSTOMER" className="text-white">Клиент</SelectItem>
                <SelectItem value="FORMER_CUSTOMER" className="text-white">Бывший клиент</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Таблица компаний */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Компании ({accounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-white/70 text-center py-8">Загрузка компаний...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Название</TableHead>
                  <TableHead className="text-white">Контакты</TableHead>
                  <TableHead className="text-white">Отрасль</TableHead>
                  <TableHead className="text-white">Сотрудники</TableHead>
                  <TableHead className="text-white">Доход</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        {account.website && (
                          <div className="flex items-center text-sm text-white/60">
                            <Globe className="w-3 h-3 mr-1" />
                            {account.website}
                          </div>
                        )}
                        {account.email && (
                          <div className="flex items-center text-sm text-white/60">
                            <Mail className="w-3 h-3 mr-1" />
                            {account.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-white/60" />
                        <span>{account.contacts.length} контактов</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      {account.industry || '-'}
                    </TableCell>
                    <TableCell className="text-white">
                      {account.employees ? account.employees.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-white">
                      {account.revenue ? (
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {account.revenue.toLocaleString()} ₽
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusLabels[account.status as keyof typeof statusLabels].color}>
                        {statusLabels[account.status as keyof typeof statusLabels].label}
                      </Badge>
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
                            onClick={() => setEditingAccount(account)}
                          >
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleDeleteAccount(account.id)}
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
      {editingAccount && (
        <Dialog open={!!editingAccount} onOpenChange={() => setEditingAccount(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать компанию</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о компании
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              initialData={editingAccount}
              onSubmit={handleEditAccount}
              onCancel={() => setEditingAccount(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
