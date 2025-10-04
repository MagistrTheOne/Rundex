// Rundex CRM - Test endpoint for GigaChat
// Автор: MagistrTheOne, 2025

import { NextResponse } from "next/server"
import { testGigaChatConnection } from "@/lib/volodya/test-gigachat"

export async function GET() {
  try {
    console.log('🧪 Starting GigaChat connection test...')

    const result = await testGigaChatConnection()

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Test endpoint error:', error)

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
