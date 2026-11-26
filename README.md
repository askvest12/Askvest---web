# AskVest Web

Mobile-first web app for AskVest. Think smarter. Invest confidently.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Server route handlers act as a backend-for-frontend for the .NET API |
| Styling | Tailwind CSS 4 | Figma tokens live in `src/app/globals.css` |
| Forms | React Hook Form + Zod | Same schema validates on the client and in the API route |
| Data | TanStack Query | Loading, error and retry states for API calls |
| API types | openapi-typescript (planned) | Generate types from the backend's OpenAPI spec once it's on Render |

### How it talks to the backend

```
Browser  ->  Next.js /api/* route handlers  ->  AskVest .NET API (Render)
```

The browser never calls the .NET API directly. Tokens will be kept in `httpOnly`
cookies set by the route handlers, so browser JavaScript never sees them, and
there is no CORS setup needed between Vercel and Render.

Until `BACKEND_API_URL` is set, the route handlers use mocks in `src/lib/api/mocks.ts`.

## Getting started

```bash
npm install
cp .env.example .env.local   # leave BACKEND_API_URL empty to use mocks
npm run dev                  # http://localhost:3000
```

Open it at phone width (390px) in dev tools, or on your phone over the local network.

Mock test values (used while `BACKEND_API_URL` is empty):
- Sign up: any details. `down@askvest.test` shows "couldn't reach AskVest"
- Verify email: `123456` is correct, anything else is incorrect
- Log in: password `Password1`. `unverified@askvest.test` goes to verify email, `newdevice@askvest.test` shows the new-device message
- Forgot password: always shows "Check your inbox"
- Personalisation: needs a logged-in session (log in first), then any answers

Point at the real API by setting `BACKEND_API_URL` (e.g. the Render URL) in `.env.local`. The API docs are at `<BACKEND_API_URL>/scalar`.

## Screens

| Figma frame | Route | Status |
|---|---|---|
| 01 Splash | `/` | Done |
| 02 Welcome + Onboarding 2, 3 | `/welcome` | Done (swipeable carousel) |
| 03 / 03b Sign up | `/sign-up` | Done (mock API). Google/Apple show "coming soon" |
| 04 to 04d Email verification | `/verify-email` | Done (mock API) |
| 05 to 05c Login | `/login` | Done (mock API, biometrics hidden) |
| 06, 06b Forgot password | `/forgot-password` | Done (mock API) |
| 07 to 10b Personalisation | `/personalise` | Done (saves to `/account/onboarding` + `/compliance/country`, needs login) |

## Backend contract (askvest12/AskVest)

Route handlers in `src/app/api/auth/*` call `/api/v1/auth/*` and unwrap the `{ success, message, data, error }` envelope.
- `Idempotency-Key` is sent on sign-up, verify-email, resend-verification, forgot-password and logout
- Login sends device info (`installationId` from the `av_iid` cookie, platform `web`)
- Tokens live in httpOnly cookies: `av_at` (access), `av_rt` (refresh, path `/api/auth`)
- Backend errors are mapped to UI copy in `src/lib/api/errors.ts`

## Open items with backend and design

- Password policy: backend wants 10+ chars with a letter and a number (Figma says 8+, upper & lowercase)
- Forgot password is code based on the backend (`/auth/reset-password`), Figma shows a link
- New-device login needs a code screen (`/auth/verify-device`), not in Figma
- Rate limiting is per client IP: behind our Next.js server, the backend must trust our `X-Forwarded-For`
- Google/Apple sign in is not on the backend yet
- Personalisation answers need an endpoint
- Reset-password screen and step counter are being fixed in Figma

## Scripts

`npm run dev`, `npm run build`, `npm run start`, `npm run lint`
