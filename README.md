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

Mock test emails on sign up:
- `taken@askvest.test` shows "email already exists"
- `down@askvest.test` shows "couldn't reach AskVest"

## Screens

| Figma frame | Route | Status |
|---|---|---|
| 01 Splash | `/` | Done |
| 02 Welcome + Onboarding 2, 3 | `/welcome` | Done (swipeable carousel) |
| 03 / 03b Sign up | `/sign-up` | Done (mock API). Google/Apple show "coming soon" |
| 04 to 04d Email verification | `/verify-email` | Next |
| 05 to 05c Login | `/login` | Next (biometrics hidden) |
| 06, 06b Forgot password | | To do |
| 07 to 10b Personalisation | | To do (waiting on backend endpoints) |

## Open items with backend and design

- Real endpoint paths and the response envelope shape (OpenAPI on Render)
- Password policy must match the backend
- Google/Apple sign in is not on the backend yet
- Personalisation answers need an endpoint
- Reset-password screen and step counter are being fixed in Figma

## Scripts

`npm run dev`, `npm run build`, `npm run start`, `npm run lint`
