import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    // Fallback to hardcoded hash if env var is not set or corrupted
    const fallbackHash = '$2a$10$O0JaIo.V/pRoIQ1lubJmhOyI7Mj630nBcnuk3DpSnc3M0DfxMT7BW'
    
    if (!adminPasswordHash || !adminPasswordHash.startsWith('$2a$')) {
      console.warn('ADMIN_PASSWORD_HASH from env is invalid or missing, using fallback')
      adminPasswordHash = fallbackHash
    } else {
      // Remove quotes if present (sometimes .env files include them)
      // Handle both single and double quotes, and trim whitespace
      adminPasswordHash = adminPasswordHash.trim()
      // Remove surrounding quotes (single or double)
      if ((adminPasswordHash.startsWith('"') && adminPasswordHash.endsWith('"')) ||
          (adminPasswordHash.startsWith("'") && adminPasswordHash.endsWith("'"))) {
        adminPasswordHash = adminPasswordHash.slice(1, -1)
      }
    }
    
    console.log('Password received:', password ? '***' : 'empty')
    console.log('Hash from env (first 30 chars):', adminPasswordHash.substring(0, 30))
    console.log('Hash length:', adminPasswordHash.length)
    console.log('Hash starts with $2a$:', adminPasswordHash.startsWith('$2a$'))

    let isValid: boolean
    try {
      isValid = await verifyPassword(password, adminPasswordHash)
      console.log('Password verification result:', isValid)
    } catch (verifyError) {
      console.error('Error verifying password:', verifyError)
      return NextResponse.json(
        { error: 'Password verification failed' },
        { status: 500 }
      )
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}


