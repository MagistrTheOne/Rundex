// Rundex CRM - Хук для мемоизации данных
// Автор: MagistrTheOne, 2025

import { useMemo, useCallback } from 'react'

export function useMemoizedData<T>(
  data: T[],
  keyExtractor: (item: T) => string | number
): {
  data: T[]
  getItemKey: (item: T) => string | number
  findItem: (key: string | number) => T | undefined
  updateItem: (key: string | number, updates: Partial<T>) => T[]
  removeItem: (key: string | number) => T[]
  addItem: (item: T) => T[]
} {
  const memoizedData = useMemo(() => {
    const map = new Map<string | number, T>()
    data.forEach(item => {
      const key = keyExtractor(item)
      map.set(key, item)
    })
    return { data, map }
  }, [data, keyExtractor])

  const findItem = useCallback((key: string | number): T | undefined => {
    return memoizedData.map.get(key)
  }, [memoizedData.map])

  const updateItem = useCallback((key: string | number, updates: Partial<T>): T[] => {
    return memoizedData.data.map(item => {
      if (keyExtractor(item) === key) {
        return { ...item, ...updates }
      }
      return item
    })
  }, [memoizedData.data, keyExtractor])

  const removeItem = useCallback((key: string | number): T[] => {
    return memoizedData.data.filter(item => keyExtractor(item) !== key)
  }, [memoizedData.data, keyExtractor])

  const addItem = useCallback((item: T): T[] => {
    return [...memoizedData.data, item]
  }, [memoizedData.data])

  return {
    data: memoizedData.data,
    getItemKey: keyExtractor,
    findItem,
    updateItem,
    removeItem,
    addItem
  }
}

export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback)
  const stableCallbackRef = useRef<T>()

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  if (!stableCallbackRef.current) {
    stableCallbackRef.current = ((...args: Parameters<T>) => {
      return callbackRef.current(...args)
    }) as T
  }

  return stableCallbackRef.current
}
