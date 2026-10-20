# Sakshi Nayak — Portfolio

Personal portfolio built with Next.js 15 (App Router), TypeScript and framer-motion, with a small backend:

- **Admin panel** at `/admin` to edit profile, stats, experience, projects, skills and education. Saving revalidates the home page, so changes go live immediately.
- **Contact form** (`POST /api/contact`) with zod validation, a honeypot and per-IP rate limiting. Messages land in the admin inbox and can also be emailed to you via Resend.
- **Live GitHub section** showing your most recently pushed public repos (cached for an hour).

## Run locally

```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and AUTH_SECRET
npm run dev
```

Open http://localhost:3000, and http://localhost:3000/admin to edit content.

Without `MONGODB_URI`, content and messages are stored in `.data/*.json`. With no saved content, the site falls back to `src/data/resume.ts`.

## Deploy (Vercel)

1. Create a free MongoDB Atlas cluster and copy its connection string.
2. Import the repo in Vercel and set `ADMIN_PASSWORD`, `AUTH_SECRET` and `MONGODB_URI` (plus `RESEND_API_KEY` if you want email notifications).
3. Deploy, then sign in at `/admin`. Your first save copies the default content into MongoDB.

## Structure

| Path | What it is |
|---|---|
| `src/app/page.tsx` | Home page; reads content from the store |
| `src/app/admin/` | Login and editor UI |
| `src/app/api/` | Auth, content, messages and contact routes |
| `src/lib/store.ts` | MongoDB / JSON-file storage |
| `src/lib/types.ts` | zod schemas shared by API and UI |
| `src/middleware.ts` | Protects `/admin` and `/api/admin` with a signed JWT cookie |
| `src/data/resume.ts` | Default content |
