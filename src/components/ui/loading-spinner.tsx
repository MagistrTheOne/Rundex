// Rundex CRM - Компонент индикатора загрузки
// Автор: MagistrTheOne, 2025

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  overlay?: boolean
}

const sizeConfig = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
}

export function LoadingSpinner({
  size = 'md',
  text,
  className = '',
  overlay = false
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeConfig[size]} animate-spin text-white`} />
      {text && <span className="text-white/80 text-sm">{text}</span>}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg p-6">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}

// Компонент для карточки с загрузкой
export function LoadingCard({ text = "Загрузка..." }: { text?: string }) {
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-6">
      <LoadingSpinner text={text} className="justify-center" />
    </div>
  )
}

// Компонент для строки таблицы с загрузкой
export function LoadingRow({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-white/10">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <div className="bg-white/5 rounded animate-pulse h-4"></div>
        </td>
      ))}
    </tr>
  )
}

// Хук для управления состоянием загрузки
export function useLoading(initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading)

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  const withLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    try {
      setIsLoading(true)
      return await fn()
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    setIsLoading,
    startLoading,
    stopLoading,
    withLoading
  }
}
