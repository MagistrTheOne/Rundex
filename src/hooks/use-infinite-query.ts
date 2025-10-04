// Rundex CRM - Хук для бесконечной загрузки данных
// Автор: MagistrTheOne, 2025

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from './use-debounce'

interface InfiniteQueryOptions<T> {
  queryKey: string[]
  queryFn: (params: { page: number; limit: number; search?: string }) => Promise<{ data: T[]; total: number; hasMore: boolean }>
  limit?: number
  debounceMs?: number
  enabled?: boolean
}

export function useInfiniteQuery<T>({
  queryKey,
  queryFn,
  limit = 20,
  debounceMs = 300,
  enabled = true
}: InfiniteQueryOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const currentPageRef = useRef(1)
  const cacheRef = useRef<Map<string, { data: T[]; total: number; timestamp: number }>>(new Map())

  const debouncedSearch = useDebounce(searchQuery, debounceMs)

  const getCacheKey = useCallback((page: number, search?: string) => {
    return `${queryKey.join('-')}-page-${page}-search-${search || ''}`
  }, [queryKey])

  const fetchPage = useCallback(async (page: number, search?: string, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      const cacheKey = getCacheKey(page, search)

      // Проверка кеша (кеш живет 5 минут)
      const cached = cacheRef.current.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        if (append) {
          setData(prev => [...prev, ...cached.data])
        } else {
          setData(cached.data)
        }
        setTotal(cached.total)
        return
      }

      const result = await queryFn({ page, limit, search })

      if (append) {
        setData(prev => [...prev, ...result.data])
      } else {
        setData(result.data)
      }

      setTotal(result.total)
      setHasMore(result.hasMore)

      // Сохранение в кеш
      cacheRef.current.set(cacheKey, {
        data: result.data,
        total: result.total,
        timestamp: Date.now()
      })

      // Очистка старого кеша
      if (cacheRef.current.size > 50) {
        const entries = Array.from(cacheRef.current.entries())
        const oldestEntries = entries
          .sort(([,a], [,b]) => a.timestamp - b.timestamp)
          .slice(0, 10)
        oldestEntries.forEach(([key]) => cacheRef.current.delete(key))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [queryFn, limit, getCacheKey])

  const loadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMore) {
      currentPageRef.current += 1
      fetchPage(currentPageRef.current, debouncedSearch, true)
    }
  }, [isLoading, isLoadingMore, hasMore, fetchPage, debouncedSearch])

  const refresh = useCallback(() => {
    currentPageRef.current = 1
    setHasMore(true)
    fetchPage(1, debouncedSearch, false)
  }, [fetchPage, debouncedSearch])

  const search = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  // Инициализация и обновление при изменении поискового запроса
  useEffect(() => {
    if (enabled) {
      refresh()
    }
  }, [debouncedSearch, enabled, refresh])

  // Intersection Observer для автоматической загрузки
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loadMoreRef.current || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [hasMore, isLoading, isLoadingMore, loadMore, enabled])

  return {
    data,
    total,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    search,
    refresh,
    loadMore,
    loadMoreRef
  }
}
