// Rundex CRM - Компонент формы с валидацией
// Автор: MagistrTheOne, 2025

"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useFormValidation, ValidationRule } from '@/hooks/use-form-validation'
import { Loader2 } from 'lucide-react'

interface ValidatedFormProps<T extends Record<string, any>> {
  title?: string
  description?: string
  initialValues: T
  validationRules?: Record<keyof T, ValidationRule>
  onSubmit: (values: T) => void | Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  isLoading?: boolean
  error?: string
  children: (props: {
    values: T
    errors: Record<string, string>
    touched: Record<string, boolean>
    setValue: (field: keyof T, value: any) => void
    setTouched: (field: keyof T, touched?: boolean) => void
    getFieldError: (field: keyof T) => string
    isFieldTouched: (field: keyof T) => boolean
    isFieldValid: (field: keyof T) => boolean
  }) => ReactNode
  className?: string
}

export function ValidatedForm<T extends Record<string, any>>({
  title,
  description,
  initialValues,
  validationRules = {} as Record<keyof T, ValidationRule>,
  onSubmit,
  submitText = "Сохранить",
  cancelText = "Отмена",
  onCancel,
  isLoading = false,
  error,
  children,
  className = ""
}: ValidatedFormProps<T>) {
  const form = useFormValidation(initialValues, validationRules)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация всей формы
    const isValid = form.validateForm()

    if (!isValid) return

    try {
      form.setSubmitting(true)
      await onSubmit(form.values)
    } catch (err) {
      console.error('Ошибка при отправке формы:', err)
    } finally {
      form.setSubmitting(false)
    }
  }

  return (
    <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 ${className}`}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-white">{title}</CardTitle>}
          {description && <CardDescription className="text-white/70">{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50">
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {children({
            values: form.values,
            errors: form.errors,
            touched: form.touched,
            setValue: form.setValue,
            setTouched: form.setTouched,
            getFieldError: form.getFieldError,
            isFieldTouched: form.isFieldTouched,
            isFieldValid: form.isFieldValid
          })}

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={form.isSubmitting}
                className="border-white/20 text-white hover:bg-white/10"
              >
                {cancelText}
              </Button>
            )}

            <Button
              type="submit"
              disabled={!form.isValid || form.isSubmitting || isLoading}
              className="bg-white text-black hover:bg-white/90"
            >
              {(form.isSubmitting || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitText}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
