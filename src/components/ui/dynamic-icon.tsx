// Rundex CRM - Dynamic icon component with effects
// Автор: MagistrTheOne, 2025

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface DynamicIconProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "glow" | "pulse" | "bounce"
  color?: string
  className?: string
  animate?: boolean
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8"
}

export function DynamicIcon({
  icon: Icon,
  size = "md",
  variant = "default",
  color,
  className,
  animate = true
}: DynamicIconProps) {
  const iconClasses = cn(
    sizeClasses[size],
    color && `text-${color}`,
    variant === "gradient" && "text-transparent bg-clip-text bg-gradient-to-r from-[#7b61ff] to-[#9d7bff]",
    variant === "glow" && "drop-shadow-lg",
    className
  )

  if (!animate) {
    return <Icon className={iconClasses} />
  }

  const variants = {
    default: {},
    pulse: {
      animate: { scale: [1, 1.1, 1] },
      transition: { duration: 2, repeat: Infinity }
    },
    bounce: {
      animate: { y: [0, -2, 0] },
      transition: { duration: 1, repeat: Infinity }
    },
    glow: {
      animate: {
        filter: [
          "drop-shadow(0 0 5px rgba(123, 97, 255, 0.5))",
          "drop-shadow(0 0 15px rgba(123, 97, 255, 0.8))",
          "drop-shadow(0 0 5px rgba(123, 97, 255, 0.5))"
        ]
      },
      transition: { duration: 3, repeat: Infinity }
    }
  }

  return (
    <motion.div
      animate={variants[variant]?.animate}
      transition={variants[variant]?.transition}
      className="inline-flex"
    >
      <Icon className={iconClasses} />
    </motion.div>
  )
}

// Preset icon components for common use cases
export function StatIcon({ icon, trend, className }: {
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  className?: string
}) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    neutral: "text-white/70"
  }

  return (
    <DynamicIcon
      icon={icon}
      variant={trend === "up" ? "glow" : "default"}
      color={trendColors[trend || "neutral"]}
      className={className}
    />
  )
}

export function ActionIcon({ icon, action = "default", className }: {
  icon: LucideIcon
  action?: "hover" | "click" | "default"
  className?: string
}) {
  const actionVariants = {
    hover: "interactive-scale",
    click: "ripple",
    default: "default"
  }

  return (
    <DynamicIcon
      icon={icon}
      variant="default"
      className={cn(actionVariants[action], className)}
    />
  )
}

export function StatusIcon({ status, className }: {
  status: "success" | "warning" | "error" | "info" | "loading"
  className?: string
}) {
  const statusConfig = {
    success: { icon: "CheckCircle", color: "text-green-400" },
    warning: { icon: "AlertTriangle", color: "text-yellow-400" },
    error: { icon: "XCircle", color: "text-red-400" },
    info: { icon: "Info", color: "text-blue-400" },
    loading: { icon: "Loader", color: "text-white/70" }
  }

  // Dynamic import of icons (simplified for this example)
  const getIcon = (iconName: string) => {
    // This would normally import the actual icon
    return ({ className }: { className?: string }) => (
      <div className={cn("w-5 h-5", className)}>{iconName[0]}</div>
    )
  }

  const Icon = getIcon(statusConfig[status].icon)

  return (
    <DynamicIcon
      icon={Icon}
      variant={status === "loading" ? "pulse" : "default"}
      color={statusConfig[status].color}
      className={className}
    />
  )
}
