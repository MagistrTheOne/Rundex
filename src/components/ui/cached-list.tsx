// Rundex CRM - Компонент списка с кешированием
// Автор: MagistrTheOne, 2025

"use client"

import { useMemo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'

interface CachedListProps<T> {
  data: T[]
  isLoading?: boolean
  error?: string | null
  emptyMessage?: string
  emptyIcon?: any
  renderItem: (item: T, index: number) => ReactNode
  keyExtractor: (item: T, index: number) => string | number
  cacheKey?: string
  className?: string
  header?: {
    title: string
    description?: string
  }
}

export function CachedList<T>({
  data,
  isLoading = false,
  error = null,
  emptyMessage = "Нет данных для отображения",
  emptyIcon,
  renderItem,
  keyExtractor,
  cacheKey,
  className = '',
  header
}: CachedListProps<T>) {
  // Мемоизированные элементы списка
  const memoizedItems = useMemo(() => {
    return data.map((item, index) => (
      <div key={keyExtractor(item, index)} data-cache-key={cacheKey}>
        {renderItem(item, index)}
      </div>
    ))
  }, [data, renderItem, keyExtractor, cacheKey])

  if (error) {
    return (
      <Card className={`bg-red-500/10 border-red-500/20 ${className}`}>
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
    <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 ${className}`}>
      {header && (
        <CardHeader>
          <CardTitle className="text-white">{header.title}</CardTitle>
          {header.description && (
            <p className="text-white/70 text-sm">{header.description}</p>
          )}
        </CardHeader>
      )}

      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <LoadingSpinner text="Загрузка данных..." />
          </div>
        ) : data.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={emptyIcon}
              title={emptyMessage}
            />
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {memoizedItems}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Специализированный компонент для списка лидов
interface LeadListProps {
  leads: Array<{
    id: string
    firstName: string
    lastName: string
    email?: string
    company?: string
    status: string
    priority: string
  }>
  isLoading?: boolean
  error?: string | null
  onLeadClick?: (leadId: string) => void
}

export function LeadList({ leads, isLoading, error, onLeadClick }: LeadListProps) {
  return (
    <CachedList
      data={leads}
      isLoading={isLoading}
      error={error}
      emptyMessage="Нет лидов для отображения"
      emptyIcon={null}
      keyExtractor={(lead) => lead.id}
      renderItem={(lead) => (
        <div
          className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
          onClick={() => onLeadClick?.(lead.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">
                {lead.firstName} {lead.lastName}
              </h3>
              {lead.company && (
                <p className="text-sm text-white/60">{lead.company}</p>
              )}
              {lead.email && (
                <p className="text-sm text-white/50">{lead.email}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                lead.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                lead.status === 'CONTACTED' ? 'bg-yellow-500/20 text-yellow-400' :
                lead.status === 'QUALIFIED' ? 'bg-green-500/20 text-green-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {lead.status}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                lead.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                lead.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {lead.priority}
              </span>
            </div>
          </div>
        </div>
      )}
      header={{
        title: "Лиды",
        description: `${leads.length} активных лидов`
      }}
    />
  )
}
