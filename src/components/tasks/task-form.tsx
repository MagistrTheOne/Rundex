// Rundex CRM - Форма создания/редактирования задачи
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskFormData {
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  leadId: string
  dealId: string
}

interface TaskFormProps {
  initialData?: any
  onSubmit: (data: TaskFormData) => void
  onCancel?: () => void
}

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    leadId: "",
    dealId: ""
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "TODO",
        priority: initialData.priority || "MEDIUM",
        dueDate: initialData.dueDate?.split('T')[0] || "",
        leadId: initialData.leadId || "",
        dealId: initialData.dealId || ""
      })
    }
  }, [initialData])

  const handleChange = (field: keyof TaskFormData, value: string) => {
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
          <Label htmlFor="title" className="text-white">Название задачи *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Название задачи"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Описание задачи..."
            rows={3}
          />
        </div>
      </div>

      {/* Статус и приоритет */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Статус и приоритет</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Статус</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="TODO" className="text-white">К выполнению</SelectItem>
                <SelectItem value="IN_PROGRESS" className="text-white">В процессе</SelectItem>
                <SelectItem value="COMPLETED" className="text-white">Завершена</SelectItem>
                <SelectItem value="CANCELLED" className="text-white">Отменена</SelectItem>
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

      {/* Дополнительная информация */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Дополнительная информация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-white">Срок выполнения</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="leadId" className="text-white">ID Лида (опционально)</Label>
            <Input
              id="leadId"
              value={formData.leadId}
              onChange={(e) => handleChange("leadId", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="ID лида из системы"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealId" className="text-white">ID Сделки (опционально)</Label>
            <Input
              id="dealId"
              value={formData.dealId}
              onChange={(e) => handleChange("dealId", e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="ID сделки из системы"
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
          {initialData ? "Сохранить изменения" : "Создать задачу"}
        </Button>
      </div>
    </form>
  )
}
