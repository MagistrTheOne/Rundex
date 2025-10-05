// Rundex CRM - Enhanced Progress Bar Component
// Автор: MagistrTheOne, 2025

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressBarProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  variant?: "default" | "gradient" | "animated" | "glow"
  color?: "primary" | "success" | "warning" | "error" | "info"
  className?: string
  showPercentage?: boolean
  label?: string
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3"
}

const colorClasses = {
  primary: "bg-gradient-to-r from-[#7b61ff] to-[#9d7bff]",
  success: "bg-gradient-to-r from-emerald-400 to-green-500",
  warning: "bg-gradient-to-r from-amber-400 to-orange-500",
  error: "bg-gradient-to-r from-red-400 to-red-500",
  info: "bg-gradient-to-r from-cyan-400 to-blue-500"
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  color = "primary",
  className,
  showPercentage = false,
  label
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const barVariants = {
    default: {},
    gradient: {
      background: colorClasses[color]
    },
    animated: {
      background: `linear-gradient(90deg, ${colorClasses[color].split(' ')[1]} 0%, ${colorClasses[color].split(' ')[2]} 50%, ${colorClasses[color].split(' ')[1]} 100%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 2s infinite'
    },
    glow: {
      background: colorClasses[color],
      boxShadow: `0 0 10px ${color === 'primary' ? 'rgba(123, 97, 255, 0.5)' :
                             color === 'success' ? 'rgba(16, 185, 129, 0.5)' :
                             color === 'warning' ? 'rgba(245, 158, 11, 0.5)' :
                             color === 'error' ? 'rgba(239, 68, 68, 0.5)' :
                             'rgba(6, 182, 212, 0.5)'}`
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-white/80">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-white/60">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn(
        "w-full bg-white/10 rounded-full overflow-hidden border border-white/20",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variant === "animated" && "animate-pulse",
            variant === "glow" && "shadow-lg"
          )}
          style={barVariants[variant]}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// Preset progress components
export function SkillProgress({ skill, level, maxLevel = 100, className }: {
  skill: string
  level: number
  maxLevel?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-white/90">{skill}</span>
        <span className="text-sm text-white/60">{level}/{maxLevel}</span>
      </div>
      <ProgressBar
        value={level}
        max={maxLevel}
        variant="gradient"
        color="primary"
        size="sm"
      />
    </div>
  )
}

export function TaskProgress({ completed, total, className }: {
  completed: number
  total: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <ProgressBar
        value={completed}
        max={total}
        variant="glow"
        color="success"
        size="sm"
        className="flex-1"
      />
      <span className="text-sm font-medium text-white/80 whitespace-nowrap">
        {completed}/{total}
      </span>
    </div>
  )
}

export function LoadingProgress({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <ProgressBar
        value={75}
        variant="animated"
        color="primary"
        showPercentage
        label="Загрузка..."
      />
    </div>
  )
}
