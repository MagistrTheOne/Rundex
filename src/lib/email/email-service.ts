// Rundex CRM - Email маркетинг сервис
// Автор: MagistrTheOne, 2025

import sgMail from '@sendgrid/mail'

// Настройка SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface CampaignData {
  id: string
  name: string
  subject: string
  content: string
  recipients: EmailRecipient[]
  scheduledFor?: Date
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
}

// Брендинг для email
const EMAIL_BRANDING = {
  logo: 'https://rundex-crm.com/logo.png',
  company: 'Rundex CRM',
  website: 'https://rundex-crm.com',
  supportEmail: 'support@rundex-crm.com',
  primaryColor: '#7B61FF',
  secondaryColor: '#6B51EF'
}

// HTML шаблоны для email
export const EMAIL_TEMPLATES = {
  // Отчет по продажам
  salesReport: (data: any): EmailTemplate => ({
    subject: `Отчет по продажам - ${new Date().toLocaleDateString('ru-RU')}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${EMAIL_BRANDING.primaryColor}, ${EMAIL_BRANDING.secondaryColor}); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <img src="${EMAIL_BRANDING.logo}" alt="${EMAIL_BRANDING.company}" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Отчет по продажам</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${new Date().toLocaleDateString('ru-RU')}</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; color: #333;">Сводка за период</h2>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: ${EMAIL_BRANDING.primaryColor};">${data.totalRevenue?.toLocaleString('ru-RU')} ₽</div>
                <div style="color: #666; font-size: 14px;">Общая выручка</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: ${EMAIL_BRANDING.primaryColor};">${data.totalDeals}</div>
                <div style="color: #666; font-size: 14px;">Количество сделок</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px;">Топ сделок</h3>
            ${data.topOpportunities?.slice(0, 5).map((opp: any) => `
              <div style="border-left: 4px solid ${EMAIL_BRANDING.primaryColor}; padding: 10px 15px; margin-bottom: 10px; background: #f8f9fa;">
                <div style="font-weight: bold; color: #333;">${opp.name}</div>
                <div style="color: #666; font-size: 14px;">${opp.amount?.toLocaleString('ru-RU')} ₽ • ${opp.stage}</div>
              </div>
            `).join('') || ''}
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <a href="${EMAIL_BRANDING.website}/dashboard/analytics" style="background: ${EMAIL_BRANDING.primaryColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Посмотреть полный отчет</a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p>Этот отчет был автоматически сгенерирован системой ${EMAIL_BRANDING.company}</p>
            <p>Если у вас есть вопросы, напишите нам: <a href="mailto:${EMAIL_BRANDING.supportEmail}">${EMAIL_BRANDING.supportEmail}</a></p>
          </div>
        </div>
      </div>
    `,
    text: `Отчет по продажам за ${new Date().toLocaleDateString('ru-RU')}

Сводка:
- Общая выручка: ${data.totalRevenue?.toLocaleString('ru-RU')} ₽
- Количество сделок: ${data.totalDeals}

Посмотреть полный отчет: ${EMAIL_BRANDING.website}/dashboard/analytics`
  }),

  // Приветственное письмо для новых клиентов
  welcomeEmail: (data: { name: string; company?: string }): EmailTemplate => ({
    subject: `Добро пожаловать в ${EMAIL_BRANDING.company}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${EMAIL_BRANDING.primaryColor}, ${EMAIL_BRANDING.secondaryColor}); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <img src="${EMAIL_BRANDING.logo}" alt="${EMAIL_BRANDING.company}" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Добро пожаловать!</h1>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Здравствуйте, ${data.name}!</h2>

          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Спасибо, что выбрали ${EMAIL_BRANDING.company} для управления вашими продажами и отношениями с клиентами.
            Мы рады приветствовать вас в нашем сообществе!
          </p>

          ${data.company ? `<p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Мы будем помогать вам развивать бизнес компании <strong>${data.company}</strong> с помощью современных инструментов CRM.
          </p>` : ''}

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333;">Что вас ждет:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Автоматизация процессов продаж</li>
              <li>Аналитика и отчеты в реальном времени</li>
              <li>Интеграция с популярными сервисами</li>
              <li>Поддержка 24/7</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${EMAIL_BRANDING.website}/auth/signin" style="background: ${EMAIL_BRANDING.primaryColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Войти в систему</a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
            <p>Если у вас есть вопросы, наша команда поддержки всегда готова помочь:</p>
            <p><a href="mailto:${EMAIL_BRANDING.supportEmail}">${EMAIL_BRANDING.supportEmail}</a></p>
          </div>
        </div>
      </div>
    `,
    text: `Добро пожаловать в ${EMAIL_BRANDING.company}!

Здравствуйте, ${data.name}!

Спасибо, что выбрали нас для управления вашими продажами.

Войти в систему: ${EMAIL_BRANDING.website}/auth/signin

Если есть вопросы: ${EMAIL_BRANDING.supportEmail}`
  }),

  // Еженедельный дайджест активности
  weeklyDigest: (data: any): EmailTemplate => ({
    subject: `Еженедельный дайджест - ${EMAIL_BRANDING.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${EMAIL_BRANDING.primaryColor}, ${EMAIL_BRANDING.secondaryColor}); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Еженедельный дайджест</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Неделя ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: ${EMAIL_BRANDING.primaryColor};">${data.newLeads || 0}</div>
              <div style="color: #666;">Новых лидов</div>
            </div>
            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <div style="font-size: 32px; font-weight: bold; color: ${EMAIL_BRANDING.primaryColor};">${data.newDeals || 0}</div>
              <div style="color: #666;">Новых сделок</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px;">Недавняя активность</h3>
            ${data.recentActivity?.slice(0, 5).map((activity: any) => `
              <div style="padding: 10px 15px; margin-bottom: 8px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid ${EMAIL_BRANDING.primaryColor};">
                <div style="font-weight: 500; color: #333;">${activity.description}</div>
                <div style="color: #666; font-size: 12px;">${new Date(activity.createdAt).toLocaleDateString('ru-RU')}</div>
              </div>
            `).join('') || ''}
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${EMAIL_BRANDING.website}/dashboard" style="background: ${EMAIL_BRANDING.primaryColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Открыть дашборд</a>
          </div>
        </div>
      </div>
    `,
    text: `Еженедельный дайджест Rundex CRM

Новых лидов: ${data.newLeads || 0}
Новых сделок: ${data.newDeals || 0}

Посмотреть полный дайджест: ${EMAIL_BRANDING.website}/dashboard`
  })
}

// Класс для управления email рассылками
export class EmailMarketingService {
  private isConfigured: boolean

  constructor() {
    this.isConfigured = !!process.env.SENDGRID_API_KEY
  }

  // Проверка конфигурации
  isReady(): boolean {
    return this.isConfigured
  }

  // Отправка одиночного email
  async sendEmail(to: EmailRecipient, template: EmailTemplate, from?: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.warn('SendGrid не настроен. Email не отправлен.')
      return false
    }

    try {
      const msg = {
        to: { email: to.email, name: to.name },
        from: {
          email: from || process.env.FROM_EMAIL || 'noreply@rundex-crm.com',
          name: EMAIL_BRANDING.company
        },
        subject: template.subject,
        html: template.html,
        text: template.text
      }

      await sgMail.send(msg)
      console.log(`Email отправлен на ${to.email}`)
      return true
    } catch (error) {
      console.error('Ошибка отправки email:', error)
      return false
    }
  }

  // Массовая рассылка
  async sendBulkEmail(recipients: EmailRecipient[], template: EmailTemplate, from?: string): Promise<{ success: number; failed: number }> {
    if (!this.isConfigured) {
      console.warn('SendGrid не настроен. Массовая рассылка не выполнена.')
      return { success: 0, failed: recipients.length }
    }

    let success = 0
    let failed = 0

    // Отправляем по одному для лучшего контроля
    for (const recipient of recipients) {
      try {
        const result = await this.sendEmail(recipient, template, from)
        if (result) {
          success++
        } else {
          failed++
        }
      } catch (error) {
        console.error(`Ошибка отправки на ${recipient.email}:`, error)
        failed++
      }

      // Небольшая задержка между отправками
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`Массовая рассылка завершена: ${success} успешно, ${failed} неудачно`)
    return { success, failed }
  }

  // Отправка отчета по email
  async sendReportEmail(
    to: EmailRecipient,
    reportType: string,
    reportData: any,
    pdfBlob?: Blob
  ): Promise<boolean> {
    const template = this.getReportTemplate(reportType, reportData)

    if (!this.isConfigured) {
      console.warn('SendGrid не настроен. Отчет не отправлен.')
      return false
    }

    try {
      const msg: any = {
        to: { email: to.email, name: to.name },
        from: {
          email: process.env.FROM_EMAIL || 'noreply@rundex-crm.com',
          name: EMAIL_BRANDING.company
        },
        subject: template.subject,
        html: template.html,
        text: template.text
      }

      // Если есть PDF, прикрепляем его
      if (pdfBlob) {
        const pdfBuffer = await pdfBlob.arrayBuffer()
        msg.attachments = [{
          content: Buffer.from(pdfBuffer).toString('base64'),
          filename: `report_${new Date().toISOString().split('T')[0]}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      }

      await sgMail.send(msg)
      console.log(`Отчет отправлен на ${to.email}`)
      return true
    } catch (error) {
      console.error('Ошибка отправки отчета:', error)
      return false
    }
  }

  // Получение шаблона для отчета
  private getReportTemplate(type: string, data: any): EmailTemplate {
    switch (type) {
      case 'sales':
        return EMAIL_TEMPLATES.salesReport(data)
      case 'weekly':
        return EMAIL_TEMPLATES.weeklyDigest(data)
      default:
        return EMAIL_TEMPLATES.salesReport(data)
    }
  }

  // Планирование кампании (будущая функциональность)
  async scheduleCampaign(campaign: CampaignData): Promise<string> {
    // В реальном приложении сохранили бы в базу данных
    console.log('Кампания запланирована:', campaign.name)
    return campaign.id
  }

  // Отправка приветственного письма
  async sendWelcomeEmail(to: EmailRecipient, userData: { name: string; company?: string }): Promise<boolean> {
    const template = EMAIL_TEMPLATES.welcomeEmail(userData)
    return await this.sendEmail(to, template)
  }

  // Отправка еженедельного дайджеста
  async sendWeeklyDigest(to: EmailRecipient, digestData: any): Promise<boolean> {
    const template = EMAIL_TEMPLATES.weeklyDigest(digestData)
    return await this.sendEmail(to, template)
  }
}

// Экспорт экземпляра сервиса
export const emailService = new EmailMarketingService()
