# Forgetool Boilerplate

Payment-ready template for building Micro-SaaS tools. Clone this to start a new product.

**GitHub**: https://github.com/wangbo23-code/forgetool-boilerplate

## What's Included

This boilerplate provides a complete infrastructure layer so you only need to write business logic in `src/app/tool/`.

### Built-In Features

| Feature | Implementation |
|---------|---------------|
| **Authentication** | NextAuth.js 5 + Google OAuth (+ demo mode for dev) |
| **Payments** | Lemon Squeezy integration + webhook handler |
| **Credits System** | Signup free credits + per-use consumption |
| **Paywall** | Component that gates features behind login + credits |
| **Database** | Supabase (PostgreSQL) with in-memory mock fallback |
| **Landing Page** | Hero + features + pricing sections |
| **Legal Pages** | Terms of Service + Privacy Policy |
| **Mock Mode** | Full local dev without any external services |

### Protected Files (DO NOT MODIFY)

- `src/lib/auth.ts` — authentication logic
- `src/lib/payment.ts` — Lemon Squeezy integration
- `src/app/api/webhooks/` — payment webhook routes
- `src/app/layout.tsx` — root layout

### Sandbox Directory

All business logic goes in `src/app/tool/`. This is where you and AI build the product-specific features.

## How to Use

### 1. Clone for a new product

```bash
cp -r boilerplate/ <product-name>
cd <product-name>
```

### 2. Customize config

Edit `src/lib/config.ts` with your product name, tagline, pricing, and features.

### 3. Build your tool

Write your business logic in `src/app/tool/page.tsx` and `src/app/api/tool/analyze/route.ts`.

### 4. Deploy

```bash
git init && git add . && git commit -m "Init from boilerplate"
gh repo create <product-name> --private --source=. --push
vercel --yes
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript strict
- **UI**: Shadcn UI + Tailwind CSS 4
- **Auth**: NextAuth.js 5 (Google OAuth)
- **DB**: Supabase (PostgreSQL)
- **Payments**: Lemon Squeezy
- **AI**: OpenRouter API (model configurable)

## Development

```bash
npm install
npm run dev
# Open http://localhost:3000
# Everything works in mock mode — no credentials needed
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page (customizable)
│   ├── tool/page.tsx             # YOUR BUSINESS LOGIC HERE
│   ├── pricing/page.tsx          # Pricing page
│   ├── auth/signin/page.tsx      # Login page
│   ├── terms/page.tsx            # Terms of Service
│   ├── privacy/page.tsx          # Privacy Policy
│   └── api/
│       ├── auth/[...nextauth]/   # Auth routes (protected)
│       ├── tool/analyze/         # YOUR API ENDPOINT HERE
│       ├── credits/              # Credit balance
│       ├── checkout/             # Payment checkout
│       └── webhooks/             # Webhook handler (protected)
├── components/
│   ├── layout/                   # Header, Footer, Paywall
│   ├── auth/                     # SignIn button
│   └── ui/                       # Shadcn UI components
└── lib/
    ├── auth.ts                   # Auth setup (protected)
    ├── payment.ts                # Payment logic (protected)
    ├── db.ts                     # Database layer
    ├── credits.ts                # Credit system
    ├── config.ts                 # Site configuration (customize this)
    └── utils.ts                  # Utilities
```

## Products Built from This Boilerplate

| Product | Domain |
|---------|--------|
| StableShift | stableshift.forgetool.co |
| TarotAI | tarot.forgetool.co |
| LoveFate | lovefate.forgetool.co |
| SoulReport | soul.forgetool.co |

## Part of Matrix-Forge

This boilerplate is part of the Matrix-Forge Micro-SaaS production system.
