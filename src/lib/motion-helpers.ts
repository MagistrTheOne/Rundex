// Rundex CRM - Хелперы для motion анимаций
// Автор: MagistrTheOne, 2025

export const fadeInUp = (delay = 0, duration = 0.5) => ({
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration },
})

export const fadeInDown = (delay = 0, duration = 0.5) => ({
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration },
})

export const fadeIn = (delay = 0, duration = 0.5) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay, duration },
})

export const scaleIn = (delay = 0, duration = 0.4) => ({
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { delay, duration },
})

export const slideInLeft = (delay = 0, duration = 0.5) => ({
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay, duration },
})

export const slideInRight = (delay = 0, duration = 0.5) => ({
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { delay, duration },
})

export const staggerContainer = (delay = 0, staggerChildren = 0.1) => ({
  animate: {
    transition: {
      delayChildren: delay,
      staggerChildren,
    },
  },
})

export const staggerItem = (delay = 0, duration = 0.4) => ({
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay, duration },
})
