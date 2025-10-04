// Rundex CRM - Компонент виртуальной таблицы для больших данных
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface VirtualTableProps<T> {
  data: T[]
  height?: number
  itemHeight?: number
  renderItem: (item: T, index: number) => React.ReactNode
  className?: string
  overscan?: number
}

export function VirtualTable<T>({
  data,
  height = 400,
  itemHeight = 50,
  renderItem,
  className = '',
  overscan = 5
}: VirtualTableProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    const visibleCount = Math.ceil(height / itemHeight)
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(data.length - 1, startIndex + visibleCount + overscan * 2)

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight: data.length * itemHeight,
      offsetY: startIndex * itemHeight
    }
  }, [data.length, scrollTop, height, itemHeight, overscan])

  const visibleItems = useMemo(() => {
    return data.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }))
  }, [data, visibleRange])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 ${className}`}>
      <CardContent className="p-0">
        <div
          ref={scrollElementRef}
          className="overflow-auto"
          style={{ height }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0
              }}
            >
              {visibleItems.map(({ item, index }) => (
                <div key={index} style={{ height: itemHeight }}>
                  {renderItem(item, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
