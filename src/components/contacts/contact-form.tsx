// Rundex CRM - Форма создания/редактирования контакта
// Автор: MagistrTheOne, 2025

"use client"

import { useEffect } from "react"
import { ValidatedForm } from "@/components/ui/validated-form"
import { ValidatedInput } from "@/components/ui/validated-input"
import { useFormValidation, ValidationRule } from "@/hooks/use-form-validation"

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  position: string
  website: string
  address: string
  city: string
  region: string
  notes: string
}

interface ContactFormProps {
  initialData?: any
  onSubmit: (data: ContactFormData) => void
  onCancel?: () => void
}

const russianRegions = [
  "Москва", "Санкт-Петербург", "Московская область", "Ленинградская область",
  "Краснодарский край", "Ростовская область", "Свердловская область",
  "Татарстан", "Башкортостан", "Челябинская область", "Нижегородская область",
  "Самарская область", "Новосибирская область", "Красноярский край",
  "Пермский край", "Воронежская область", "Волгоградская область"
]

const validationRules: Record<keyof ContactFormData, ValidationRule> = {
  firstName: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  email: { email: true },
  phone: { phone: true },
  company: { maxLength: 100 },
  position: { maxLength: 100 },
  website: { url: true },
  address: { maxLength: 200 },
  city: { maxLength: 50 },
  region: {},
  notes: { maxLength: 1000 }
}

export function ContactForm({ initialData, onSubmit, onCancel }: ContactFormProps) {
  const initialValues: ContactFormData = {
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    position: initialData?.position || "",
    website: initialData?.website || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    region: initialData?.region || "",
    notes: initialData?.notes || ""
  }

  const handleSubmit = async (values: ContactFormData) => {
    await onSubmit(values)
  }

  return (
    <ValidatedForm
      initialValues={initialValues}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitText={initialData ? "Сохранить изменения" : "Создать контакт"}
    >
      {({ values, setValue, getFieldError, isFieldTouched }) => (
        <>
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Основная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Имя"
                placeholder="Иван"
                value={values.firstName}
                onChange={(value) => setValue("firstName", value)}
                error={getFieldError("firstName")}
                touched={isFieldTouched("firstName")}
                required
              />
              <ValidatedInput
                label="Фамилия"
                placeholder="Иванов"
                value={values.lastName}
                onChange={(value) => setValue("lastName", value)}
                error={getFieldError("lastName")}
                touched={isFieldTouched("lastName")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Email"
                type="email"
                placeholder="ivan@example.com"
                value={values.email}
                onChange={(value) => setValue("email", value)}
                error={getFieldError("email")}
                touched={isFieldTouched("email")}
              />
              <ValidatedInput
                label="Телефон"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={values.phone}
                onChange={(value) => setValue("phone", value)}
                error={getFieldError("phone")}
                touched={isFieldTouched("phone")}
              />
            </div>
          </div>

          {/* Информация о компании */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Информация о компании</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Компания"
                placeholder="ООО 'Компания'"
                value={values.company}
                onChange={(value) => setValue("company", value)}
                error={getFieldError("company")}
                touched={isFieldTouched("company")}
              />
              <ValidatedInput
                label="Должность"
                placeholder="Директор"
                value={values.position}
                onChange={(value) => setValue("position", value)}
                error={getFieldError("position")}
                touched={isFieldTouched("position")}
              />
            </div>

            <ValidatedInput
              label="Сайт"
              type="url"
              placeholder="https://example.com"
              value={values.website}
              onChange={(value) => setValue("website", value)}
              error={getFieldError("website")}
              touched={isFieldTouched("website")}
            />
          </div>

          {/* Адрес */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Адрес</h3>
            <ValidatedInput
              label="Адрес"
              placeholder="ул. Ленина, д. 1"
              value={values.address}
              onChange={(value) => setValue("address", value)}
              error={getFieldError("address")}
              touched={isFieldTouched("address")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Город"
                placeholder="Москва"
                value={values.city}
                onChange={(value) => setValue("city", value)}
                error={getFieldError("city")}
                touched={isFieldTouched("city")}
              />
              <ValidatedInput
                label="Регион"
                placeholder="Выберите регион"
                value={values.region}
                onChange={(value) => setValue("region", value)}
                error={getFieldError("region")}
                touched={isFieldTouched("region")}
                options={russianRegions.map(region => ({ value: region, label: region }))}
              />
            </div>
          </div>

          {/* Заметки */}
          <div className="space-y-2">
            <ValidatedInput
              label="Заметки"
              placeholder="Дополнительная информация о контакте..."
              value={values.notes}
              onChange={(value) => setValue("notes", value)}
              error={getFieldError("notes")}
              touched={isFieldTouched("notes")}
              multiline
              rows={4}
            />
          </div>
        </>
      )}
    </ValidatedForm>
  )
}
