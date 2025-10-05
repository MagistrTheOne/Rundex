// Rundex CRM - Инициализация Volodya компонентов
// Автор: MagistrTheOne, 2025

import { ContextManager } from './contextManager'

/**
 * Инициализирует все Volodya компоненты
 */
export function initializeVolodyaComponents(): void {
  try {
    // Инициализируем менеджер контекста
    ContextManager.initialize()

    console.log('✅ Volodya components initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize Volodya components:', error)
    throw error
  }
}

/**
 * Корректное завершение работы Volodya компонентов
 */
export function shutdownVolodyaComponents(): void {
  try {
    // ContextManager завершается автоматически через process hooks
    console.log('✅ Volodya components shutdown completed')
  } catch (error) {
    console.error('❌ Error during Volodya components shutdown:', error)
  }
}

// Автоматическая инициализация при импорте в серверном окружении
if (typeof window === 'undefined') {
  // Даем время на инициализацию других компонентов
  setTimeout(() => {
    initializeVolodyaComponents()
  }, 1000)
}
