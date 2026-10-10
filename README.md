# React Boilerplate

Production-ready **React 19 + TypeScript + Vite** starter with a complete design system.

| | |
|---|---|
| **Stack** | React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui |
| **Architecture** | Atomic Design |
| **Forms** | React Hook Form + Zod |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |
| **Tests** | Vitest + Testing Library |
| **Design source** | Public Vorflux web tokens from https://vorflux.com/ |

---

## Quick start

```bash
cd react-boilerplate
npm install
npm run dev          # http://localhost:5173
```

**Demo login:** `alex@example.com` / `password123`

---

## All commands

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier-format all `src/**` files |
| `npm run test` | Vitest single-run (CI-safe) |
| `npm run test:watch` | Vitest interactive watch mode |

---

## Folder structure

```
react-boilerplate/
├── docs/
│   └── design-system-plan.md     ← design token reference, component inventory
├── src/
│   ├── app/
│   │   ├── providers/             ThemeProvider, AuthProvider
│   │   └── router/                AppRouter, route constants
│   ├── assets/                    Logo component
│   ├── components/
│   │   ├── atoms/                 Button, Input, Label, Badge, Avatar,
│   │   │                          Icon, Separator, Spinner, Skeleton, Card
│   │   ├── molecules/             FormField, SearchField, PasswordField,
│   │   │                          SelectField, Pagination
│   │   └── organisms/             AppHeader, Sidebar, LoginForm,
│   │                              SummaryCard, PageHeader, DataCard
│   ├── hooks/                     use-auth, use-dark-mode, use-zod-form,
│   │                              use-local-storage, use-debounce, use-click-outside
│   ├── lib/                       cn() utility, Zod schemas
│   ├── pages/                     Dashboard, Login, ComponentShowcase,
│   │                              FormExamples, NotFound
│   ├── services/                  auth.service (mock — swap for real API)
│   ├── styles/
│   │   └── globals.css            ← single source of truth for design tokens
│   ├── templates/                 AuthLayout, DashboardLayout, SettingsLayout
│   ├── tests/                     Vitest + Testing Library test files
│   └── types/                     Shared TypeScript interfaces
├── components.json                shadcn/ui CLI config
└── vitest.config.ts
```

---

## Atomic Design rules

Components are classified by **responsibility**, not by name.

| Layer | Directory | Rule |
|---|---|---|
| **Atoms** | `components/atoms/` | Single HTML element or Radix primitive. No business logic. No higher-layer imports. |
| **Molecules** | `components/molecules/` | 2–3 atoms with coordinated behaviour. No routing, no API calls. |
| **Organisms** | `components/organisms/` | Complete, self-contained UI sections. May use hooks, context, routing. |
| **Templates** | `templates/` | Page layout shells. Render `<Outlet />` or `children`. No data fetching. |
| **Pages** | `pages/` | One per route. Connects template + organisms + mock/real data. |

**Dependency direction (enforce strictly):**

```
Pages  →  Templates  →  Organisms  →  Molecules  →  Atoms
```

Lower layers must **never** import from higher layers.  
Shared hooks (`hooks/`) and utilities (`lib/`) may be used at any layer.

---

## How to add a new component

### As an atom (via shadcn/ui CLI)

```bash
# components.json routes output to src/components/atoms/
npx shadcn@latest add select
```

Then re-export from the barrel:

```ts
// src/components/atoms/index.ts
export { Select, SelectContent, SelectItem } from "./select";
```

### As a custom molecule / organism

1. Create `src/components/molecules/MyMolecule.tsx`
2. Export from `src/components/molecules/index.ts`
3. Only import from layers below (atoms, lib, hooks)

---

## How to add a new page

1. Create `src/pages/MyFeature/MyFeaturePage.tsx`
2. Export from `src/pages/MyFeature/index.ts`
3. Add a route in `src/app/router/index.tsx`
4. Add a nav item in `src/templates/DashboardLayout.tsx` (if needed)
5. Use `<PageHeader>` as the first element inside the page

---

## How to add shadcn/ui components

`components.json` is configured so the shadcn CLI drops files into `src/components/atoms/`:

```json
{
  "aliases": { "ui": "@/components/atoms" }
}
```

**Do not create a separate `components/ui/` folder.** Keep shadcn primitives in atoms.

```bash
npx shadcn@latest add dialog tooltip sheet
```

---

## How to update design tokens

All tokens live in **one file**: `src/styles/globals.css`.

```
:root / .dark  ←  change values here
     ↓
@theme inline  ←  maps CSS vars to Tailwind utilities (do not edit)
     ↓
bg-background, text-foreground, …  ←  use these in components
```

### Changing the primary colour

```css
/* src/styles/globals.css */
:root {
  --primary: #6366f1;              /* ← new colour */
  --primary-foreground: #ffffff;   /* ← text on primary */
}
```

No Tailwind recompilation needed — changes apply instantly via CSS variables.

### Adding a new token

```css
/* 1. Define the value */
:root  { --brand-sidebar: #0f172a; }
.dark  { --brand-sidebar: #020617; }

/* 2. Map to a Tailwind utility */
@theme inline {
  --color-brand-sidebar: var(--brand-sidebar);
}

/* 3. Use in components */
/* className="bg-brand-sidebar" */
```

---

## How to maintain product-wide visual consistency

These rules are enforced by the design system:

1. **Tokens only** — never use `bg-[#3d5bff]`. Use `bg-primary`.
2. **No duplicates** — extend an existing atom with a `variant`, don't create a new component.
3. **One icon library** — Lucide only. Always use the `Icon` atom, not bare Lucide icons.
4. **Spacing scale** — use Tailwind multiples of 4px (`p-4`, `gap-6`). No `px-[17px]`.
5. **Border radius** — `rounded-md` for controls (buttons, inputs). `rounded-xl` for cards.
6. **Focus rings** — always `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
7. **States** — every interactive component must have hover, focus, disabled, loading, error, success states.
8. **PageHeader** — every dashboard page starts with `<PageHeader title="…" />`.
9. **Dependency direction** — Pages → Templates → Organisms → Molecules → Atoms. Never import up.

---

## Design token reference

Full token table: [`docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md)

### Core public values

| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0a0b` | Dark page background |
| `--foreground` | `#f5f5f2` | Dark primary text |
| `--card` | `#121214` | Dark card surface |
| `--primary` | `#3d5bff` | Public Vorflux accent blue |
| `--primary-foreground` | `#ffffff` | Text on primary |
| `--muted-foreground` | `#8a8a8a` | Captions and labels |
| `--border` | `#1c1c1e` | Borders |
| `--input` | `#66666a` | Dark input borders |
| `--destructive` | `#ef4444` | Errors |
| `--radius` | `0.625rem (10px)` | Control corners |

---

## Token source and limitations

- The public Vorflux website at https://vorflux.com/ supplies the core dark values.
- Vorflux does not publish its private application design-system tokens.
- The light palette and supporting blue scale are accessible companion values created for this boilerplate.
- Components consume semantic tokens through Tailwind CSS v4 utilities.

---

## Validation commands

```bash
npm run build       # tsc -b + vite build
npm run lint        # ESLint (0 errors required)
npm run typecheck   # tsc --noEmit (0 errors required)
npm run test        # vitest run (all tests must pass)
```

Expected output:

```
✓ build:     dist/assets/index-*.js   ~424 kB │ gzip: ~128 kB
✓ lint:      0 errors
✓ typecheck: 0 errors
✓ tests:     2 test files, 13 tests passed
```
