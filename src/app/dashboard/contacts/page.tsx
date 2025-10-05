// Rundex CRM - Страница управления контактами
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, MoreHorizontal, UserPlus, Phone, Mail, Building } from "lucide-react"
import { ContactForm } from "@/components/contacts/contact-form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Типы данных для контактов
interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  createdAt: string
  leads: Array<{
    id: string
    firstName: string
    lastName: string
  }>
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Загрузка контактов из API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/v1/contacts?${params}`)
        if (!response.ok) throw new Error("Ошибка загрузки контактов")

        const data = await response.json()
        setContacts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [searchQuery])

  const handleCreateContact = async (contactData: any) => {
    try {
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) throw new Error('Ошибка создания контакта')

      const newContact = await response.json()
      setContacts([newContact, ...contacts])
      setIsCreateDialogOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания контакта")
    }
  }

  const handleEditContact = async (contactData: any) => {
    try {
      const response = await fetch(`/api/v1/contacts/${editingContact?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) throw new Error('Ошибка обновления контакта')

      const updatedContact = await response.json()
      setContacts(contacts.map(contact =>
        contact.id === editingContact?.id ? updatedContact : contact
      ))
      setEditingContact(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обновления контакта")
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/v1/contacts/${contactId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Ошибка удаления контакта')

      setContacts(contacts.filter(contact => contact.id !== contactId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка удаления контакта")
    }
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Управление контактами</h2>
          <p className="text-white/70 mt-1">
            Управляйте контактами и отслеживайте взаимодействия
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90">
              <Plus className="w-4 h-4 mr-2" />
              Новый контакт
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Создать новый контакт</DialogTitle>
              <DialogDescription className="text-white/70">
                Добавьте информацию о контакте
              </DialogDescription>
            </DialogHeader>
            <ContactForm onSubmit={handleCreateContact} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Поиск */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
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
          </div>
        </CardContent>
      </Card>

      {/* Таблица контактов */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Контакты ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-400 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-white/70 text-center py-8">Загрузка контактов...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Имя</TableHead>
                  <TableHead className="text-white">Компания</TableHead>
                  <TableHead className="text-white">Контакты</TableHead>
                  <TableHead className="text-white">Связанные лиды</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {contact.firstName} {contact.lastName}
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        <div className="font-medium">{contact.company}</div>
                        <div className="text-sm text-white/50">{contact.position}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex flex-wrap gap-1">
                        {contact.leads.slice(0, 2).map((lead) => (
                          <span key={lead.id} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            {lead.firstName} {lead.lastName}
                          </span>
                        ))}
                        {contact.leads.length > 2 && (
                          <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded">
                            +{contact.leads.length - 2}
                          </span>
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
                            onClick={() => setEditingContact(contact)}
                          >
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10"
                            onClick={() => handleDeleteContact(contact.id)}
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
      {editingContact && (
        <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
          <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Редактировать контакт</DialogTitle>
              <DialogDescription className="text-white/70">
                Измените информацию о контакте
              </DialogDescription>
            </DialogHeader>
            <ContactForm
              initialData={editingContact}
              onSubmit={handleEditContact}
              onCancel={() => setEditingContact(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
