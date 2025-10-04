// Rundex CRM - Хук для валидации форм
// Автор: MagistrTheOne, 2025

import { useState, useCallback } from 'react'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  email?: boolean
  phone?: boolean
  url?: boolean
  min?: number
  max?: number
}

export interface FieldError {
  field: string
  message: string
}

export interface FormState<T> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  isSubmitting: boolean
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRule> = {} as Record<keyof T, ValidationRule>
) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isValid: true,
    isSubmitting: false
  })

  // Валидация одного поля
  const validateField = useCallback((field: keyof T, value: any): string => {
    const rules = validationRules[field]
    if (!rules) return ''

    // Обязательное поле
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'Это поле обязательно для заполнения'
    }

    // Минимальная длина
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Минимальная длина: ${rules.minLength} символов`
    }

    // Максимальная длина
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Максимальная длина: ${rules.maxLength} символов`
    }

    // Регулярное выражение
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Некорректный формат'
    }

    // Email валидация
    if (rules.email && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Некорректный email адрес'
      }
    }

    // Телефон валидация
    if (rules.phone && typeof value === 'string') {
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
      if (!phoneRegex.test(value)) {
        return 'Некорректный номер телефона'
      }
    }

    // URL валидация
    if (rules.url && typeof value === 'string' && value) {
      try {
        new URL(value)
      } catch {
        return 'Некорректный URL адрес'
      }
    }

    // Минимальное значение
    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      return `Минимальное значение: ${rules.min}`
    }

    // Максимальное значение
    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      return `Максимальное значение: ${rules.max}`
    }

    // Кастомная валидация
    if (rules.custom) {
      const customError = rules.custom(value)
      if (customError) {
        return customError
      }
    }

    return ''
  }, [validationRules])

  // Валидация всей формы
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const fieldKey = field as keyof T
      const error = validateField(fieldKey, formState.values[fieldKey])
      if (error) {
        errors[field] = error
        isValid = false
      }
    })

    setFormState(prev => ({
      ...prev,
      errors,
      isValid
    }))

    return isValid
  }, [formState.values, validationRules, validateField])

  // Обновление значения поля
  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value
      }
    }))

    // Валидация поля при изменении если оно было touched
    if (formState.touched[field]) {
      const error = validateField(field, value)
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: error
        }
      }))
    }
  }, [formState.touched, validateField])

  // Отметка поля как touched
  const setTouched = useCallback((field: keyof T, touched = true) => {
    setFormState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: touched
      }
    }))

    // Валидация поля при отметке как touched
    if (touched) {
      const error = validateField(field, formState.values[field])
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: error
        }
      }))
    }
  }, [formState.values, validateField])

  // Сброс формы
  const reset = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isValid: true,
      isSubmitting: false
    })
  }, [initialValues])

  // Установка состояния отправки
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({
      ...prev,
      isSubmitting
    }))
  }, [])

  // Получение ошибки поля
  const getFieldError = useCallback((field: keyof T): string => {
    return formState.errors[field] || ''
  }, [formState.errors])

  // Проверка, было ли поле touched
  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return formState.touched[field] || false
  }, [formState.touched])

  // Проверка валидности поля
  const isFieldValid = useCallback((field: keyof T): boolean => {
    return !formState.errors[field]
  }, [formState.errors])

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isValid: formState.isValid,
    isSubmitting: formState.isSubmitting,
    setValue,
    setTouched,
    validateForm,
    reset,
    setSubmitting,
    getFieldError,
    isFieldTouched,
    isFieldValid,
    validateField
  }
}
