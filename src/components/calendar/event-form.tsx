// Rundex CRM - Форма создания события календаря
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, MapPin, Users, Repeat, X } from "lucide-react"
import { motion } from "framer-motion"

interface EventFormData {
  title: string
  description: string
  type: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  location: string
  attendees: string[]

  // Повторение
  isRecurring: boolean
  recurrenceType: string
  recurrenceInterval: number
  recurrenceEndDate: string
  recurrenceDays: string[] // Для weekly повторений
}

interface EventFormProps {
  initialData?: Partial<EventFormData>
  onSubmit: (data: EventFormData) => void
  onCancel: () => void
}

const eventTypes = [
  { value: "MEETING", label: "Встреча", color: "bg-blue-500" },
  { value: "CALL", label: "Звонок", color: "bg-green-500" },
  { value: "DEMO", label: "Демо", color: "bg-purple-500" },
  { value: "TASK", label: "Задача", color: "bg-orange-500" },
  { value: "REMINDER", label: "Напоминание", color: "bg-yellow-500" },
  { value: "OTHER", label: "Другое", color: "bg-gray-500" }
]

const recurrenceTypes = [
  { value: "DAILY", label: "Ежедневно" },
  { value: "WEEKLY", label: "Еженедельно" },
  { value: "MONTHLY", label: "Ежемесячно" },
  { value: "YEARLY", label: "Ежегодно" }
]

const weekDays = [
  { value: "1", label: "Пн" },
  { value: "2", label: "Вт" },
  { value: "3", label: "Ср" },
  { value: "4", label: "Чт" },
  { value: "5", label: "Пт" },
  { value: "6", label: "Сб" },
  { value: "0", label: "Вс" }
]

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    type: initialData?.type || "MEETING",
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || "09:00",
    endDate: initialData?.endDate || new Date().toISOString().split('T')[0],
    endTime: initialData?.endTime || "10:00",
    location: initialData?.location || "",
    attendees: initialData?.attendees || [],

    isRecurring: initialData?.isRecurring || false,
    recurrenceType: initialData?.recurrenceType || "WEEKLY",
    recurrenceInterval: initialData?.recurrenceInterval || 1,
    recurrenceEndDate: initialData?.recurrenceEndDate || "",
    recurrenceDays: initialData?.recurrenceDays || ["1", "2", "3", "4", "5"] // Пн-Пт по умолчанию
  })

  const [attendeeInput, setAttendeeInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    if (!formData.title.trim()) {
      alert("Название события обязательно")
      return
    }

    if (!formData.startDate || !formData.startTime) {
      alert("Дата и время начала обязательны")
      return
    }

    onSubmit(formData)
  }

  const addAttendee = () => {
    if (attendeeInput.trim() && !formData.attendees.includes(attendeeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, attendeeInput.trim()]
      }))
      setAttendeeInput("")
    }
  }

  const removeAttendee = (attendee: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(a => a !== attendee)
    }))
  }

  const toggleWeekDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      recurrenceDays: prev.recurrenceDays.includes(day)
        ? prev.recurrenceDays.filter(d => d !== day)
        : [...prev.recurrenceDays, day]
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CalendarDays className="w-5 h-5 mr-2" />
            {initialData ? "Редактировать событие" : "Создать событие"}
          </CardTitle>
          <CardDescription className="text-white/70">
            Запланируйте встречу, звонок или задачу
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">Название события *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Название события"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Описание события"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Тип события</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/20">
                    {eventTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${type.color}`}></div>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Дата и время */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Дата и время
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-white">Дата начала *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startTime" className="text-white">Время начала *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endDate" className="text-white">Дата окончания</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="endTime" className="text-white">Время окончания</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Местоположение */}
            <div>
              <Label htmlFor="location" className="text-white flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Местоположение
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Офис, Zoom, телефон..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Участники */}
            <div className="space-y-3">
              <Label className="text-white flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Участники
              </Label>

              <div className="flex gap-2">
                <Input
                  value={attendeeInput}
                  onChange={(e) => setAttendeeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                  placeholder="Email или имя участника"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button
                  type="button"
                  onClick={addAttendee}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Добавить
                </Button>
              </div>

              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.attendees.map(attendee => (
                    <Badge
                      key={attendee}
                      variant="outline"
                      className="border-white/20 text-white/70 flex items-center gap-1"
                    >
                      {attendee}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400"
                        onClick={() => removeAttendee(attendee)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Повторение */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isRecurring: checked as boolean }))
                  }
                />
                <Label htmlFor="recurring" className="text-white flex items-center">
                  <Repeat className="w-4 h-4 mr-2" />
                  Повторяющееся событие
                </Label>
              </div>

              {formData.isRecurring && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="recurrenceType" className="text-white">Тип повторения</Label>
                      <Select
                        value={formData.recurrenceType}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, recurrenceType: value }))}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          {recurrenceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value} className="text-white">
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="recurrenceInterval" className="text-white">Интервал</Label>
                      <Select
                        value={formData.recurrenceInterval.toString()}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, recurrenceInterval: parseInt(value) }))}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-white/20">
                          {[1, 2, 3, 4, 6, 12].map(interval => (
                            <SelectItem key={interval} value={interval.toString()} className="text-white">
                              Каждый {interval}-й {formData.recurrenceType === 'DAILY' ? 'день' :
                                                   formData.recurrenceType === 'WEEKLY' ? 'неделю' :
                                                   formData.recurrenceType === 'MONTHLY' ? 'месяц' : 'год'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.recurrenceType === 'WEEKLY' && (
                    <div>
                      <Label className="text-white">Дни недели</Label>
                      <div className="flex gap-2 mt-2">
                        {weekDays.map(day => (
                          <Button
                            key={day.value}
                            type="button"
                            size="sm"
                            variant={formData.recurrenceDays.includes(day.value) ? "default" : "outline"}
                            onClick={() => toggleWeekDay(day.value)}
                            className={`${
                              formData.recurrenceDays.includes(day.value)
                                ? 'bg-[#7B61FF] hover:bg-[#6B51EF]'
                                : 'border-white/20 text-white hover:bg-white/10'
                            }`}
                          >
                            {day.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="recurrenceEndDate" className="text-white">Дата окончания повторений</Label>
                    <Input
                      id="recurrenceEndDate"
                      type="date"
                      value={formData.recurrenceEndDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, recurrenceEndDate: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Оставить пустым для бессрочных повторений"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-[#7B61FF] hover:bg-[#6B51EF] text-white"
              >
                {initialData ? "Сохранить" : "Создать событие"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
