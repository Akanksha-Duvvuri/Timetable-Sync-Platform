# Timetable Sync Project

> Student enters their roll number + class → sees their timetable → syncs directly to Google or Apple Calendar. No .ics downloads

**Stack:** Next.js · TypeScript · Tailwind CSS · Framer Motion · Supabase (PostgreSQL) · NextAuth · Google Calendar API · CalDAV (Apple)

---

## Features

| Feature | Status |
|---|---|
| Roll number + class lookup | 🔲 Todo |
| Auto device detection (iOS → Apple, Android/Desktop → Google) | 🔲 Todo |
| Manual provider switching | 🔲 Todo |
| Timetable preview before syncing | 🔲 Todo |
| Animated modal flow (enter details → connecting → success) | 🔲 Todo |
| Google Calendar OAuth + recurring event push | 🔲 Todo |
| Apple Calendar via CalDAV (no .ics download) | 🔲 Todo |
| Admin panel — manage classes, students, slots | 🔲 Todo |
| Token refresh handling | 🔲 Todo |
| Re-sync / update existing calendar events | 🔲 Todo |
| Duplicate event prevention | 🔲 Todo |

---

## UI Flow

```
Landing page (dark, bold)
    ↓
[ Enter Roll Number + Class ] modal
    ↓
Timetable preview screen — shows all slots before committing
    ↓
"Connecting to Google Calendar" / "Connecting to Apple Calendar"
  (auto-detected, switchable)
    ↓
OAuth redirect → permission granted
    ↓
Success screen — "Your timetable is live in your calendar"
```

**Design language:** Dark background · Strong accent color (suggest indigo or violet) · Large typography · Smooth Framer Motion transitions between modal steps 

---

## Branch Structure

```
main                  
│
├── dev              
│
├── feature/
│   ├── feature/db-schema
│   ├── feature/admin-panel
│   ├── feature/timetable-api
│   ├── feature/ui-modal-flow
│   ├── feature/timetable-preview
│   ├── feature/google-calendar
│   ├── feature/apple-caldav
│   └── feature/device-detection
│
└── fix/
    ├── fix/token-refresh
    └── fix/duplicate-events
```

**Workflow:** branch off `dev` → build feature → PR into `dev` → test → merge `dev` into `main` for releases

---

## Project Structure

```
timetable-sync/
│
├── app/
│   ├── page.tsx                           # Landing page + modal entry point
│   ├── layout.tsx                         # Root layout, dark theme provider
│   ├── globals.css
│   │
│   ├── admin/
│   │   └── page.tsx                       # Admin panel (protected)
│   │
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/route.ts     # NextAuth — Google OAuth
│       ├── timetable/
│       │   └── route.ts                   # Lookup by roll no + class
│       └── calendar/
│           ├── google/route.ts            # Push events to Google Calendar
│           └── apple/route.ts             # Push events via CalDAV
│
├── components/
│   ├── Modal/
│   │   ├── ModalShell.tsx                 # Wrapper with backdrop + animation
│   │   ├── StepInput.tsx                  # Step 1 — roll no + class form
│   │   ├── StepPreview.tsx                # Step 2 — timetable preview
│   │   ├── StepConnecting.tsx             # Step 3 — "Connecting to X Calendar"
│   │   └── StepSuccess.tsx                # Step 4 — success screen
│   ├── TimetableGrid.tsx                  # Timetable display component
│   ├── ProviderPicker.tsx                 # Google / Apple switcher
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Badge.tsx
│
├── lib/
│   ├── supabase.ts                        # Supabase client
│   ├── google-calendar.ts                 # Google API helpers
│   ├── apple-caldav.ts                    # CalDAV push helpers
│   ├── device-detect.ts                   # UA-based device detection
│   └── timetable.ts                       # Timetable formatting utils
│
├── hooks/
│   ├── useTimetable.ts                    # Fetch + cache timetable data
│   └── useCalendarSync.ts                 # Handle sync state machine
│
├── types/
│   └── index.ts                           # Shared TS types
│
└── middleware.ts                          # Protect /admin route
```

---

## 🗄️ Database Schema

```sql
classes            → id, name, section
students           → id, roll_number, class_id, name
timetable_slots    → id, class_id, subject, teacher, day_of_week, start_time, end_time
calendar_connections → id, student_id, provider, access_token,
                       refresh_token, token_expiry, calendar_event_ids (jsonb)
```

---

##  Build Phases

---

### Phase 1 — Project Setup

- [x] Scaffold: `npx create-next-app@latest timetable-sync --typescript --tailwind --app`
- [ ] Install: `@supabase/supabase-js` `@supabase/auth-helpers-nextjs` `googleapis` `next-auth` `framer-motion` `zod` `tsdav`
- [ ] Create Supabase project at supabase.com
- [ ] Set up `.env.local` — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- [ ] Configure dark mode in `tailwind.config.ts` (`darkMode: 'class'`)
- [ ] Set dark background in `layout.tsx` and `globals.css`
- [ ] Init Git, create `main` and `dev` branches

---

### Phase 2 — Database Schema

- [ ] Branch: `git checkout -b feature/db-schema`
- [ ] Create `classes` table
- [ ] Create `students` table
- [ ] Create `timetable_slots` table
- [ ] Create `calendar_connections` table with `calendar_event_ids jsonb` column
- [ ] Run all SQL in Supabase editor, verify tables
- [ ] Enable Row Level Security on all tables (lock down now, not later)
- [ ] Merge into `dev`

---

### Phase 3 — Admin Panel

- [ ] Branch: `git checkout -b feature/admin-panel`
- [ ] Create `/app/admin/page.tsx`
- [ ] Add admin route protection in `middleware.ts`
- [ ] Build "Add class" form
- [ ] Build "Add student" form (roll number + class)
- [ ] Build "Add timetable slot" form (subject, teacher, day, start/end time)
- [ ] Seed test data — at least 2 classes, 5 students, full week of slots
- [ ] Merge into `dev`

---

### Phase 4 — Timetable Lookup API


- [ ] Branch: `git checkout -b feature/timetable-api`
- [ ] Create `app/api/timetable/route.ts`
- [ ] Accept `roll_number` + `class_id` as query params
- [ ] Query: student → class → all timetable slots for that class
- [ ] Return sorted JSON array (by day, then time)
- [ ] Test in Postman — happy path + not-found case
- [ ] Merge into `dev`

---

### Phase 5 — UI Modal Flow


- [ ] Branch: `git checkout -b feature/ui-modal-flow`
- [ ] Build `ModalShell.tsx` — full-screen dark overlay, Framer Motion fade in
- [ ] Build `StepInput.tsx` — roll number input + class dropdown, styled boldly
- [ ] Build `StepConnecting.tsx` — animated spinner + "Connecting to [Provider] Calendar" text
- [ ] Build `StepSuccess.tsx` — confirmation screen with calendar icon
- [ ] Wire modal steps together with state machine (`input → preview → connecting → success`)
- [ ] Add "open modal" trigger on landing page
- [ ] Make it mobile responsive
- [ ] Merge into `dev`

---

### Phase 6 — Timetable Preview

- [ ] Branch: `git checkout -b feature/timetable-preview`
- [ ] Build `TimetableGrid.tsx` — week view, color-coded by subject
- [ ] Build `StepPreview.tsx` — shows grid + "Sync to Calendar" CTA
- [ ] Call `/api/timetable` after Step 1 submit, pass data to preview step
- [ ] Build `ProviderPicker.tsx` — shows detected provider, allows switching
- [ ] Implement `device-detect.ts` — check `navigator.userAgent` for iOS/Android/Desktop
- [ ] iOS → default to Apple, everything else → default to Google
- [ ] Merge into `dev`

---

### Phase 7 — Google Calendar Integration

**Google Cloud Setup**
- [ ] Branch: `git checkout -b feature/google-calendar`
- [ ] Create project at console.cloud.google.com
- [ ] Enable Google Calendar API
- [ ] Create OAuth 2.0 credentials (Web Application)
- [ ] Add `http://localhost:3000/api/auth/callback/google` as redirect URI
- [ ] Add `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` to `.env.local`

**NextAuth + Token Storage**
- [ ] Configure `/app/api/auth/[...nextauth]/route.ts` with Google provider
- [ ] Request `https://www.googleapis.com/auth/calendar` scope
- [ ] On sign-in callback, save `access_token` + `refresh_token` to `calendar_connections`

**Event Push**
- [ ] Create `lib/google-calendar.ts` with event creation helper
- [ ] Create `app/api/calendar/google/route.ts`
- [ ] Map timetable slots → Google Calendar events with `RRULE:FREQ=WEEKLY`
- [ ] Save returned `event_id` per slot into `calendar_event_ids` jsonb column
- [ ] Test full OAuth flow + event creation on real Google account
- [ ] Merge into `dev`

---

### Phase 8 — Apple Calendar Integration (CalDAV)

- [ ] Branch: `git checkout -b feature/apple-caldav`
- [ ] Install `tsdav` — CalDAV client library
- [ ] Build `lib/apple-caldav.ts` — connect to iCloud CalDAV, create events
- [ ] Create `app/api/calendar/apple/route.ts`
- [ ] Prompt user for iCloud email + app-specific password (Apple requires this)
- [ ] Add iCloud credential fields to `StepInput.tsx` when Apple is selected
- [ ] Map slots → CalDAV VEVENT objects with weekly recurrence
- [ ] Push events directly to iCloud calendar (no file download)
- [ ] Test on real iCloud account
- [ ] Merge into `dev`

> **Note:** Apple doesn't support OAuth for CalDAV — users need to generate an app-specific password at appleid.apple.com. Store this encrypted, never plain text.

---

### Phase 9 — Edge Cases & Resilience

- [ ] Branch: `git checkout -b fix/token-refresh`
- [ ] Handle Google token expiry — auto-refresh using `refresh_token` before API calls
- [ ] Merge into `dev`
- [ ] Branch: `git checkout -b fix/duplicate-events`
- [ ] On re-sync, check `calendar_event_ids` — update existing events instead of creating new ones
- [ ] Handle timetable slot changes — delete old event, create new one
- [ ] Add loading states to every async action in the modal
- [ ] Test all error states: wrong roll number, expired token, CalDAV auth fail, Google API quota
- [ ] Merge into `dev`

---

### Phase 10 — Go Live

- [ ] Final QA on `dev` — full flow on mobile (iOS + Android) and desktop
- [ ] Merge `dev` → `main`
- [ ] Add production redirect URI to Google Cloud Console
- [ ] Set all production env vars in Vercel dashboard
- [ ] Deploy: `vercel deploy --prod`
- [ ] Smoke test on production URL
- [ ] Share with a few real students to test

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

# Admin (temporary)
ADMIN_PASSWORD=
```

---

## Key Decisions & Notes

- **No .ics downloads** — Apple integration uses CalDAV to push events directly. Requires user's iCloud app-specific password.
- **Device detection** is `navigator.userAgent` based — iOS devices default to Apple, everything else defaults to Google. User can always switch.
- **Token storage** — all OAuth tokens and CalDAV passwords must be encrypted at rest. Use `crypto` module or a secrets manager before going to production.
- **Timetable updates** — always save `event_id` on creation. Updates patch in place rather than delete + recreate to preserve user edits.
- **Google OAuth warning** — unverified apps show a warning screen to users. For internal school use this is fine. For public launch you'll need Google to verify the app.

---

*Branch off `dev`. Build one phase at a time. Merge when it works. Don't touch `main` until you're ready to ship.*
---

*Built with Next.js + Supabase. Start at Phase 1 and work downward — don't skip ahead.*



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
