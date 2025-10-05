// Rundex CRM - Сервис двухфакторной аутентификации
// Автор: MagistrTheOne, 2025

import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface TwoFactorVerification {
  isValid: boolean
  backupCodeUsed?: boolean
}

export interface User2FAStatus {
  enabled: boolean
  method: 'totp' | 'sms' | null
  backupCodesRemaining: number
  lastUsed?: Date
}

// Класс для управления 2FA
export class TwoFactorAuthService {
  private static readonly ISSUER = 'Rundex CRM'
  private static readonly BACKUP_CODE_COUNT = 10
  private static readonly BACKUP_CODE_LENGTH = 8

  // Генерация секрета и QR-кода для TOTP
  async generateTOTPSecret(email: string): Promise<TwoFactorSetup> {
    // Генерируем секрет
    const secret = speakeasy.generateSecret({
      name: `${TwoFactorAuthService.ISSUER}:${email}`,
      issuer: TwoFactorAuthService.ISSUER,
      length: 32
    })

    // Генерируем QR-код
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!)

    // Генерируем резервные коды
    const backupCodes = this.generateBackupCodes()

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes
    }
  }

  // Включение 2FA для пользователя
  async enable2FAForUser(
    userId: string,
    method: 'totp' | 'sms',
    secret: string,
    backupCodes: string[]
  ): Promise<void> {
    // Хешируем резервные коды для безопасности
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => this.hashBackupCode(code))
    )

    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: method,
        twoFactorSecret: secret,
        twoFactorBackupCodes: JSON.stringify(hashedBackupCodes),
        twoFactorEnabledAt: new Date()
      }
    })
  }

  // Отключение 2FA для пользователя
  async disable2FAForUser(userId: string): Promise<void> {
    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null,
        twoFactorBackupCodes: null,
        twoFactorEnabledAt: null,
        twoFactorLastUsed: null
      }
    })
  }

  // Проверка TOTP кода
  async verifyTOTPCode(secret: string, token: string): Promise<boolean> {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Разрешаем ±2 временных окна (6 минут)
    })
  }

  // Проверка резервного кода
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await (prisma.user.findUnique as any)({
      where: { id: userId },
      select: { twoFactorBackupCodes: true }
    })

    if (!user?.twoFactorBackupCodes) return false

    let backupCodes: string[] = []
    try {
      backupCodes = JSON.parse(user.twoFactorBackupCodes)
    } catch {
      return false
    }

    if (!Array.isArray(backupCodes)) return false

    // Находим и проверяем код
    const codeIndex = backupCodes.findIndex(
      hashedCode => this.verifyHashedBackupCode(code, hashedCode)
    )

    if (codeIndex === -1) return false

    // Удаляем использованный код
    backupCodes.splice(codeIndex, 1)

    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: JSON.stringify(backupCodes),
        twoFactorLastUsed: new Date()
      }
    })

    return true
  }

  // Проверка 2FA при входе
  async verify2FAForLogin(
    userId: string,
    token: string
  ): Promise<TwoFactorVerification> {
    const user = await (prisma.user.findUnique as any)({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
        twoFactorMethod: true,
        twoFactorSecret: true
      }
    })

    if (!user?.twoFactorEnabled) {
      return { isValid: true } // 2FA не включено
    }

    // Сначала проверяем TOTP
    if (user.twoFactorMethod === 'totp' && user.twoFactorSecret) {
      const isValidTOTP = await this.verifyTOTPCode(user.twoFactorSecret, token)
      if (isValidTOTP) {
        await this.updateLastUsed(userId)
        return { isValid: true }
      }
    }

    // Если TOTP не подошел, проверяем резервный код
    const isValidBackup = await this.verifyBackupCode(userId, token)
    if (isValidBackup) {
      return { isValid: true, backupCodeUsed: true }
    }

    return { isValid: false }
  }

  // Получение статуса 2FA пользователя
  async getUser2FAStatus(userId: string): Promise<User2FAStatus> {
    const user = await (prisma.user.findUnique as any)({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
        twoFactorMethod: true,
        twoFactorBackupCodes: true,
        twoFactorLastUsed: true
      }
    })

    if (!user) {
      throw new Error('Пользователь не найден')
    }

    let backupCodesRemaining = 0
    if (user.twoFactorBackupCodes) {
      try {
        const codes = JSON.parse(user.twoFactorBackupCodes)
        backupCodesRemaining = Array.isArray(codes) ? codes.length : 0
      } catch {
        backupCodesRemaining = 0
      }
    }

    return {
      enabled: user.twoFactorEnabled || false,
      method: user.twoFactorMethod,
      backupCodesRemaining,
      lastUsed: user.twoFactorLastUsed || undefined
    }
  }

  // Генерация новых резервных кодов
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const backupCodes = this.generateBackupCodes()
    const hashedBackupCodes = await Promise.all(
      backupCodes.map(code => this.hashBackupCode(code))
    )

    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: JSON.stringify(hashedBackupCodes)
      }
    })

    return backupCodes
  }

  // Обновление времени последнего использования
  private async updateLastUsed(userId: string): Promise<void> {
    await (prisma.user.update as any)({
      where: { id: userId },
      data: {
        twoFactorLastUsed: new Date()
      }
    })
  }

  // Генерация резервных кодов
  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < TwoFactorAuthService.BACKUP_CODE_COUNT; i++) {
      codes.push(this.generateRandomCode())
    }
    return codes
  }

  // Генерация случайного кода
  private generateRandomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < TwoFactorAuthService.BACKUP_CODE_LENGTH; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  // Хеширование резервного кода с bcrypt
  private async hashBackupCode(code: string): Promise<string> {
    const saltRounds = 12 // Высокий уровень защиты для коротких кодов
    return await bcrypt.hash(code, saltRounds)
  }

  // Проверка хешированного резервного кода
  private async verifyHashedBackupCode(code: string, hashedCode: string): Promise<boolean> {
    return await bcrypt.compare(code, hashedCode)
  }
}

// Экспорт экземпляра сервиса
export const twoFactorService = new TwoFactorAuthService()
