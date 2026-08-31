# Koze

A calm language studio for translation, reading, listening, and short practice quizzes.

Progress can stay on-device (guest mode) or sync to **MongoDB** when you sign in.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Auth.js (`next-auth` v5) — email/password credentials; optional Google
- MongoDB via Mongoose (users, onboarding, progress)
- Gemini quizzes, RapidAPI translate, VoiceRSS TTS (existing features)

## Getting started

```bash
npm install
cp .env.example .env.local
# fill MONGODB_URI, AUTH_SECRET, and existing API keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required env

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `AUTH_SECRET` | Auth.js secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` | App origin (e.g. `http://localhost:3000`) |
| `GOOGLE_API_KEY` | Gemini quizzes |
| `API_KEY` | RapidAPI Deep Translate |
| `VOICERS_API_KEY` | VoiceRSS TTS |
| `NINJA_API_KEY` | Quotes for reading |

Optional Google sign-in: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and set `NEXT_PUBLIC_GOOGLE_AUTH=true`.

## Auth & onboarding

1. **Guest** — use the app with `localStorage` progress only.
2. **Register / Sign in** — `/register`, `/login`.
3. **Onboarding** (required once after account creation) — display name, native language, learning language, goal, daily minutes.
4. Progress is written to MongoDB on each activity and merged with any prior guest data on login.

## Main routes

| Path | Description |
|------|-------------|
| `/` | Home + progress summary |
| `/translation` | Translate (+ camera OCR) |
| `/reading` | Quote + guided reading |
| `/listening` | TTS + multiple choice |
| `/chat` | Topic quizzes (Gemini) |
| `/onboarding` | Post-signup setup |
| `/login`, `/register` | Auth |

## Deploy notes

- Set all env vars on Vercel (or your host).
- MongoDB Atlas: allow your deployment IPs / `0.0.0.0/0` for serverless if needed.
- Auth.js needs a stable `AUTH_SECRET` and correct public URL.
