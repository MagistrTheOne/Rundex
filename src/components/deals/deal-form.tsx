// Rundex CRM - Форма создания/редактирования сделки
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DealFormData {
  title: string
  description: string
  value: string
  currency: string
  status: string
  priority: string
  stage: string
  expectedCloseDate: string
  leadId: string
}

interface DealFormProps {
  initialData?: any
  onSubmit: (data: DealFormData) => void
  onCancel?: () => void
}

export function DealForm({ initialData, onSubmit, onCancel }: DealFormProps) {
  const [formData, setFormData] = useState<DealFormData>({
    title: "",
    description: "",
    value: "",
    currency: "RUB",
    status: "NEW",
    priority: "MEDIUM",
    stage: "QUALIFICATION",
    expectedCloseDate: "",
    leadId: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        value: initialData.value?.toString() || "",
        currency: initialData.currency || "RUB",
        status: initialData.status || "NEW",
        priority: initialData.priority || "MEDIUM",
        stage: initialData.stage || "QUALIFICATION",
        expectedCloseDate: initialData.expectedCloseDate?.split('T')[0] || "",
        leadId: initialData.leadId || ""
      })
    }
  }, [initialData])

  const handleChange = (field: keyof DealFormData, value: string) => {
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
        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">Название сделки *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Продажа CRM системы"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Описание сделки..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="value" className="text-white">Стоимость</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="1000000"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Валюта</Label>
            <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="RUB" className="text-white">RUB</SelectItem>
                <SelectItem value="USD" className="text-white">USD</SelectItem>
                <SelectItem value="EUR" className="text-white">EUR</SelectItem>
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
            <Label className="text-white">Статус</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="NEW" className="text-white">Новая</SelectItem>
                <SelectItem value="QUALIFIED" className="text-white">Квалифицирована</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSED_WON" className="text-white">Закрыта успешно</SelectItem>
                <SelectItem value="CLOSED_LOST" className="text-white">Закрыта неудачно</SelectItem>
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
          <div className="space-y-2">
            <Label className="text-white">Этап</Label>
            <Select value={formData.stage} onValueChange={(value) => handleChange("stage", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="QUALIFICATION" className="text-white">Квалификация</SelectItem>
                <SelectItem value="NEEDS_ANALYSIS" className="text-white">Анализ потребностей</SelectItem>
                <SelectItem value="PROPOSAL" className="text-white">Предложение</SelectItem>
                <SelectItem value="NEGOTIATION" className="text-white">Переговоры</SelectItem>
                <SelectItem value="CLOSING" className="text-white">Закрытие</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Дополнительная информация */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Дополнительная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedCloseDate" className="text-white">Ожидаемая дата закрытия</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadId" className="text-white">ID Лида</Label>
            <Input
              id="leadId"
              value={formData.leadId}
              onChange={(e) => handleChange("leadId", e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="ID лида из системы"
            />
          </div>
        </div>
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
          {initialData ? "Сохранить изменения" : "Создать сделку"}
        </Button>
      </div>
    </form>
  )
}
