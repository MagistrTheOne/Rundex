// Rundex CRM - Страница отчетов
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Clock,
  RefreshCw,
  Eye,
  Trash2
} from "lucide-react"
import { motion } from "framer-motion"

// Типы отчетов
interface Report {
  id: string
  name: string
  type: string
  description: string
  createdAt: string
  size: string
  format: string
  status: 'completed' | 'generating' | 'failed'
}

// Моковые данные отчетов
const mockReports: Report[] = [
  {
    id: "1",
    name: "Отчет по продажам за сентябрь 2025",
    type: "sales",
    description: "Детальный анализ продаж, конверсии и доходов",
    createdAt: "2025-10-01T10:30:00Z",
    size: "2.4 MB",
    format: "PDF",
    status: "completed"
  },
  {
    id: "2",
    name: "Анализ лидов за квартал",
    type: "leads",
    description: "Статистика по источникам привлечения и конверсии",
    createdAt: "2025-10-01T09:15:00Z",
    size: "1.8 MB",
    format: "Excel",
    status: "completed"
  },
  {
    id: "3",
    name: "Отчет по компаниям",
    type: "accounts",
    description: "Обзор всех компаний и их активности",
    createdAt: "2025-09-30T16:45:00Z",
    size: "3.2 MB",
    format: "PDF",
    status: "generating"
  }
]

const reportTypes = [
  { value: "sales", label: "Продажи", icon: DollarSign, color: "text-green-400" },
  { value: "leads", label: "Лиды", icon: Users, color: "text-blue-400" },
  { value: "accounts", label: "Компании", icon: Target, color: "text-purple-400" },
  { value: "activities", label: "Активность", icon: BarChart3, color: "text-orange-400" },
  { value: "performance", label: "Производительность", icon: Clock, color: "text-cyan-400" }
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedType, setSelectedType] = useState("all")
  const [dateRange, setDateRange] = useState("month")
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const generateReport = async (type: string) => {
    setIsGenerating(true)

    // Имитация генерации отчета
    setTimeout(() => {
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${reportTypes.find(t => t.value === type)?.label} отчет - ${new Date().toLocaleDateString('ru-RU')}`,
        type,
        description: `Автоматически сгенерированный отчет по ${reportTypes.find(t => t.value === type)?.label.toLowerCase()}`,
        createdAt: new Date().toISOString(),
        size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
        format: Math.random() > 0.5 ? "PDF" : "Excel",
        status: "completed"
      }

      setReports([newReport, ...reports])
      setIsGenerating(false)
    }, 3000)
  }

  const downloadReport = (report: Report) => {
    // Имитация скачивания
    console.log(`Downloading ${report.name}`)
  }

  const deleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId))
  }

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === "all" || report.type === selectedType
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Отчеты</h2>
          <p className="text-white/70 mt-1">
            Создание и управление отчетами системы
          </p>
        </div>
      </div>

      {/* Быстрое создание отчетов */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Быстрое создание отчетов
            </CardTitle>
            <CardDescription className="text-white/70">
              Выберите тип отчета для автоматической генерации
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Button
                    key={type.value}
                    onClick={() => generateReport(type.value)}
                    disabled={isGenerating}
                    className="h-20 flex-col border border-white/20 bg-white/5 hover:bg-white/10 text-white"
                    variant="outline"
                  >
                    <Icon className={`w-6 h-6 mb-2 ${type.color}`} />
                    <span className="text-sm">{type.label}</span>
                  </Button>
                )
              })}
            </div>
            {isGenerating && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center text-blue-400">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Генерация отчета...
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Фильтры */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                  <Input
                    placeholder="Поиск отчетов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Тип отчета" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="all" className="text-white">Все типы</SelectItem>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value} className="text-white">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Период" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="week" className="text-white">Последняя неделя</SelectItem>
                  <SelectItem value="month" className="text-white">Последний месяц</SelectItem>
                  <SelectItem value="quarter" className="text-white">Последний квартал</SelectItem>
                  <SelectItem value="year" className="text-white">Последний год</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Список отчетов */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Сгенерированные отчеты ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">Название</TableHead>
                  <TableHead className="text-white">Тип</TableHead>
                  <TableHead className="text-white">Формат</TableHead>
                  <TableHead className="text-white">Размер</TableHead>
                  <TableHead className="text-white">Дата создания</TableHead>
                  <TableHead className="text-white">Статус</TableHead>
                  <TableHead className="text-white">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => {
                  const typeInfo = reportTypes.find(t => t.value === report.type)
                  const Icon = typeInfo?.icon || FileText

                  return (
                    <TableRow key={report.id} className="border-white/10">
                      <TableCell className="text-white font-medium">
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-white/60">{report.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          typeInfo?.color ? `bg-white/10 ${typeInfo.color} border-white/20` : 'bg-white/10 text-white border-white/20'
                        }`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {typeInfo?.label || report.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{report.format}</TableCell>
                      <TableCell className="text-white">{report.size}</TableCell>
                      <TableCell className="text-white">
                        {new Date(report.createdAt).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${
                          report.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          report.status === 'generating' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {report.status === 'completed' ? 'Готов' :
                           report.status === 'generating' ? 'Генерируется' : 'Ошибка'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadReport(report)}
                            disabled={report.status !== 'completed'}
                            className="text-white hover:bg-white/10"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteReport(report.id)}
                            className="text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-white/60">
                Отчеты не найдены. Создайте первый отчет выше.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Шаблоны отчетов */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-black/80 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Шаблоны отчетов</CardTitle>
            <CardDescription className="text-white/70">
              Готовые шаблоны для регулярной отчетности
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white/5 border border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Ежемесячный отчет по продажам</h4>
                      <p className="text-sm text-white/60">Доходы, конверсия, ROI</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Анализ лидов</h4>
                      <p className="text-sm text-white/60">Источники, качество, конверсия</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Производительность команды</h4>
                      <p className="text-sm text-white/60">Задачи, активность, эффективность</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                    Создать отчет
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
