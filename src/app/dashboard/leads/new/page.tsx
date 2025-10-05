// Rundex CRM - Страница создания нового лида
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { LeadForm } from "@/components/leads/lead-form"
import { useToast } from "@/hooks/use-toast"

export default function NewLeadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateLead = async (leadData: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка создания лида')
      }

      const newLead = await response.json()

      toast({
        title: "Лид создан",
        description: `${newLead.firstName} ${newLead.lastName} успешно добавлен в систему`,
      })

      // Перенаправляем на страницу лидов
      router.push('/dashboard/leads')
    } catch (error) {
      console.error('Error creating lead:', error)
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось создать лид",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/leads')
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
            <h2 className="text-3xl font-bold text-white">Создать нового лида</h2>
            <p className="text-white/70 mt-1">
              Добавьте информацию о потенциальном клиенте в систему
            </p>
          </div>
        </div>
      </div>

      {/* Форма создания лида */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Информация о лиде</CardTitle>
          <CardDescription className="text-white/70">
            Заполните все необходимые поля для создания нового лида
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadForm
            onSubmit={handleCreateLead}
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
              {isSubmitting ? 'Создание...' : 'Создать лид'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
