# Environment Variables Setup

Erstelle eine `.env` Datei im Root-Verzeichnis mit folgenden Variablen:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Admin Dashboard Password (hashed with bcrypt)
ADMIN_PASSWORD_HASH=""

# Resend API
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Resend Email Configuration
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_FROM_NAME="Lingoletics"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Admin Password Hash generieren

Um das Admin-Passwort zu hashen, führe aus:

```bash
node scripts/hash-password.js "LingoSubStart2026!#"
```

Kopiere den generierten Hash und füge ihn als `ADMIN_PASSWORD_HASH` in deine `.env` Datei ein.

## NEON Database Setup

1. Erstelle ein NEON Account unter https://neon.tech
2. Erstelle eine neue Datenbank
3. Kopiere den Connection String und füge ihn als `DATABASE_URL` ein

## Resend Setup

1. Erstelle ein Resend Account unter https://resend.com
2. Generiere einen API Key
3. Verifiziere deine Domain oder nutze die Test-Domain
4. Füge den API Key als `RESEND_API_KEY` ein
5. Setze `RESEND_FROM_EMAIL` auf deine verifizierte Email-Adresse



