// Rundex CRM - Компонент валидированного поля ввода
// Автор: MagistrTheOne, 2025

import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ValidatedInputProps {
  label?: string
  placeholder?: string
  value: any
  onChange: (value: any) => void
  onBlur?: () => void
  error?: string
  touched?: boolean
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  multiline?: boolean
  rows?: number
  required?: boolean
  disabled?: boolean
  className?: string
  options?: Array<{ value: string; label: string }>
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    type = 'text',
    multiline = false,
    rows = 3,
    required = false,
    disabled = false,
    className = '',
    options = []
  }, ref) => {
    const hasError = touched && error

    const inputClasses = `bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-colors ${
      hasError
        ? 'border-red-500/50 focus:ring-red-500/20'
        : 'focus:ring-white/20 focus:border-white/40'
    } ${className}`

    const InputComponent = multiline ? Textarea : Input

    return (
      <div className="space-y-2">
        {label && (
          <Label className={`text-white ${required ? "after:content-['*'] after:ml-1 after:text-red-400" : ''}`}>
            {label}
          </Label>
        )}

        {options.length > 0 ? (
          <Select
            value={value}
            onValueChange={onChange}
            disabled={disabled}
          >
            <SelectTrigger className={inputClasses}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20">
              {options.map(option => (
                <SelectItem key={option.value} value={option.value} className="text-white">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <InputComponent
            ref={ref}
            type={multiline ? undefined : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(multiline ? e.target.value : e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            rows={multiline ? rows : undefined}
            className={inputClasses}
          />
        )}

        {hasError && (
          <p className="text-sm text-red-400 flex items-center">
            {error}
          </p>
        )}
      </div>
    )
  }
)

ValidatedInput.displayName = 'ValidatedInput'
