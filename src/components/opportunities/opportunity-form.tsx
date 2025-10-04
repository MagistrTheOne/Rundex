// Rundex CRM - Форма создания/редактирования возможности
// Автор: MagistrTheOne, 2025

"use client"

import { ValidatedForm } from "@/components/ui/validated-form"
import { ValidatedInput } from "@/components/ui/validated-input"
import { useFormValidation, ValidationRule } from "@/hooks/use-form-validation"

interface OpportunityFormData {
  name: string
  description: string
  amount: string
  currency: string
  stage: string
  probability: string
  closeDate: string
  leadId: string
  accountId: string
  assignedToId: string
}

interface OpportunityFormProps {
  initialData?: any
  onSubmit: (data: OpportunityFormData) => void
  onCancel?: () => void
}

const validationRules: Record<keyof OpportunityFormData, ValidationRule> = {
  name: { required: true, minLength: 2, maxLength: 100 },
  description: { maxLength: 1000 },
  amount: { required: true, min: 0 },
  currency: {},
  stage: {},
  probability: { min: 0, max: 100 },
  closeDate: {},
  leadId: {},
  accountId: {},
  assignedToId: {}
}

export function OpportunityForm({ initialData, onSubmit, onCancel }: OpportunityFormProps) {
  const initialValues: OpportunityFormData = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    amount: initialData?.amount?.toString() || "",
    currency: initialData?.currency || "RUB",
    stage: initialData?.stage || "PROSPECTING",
    probability: initialData?.probability?.toString() || "0",
    closeDate: initialData?.closeDate?.split('T')[0] || "",
    leadId: initialData?.leadId || "",
    accountId: initialData?.accountId || "",
    assignedToId: initialData?.assignedToId || ""
  }

  const handleSubmit = async (values: OpportunityFormData) => {
    await onSubmit(values)
  }

  return (
    <ValidatedForm
      initialValues={initialValues}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitText={initialData ? "Сохранить изменения" : "Создать возможность"}
    >
      {({ values, setValue, getFieldError, isFieldTouched }) => (
        <>
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Основная информация</h3>
            <ValidatedInput
              label="Название возможности"
              placeholder="Продажа CRM системы"
              value={values.name}
              onChange={(value) => setValue("name", value)}
              error={getFieldError("name")}
              touched={isFieldTouched("name")}
              required
            />

            <ValidatedInput
              label="Описание"
              placeholder="Описание возможности..."
              value={values.description}
              onChange={(value) => setValue("description", value)}
              error={getFieldError("description")}
              touched={isFieldTouched("description")}
              multiline
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Сумма"
                type="number"
                placeholder="1000000"
                value={values.amount}
                onChange={(value) => setValue("amount", value)}
                error={getFieldError("amount")}
                touched={isFieldTouched("amount")}
                required
              />
              <ValidatedInput
                label="Валюта"
                placeholder="Выберите валюту"
                value={values.currency}
                onChange={(value) => setValue("currency", value)}
                error={getFieldError("currency")}
                touched={isFieldTouched("currency")}
                options={[
                  { value: "RUB", label: "RUB" },
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" }
                ]}
              />
            </div>
          </div>

          {/* Этап и вероятность */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Этап и вероятность</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Этап"
                placeholder="Выберите этап"
                value={values.stage}
                onChange={(value) => setValue("stage", value)}
                error={getFieldError("stage")}
                touched={isFieldTouched("stage")}
                options={[
                  { value: "PROSPECTING", label: "Поиск" },
                  { value: "QUALIFICATION", label: "Квалификация" },
                  { value: "PROPOSAL", label: "Предложение" },
                  { value: "NEGOTIATION", label: "Переговоры" },
                  { value: "CLOSED_WON", label: "Закрыта успешно" },
                  { value: "CLOSED_LOST", label: "Закрыта неудачно" }
                ]}
              />
              <ValidatedInput
                label="Вероятность (%)"
                type="number"
                placeholder="75"
                value={values.probability}
                onChange={(value) => setValue("probability", value)}
                error={getFieldError("probability")}
                touched={isFieldTouched("probability")}
              />
            </div>

            <ValidatedInput
              label="Ожидаемая дата закрытия"
              placeholder="YYYY-MM-DD"
              value={values.closeDate}
              onChange={(value) => setValue("closeDate", value)}
              error={getFieldError("closeDate")}
              touched={isFieldTouched("closeDate")}
            />
          </div>

          {/* Связи */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Связи</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ValidatedInput
                label="ID Лида"
                placeholder="ID лида"
                value={values.leadId}
                onChange={(value) => setValue("leadId", value)}
                error={getFieldError("leadId")}
                touched={isFieldTouched("leadId")}
              />
              <ValidatedInput
                label="ID Компании"
                placeholder="ID компании"
                value={values.accountId}
                onChange={(value) => setValue("accountId", value)}
                error={getFieldError("accountId")}
                touched={isFieldTouched("accountId")}
              />
              <ValidatedInput
                label="ID Назначенного"
                placeholder="ID пользователя"
                value={values.assignedToId}
                onChange={(value) => setValue("assignedToId", value)}
                error={getFieldError("assignedToId")}
                touched={isFieldTouched("assignedToId")}
              />
            </div>
          </div>
        </>
      )}
    </ValidatedForm>
  )
}
