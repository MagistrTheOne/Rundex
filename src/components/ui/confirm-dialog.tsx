// Rundex CRM - Компонент диалога подтверждения
// Автор: MagistrTheOne, 2025

"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning'
  onConfirm: () => void | Promise<void>
  isLoading?: boolean
}

const variantConfig = {
  default: {
    icon: Info,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20'
  },
  destructive: {
    icon: XCircle,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20'
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20'
  }
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  variant = "default",
  onConfirm,
  isLoading = false
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    if (isLoading || isConfirming) return

    setIsConfirming(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Ошибка при подтверждении:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black/80 backdrop-blur-xl border border-white/20">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${config.bgColor} ${config.borderColor} border`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div>
              <AlertDialogTitle className="text-white">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-white/70 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="border-white/20 text-white/80 hover:bg-white/10"
            disabled={isConfirming}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`${
              variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : variant === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-white text-black hover:bg-white/90'
            }`}
          >
            {isConfirming ? "Обработка..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Хук для управления диалогами подтверждения
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean
    config: Omit<ConfirmDialogProps, 'open' | 'onOpenChange' | 'onConfirm'>
  }>({
    open: false,
    config: {
      title: '',
      description: '',
      variant: 'default'
    }
  })

  const confirm = (config: Omit<ConfirmDialogProps, 'open' | 'onOpenChange'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        config: {
          ...config,
          onConfirm: async () => {
            try {
              await config.onConfirm()
              resolve(true)
            } catch (error) {
              resolve(false)
            }
          }
        }
      })

      // Обработчик закрытия диалога
      const handleClose = (open: boolean) => {
        setDialogState(prev => ({ ...prev, open }))
        if (!open) {
          resolve(false)
        }
      }

      // Переопределяем onOpenChange в config
      setDialogState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          onOpenChange: handleClose
        }
      }))
    })
  }

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      {...dialogState.config}
      open={dialogState.open}
      onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
    />
  )

  return { confirm, ConfirmDialogComponent }
}
