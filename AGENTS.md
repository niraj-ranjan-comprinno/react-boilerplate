# AI Coding Agent — Root Instructions

This file is discovered automatically by AI coding tools (Kiro, Cursor, Claude, Copilot).
Full detailed instructions live in `/docs/AGENTS.md`.

## Quick Reference

Project: React Boilerplate (React 19 + TypeScript + shadcn/ui)
Stack: Vite · Tailwind v4 · React Router v6 · Vitest
Architecture: Atomic Design (Atoms → Molecules → Organisms → Templates → Pages)

## Core Documents

Read these before implementing any non-trivial feature:

| Document | Read when |
|---|---|
| `docs/PRD.md` | Understanding what we're building |
| `docs/DESIGN_SYSTEM.md` | Adding UI components or changing styles |
| `docs/ARCHITECTURE.md` | Adding files, routes, or new layers |
| `docs/DATABASE.md` | Touching data persistence or types |
| `docs/SECURITY.md` | Auth, secrets, environment variables |
| `docs/CODE_STYLE.md` | Before writing any code |
| `docs/TESTING.md` | Before adding or changing tests |
| `docs/AGENTS.md` | Full agent instructions |

## Hardcoded Rules (always apply)

1. **No hardcoded hex in components.** Use semantic tokens: `text-muted-foreground` not `text-[#52525b]`
2. **Dependency direction.** Pages → Templates → Organisms → Molecules → Atoms. Never reverse.
3. **Lucide icons only.** Use `<Icon icon={X} />` atom wrapper.
4. **No direct `import.meta.env`.** Use `src/lib/env.ts`.
5. **Reuse before creating.** Check `src/components/atoms/index.ts` before adding a new atom.

## Validation (run after every change)

```bash
npm run build      # 0 errors required
npm run lint       # 0 errors required
npm run typecheck  # 0 errors required
npm run test       # all tests must pass
```

Do not report a task complete unless all four checks pass.
