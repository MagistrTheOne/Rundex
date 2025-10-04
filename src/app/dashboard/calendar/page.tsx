// Rundex CRM - Страница календаря
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Users, Target } from "lucide-react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Типы данных для событий
interface CalendarEvent {
  id: string
  title: string
  type: string
  date: string
  time: string
  description?: string
  location?: string
  attendees: string[]
  status: string
  isRecurring?: boolean
  recurrenceType?: string
}

const eventTypes = {
  meeting: { label: "Встреча", color: "bg-blue-500/20 text-blue-400", icon: Users },
  demo: { label: "Демо", color: "bg-purple-500/20 text-purple-400", icon: Target },
  call: { label: "Звонок", color: "bg-green-500/20 text-green-400", icon: Clock }
}

// Компонент для draggable события
function DraggableEvent({ event, isDragging }: { event: any; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({ id: event.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: (sortableIsDragging || isDragging) ? 0.5 : 1,
  }

  const typeInfo = eventTypes[event.type as keyof typeof eventTypes]
  const Icon = typeInfo.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`text-xs p-1 rounded cursor-move ${typeInfo.color} flex items-center hover:opacity-80 transition-opacity`}
    >
      <Icon className="w-2 h-2 mr-1 flex-shrink-0" />
      <span className="truncate">{event.title}</span>
    </div>
  )
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Настройка сенсоров для drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Загрузка событий
  const loadEvents = async () => {
    try {
      setIsLoading(true)
      // Получаем события для текущего месяца и ±1 месяц
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0)

      const response = await fetch(
        `/api/events?startDate=${startOfMonth.toISOString().split('T')[0]}&endDate=${endOfMonth.toISOString().split('T')[0]}&includeRecurring=true`
      )

      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Загружаем события при изменении месяца
  useEffect(() => {
    loadEvents()
  }, [currentDate])

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

  // Обработчики drag & drop
  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = events.find(e => e.id === event.active.id)
    setActiveEvent(draggedEvent || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveEvent(null)
      return
    }

    // Если событие перетащили на другой день
    if (over.id !== active.id && typeof over.id === 'string' && over.id.includes('-')) {
      const newDate = over.id

      try {
        // Отправляем запрос на обновление даты события
        const response = await fetch(`/api/events/${active.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: `${newDate}T${activeEvent?.time || '09:00'}:00`
          })
        })

        if (response.ok) {
          // Обновляем локальное состояние
          const updatedEvents = events.map(event =>
            event.id === active.id
              ? { ...event, date: newDate }
              : event
          )
          setEvents(updatedEvents)
          console.log(`Event ${active.id} moved to ${newDate}`)
        } else {
          console.error('Failed to update event date')
        }
      } catch (error) {
        console.error('Error updating event:', error)
      }
    }

    setActiveEvent(null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Можно добавить дополнительную логику для drag over
  }

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
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
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

                const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

                return (
                  <div
                    key={index}
                    id={dateString}
                    className={`p-2 min-h-16 border rounded-lg transition-colors ${
                      isToday
                        ? 'border-[#7B61FF] bg-[#7B61FF]/10'
                        : 'border-white/10 hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedDate(dateString)}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-[#7B61FF]' : 'text-white'}`}>
                      {day}
                    </div>
                    {dayEvents.length > 0 && (
                      <SortableContext items={dayEvents.map(e => e.id)} strategy={verticalListSortingStrategy}>
                        <div className="mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <DraggableEvent key={event.id} event={event} />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-white/50">
                              +{dayEvents.length - 2} еще
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <DragOverlay>
          {activeEvent ? (
            <div className="opacity-90 transform rotate-3">
              <DraggableEvent event={activeEvent} isDragging={true} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
