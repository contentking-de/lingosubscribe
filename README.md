# Lingoletics Presell/Subscription Page

A Next.js application for collecting pre-launch subscriptions for Lingoletics, a language learning platform for students.

## Features

- **Subscription Page**: Beautiful landing page where users can subscribe with their email
- **Admin Dashboard**: Password-protected dashboard to manage subscriptions
- **Email Notifications**: Send launch notifications to all subscribers via Resend API
- **Analytics**: Charts showing daily signups over the last 30 days
- **Database**: PostgreSQL database using NEON (via Prisma)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: Your NEON PostgreSQL connection string
- `ADMIN_PASSWORD_HASH`: Hashed password for admin dashboard (see below)
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Email address to send from (must be verified in Resend)
- `RESEND_FROM_NAME`: Display name for emails
- `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., `http://localhost:3000`)

### 3. Generate Admin Password Hash

Create a script to hash your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"
```

Or use this temporary script:

```bash
npm install -g bcryptjs-cli
bcryptjs-cli hash "your-password"
```

Add the hash to your `.env` file as `ADMIN_PASSWORD_HASH`.

### 4. Setup Database

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` for the subscription page and `http://localhost:3000/admin` for the admin dashboard.

## Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard page
│   ├── api/
│   │   ├── admin/      # Admin API routes (login, stats, notify)
│   │   └── subscribe/  # Subscription API route
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Subscription landing page
│   └── globals.css     # Global styles
├── components/
│   ├── SignupsChart.tsx      # Chart component for daily signups
│   ├── SubscriberList.tsx    # List of subscribers with pagination
│   └── SubscriptionForm.tsx  # Subscription form component
├── lib/
│   ├── prisma.ts       # Prisma client instance
│   ├── resend.ts       # Resend client instance
│   └── utils.ts        # Utility functions (password hashing)
└── prisma/
    └── schema.prisma   # Database schema
```

## Usage

### Subscription Page

Users can visit the main page and enter their email (and optionally their name) to subscribe. They will receive a confirmation email via Resend.

### Admin Dashboard

1. Navigate to `/admin`
2. Enter your admin password
3. View subscription statistics and charts
4. Browse all subscribers
5. Send launch notifications to all subscribers who haven't been notified yet

### Sending Launch Notifications

1. Log into the admin dashboard
2. Click "Notify All Subscribers"
3. Enter a subject and message
4. Click "Send Notifications"

All subscribers who haven't been notified yet will receive the email, and their status will be updated to "Notified".

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Prisma**: Database ORM
- **NEON**: PostgreSQL database
- **Resend**: Email service
- **Recharts**: Chart library
- **Tailwind CSS**: Styling
- **bcryptjs**: Password hashing

## Deployment

This application can be deployed to Vercel, Netlify, or any platform that supports Next.js. Make sure to:

1. Set all environment variables in your hosting platform
2. Run database migrations: `npx prisma db push`
3. Ensure your Resend domain is verified
4. Update `NEXT_PUBLIC_APP_URL` to your production URL


