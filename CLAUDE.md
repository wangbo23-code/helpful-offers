# AI Development Rules for This Project

## Sandbox Rule (CRITICAL)
- You can ONLY write code in `src/app/tool/` directory
- You MUST NOT modify: lib/auth.ts, lib/payment.ts, webhook routes, layout.tsx
- You MUST use Shadcn UI components only. No custom CSS files.
- You can import and use functions from lib/credits.ts and lib/db.ts
- You can use any components from components/ui/

## Tech Stack (locked, do not change)
- Next.js 15 App Router + TypeScript strict mode
- Shadcn UI + Tailwind CSS (utility classes only)
- Supabase for data storage
- Server Actions for backend logic

## Code Style
- File naming: kebab-case (e.g., `tool-form.tsx`)
- Functions/variables: camelCase
- Types/interfaces: PascalCase
- Comments: English

## Available APIs for Sandbox Use
```typescript
// Credits — check and consume
import { getCredits, useCredit, hasCredits } from "@/lib/credits"
// Database — read/write user data
import { getUserByEmail } from "@/lib/db"
// Config — site settings
import { siteConfig } from "@/lib/config"
// Auth — get current user (read-only)
import { getCurrentUser, requireAuth } from "@/lib/auth"
```

## Paywall Component
Wrap any paid feature with the Paywall component:
```tsx
import { Paywall } from "@/components/layout/paywall"

<Paywall featureName="Generate Report">
  <YourToolComponent />
</Paywall>
```
