// Rundex CRM - Универсальный компонент таблицы данных
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff
} from "lucide-react"

export interface Column<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
  pagination?: {
    pageSize: number
    currentPage: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  actions?: {
    render: (item: T) => React.ReactNode
  }
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Поиск...",
  onSearch,
  isLoading = false,
  error = null,
  emptyMessage = "Нет данных для отображения",
  pagination,
  actions
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => String(col.key)))
  )

  // Фильтрация и сортировка данных
  const processedData = useMemo(() => {
    let filtered = data

    // Поиск
    if (searchQuery && onSearch) {
      onSearch(searchQuery)
    }

    // Сортировка
    if (sortConfig) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filtered
  }, [data, searchQuery, sortConfig, onSearch])

  // Пагинация
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData

    const startIndex = (pagination.currentPage - 1) * pagination.pageSize
    return processedData.slice(startIndex, startIndex + pagination.pageSize)
  }, [processedData, pagination])

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return

    const key = String(column.key)
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const toggleColumnVisibility = (columnKey: string) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(columnKey)) {
      newVisible.delete(columnKey)
    } else {
      newVisible.add(columnKey)
    }
    setVisibleColumns(newVisible)
  }

  if (error) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-6">
          <div className="text-center text-red-400">
            <p className="font-medium">Ошибка загрузки данных</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">
            Данные ({processedData.length})
          </CardTitle>
          {columns.length > 1 && (
            <div className="flex items-center space-x-2">
              <Select>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Колонки" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  {columns.map(column => (
                    <div key={String(column.key)} className="flex items-center space-x-2 p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleColumnVisibility(String(column.key))}
                        className="w-4 h-4 p-0"
                      >
                        {visibleColumns.has(String(column.key)) ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </Button>
                      <span className="text-white text-sm">{column.header}</span>
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Поиск */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-white/70">Загрузка данных...</div>
        ) : processedData.length === 0 ? (
          <div className="text-center py-8 text-white/70">{emptyMessage}</div>
        ) : (
          <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  {columns
                    .filter(column => visibleColumns.has(String(column.key)))
                    .map(column => (
                      <TableHead
                        key={String(column.key)}
                        className={`text-white ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                        style={{ width: column.width }}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{column.header}</span>
                          {column.sortable && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort(column)}
                              className="h-4 w-4 p-0 text-white/70 hover:text-white"
                            >
                              <ArrowUpDown className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  {actions && <TableHead className="text-white">Действия</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow key={index} className="border-white/10">
                    {columns
                      .filter(column => visibleColumns.has(String(column.key)))
                      .map(column => (
                        <TableCell
                          key={String(column.key)}
                          className={`text-white ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}`}
                        >
                          {column.render
                            ? column.render(item[column.key], item)
                            : String(item[column.key] || '')
                          }
                        </TableCell>
                      ))}
                    {actions && (
                      <TableCell className="text-white">
                        {actions.render(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Пагинация */}
        {pagination && processedData.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/70">Показывать:</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) => pagination.onPageSizeChange(Number(value))}
              >
                <SelectTrigger className="w-20 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/20">
                  <SelectItem value="10" className="text-white">10</SelectItem>
                  <SelectItem value="25" className="text-white">25</SelectItem>
                  <SelectItem value="50" className="text-white">50</SelectItem>
                  <SelectItem value="100" className="text-white">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-white/70">
                элементов на странице
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/70">
                {((pagination.currentPage - 1) * pagination.pageSize) + 1} - {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)} из {pagination.total}
              </span>

              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(Math.ceil(pagination.total / pagination.pageSize))}
                  disabled={pagination.currentPage >= Math.ceil(pagination.total / pagination.pageSize)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
