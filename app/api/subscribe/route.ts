import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateConfirmationToken } from '@/lib/crypto'
import { sendOptInEmail } from '@/lib/email-templates'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = subscribeSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.subscription.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.confirmed) {
        return NextResponse.json(
          { error: 'This email is already subscribed and confirmed.' },
          { status: 400 }
        )
      } else {
        // If not confirmed, send new confirmation email
        const confirmationToken = generateConfirmationToken()
        await prisma.subscription.update({
          where: { email },
          data: { confirmationToken },
        })
        
        await sendOptInEmail(email, name, confirmationToken)
        
        return NextResponse.json(
          { message: 'Please check your email to confirm your subscription.' },
          { status: 200 }
        )
      }
    }

    // Generate confirmation token
    const confirmationToken = generateConfirmationToken()

    // Create subscription (not confirmed yet)
    const subscription = await prisma.subscription.create({
      data: {
        email,
        name: name,
        confirmationToken,
        confirmed: false,
      },
    })

    // Send opt-in confirmation email
    try {
      await sendOptInEmail(email, name || null, confirmationToken)
    } catch (emailError) {
      console.error('Failed to send opt-in email:', emailError)
      // Delete the subscription if email fails
      await prisma.subscription.delete({ where: { id: subscription.id } })
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Please check your email to confirm your subscription.' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors[0]?.message || 'Invalid input. Please check your name and email.'
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}


