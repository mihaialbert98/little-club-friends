---
name: nextjs-best-practices
description: Invoke this skill when writing, reviewing, or structuring Next.js code. Establishes the canonical file structure, naming conventions, component patterns, data fetching rules, and TypeScript standards for this project.
---

# Next.js Best Practices

This skill defines the standards for this project. Apply these rules to all code written or reviewed.

---

## Directory Structure

```
/
├── app/                        # Next.js App Router root
│   ├── layout.tsx              # Root layout — HTML shell, global providers
│   ├── page.tsx                # Home route (/)
│   ├── globals.css             # Global styles (Tailwind directives here)
│   ├── (marketing)/            # Route group — shared layout, no URL segment
│   │   ├── layout.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── (app)/                  # Authenticated app route group
│   │   ├── layout.tsx          # Auth check, dashboard shell
│   │   └── dashboard/page.tsx
│   ├── api/                    # Route Handlers (backend API)
│   │   └── [resource]/
│   │       └── route.ts
│   ├── error.tsx               # Error boundary (Client Component)
│   ├── loading.tsx             # Loading skeleton (Server Component)
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── ui/                     # Primitive UI components (Button, Input, Modal, etc.)
│   └── features/               # Feature-specific components (ProductCard, UserAvatar, etc.)
│
├── lib/
│   ├── db.ts                   # Database client singleton (Prisma)
│   ├── auth.ts                 # Auth helpers and config
│   ├── validations.ts          # Zod schemas (shared between frontend and API)
│   └── utils.ts                # General utility functions
│
├── hooks/                      # Custom React hooks (client-side only)
│   └── use-*.ts
│
├── types/                      # TypeScript type and interface definitions
│   └── index.ts
│
├── public/                     # Static assets (served at /)
│   ├── images/
│   └── fonts/
│
├── middleware.ts               # Next.js middleware (auth, redirects, headers)
├── next.config.js              # Next.js config (headers, rewrites, env)
├── tailwind.config.ts          # Tailwind config (theme, plugins)
├── tsconfig.json
└── .env.example                # Document all required env vars
```

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| React components | `PascalCase` | `ProductCard.tsx`, `UserAvatar.tsx` |
| Utility functions | `camelCase` | `formatPrice.ts`, `parseDate.ts` |
| Hooks | `camelCase` with `use` prefix | `useCart.ts`, `useMediaQuery.ts` |
| Route segments | `kebab-case` | `app/product-details/page.tsx` |
| API routes | `kebab-case` | `app/api/user-profile/route.ts` |
| Types / Interfaces | `PascalCase` | `type UserProfile`, `interface CartItem` |
| Zod schemas | `PascalCase` + `Schema` suffix | `const CreateProductSchema` |
| Constants | `SCREAMING_SNAKE_CASE` | `const MAX_UPLOAD_SIZE = 5_000_000` |
| CSS class names | Tailwind utilities only (no custom class names unless CSS Module) | |

---

## Server vs Client Components

**Default: Server Component** — no directive needed.

Add `'use client'` only when you need:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`window`, `document`, `localStorage`, `navigator`)
- React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)
- Third-party libraries that require browser context

**Decision rule:**
```
Does this component need interactivity or browser APIs?
  YES → 'use client'
  NO  → Server Component (default)
```

**Push `'use client'` as far down the tree as possible.** Wrap only the interactive leaf node, not the whole page.

```tsx
// Good — only the button is a Client Component
// components/ui/AddToCartButton.tsx
'use client'
export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>Add to Cart</button>
}

// components/features/ProductCard.tsx  ← Server Component
import { AddToCartButton } from '@/components/ui/AddToCartButton'
export function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h2>{product.name}</h2>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

---

## Data Fetching

### In Server Components (preferred)
```tsx
// app/products/page.tsx
async function ProductsPage() {
  const products = await db.product.findMany({ orderBy: { createdAt: 'desc' } })
  return <ProductList products={products} />
}
```

### Caching Server Fetches
```tsx
// Cache for 60 seconds
const data = await fetch('/api/something', { next: { revalidate: 60 } })

// No cache (always fresh)
const data = await fetch('/api/something', { cache: 'no-store' })
```

### On the Client (when necessary)
Use **SWR** or **TanStack Query** — never `useEffect + fetch`:
```tsx
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function ProductList() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher)
  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage />
  return <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>
}
```

---

## API Route Handlers

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = CreateProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const product = await db.product.create({ data: parsed.data })
  return NextResponse.json(product, { status: 201 })
}
```

Rules:
- Always validate input with zod
- Always return appropriate HTTP status codes
- Never return stack traces in responses
- Use `NextResponse.json()` — not `new Response(JSON.stringify(...))`

---

## Environment Variables

```bash
# .env.local (never commit this)
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."        # server-only
STRIPE_SECRET_KEY="..."      # server-only

# Safe to expose to browser (prefix with NEXT_PUBLIC_)
NEXT_PUBLIC_APP_URL="https://myapp.com"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

**Rule:** If a variable is a secret, it must NOT have the `NEXT_PUBLIC_` prefix. If it does, it will be bundled into the browser JavaScript.

Always document all variables in `.env.example` with placeholder values.

---

## Image & Font Optimization

```tsx
// Images — always use next/image for content images
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority          // Add for above-the-fold images
  className="..."
/>

// Fonts — always use next/font, never <link> to Google Fonts
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
```

---

## SEO — Metadata API

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | MyApp',
  description: 'Learn about our mission and team.',
  openGraph: {
    title: 'About Us | MyApp',
    images: ['/og-about.png'],
  },
}
```

For dynamic metadata:
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return { title: product.name }
}
```

---

## Error & Loading Boundaries

Place these in each route segment that needs them:

```tsx
// app/dashboard/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}

// app/dashboard/loading.tsx  (Server Component)
export default function Loading() {
  return <DashboardSkeleton />
}
```

---

## TypeScript Rules

- No `any` — use `unknown` and narrow with type guards if needed
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `satisfies` to validate objects against types without widening
- Enable `strict: true` in `tsconfig.json`
- Use path aliases: `@/components/...`, `@/lib/...` (configure in `tsconfig.json`)

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Testing

| Layer | Tool |
|-------|------|
| Unit + component tests | Jest + React Testing Library |
| E2E tests | Playwright |
| API route tests | Jest with `fetch` mocks or supertest |

File placement: co-locate tests with source files:
```
components/ui/Button.tsx
components/ui/Button.test.tsx
```

E2E tests in a top-level `e2e/` directory:
```
e2e/
  auth.spec.ts
  checkout.spec.ts
```

---

## Code Organization Rules

1. **Co-location** — keep tests, styles, and sub-components near the component they belong to
2. **No premature abstraction** — don't create a utility function until it's used 3+ times
3. **Barrel exports** — only use `index.ts` re-exports at feature boundaries (e.g., `components/ui/index.ts`), not everywhere
4. **One component per file** — each file exports one primary component
5. **No default exports in lib/hooks** — use named exports for utilities and hooks; default exports only for page/layout components (Next.js requires it)
