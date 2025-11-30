import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { message, subject } = await request.json()

    if (!message || !subject) {
      return NextResponse.json(
        { error: 'Message and subject are required' },
        { status: 400 }
      )
    }

    // Get all confirmed subscribers who haven't been notified yet
    const subscribers = await prisma.subscription.findMany({
      where: {
        confirmed: true,
        notified: false,
      },
    })

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: 'No subscribers to notify',
        sent: 0,
      })
    }

    let successCount = 0
    let failCount = 0

    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: `${process.env.RESEND_FROM_NAME || 'Lingoletics'} <${process.env.RESEND_FROM_EMAIL}>`,
          to: subscriber.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #4f46e5;">Lingoletics Launch!</h1>
              <p>Hi ${subscriber.name || 'there'},</p>
              <div style="margin: 20px 0;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              <p>Best regards,<br>The Lingoletics Team</p>
            </div>
          `,
        })

        // Mark as notified
        await prisma.subscription.update({
          where: { id: subscriber.id },
          data: { notified: true },
        })

        successCount++
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error)
        failCount++
      }
    }

    return NextResponse.json({
      message: `Notifications sent: ${successCount} successful, ${failCount} failed`,
      sent: successCount,
      failed: failCount,
    })
  } catch (error) {
    console.error('Error sending notifications:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}


