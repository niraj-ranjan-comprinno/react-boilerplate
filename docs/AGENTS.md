# AI Coding Agent Instructions

## 1. Project Context

Project: react-boilerplate
Purpose: Production-ready React 19 + TypeScript + shadcn/ui boilerplate with Atomic Design,
full auth flow (Splash → Login → MFA → Voice → Dashboard), CC-style dark design, 28 atoms,
component docs page, and CI/CD.
Primary Users: Frontend developers and AI coding agents implementing product features.

## 2. Source of Truth

Before making significant changes, read relevant documentation in `/docs`:

- `PRD.md` — what we are building and why
- `DESIGN_SYSTEM.md` — visual language, tokens, component rules
- `ARCHITECTURE.md` — folder structure, layer rules, dependency direction
- `SECURITY.md` — auth approach, secret handling, mock vs production
- `CODE_STYLE.md` — naming, imports, do/don't rules
- `TESTING.md` — test tools, commands, how to write a test

Do not contradict these documents without first identifying the conflict.

## 3. General Rules

- Read existing code before modifying it — do not guess at patterns
- Reuse existing atoms before creating new ones (check `src/components/atoms/index.ts`)
- Follow the Atomic Design dependency direction: Pages → Templates → Organisms → Molecules → Atoms
- Never use hardcoded hex colors in components — always use semantic tokens
- Never import from a higher layer (atom importing an organism is forbidden)
- Never access `import.meta.env` directly — use `src/lib/env.ts`
- Never add a new icon library — Lucide only, via the `Icon` atom
- Avoid unnecessary dependencies
- Avoid changing unrelated files

## 4. Before Implementing a Feature

1. Read `ARCHITECTURE.md` — identify which layer the feature belongs to
2. Read `CODE_STYLE.md` — confirm naming and import conventions
3. Inspect existing similar code — match the established pattern
4. Identify affected files (component, test, barrel export, route if needed)
5. Check if a similar atom/molecule/organism already exists
6. Create a concise implementation plan before writing code

## 5. Implementation Rules

- Add new atoms to: `src/components/atoms/<name>.tsx` + export in `src/components/atoms/index.ts`
- Add new molecules to: `src/components/molecules/<Name>.tsx` + barrel
- Add new organisms to: `src/components/organisms/<Name>/` folder
- Add new pages to: `src/pages/<Name>/<Name>Page.tsx` + barrel + route in `router/index.tsx` + route constant in `router/routes.ts`
- Add new design tokens to: `src/styles/globals.css` only — not inline in components
- All className merging must use `cn()` from `@/lib/utils`
- All forms must use `useZodForm()` from `@/hooks/use-zod-form`
- All Zod schemas go in `src/lib/schemas.ts` unless feature-specific

## 6. After Implementation

Run all checks in this order:

```bash
npm run build      # must succeed with 0 errors
npm run lint       # must show 0 errors (warnings OK)
npm run typecheck  # must show 0 errors
npm run test       # all tests must pass
```

If any check fails, fix it before reporting completion.

## 7. Component Creation Checklist

When adding a new atom:
- [ ] File in `src/components/atoms/<name>.tsx`
- [ ] Uses semantic tokens (no hardcoded hex)
- [ ] Exported from `src/components/atoms/index.ts`
- [ ] Uses `cn()` for className merging
- [ ] Has TypeScript interface for props
- [ ] Has at least one test in `src/tests/atoms/`

When adding a new page:
- [ ] File in `src/pages/<Name>/<Name>Page.tsx`
- [ ] Barrel `index.ts` exports it
- [ ] Route added in `src/app/router/index.tsx` (lazy-loaded)
- [ ] Route constant added in `src/app/router/routes.ts`
- [ ] Nav item added in `src/templates/DashboardLayout.tsx` (if dashboard page)
- [ ] Uses `<PageHeader>` organism at the top of the page
- [ ] Wrapped in `<ErrorBoundary>` in the router

## 8. Design Token Rules

Always use semantic tokens. Never use arbitrary values when a token exists.

| Pattern | ✅ Token | ❌ Hardcoded |
|---|---|---|
| Text | `text-foreground` | `text-[#27272a]` |
| Muted text | `text-muted-foreground` | `text-[#52525b]` |
| Primary | `bg-primary text-primary-foreground` | `bg-[#3d5bff] text-white` |
| Border | `border-border` | `border-[#e4e4e7]` |
| Surface | `bg-card` | `bg-[#ffffff]` |
| Sidebar | `bg-sidebar` | `bg-[#18181b]` |
| Success | `text-success bg-success-soft` | `text-[#22c55e]` |

## 9. Conflict Handling

If requirements in different documents conflict:
- Do not guess or silently choose one
- Identify the conflict explicitly
- Ask for clarification before proceeding

## 10. Completion Criteria

A task is complete only when:
- [ ] Requirements are satisfied
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npm run lint` shows 0 errors
- [ ] `npm run typecheck` shows 0 errors
- [ ] `npm run test` — all tests pass
- [ ] No unintended files changed
- [ ] Security rules respected (no hardcoded secrets, no exposed tokens)
- [ ] Documentation updated if behavior changed
