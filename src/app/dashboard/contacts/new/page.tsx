// Rundex CRM - Страница создания нового контакта
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { ContactForm } from "@/components/contacts/contact-form"
import { useToast } from "@/hooks/use-toast"

export default function NewContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateContact = async (contactData: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка создания контакта')
      }

      const newContact = await response.json()

      toast({
        title: "Контакт создан",
        description: `${newContact.firstName} ${newContact.lastName} успешно добавлен в систему`,
      })

      // Перенаправляем на страницу контактов
      router.push('/dashboard/contacts')
    } catch (error) {
      console.error('Error creating contact:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать контакт",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/contacts')
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-white">Создать новый контакт</h2>
            <p className="text-white/70 mt-1">
              Добавьте информацию о контактном лице в систему
            </p>
          </div>
        </div>
      </div>

      {/* Форма создания контакта */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Информация о контакте</CardTitle>
          <CardDescription className="text-white/70">
            Заполните все необходимые поля для создания нового контакта
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm
            onSubmit={handleCreateContact}
            onCancel={handleCancel}
          />

          {/* Кнопки действий */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Отмена
            </Button>
            <Button
              onClick={() => {
                const form = document.querySelector('form')
                if (form) form.requestSubmit()
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#7B61FF] to-[#6B51EF] hover:from-[#6B51EF] hover:to-[#5A41DF] text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Создание...' : 'Создать контакт'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
