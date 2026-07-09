# Timetable Sync Platform

> Enter your roll number and class, your time table will get synced to the calendar you use

**Stack:** Next.js · Supabase (PostgreSQL) · NextAuth · Google Cloud (OAuth 2.0) · ICS/webcal (RFC 5545)

---

## Features

| Feature |
|--- |
| Roll number + class lookup | 
| Timetable preview before syncing | 
| Google Calendar OAuth + recurring event push |
| Apple Calendar via webcal/ICS|
| Admin panel — manage classes, students, slots |

---

**Design language:** Dark background · Terminal sort of feel

---

.
├── README.md
└── timetable-sync
    ├── app
    │   ├── admin
    │   ├── api
    │   ├── components
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── lib
    │   ├── page.tsx
    │   └── types
    ├── components
    │   ├── Modal
    │   ├── ProviderPicker.tsx
    │   ├── Providers.tsx
    │   ├── TimetableGrid.tsx
    │   └── ui
    ├── lib
    │   ├── auth-options.ts
    │   ├── device-detect.ts
    │   ├── google-calendar.ts
    │   ├── mock-timetable.ts
    │   ├── roll-parser.ts
    │   └── supabase.ts
    ├── public
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    └── types
        └── index.ts


## 🗄️ Database Schema

```sql
classes            → id, name, section
students           → id, roll_number, class_id, name
timetable_slots    → id, class_id, subject, teacher, day_of_week, start_time, end_time
calendar_connections → id, student_id, provider, access_token,
                       refresh_token, token_expiry, calendar_event_ids (jsonb)
```

---

## Environment Variables

```bash
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Admin (to update the timetable easily)
ADMIN_PASSWORD=
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
