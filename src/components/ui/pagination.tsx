// Rundex CRM - Компонент пагинации
// Автор: MagistrTheOne, 2025

"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  showPageSizeSelector?: boolean
  pageSizeOptions?: number[]
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 25, 50, 100],
  className = ""
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Генерация номеров страниц для отображения
  const getVisiblePages = () => {
    const delta = 2 // Количество страниц слева и справа от текущей
    const pages = []

    // Всегда показываем первую страницу
    if (totalPages > 1) pages.push(1)

    // Добавляем страницы слева от текущей
    for (let i = Math.max(2, currentPage - delta); i < currentPage; i++) {
      pages.push(i)
    }

    // Добавляем текущую страницу (если она не первая и не последняя)
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage)
    }

    // Добавляем страницы справа от текущей
    for (let i = currentPage + 1; i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      pages.push(i)
    }

    // Всегда показываем последнюю страницу (если она не первая)
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Информация о странице */}
      <div className="flex items-center space-x-4">
        {showPageSizeSelector && onPageSizeChange && (
          <>
            <span className="text-sm text-white/70">Показывать:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-20 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()} className="text-white">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-white/70">элементов</span>
          </>
        )}

        <span className="text-sm text-white/70">
          {startItem}-{endItem} из {totalItems}
        </span>
      </div>

      {/* Кнопки пагинации */}
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Номера страниц */}
        {visiblePages.map((page, index) => {
          const isCurrentPage = page === currentPage
          const showEllipsis = index > 0 && page - visiblePages[index - 1] > 1

          return (
            <div key={page} className="flex items-center">
              {showEllipsis && (
                <div className="px-2 text-white/50">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              )}
              <Button
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`min-w-8 ${
                  isCurrentPage
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {page}
              </Button>
            </div>
          )
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}