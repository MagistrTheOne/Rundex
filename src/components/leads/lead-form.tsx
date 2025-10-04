// Rundex CRM - Форма создания/редактирования лида
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  website: string
  address: string
  city: string
  region: string
  source: string
  status: string
  priority: string
  budget: string
  notes: string
}

interface LeadFormProps {
  initialData?: any
  onSubmit: (data: LeadFormData) => void
  onCancel?: () => void
}

const russianRegions = [
  "Москва", "Санкт-Петербург", "Московская область", "Ленинградская область",
  "Краснодарский край", "Ростовская область", "Свердловская область",
  "Татарстан", "Башкортостан", "Челябинская область", "Нижегородская область",
  "Самарская область", "Новосибирская область", "Красноярский край",
  "Пермский край", "Воронежская область", "Волгоградская область"
]

export function LeadForm({ initialData, onSubmit, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    website: "",
    address: "",
    city: "",
    region: "",
    source: "OTHER",
    status: "NEW",
    priority: "MEDIUM",
    budget: "",
    notes: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        company: initialData.company || "",
        position: initialData.position || "",
        website: initialData.website || "",
        address: initialData.address || "",
        city: initialData.city || "",
        region: initialData.region || "",
        source: initialData.source || "OTHER",
        status: initialData.status || "NEW",
        priority: initialData.priority || "MEDIUM",
        budget: initialData.budget?.toString() || "",
        notes: initialData.notes || ""
      })
    }
  }, [initialData])

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Основная информация */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Основная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">Имя *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Иван"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">Фамилия *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Иванов"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="ivan@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Телефон</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
        </div>
      </div>

      {/* Информация о компании */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Информация о компании</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Компания</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="ООО 'Компания'"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position" className="text-white">Должность</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Директор"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white">Сайт</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-white">Бюджет (₽)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => handleChange("budget", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="1000000"
            />
          </div>
        </div>
      </div>

      {/* Адрес */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Адрес</h3>
        <div className="space-y-2">
          <Label htmlFor="address" className="text-white">Адрес</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="ул. Ленина, д. 1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-white">Город</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Москва"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="region" className="text-white">Регион</Label>
            <Select value={formData.region} onValueChange={(value) => handleChange("region", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Выберите регион" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20 max-h-48">
                {russianRegions.map((region) => (
                  <SelectItem key={region} value={region} className="text-white">
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Статус и приоритет */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Статус и приоритет</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Источник</Label>
            <Select value={formData.source} onValueChange={(value) => handleChange("source", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="WEBSITE" className="text-white">Сайт</SelectItem>
                <SelectItem value="SOCIAL_MEDIA" className="text-white">Социальные сети</SelectItem>
                <SelectItem value="REFERRAL" className="text-white">Рекомендация</SelectItem>
                <SelectItem value="COLD_CALL" className="text-white">Холодный звонок</SelectItem>
                <SelectItem value="EMAIL" className="text-white">Email</SelectItem>
                <SelectItem value="TRADE_SHOW" className="text-white">Выставка</SelectItem>
                <SelectItem value="PARTNER" className="text-white">Партнёр</SelectItem>
                <SelectItem value="OTHER" className="text-white">Другое</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Статус</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="NEW" className="text-white">Новый</SelectItem>
                <SelectItem value="CONTACTED" className="text-white">Связались</SelectItem>
                <SelectItem value="QUALIFIED" className="text-white">Квалифицирован</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSED_WON" className="text-white">Закрыто успешно</SelectItem>
                <SelectItem value="CLOSED_LOST" className="text-white">Закрыто неудачно</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-white">Приоритет</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="LOW" className="text-white">Низкий</SelectItem>
                <SelectItem value="MEDIUM" className="text-white">Средний</SelectItem>
                <SelectItem value="HIGH" className="text-white">Высокий</SelectItem>
                <SelectItem value="URGENT" className="text-white">Срочный</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Заметки */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">Заметки</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-24"
          placeholder="Дополнительная информация о лиде..."
        />
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Отмена
          </Button>
        )}
        <Button
          type="submit"
          className="bg-white text-black hover:bg-white/90"
        >
          {initialData ? "Сохранить изменения" : "Создать лид"}
        </Button>
      </div>
    </form>
  )
}
