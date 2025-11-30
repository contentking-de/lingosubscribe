import { resend } from './resend'

export async function sendOptInEmail(
  email: string,
  name: string | null,
  confirmationToken: string,
  school: string | null = null
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const confirmationUrl = `${baseUrl}/api/confirm?token=${confirmationToken}`

  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME || 'Lingoletics'} <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: 'Confirm your subscription to Lingoletics',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f0641e; margin: 0;">Lingoletics</h1>
        </div>
        
        <h2 style="color: #333; margin-top: 0;">Confirm your subscription</h2>
        
        <p>Hi ${name || 'there'},</p>
        
        <p>Thank you for your interest in Lingoletics! We're excited to have you on board.</p>
        
        <p>To complete your subscription and receive notifications when we launch, please confirm your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #f0641e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Confirm Subscription
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 12px; word-break: break-all;">${confirmationUrl}</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't request this subscription, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; margin: 0;">
          Best regards,<br>
          The Lingoletics Team
        </p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(email: string, name: string | null) {
  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME || 'Lingoletics'} <${process.env.RESEND_FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Lingoletics!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f0641e; margin: 0;">Lingoletics</h1>
        </div>
        
        <h2 style="color: #333; margin-top: 0;">Welcome to Lingoletics!</h2>
        
        <p>Hi ${name || 'there'},</p>
        
        <p>Thank you for confirming your subscription! We're excited to have you on board.</p>
        
        <p>We're currently working hard to launch Lingoletics - a platform that makes language learning fun and engaging for students with:</p>
        
        <ul>
          <li>📚 Engaging Stories</li>
          <li>🎯 Tests & Quizzes</li>
          <li>📖 Vocabulary Trainer</li>
          <li>🎮 Fun Games</li>
        </ul>
        
        <p>We'll notify you as soon as we launch. Stay tuned!</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #999; font-size: 12px; margin: 0;">
          Best regards,<br>
          The Lingoletics Team
        </p>
      </div>
    `,
  })
}

