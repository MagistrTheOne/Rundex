// Rundex CRM - Генератор PDF отчетов
// Автор: MagistrTheOne, 2025

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Брендинг Rundex CRM
const BRANDING = {
  primaryColor: '#7B61FF',
  secondaryColor: '#6B51EF',
  accentColor: '#F0F0FF',
  textColor: '#1a1a1a',
  fontFamily: 'Helvetica',
  logoText: 'Rundex CRM',
  company: 'Rundex Technologies',
  website: 'www.rundex-crm.com'
}

interface ReportData {
  title: string
  type: 'sales' | 'analytics' | 'leads' | 'opportunities' | 'custom'
  dateRange: {
    start: string
    end: string
  }
  generatedAt: string
  generatedBy: string
  data: any
  summary?: {
    totalRevenue?: number
    totalLeads?: number
    conversionRate?: number
    totalDeals?: number
  }
}

export class PDFReportGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageWidth: number
  private pageHeight: number
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.pageWidth = this.doc.internal.pageSize.getWidth()
    this.pageHeight = this.doc.internal.pageSize.getHeight()
  }

  // Генерация полного отчета
  async generateReport(reportData: ReportData): Promise<Blob> {
    this.addHeader(reportData)
    this.addReportInfo(reportData)
    this.addSummarySection(reportData)
    this.addDataSection(reportData)
    this.addFooter()

    return this.doc.output('blob')
  }

  // Добавление заголовка с брендингом
  private addHeader(reportData: ReportData): void {
    // Логотип/брендинг
    this.doc.setFillColor(BRANDING.primaryColor)
    this.doc.rect(0, 0, this.pageWidth, 25, 'F')

    this.doc.setTextColor('#FFFFFF')
    this.doc.setFont(BRANDING.fontFamily, 'bold')
    this.doc.setFontSize(20)
    this.doc.text(BRANDING.logoText, this.margin, 15)

    this.doc.setFontSize(12)
    this.doc.text(BRANDING.company, this.margin, 22)

    // Название отчета
    this.doc.setTextColor(BRANDING.textColor)
    this.doc.setFontSize(18)
    this.doc.setFont(BRANDING.fontFamily, 'bold')
    this.currentY = 40
    this.doc.text(reportData.title, this.margin, this.currentY)

    this.currentY += 10
  }

  // Добавление информации об отчете
  private addReportInfo(reportData: ReportData): void {
    this.doc.setFontSize(10)
    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setTextColor(BRANDING.textColor)

    const info = [
      `Тип отчета: ${this.getReportTypeLabel(reportData.type)}`,
      `Период: ${this.formatDate(reportData.dateRange.start)} - ${this.formatDate(reportData.dateRange.end)}`,
      `Сгенерировано: ${this.formatDateTime(reportData.generatedAt)}`,
      `Автор: ${reportData.generatedBy}`
    ]

    info.forEach((line, index) => {
      this.doc.text(line, this.margin, this.currentY + (index * 5))
    })

    this.currentY += info.length * 5 + 10
  }

  // Добавление сводной секции
  private addSummarySection(reportData: ReportData): void {
    if (!reportData.summary) return

    // Заголовок секции
    this.doc.setFont(BRANDING.fontFamily, 'bold')
    this.doc.setFontSize(14)
    this.doc.setTextColor(BRANDING.primaryColor)
    this.doc.text('Сводка', this.margin, this.currentY)
    this.currentY += 8

    // Данные сводки
    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setFontSize(10)
    this.doc.setTextColor(BRANDING.textColor)

    const summaryItems = []
    if (reportData.summary.totalRevenue !== undefined) {
      summaryItems.push(`Общая выручка: ${this.formatCurrency(reportData.summary.totalRevenue)}`)
    }
    if (reportData.summary.totalLeads !== undefined) {
      summaryItems.push(`Всего лидов: ${reportData.summary.totalLeads}`)
    }
    if (reportData.summary.conversionRate !== undefined) {
      summaryItems.push(`Конверсия: ${reportData.summary.conversionRate}%`)
    }
    if (reportData.summary.totalDeals !== undefined) {
      summaryItems.push(`Всего сделок: ${reportData.summary.totalDeals}`)
    }

    summaryItems.forEach((item, index) => {
      this.doc.text(item, this.margin + 5, this.currentY + (index * 6))
    })

    this.currentY += summaryItems.length * 6 + 10
  }

  // Добавление секции с данными
  private addDataSection(reportData: ReportData): void {
    // Заголовок секции
    this.doc.setFont(BRANDING.fontFamily, 'bold')
    this.doc.setFontSize(14)
    this.doc.setTextColor(BRANDING.primaryColor)
    this.doc.text('Детальные данные', this.margin, this.currentY)
    this.currentY += 8

    // Рендеринг данных в зависимости от типа отчета
    switch (reportData.type) {
      case 'sales':
        this.renderSalesData(reportData.data)
        break
      case 'analytics':
        this.renderAnalyticsData(reportData.data)
        break
      case 'leads':
        this.renderLeadsData(reportData.data)
        break
      case 'opportunities':
        this.renderOpportunitiesData(reportData.data)
        break
      default:
        this.renderGenericData(reportData.data)
    }
  }

  // Рендеринг данных продаж
  private renderSalesData(data: any): void {
    if (!data || !Array.isArray(data)) return

    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setFontSize(9)
    this.doc.setTextColor(BRANDING.textColor)

    // Заголовки таблицы
    const headers = ['Месяц', 'Выручка', 'Количество сделок', 'Средний чек']
    this.renderTableRow(headers, true)
    this.currentY += 5

    // Данные
    data.forEach((item: any) => {
      const row = [
        item.month || item.period,
        this.formatCurrency(item.revenue || item.value),
        item.deals?.toString() || '0',
        this.formatCurrency(item.average || 0)
      ]
      this.renderTableRow(row, false)
      this.currentY += 5
    })
  }

  // Рендеринг аналитических данных
  private renderAnalyticsData(data: any): void {
    if (!data) return

    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setFontSize(9)

    // KPI метрики
    if (data.kpis) {
      this.doc.setFont(BRANDING.fontFamily, 'bold')
      this.doc.text('KPI Метрики:', this.margin, this.currentY)
      this.currentY += 6

      this.doc.setFont(BRANDING.fontFamily, 'normal')
      Object.entries(data.kpis).forEach(([key, value]: [string, any]) => {
        this.doc.text(`${key}: ${value}`, this.margin + 5, this.currentY)
        this.currentY += 5
      })
      this.currentY += 5
    }

    // Графики (если есть)
    if (data.charts) {
      this.doc.setFont(BRANDING.fontFamily, 'bold')
      this.doc.text('Графики и диаграммы:', this.margin, this.currentY)
      this.doc.setFont(BRANDING.fontFamily, 'normal')
      this.doc.setFontSize(8)
      this.doc.text('(Графики доступны в веб-версии отчета)', this.margin + 5, this.currentY + 5)
      this.currentY += 15
    }
  }

  // Рендеринг данных лидов
  private renderLeadsData(data: any): void {
    if (!data || !Array.isArray(data)) return

    const headers = ['Имя', 'Компания', 'Источник', 'Статус', 'Дата создания']
    this.renderTableRow(headers, true)
    this.currentY += 5

    data.slice(0, 20).forEach((lead: any) => {
      const row = [
        lead.name || `${lead.firstName} ${lead.lastName}`,
        lead.company || lead.account?.name || '-',
        lead.source || '-',
        lead.status || '-',
        this.formatDate(lead.createdAt)
      ]
      this.renderTableRow(row, false)
      this.currentY += 5
    })
  }

  // Рендеринг данных возможностей
  private renderOpportunitiesData(data: any): void {
    if (!data || !Array.isArray(data)) return

    const headers = ['Название', 'Компания', 'Стадия', 'Сумма', 'Вероятность']
    this.renderTableRow(headers, true)
    this.currentY += 5

    data.slice(0, 20).forEach((opp: any) => {
      const row = [
        opp.title,
        opp.account?.name || '-',
        opp.stage || opp.status,
        this.formatCurrency(opp.value || opp.amount),
        `${opp.probability || 0}%`
      ]
      this.renderTableRow(row, false)
      this.currentY += 5
    })
  }

  // Рендеринг общих данных
  private renderGenericData(data: any): void {
    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setFontSize(9)

    if (typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        this.doc.text(`${key}: ${JSON.stringify(value)}`, this.margin, this.currentY)
        this.currentY += 5
      })
    } else {
      this.doc.text(String(data), this.margin, this.currentY)
    }
  }

  // Рендеринг строки таблицы
  private renderTableRow(data: string[], isHeader: boolean = false): void {
    const columnWidth = (this.pageWidth - 2 * this.margin) / data.length

    if (isHeader) {
      this.doc.setFillColor(BRANDING.accentColor)
      this.doc.rect(this.margin, this.currentY - 3, this.pageWidth - 2 * this.margin, 6, 'F')
      this.doc.setFont(BRANDING.fontFamily, 'bold')
      this.doc.setTextColor(BRANDING.primaryColor)
    } else {
      this.doc.setFont(BRANDING.fontFamily, 'normal')
      this.doc.setTextColor(BRANDING.textColor)
    }

    data.forEach((cell, index) => {
      const x = this.margin + (index * columnWidth) + 2
      this.doc.text(cell, x, this.currentY)
    })
  }

  // Добавление футера
  private addFooter(): void {
    const footerY = this.pageHeight - 15

    // Линия
    this.doc.setDrawColor(BRANDING.primaryColor)
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5)

    // Текст футера
    this.doc.setFont(BRANDING.fontFamily, 'normal')
    this.doc.setFontSize(8)
    this.doc.setTextColor('#666666')

    this.doc.text(BRANDING.company, this.margin, footerY)
    this.doc.text(`Отчет сгенерирован Rundex CRM`, this.pageWidth - this.margin - 60, footerY)
    this.doc.text(`Страница 1 из 1`, this.pageWidth - this.margin - 25, footerY + 5)
  }

  // Вспомогательные функции форматирования
  private getReportTypeLabel(type: string): string {
    const labels = {
      sales: 'Продажи',
      analytics: 'Аналитика',
      leads: 'Лиды',
      opportunities: 'Возможности',
      custom: 'Пользовательский'
    }
    return labels[type as keyof typeof labels] || type
  }

  private formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU')
    } catch {
      return dateString
    }
  }

  private formatDateTime(dateString: string): string {
    try {
      return new Date(dateString).toLocaleString('ru-RU')
    } catch {
      return dateString
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  // Получение PDF как Blob
  getBlob(): Blob {
    return this.doc.output('blob')
  }

  // Получение PDF как base64
  getBase64(): string {
    return this.doc.output('datauristring')
  }

  // Сохранение PDF
  save(filename: string): void {
    this.doc.save(filename)
  }
}

// Функция для быстрой генерации отчета
// Функция для сбора данных отчета
async function collectReportData(type: string, userId: string, startDate?: string | null, endDate?: string | null) {
  const dateFilter = startDate && endDate ? {
    gte: new Date(startDate),
    lte: new Date(endDate)
  } : {}

  let data: any = {}
  let summary: any = {}

  switch (type) {
    case 'sales':
      // Пример сбора данных продаж
      data = {
        monthlyRevenue: [
          { month: '2024-01', revenue: 150000, deals: 5 },
          { month: '2024-02', revenue: 180000, deals: 7 },
          { month: '2024-03', revenue: 220000, deals: 8 }
        ]
      }
      summary = {
        totalRevenue: 550000,
        totalDeals: 20,
        conversionRate: 65
      }
      break
    case 'analytics':
      data = {
        kpis: {
          totalRevenue: 550000,
          totalLeads: 150,
          conversionRate: 65,
          activeDeals: 25
        }
      }
      break
    case 'leads':
      data = [
        { name: 'Иван Петров', company: 'ТехноСервис', source: 'Веб-сайт', status: 'Новый', createdAt: '2024-01-15' },
        { name: 'Мария Иванова', company: 'СтройКомплект', source: 'Реклама', status: 'В работе', createdAt: '2024-01-20' }
      ]
      break
    case 'opportunities':
      data = [
        { title: 'Проект внедрения CRM', company: 'ТехноСервис', stage: 'Переговоры', value: 500000, probability: 75 },
        { title: 'Разработка сайта', company: 'СтройКомплект', stage: 'Предложение', value: 300000, probability: 50 }
      ]
      break
  }

  return { data, summary }
}

// Вспомогательные функции
function getReportTitle(type: string): string {
  const titles = {
    sales: 'Отчет по продажам',
    analytics: 'Аналитический отчет',
    leads: 'Отчет по лидам',
    opportunities: 'Отчет по возможностям'
  }
  return titles[type as keyof typeof titles] || 'Отчет'
}

function getReportFileName(type: string, startDate?: string | null, endDate?: string | null): string {
  const baseName = getReportTitle(type).toLowerCase().replace(/\s+/g, '_')
  const dateSuffix = startDate && endDate ? `_${startDate}_to_${endDate}` : `_${new Date().toISOString().split('T')[0]}`
  return `${baseName}${dateSuffix}`
}

export async function generatePDFReport(reportData: ReportData): Promise<Blob> {
  const generator = new PDFReportGenerator()
  return await generator.generateReport(reportData)
}

// Функция для генерации отчета из HTML элемента
export async function generatePDFFromElement(elementId: string, reportData: ReportData): Promise<Blob> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Element not found')
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')

  const imgWidth = 210
  const pageHeight = 295
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  let heightLeft = imgHeight

  let position = 0

  // Добавление заголовка
  pdf.setFillColor(BRANDING.primaryColor)
  pdf.rect(0, 0, 210, 25, 'F')
  pdf.setTextColor('#FFFFFF')
  pdf.setFontSize(20)
  pdf.text(BRANDING.logoText, 20, 15)
  pdf.setFontSize(12)
  pdf.text(BRANDING.company, 20, 22)

  pdf.setTextColor(BRANDING.textColor)
  pdf.setFontSize(16)
  pdf.text(reportData.title, 20, 40)

  position = 50

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  return pdf.output('blob')
}
