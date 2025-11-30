import { randomBytes } from 'crypto'

export function generateConfirmationToken(): string {
  return randomBytes(32).toString('hex')
}

