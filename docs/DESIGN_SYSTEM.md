# Design System

> Source of truth for visual language.
> Core dark tokens come from the public Vorflux website at https://vorflux.com/.
> The public source does not expose the private Vorflux application design system.
> Light-mode tokens and the blue scale are accessible companion values.
> All tokens live in ONE file: `src/styles/globals.css`.

## 1. Design Direction

Style: Technical / Minimal / Dark-first
Mood: Focused, professional, and data-dense
Design Principles:
- One source of truth for tokens (globals.css — never inline hex)
- Semantic tokens only in components (`text-muted-foreground` not `text-[#52525b]`)
- Dark mode is the primary experience

## 2. Brand

Brand Name: React Boilerplate
Logo: `src/assets/Logo.tsx` — blue rounded square with "R" + wordmark "ReactUI"
Brand Voice: Direct, technical, developer-focused

## 3. Color Palette

All tokens are CSS custom properties in `src/styles/globals.css`.
Tailwind utilities generated via `@theme inline {}`.

### Semantic tokens (light → dark)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#f7f7f5` | `#0a0a0b` |
| `--foreground` | `#141416` | `#f5f5f2` |
| `--card` | `#ffffff` | `#121214` |
| `--card-foreground` | `#141416` | `#f5f5f2` |
| `--primary` | `#3d5bff` | `#3d5bff` |
| `--primary-foreground` | `#ffffff` | `#ffffff` |
| `--primary-ink` | `#3048db` | `#6b7cff` |
| `--secondary` | `#efefed` | `#1c1c1e` |
| `--muted` | `#efefed` | `#1c1c1e` |
| `--muted-foreground` | `#66666a` | `#8a8a8a` |
| `--accent` | `#e6e9ff` | `#1c1c1e` |
| `--accent-foreground` | `#202f70` | `#f5f5f2` |
| `--destructive` | `#ef4444` (red-500) | `#ef4444` |
| `--border` | `#dededa` | `#1c1c1e` |
| `--input` | `#d1d1cd` | `#2a2a2d` |
| `--ring` | `#3d5bff` | `#3d5bff` |

### Severity scale (critical → low + domain)

| Token | Light | Dark |
|---|---|---|
| `--critical` | `#dc2626` | `#f87171` |
| `--critical-soft` | `#fef2f2` | `#450a0a` |
| `--high` | `#c2410c` | `#fb923c` |
| `--high-soft` | `#fff7ed` | `#431407` |
| `--success` | `#15803d` | `#4ade80` |
| `--success-soft` | `#f0fdf4` | `#052e16` |
| `--warning` | `#f59e0b` | `#fb923c` |
| `--info` | `#0369a1` | `#38bdf8` |
| `--agent` | `#6d28d9` | `#a78bfa` |
| `--takeover` | `#9333ea` | `#c084fc` |

### Sidebar

| Token | Value |
|---|---|
| `--color-sidebar` | `#f2f2f0` light / `#070708` dark |
| `--color-sidebar-hover` | `#e9e9e6` light / `#121214` dark |

## 4. Typography

Sans Font Family: Plus Jakarta Sans (loaded from Google Fonts in `index.html`)
Mono Font Family: Geist Mono (loaded from Google Fonts in `index.html`)

| Scale | Size | Line-height | Weight |
|---|---|---|---|
| `text-xs` | 12px | 16px | 400 |
| `text-sm` | 14px | 20px | 400/500 |
| `text-base` | 16px | 24px | 400 |
| `text-lg` | 18px | 28px | 400 |
| `text-xl` | 20px | 28px | 600 |
| `text-2xl` | 24px | 32px | 600 |
| `text-3xl` | 30px | 36px | 600 |
| `text-4xl` | 36px | 40px | 800 |

Usage rules:
- Page titles: `text-2xl font-bold` or `text-3xl font-bold`
- Section headings: `text-lg font-semibold`
- Card titles: `text-sm font-semibold`
- Labels: `text-sm font-medium`
- Body: `text-sm` or `text-base`
- Captions: `text-xs text-muted-foreground`

## 5. Spacing

Base unit: 4px. Always use Tailwind scale — never arbitrary `px-[17px]`.

| Token | Value |
|---|---|
| `/1` | 4px |
| `/2` | 8px |
| `/3` | 12px |
| `/4` | 16px |
| `/6` | 24px |
| `/8` | 32px |
| `/12` | 48px |

## 6. Border Radius

Confirmed from Figma: `border-radius/rounded-md = 8px`, `border-radius/rounded-xl = 12px`.
`--radius: 0.625rem` (10px) = default for controls.

| Use | Class | Value |
|---|---|---|
| Controls (button, input, select) | `rounded-md` | 8px |
| Cards | `rounded-xl` | 12px |
| Badges, pills | `rounded-full` | 9999px |
| NavRail items | `rounded-lg` | 8px |

## 7. Shadows

Confirmed from Figma `shadow/sm` and `shadow/xs`:

| Name | Value | Usage |
|---|---|---|
| `shadow/xs` | `0 1px 2px rgba(0,0,0,.05)` | Inputs |
| `shadow/sm` | `0 1px 3px rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)` | Cards |
| `shadow/elevated` | `0 4px 6px rgba(0,0,0,.1), 0 2px 4px rgba(0,0,0,.1)` | Modals |

## 8. Buttons

9 variants defined in `src/components/atoms/button.tsx` (cva):

| Variant | Light bg | Dark bg | Usage |
|---|---|---|---|
| `primary` | `bg-primary text-primary-foreground` | same | Main CTA |
| `secondary` | `bg-secondary border` | same | Secondary action |
| `ghost` | transparent | transparent | Tertiary / icon area |
| `danger` | `bg-destructive` | same | Destructive action |
| `outline` | `border bg-background` | same | Outlined |
| `link` | text only, underline | same | Inline links |
| `card` | `bg-card/80 border` | same | CC-style card button |
| `critical-soft` | `bg-critical/20 text-critical` | same | Inline critical action |
| `success` | alias of primary | same | — |

Sizes: `sm` (h-8), `md` (h-9 default), `lg` (h-10), `icon` (h-9 w-9), `icon-sm`, `icon-xs`

Disabled state: `opacity-50 pointer-events-none`
Loading state: spinner replaces label, button disabled

## 9. Inputs

Height: `h-9` (36px) — confirmed from Figma `height/h-9`
Border: `border-input` = `#e4e4e7` light / `#3f3f46` dark
Border radius: `rounded-md` (8px)
Shadow: `shadow-[0_1px_2px_rgba(0,0,0,0.05)]` (Figma shadow/xs)
Font: `text-sm` Plus Jakarta Sans Regular

States:
- Default: `border-input bg-background text-foreground`
- Focus: `ring-2 ring-ring ring-offset-2`
- Error: `border-destructive` + `role="alert"` message below
- Disabled: `opacity-50 cursor-not-allowed`
- Placeholder: `text-muted-foreground`

## 10. Cards

Background: `bg-card`
Border: `border-border` (1px)
Radius: `rounded-xl` (12px)
Shadow: `shadow/sm`
Internal padding: `p-6` (24px) — confirmed Figma `spacing/6`

Sub-components:
- `Card.Header` (compound) or `CardHeader` (named export) — `border-b border-border px-6 py-4`
- `Card.Body` or `CardContent` — `px-6 py-4`
- `Card.Footer` or `CardFooter` — `border-t border-border px-6 py-3`

## 11. Navigation

NavRail (DashboardLayout):
- Width: `w-14` (56px) — always visible, icon-only
- Background: `bg-card/60`
- Active item: `bg-accent text-foreground` + left-edge `h-5 w-0.5 bg-primary` bar
- Inactive item: `text-muted-foreground hover:bg-accent/60 hover:text-foreground`
- Logo: `h-8 w-8 rounded-md bg-primary text-primary-foreground` (LifeBuoy icon)
- UserMenu: Radix Popover at bottom with theme toggle + logout

Sidebar (collapsible, not used in main dashboard):
- Background: `bg-sidebar`
- Same active/inactive patterns as NavRail
- Section labels: `text-muted-foreground/60`

## 12. States

Loading: `<Spinner>` atom (CSS border animation) or `isLoading` prop on `<Button>`
Empty: emoji + heading + description + optional CTA button
Error: `<Alert variant="destructive">` or `<ErrorBoundary>` default UI
Success: `<Alert variant="success">` or toast via `toast.success()`
Disabled: `opacity-50` on container or `disabled` prop on controls

## 13. Icons

Icon Library: Lucide React **only** — never add Bootstrap Icons, Heroicons, etc.
Always use the `Icon` atom wrapper: `<Icon icon={Search} size="sm" />`
Default size: `sm` = `h-4 w-4` (16px)
Nav item size: `md` = `h-5 w-5` (20px)
Stroke width: 2 (Lucide default — do not change)
Decorative icons: always `aria-hidden="true"`
Meaningful icons: always `aria-label="description"`

## 14. Responsive Design

Mobile: single column, NavRail hidden, content full-width
Tablet: two columns for grids
Desktop (`lg+`): three columns, NavRail always visible

Breakpoints (Tailwind defaults):
- Mobile: < 640px
- Tablet: 640–1024px
- Desktop: ≥ 1024px

Dashboard grid: `grid-cols-1 md:grid-cols-3`
Form grids: `grid-cols-1 sm:grid-cols-2`

## 15. Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`, `<aside>`)
- All interactive elements: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Error messages: `role="alert"` + `aria-invalid` on invalid inputs
- Icons: `aria-hidden="true"` (decorative) or `aria-label` (meaningful)
- Navigation: `aria-label` on `<nav>` elements, `aria-current="page"` on active items
- Color: never rely on color alone to convey state — pair with icon or text
- Keyboard: all interactive elements reachable and operable via keyboard
