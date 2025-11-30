import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email-templates'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(
        new URL('/?error=missing_token', request.url)
      )
    }

    // Find subscription by confirmation token
    const subscription = await prisma.subscription.findUnique({
      where: { confirmationToken: token },
    })

    if (!subscription) {
      return NextResponse.redirect(
        new URL('/?error=invalid_token', request.url)
      )
    }

    if (subscription.confirmed) {
      return NextResponse.redirect(
        new URL('/?message=already_confirmed', request.url)
      )
    }

    // Confirm the subscription
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        confirmed: true,
        confirmedAt: new Date(),
        confirmationToken: null, // Remove token after confirmation
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(subscription.email, subscription.name)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the confirmation if email fails
    }

    // Redirect to success page
    return NextResponse.redirect(
      new URL('/?message=subscription_confirmed', request.url)
    )
  } catch (error) {
    console.error('Confirmation error:', error)
    return NextResponse.redirect(
      new URL('/?error=confirmation_failed', request.url)
    )
  }
}

