// Rundex CRM - Компонент для пустых состояний
// Автор: MagistrTheOne, 2025

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 text-center ${className}`}>
      <CardContent className="p-8">
        {Icon && (
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <Icon className="w-8 h-8 text-white/60" />
            </div>
          </div>
        )}

        <h3 className="text-lg font-medium text-white mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}

        {action && (
          <Button
            onClick={action.onClick}
            className="bg-white text-black hover:bg-white/90"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
