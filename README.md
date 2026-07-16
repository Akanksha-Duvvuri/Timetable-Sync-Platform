# Timetable Sync Platform

> Enter your roll number and class, your timetable gets synced to the calendar you already use.

**Live:** https://timetable-sync-platform.vercel.app/

**Stack:** Next.js · Supabase (PostgreSQL) · NextAuth · Google Cloud (OAuth 2.0) · ICS/webcal (RFC 5545)

---

## Features

| Feature |
|---|
| Roll number + class lookup (branch/section auto-detected from roll number format) |
| Timetable preview before syncing |
| Google Calendar OAuth |
| Apple Calendar via live webcal subscription feed |
| Admin panel — manage classes, students, and timetable slots |

---

**Design language:** Dark background · Terminal sort of aesthetic · Decrypt-reveal text animation

---

## Project Structure

```
timetable-sync/
├── app/
│   ├── admin/            
│   ├── api/
│   │   ├── auth/         
│   │   ├── timetable/    
│   │   └── calendar/
│   │       ├── google/  
│   │       └── apple/   
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Modal/           
│   ├── ui/              
│   ├── ProviderPicker.tsx
│   ├── Providers.tsx
│   └── TimetableGrid.tsx
├── lib/
│   ├── auth-options.ts   
│   ├── device-detect.ts  
│   ├── google-calendar.ts
│   ├── roll-parser.ts   
│   └── supabase.ts
└── types/
    └── index.ts
```

---

## Database Schema

```sql
classes              → id, name, section
students              → id, roll_number, class_id, name
timetable_slots       → id, class_id, subject, teacher, day_of_week, start_time, end_time
calendar_connections  → id, student_id, provider, access_token,
                         refresh_token, token_expiry, calendar_event_ids (jsonb)
```

---

## Environment Variables

```bash
# Supabase 
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Admin panel password
NEXT_PUBLIC_ADMIN_PASSWORD=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To edit timetable data, log in at `/admin` with the password set in `NEXT_PUBLIC_ADMIN_PASSWORD`.
```---


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
