# Design System Plan

**Project:** react-boilerplate  
**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui  
**Status:** Superseded by `docs/DESIGN_SYSTEM.md`.
**Current visual source:** Public Vorflux web tokens from https://vorflux.com/.
**Reference implementation:** `../nextjs-boilerplate`

---

## 1. Design Token Source of Truth

All tokens live in **one file only**: `src/styles/globals.css`.

### Mapping: Figma → CSS Variables → Tailwind

```
Figma variable collection         CSS custom property        Tailwind utility
─────────────────────────────     ──────────────────────     ──────────────────
3. Mode / background              --background               bg-background
3. Mode / foreground              --foreground               text-foreground
3. Mode / card                    --card                     bg-card
3. Mode / card-foreground         --card-foreground          text-card-foreground
3. Mode / primary                 --primary                  bg-primary / text-primary
3. Mode / primary-foreground      --primary-foreground       text-primary-foreground
3. Mode / secondary               --secondary                bg-secondary
3. Mode / muted                   --muted                    bg-muted
3. Mode / muted-foreground        --muted-foreground         text-muted-foreground
3. Mode / accent                  --accent                   bg-accent
3. Mode / accent-foreground       --accent-foreground        text-accent-foreground
3. Mode / destructive             --destructive              bg-destructive / text-destructive
3. Mode / border                  --border                   border-border
3. Mode / input                   --input                    border-input
3. Mode / ring                    --ring                     ring / ring-ring
```

Tailwind v4 `@theme inline {}` maps each `--color-*` to `var(--*)`,
so utilities resolve at runtime — theme switching requires no recompilation.

### Light-mode values (Figma confirmed)

| Token | Value | Figma source |
|---|---|---|
| `--background` | `#fafafa` | zinc-50 |
| `--foreground` | `#27272a` | zinc-900 |
| `--card` | `#ffffff` | white |
| `--primary` | `#4ccbbf` | Teal (custom in copy) |
| `--primary-foreground` | `#042f2e` | Dark teal (Button node) |
| `--muted` | `#f4f4f5` | zinc-100 |
| `--muted-foreground` | `#52525b` | zinc-600 |
| `--border` | `#e4e4e7` | zinc-200 (Input node) |
| `--input` | `#e4e4e7` | zinc-200 |
| `--destructive` | `#ef4444` | red-500 |
| `--radius` | `0.5rem` | rounded-md = 8px |

### Dark-mode values

| Token | Value | Source |
|---|---|---|
| `--background` | `#09090b` | zinc-950 |
| `--foreground` | `#fafafa` | zinc-50 |
| `--card` | `#09090b` | zinc-950 |
| `--border` | `#27272a` | zinc-800 |
| `--muted` | `#27272a` | zinc-800 |
| `--muted-foreground` | `#a1a1aa` | zinc-400 |

---

## 2. Typography Scale

Sourced from Figma text styles (`--text-*` variables):

| Name | Size | Line-height | Weight |
|---|---|---|---|
| `text-xs` | 12px | 16px | regular |
| `text-sm` | 14px | 20px | regular / medium |
| `text-base` | 16px | 24px | regular |
| `text-lg` | 18px | 28px | regular |
| `text-xl` | 20px | 28px | semibold |
| `text-2xl` | 24px | 32px | semibold |
| `text-3xl` | 30px | 36px | semibold |
| `text-4xl` | 36px | 40px | extrabold |

Font family: **Inter** — loaded from Google Fonts in `index.html`.

### Typography rules
- Page titles: `text-2xl font-bold` or `text-3xl font-bold`
- Section headings: `text-lg font-semibold`
- Card titles: `text-sm font-semibold`
- Labels: `text-sm font-medium`
- Body: `text-sm` or `text-base`
- Captions / metadata: `text-xs text-muted-foreground`

---

## 3. Spacing Scale

Sourced from Figma spacing variables (`--spacing/*`):

| Var | Value | Tailwind |
|---|---|---|
| `/1` | 4px | `gap-1 / p-1` |
| `/1.5` | 6px | `gap-1.5` |
| `/2` | 8px | `gap-2 / p-2` |
| `/3` | 12px | `gap-3 / p-3` |
| `/4` | 16px | `gap-4 / p-4` |
| `/6` | 24px | `gap-6 / p-6` |
| `/8` | 32px | `gap-8 / p-8` |
| `/12` | 48px | `gap-12` |

### Spacing rules
- Component padding: `p-4` (16px) default, `p-6` (24px) for cards
- Section gaps: `gap-6` between major sections
- Form field internal gap (label→input): `gap-1.5`
- Between stacked form fields: `gap-4`

---

## 4. Border Radius

| Name | Value | Figma |
|---|---|---|
| `rounded-sm` | 4px | — |
| `rounded-md` | 8px | `border-radius/rounded-md` |
| `rounded-lg` | 8px | `border-radius/rounded-lg` |
| `rounded-xl` | 12px | `border-radius/rounded-xl` |
| `rounded-full` | 9999px | `border-radius/rounded-full` |

**Rule:** Components use `rounded-md` (buttons, inputs). Cards use `rounded-xl`.

---

## 5. Shadows / Elevation

| Name | Value | Usage |
|---|---|---|
| `shadow/xs` | `0 1px 2px rgba(0,0,0,.05)` | Inputs, small buttons |
| `shadow/sm` | `0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)` | Cards, dropdowns |
| `shadow/elevated` | `0 4px 6px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.1)` | Modals, popovers |

---

## 6. Component Dimensions

Sourced from Figma height variables:

| Component | Height | Padding-X |
|---|---|---|
| Button sm | 32px | 12px |
| Button md (default) | 36px | 16px |
| Button lg | 44px | 24px |
| Input | 36px | 12px |
| Nav header | 56px | 20px |
| Sidebar width (expanded) | — | 224px |
| Sidebar width (collapsed) | — | 60px |

---

## 7. Interaction States

All interactive components must define these states consistently:

| State | Implementation |
|---|---|
| Default | Base styles |
| Hover | `hover:bg-accent` or `hover:opacity-90` |
| Focus | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Active | `active:scale-[0.98]` on buttons |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Loading | Spinner replaces/joins label; button disabled |
| Error | `border-destructive`, `text-destructive` for message |
| Success | `text-success`, green border where applicable |

---

## 8. Component Inventory

### Atoms (`components/atoms/`)
| Component | Status | Variants |
|---|---|---|
| Button | ✅ | primary, secondary, ghost, danger, outline, link × sm/md/lg/icon |
| Input | ✅ | default, with addons, error, disabled |
| Label | ✅ | Radix Label primitive |
| Badge | ✅ | default, primary, success, warning, danger, info, outline |
| Avatar | ✅ | sm/md/lg with image/fallback |
| Separator | ✅ | horizontal/vertical |
| Spinner | ✅ | sm/md/lg |
| Skeleton | ✅ | any shape |
| Card | ✅ | Header/Body/Footer sub-components |
| Icon | ✅ | Lucide wrapper, size/stroke consistent |

### Molecules (`components/molecules/`)
| Component | Status | Notes |
|---|---|---|
| FormField | ✅ | Input + label + error + hint |
| SearchField | ✅ | Input + search icon + clear |
| PasswordField | ✅ | Input + toggle visibility |
| SelectField | ✅ | Native select + label + error |
| Pagination | ✅ | Prev/next/page buttons |

### Organisms (`components/organisms/`)
| Component | Status | Notes |
|---|---|---|
| AppHeader | ✅ | Search, theme toggle, notifications, user menu |
| Sidebar | ✅ | Collapsible, icon-only, tooltip, groups |
| LoginForm | ✅ | Figma-matched: GitHub/Google + email/password |
| SummaryCard | ✅ | Metric card with trend |
| PageHeader | ✅ | Title + breadcrumb + action slot |
| DataCard | ✅ | Card wrapping tabular/list data |

### Templates (`templates/`)
| Template | Status | Notes |
|---|---|---|
| AuthLayout | ✅ | Split panel, branding left |
| DashboardLayout | ✅ | Sidebar + AppHeader + Outlet |
| SettingsLayout | ✅ | Side nav + content |

### Pages (`pages/`)
| Page | Status | Route |
|---|---|---|
| Dashboard | ✅ | `/dashboard` |
| Login | ✅ | `/login` |
| ComponentShowcase | ✅ | `/dashboard/components` |
| FormExamples | ✅ | `/dashboard/forms` |
| NotFound | ✅ | `*` |

---

## 9. Icon System

Library: **Lucide React** (single source — no other icon libraries).

Rules:
- Default size: `h-4 w-4` (16px) inline, `h-5 w-5` (20px) in nav
- Stroke width: Lucide default (2px)
- Always `aria-hidden="true"` on decorative icons
- Use `Icon` atom wrapper for consistent sizing

---

## 10. Responsive Breakpoints

| Breakpoint | Width | Behaviour |
|---|---|---|
| `sm` | 640px | Mobile → tablet transition |
| `md` | 768px | Single column → two column |
| `lg` | 1024px | Sidebar becomes static |
| `xl` | 1280px | Content max-width active |

Sidebar: fixed overlay on mobile, static on `lg+`.  
Grid: `grid-cols-1` → `sm:grid-cols-2` → `xl:grid-cols-4` for stat cards.

---

## 11. Theme Strategy

- Dark mode: `.dark` class on `<html>` (class-based, not `prefers-color-scheme`)
- No-flash: inline script in `index.html` reads `localStorage.getItem("theme")` before first paint
- `ThemeProvider` syncs React state with DOM class
- All components use semantic tokens (`bg-background`, not `bg-[#fafafa]`)
- Exception: sidebar always uses dark surface colours regardless of theme

---

## 12. Design-system Rules (Enforcement)

1. **One source of truth for tokens** — only `globals.css` defines `:root` / `.dark` variables.
2. **No hardcoded colours in components** — always use semantic tokens.
3. **Extend, don't duplicate** — add a `variant` to an existing atom, not a new component.
4. **Dependency direction** — Pages → Templates → Organisms → Molecules → Atoms. Never up.
5. **shadcn CLI target** — `components.json` routes `npx shadcn add` to `components/atoms/`.
6. **Icon library** — Lucide only. One consistent stroke/size.
7. **Spacing** — use Tailwind scale (multiples of 4px). No `px-[17px]`.
8. **Border radius** — `rounded-md` for controls, `rounded-xl` for cards.
9. **Focus rings** — always `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
10. **Loading state** — spinner in button, skeleton for async content, never blank space.

---

## 13. Figma Access Limitations

- `get_variable_defs` requires an active layer selection in Figma desktop app — unavailable in CI/headless environments.
- Token values confirmed via `get_design_context` on specific component nodes (Button, Input, Card).
- Dark mode token values sourced from standard shadcn/ui zinc-950 palette (Figma theming docs confirm this is the base).
- Social auth icons (GitHub/Google) referenced as SVG inline in `LoginForm` — Figma exports were session-limited URLs.
