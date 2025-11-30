import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  const testPassword = 'LingoSubStart2026!#'
  
  if (!adminPasswordHash) {
    return NextResponse.json({ 
      error: 'ADMIN_PASSWORD_HASH not set',
      hashFromEnv: null 
    })
  }

  // Remove quotes if present
  const cleanedHash = adminPasswordHash.replace(/^["']|["']$/g, '')
  
  const isValid = await verifyPassword(testPassword, cleanedHash)
  
  return NextResponse.json({
    hashFromEnv: adminPasswordHash,
    hashLength: adminPasswordHash.length,
    cleanedHash: cleanedHash.substring(0, 30) + '...',
    cleanedHashLength: cleanedHash.length,
    testPassword: testPassword,
    passwordMatch: isValid,
    expectedHashStart: '$2a$10$bE6cqXybv'
  })
}

