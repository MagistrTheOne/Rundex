// Rundex CRM - Форма создания/редактирования компании
// Автор: MagistrTheOne, 2025

"use client"

import { useState, useEffect } from "react"
import { ValidatedForm } from "@/components/ui/validated-form"
import { ValidatedInput } from "@/components/ui/validated-input"
import { useFormValidation, ValidationRule } from "@/hooks/use-form-validation"

interface AccountFormData {
  name: string
  website: string
  phone: string
  email: string
  address: string
  city: string
  region: string
  industry: string
  employees: string
  revenue: string
  description: string
  status: string
}

interface AccountFormProps {
  initialData?: any
  onSubmit: (data: AccountFormData) => void
  onCancel?: () => void
}

const russianRegions = [
  "Москва", "Санкт-Петербург", "Московская область", "Ленинградская область",
  "Краснодарский край", "Ростовская область", "Свердловская область",
  "Татарстан", "Башкортостан", "Челябинская область", "Нижегородская область",
  "Самарская область", "Новосибирская область", "Красноярский край",
  "Пермский край", "Воронежская область", "Волгоградская область"
]

const industries = [
  "IT и технологии", "Финансы и банковское дело", "Производство", "Торговля",
  "Строительство", "Недвижимость", "Медицина и здравоохранение", "Образование",
  "Транспорт и логистика", "Энергетика", "Сельское хозяйство", "Другое"
]

const validationRules: Record<keyof AccountFormData, ValidationRule> = {
  name: { required: true, minLength: 2, maxLength: 100 },
  website: { url: true },
  phone: { maxLength: 20 },
  email: { email: true },
  address: { maxLength: 200 },
  city: { maxLength: 50 },
  region: {},
  industry: { maxLength: 50 },
  employees: { min: 0 },
  revenue: { min: 0 },
  description: { maxLength: 1000 },
  status: {}
}

export function AccountForm({ initialData, onSubmit, onCancel }: AccountFormProps) {
  const initialValues: AccountFormData = {
    name: initialData?.name || "",
    website: initialData?.website || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    region: initialData?.region || "",
    industry: initialData?.industry || "",
    employees: initialData?.employees?.toString() || "",
    revenue: initialData?.revenue?.toString() || "",
    description: initialData?.description || "",
    status: initialData?.status || "ACTIVE"
  }

  const handleSubmit = async (values: AccountFormData) => {
    await onSubmit(values)
  }

  return (
    <ValidatedForm
      initialValues={initialValues}
      validationRules={validationRules}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitText={initialData ? "Сохранить изменения" : "Создать компанию"}
    >
      {({ values, setValue, getFieldError, isFieldTouched }) => (
        <>
          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Основная информация</h3>
            <ValidatedInput
              label="Название компании"
              placeholder="ООО 'Компания'"
              value={values.name}
              onChange={(value) => setValue("name", value)}
              error={getFieldError("name")}
              touched={isFieldTouched("name")}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Сайт"
                type="url"
                placeholder="https://example.com"
                value={values.website}
                onChange={(value) => setValue("website", value)}
                error={getFieldError("website")}
                touched={isFieldTouched("website")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Email"
                type="email"
                placeholder="company@example.com"
                value={values.email}
                onChange={(value) => setValue("email", value)}
                error={getFieldError("email")}
                touched={isFieldTouched("email")}
              />
              <ValidatedInput
                label="Отрасль"
                placeholder="Выберите отрасль"
                value={values.industry}
                onChange={(value) => setValue("industry", value)}
                error={getFieldError("industry")}
                touched={isFieldTouched("industry")}
                options={industries.map(industry => ({ value: industry, label: industry }))}
              />
            </div>
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

          {/* Финансовая информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Финансовая информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ValidatedInput
                label="Количество сотрудников"
                type="number"
                placeholder="100"
                value={values.employees}
                onChange={(value) => setValue("employees", value)}
                error={getFieldError("employees")}
                touched={isFieldTouched("employees")}
              />
              <ValidatedInput
                label="Годовой доход (₽)"
                type="number"
                placeholder="10000000"
                value={values.revenue}
                onChange={(value) => setValue("revenue", value)}
                error={getFieldError("revenue")}
                touched={isFieldTouched("revenue")}
              />
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Дополнительная информация</h3>
            <ValidatedInput
              label="Описание"
              placeholder="Описание компании..."
              value={values.description}
              onChange={(value) => setValue("description", value)}
              error={getFieldError("description")}
              touched={isFieldTouched("description")}
              multiline
              rows={3}
            />

            <ValidatedInput
              label="Статус"
              placeholder="Выберите статус"
              value={values.status}
              onChange={(value) => setValue("status", value)}
              error={getFieldError("status")}
              touched={isFieldTouched("status")}
              options={[
                { value: "ACTIVE", label: "Активный" },
                { value: "INACTIVE", label: "Неактивный" },
                { value: "PROSPECT", label: "Потенциальный" },
                { value: "CUSTOMER", label: "Клиент" },
                { value: "FORMER_CUSTOMER", label: "Бывший клиент" }
              ]}
            />
          </div>
        </>
      )}
    </ValidatedForm>
  )
}
