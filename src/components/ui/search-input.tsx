// Rundex CRM - Улучшенный компонент поиска
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  debounceMs?: number
  showFilters?: boolean
  filters?: Array<{
    key: string
    label: string
    value: string
    active: boolean
  }>
  onFilterToggle?: (key: string) => void
  className?: string
}

export function SearchInput({
  placeholder = "Поиск...",
  value = "",
  onChange,
  onSearch,
  debounceMs = 300,
  showFilters = false,
  filters = [],
  onFilterToggle,
  className = ""
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setSearchValue(value)
  }, [value])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch && searchValue !== value) {
        onSearch(searchValue)
      }
      if (onChange) {
        onChange(searchValue)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue, onSearch, onChange, debounceMs, value])

  const handleClear = () => {
    setSearchValue("")
    if (onSearch) onSearch("")
    if (onChange) onChange("")
  }

  const activeFilters = filters.filter(f => f.active)

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-all duration-200 ${
            isFocused ? 'ring-2 ring-white/20 border-white/40' : ''
          }`}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Активные фильтры */}
      {activeFilters.length > 0 && (
        <div className="flex items-center space-x-2 mt-2">
          <span className="text-xs text-white/60">Фильтры:</span>
          {activeFilters.map(filter => (
            <Badge
              key={filter.key}
              variant="outline"
              className="bg-white/10 border-white/20 text-white/80 text-xs"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterToggle?.(filter.key)}
                className="ml-1 h-3 w-3 p-0 text-white/60 hover:text-white"
              >
                <X className="w-2 h-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Панель фильтров */}
      {showFilters && filters.length > 0 && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/80">Быстрые фильтры</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <Button
                key={filter.key}
                variant={filter.active ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterToggle?.(filter.key)}
                className={`text-xs ${
                  filter.active
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'border-white/20 text-white/80 hover:bg-white/10'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
