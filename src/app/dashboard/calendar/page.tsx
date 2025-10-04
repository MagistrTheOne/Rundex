// Rundex CRM - Страница календаря
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, Target } from "lucide-react"

// Моковые данные событий календаря
const mockEvents = [
  {
    id: "1",
    title: "Встреча с клиентом",
    type: "meeting",
    date: "2025-01-15",
    time: "14:00",
    description: "Обсуждение нового проекта",
    attendees: ["Иванов И.И.", "Петров П.П."],
    status: "confirmed"
  },
  {
    id: "2",
    title: "Демо-презентация",
    type: "demo",
    date: "2025-01-16",
    time: "10:30",
    description: "Презентация продукта для потенциального клиента",
    attendees: ["Сидоров С.С."],
    status: "pending"
  },
  {
    id: "3",
    title: "Звонок клиенту",
    type: "call",
    date: "2025-01-17",
    time: "16:00",
    description: "Follow-up звонок после встречи",
    attendees: ["Иванов И.И."],
    status: "confirmed"
  }
]

const eventTypes = {
  meeting: { label: "Встреча", color: "bg-blue-500/20 text-blue-400", icon: Users },
  demo: { label: "Демо", color: "bg-purple-500/20 text-purple-400", icon: Target },
  call: { label: "Звонок", color: "bg-green-500/20 text-green-400", icon: Clock }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(mockEvents)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Получить дни месяца
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Получить первый день недели месяца
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  // Навигация по месяцам
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Получить события для даты
  const getEventsForDate = (date: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`
    return events.filter(event => event.date === dateString)
  }

  // Генерация календаря
  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null) // Пустые дни в начале месяца
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ]

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Календарь</h2>
          <p className="text-white/70 mt-1">
            Планируйте встречи, звонки и события
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-white/90">
          <Plus className="w-4 h-4 mr-2" />
          Новое событие
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Календарь */}
        <Card className="lg:col-span-2 bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Заголовки дней недели */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-white/70">
                  {day}
                </div>
              ))}
            </div>

            {/* Дни месяца */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2"></div>
                }

                const dayEvents = getEventsForDate(day)
                const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()

                return (
                  <div
                    key={index}
                    className={`p-2 min-h-16 border rounded-lg cursor-pointer transition-colors ${
                      isToday
                        ? 'border-[#7B61FF] bg-[#7B61FF]/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-[#7B61FF]' : 'text-white'}`}>
                      {day}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => {
                          const typeInfo = eventTypes[event.type as keyof typeof eventTypes]
                          const Icon = typeInfo.icon

                          return (
                            <div key={event.id} className={`text-xs p-1 rounded ${typeInfo.color} flex items-center`}>
                              <Icon className="w-2 h-2 mr-1" />
                              {event.title}
                            </div>
                          )
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-white/50">
                            +{dayEvents.length - 2} еще
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* События дня */}
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedDate ? `События ${selectedDate}` : "Выберите дату"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-3">
                {getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 ? (
                  <p className="text-white/60 text-center py-4">Нет событий на эту дату</p>
                ) : (
                  getEventsForDate(parseInt(selectedDate.split('-')[2])).map(event => {
                    const typeInfo = eventTypes[event.type as keyof typeof eventTypes]
                    const Icon = typeInfo.icon

                    return (
                      <div key={event.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-white/70" />
                            <Badge className={typeInfo.color}>
                              {typeInfo.label}
                            </Badge>
                          </div>
                          <span className="text-sm text-white/60">{event.time}</span>
                        </div>

                        <h4 className="font-medium text-white mb-1">{event.title}</h4>
                        <p className="text-sm text-white/70 mb-2">{event.description}</p>

                        <div className="flex items-center text-xs text-white/50">
                          <Users className="w-3 h-3 mr-1" />
                          {event.attendees.join(", ")}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            ) : (
              <p className="text-white/60 text-center py-4">Выберите дату для просмотра событий</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
