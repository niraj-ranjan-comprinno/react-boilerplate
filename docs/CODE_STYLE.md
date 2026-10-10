# Code Style & Conventions

## 1. General Principles

- Prefer readable code over clever code
- Keep components focused on one responsibility
- Avoid unnecessary abstractions — add them only when the pattern repeats 3+ times
- Reuse existing atoms/molecules/organisms before creating new ones
- Prefer consistency over novelty — match the pattern already in the file

## 2. Naming

Components: PascalCase (`Button`, `FormField`, `DashboardPage`)
Functions/hooks: camelCase (`useAuth`, `handleSubmit`, `getPageTitle`)
Variables/constants: camelCase (`isLoading`, `navItems`, `PAYMENT_STATUSES`)
Files:
  - Atoms/Molecules/Organisms: kebab-case (`button.tsx`, `form-field.tsx`)
  - Pages: PascalCase (`DashboardPage.tsx`)
  - Hooks: kebab-case with `use-` prefix (`use-auth.ts`)
  - Barrel files: `index.ts`
CSS custom properties: kebab-case (`--primary-foreground`, `--muted-foreground`)
Routes: kebab-case (`/dashboard/form-examples`)

## 3. Folder Structure Rules

- New atom → `src/components/atoms/<name>.tsx` + export in `src/components/atoms/index.ts`
- New molecule → `src/components/molecules/<Name>.tsx` + export in `index.ts`
- New organism → `src/components/organisms/<Name>/` folder with `<Name>.tsx` + `index.ts`
- New page → `src/pages/<Name>/<Name>Page.tsx` + `index.ts`
- New route → add in `src/app/router/index.tsx`
- New route constant → add in `src/app/router/routes.ts`

## 4. Imports

Order (eslint-enforced): external packages → internal `@/` aliases → relative
Always use `@/` alias: `import { Button } from "@/components/atoms/button"` (not relative `../../`)
Import from barrels when using multiple things from the same layer: `import { Button, Badge } from "@/components/atoms"`
Import directly for single-item: `import { Sidebar } from "@/components/organisms/Sidebar"`

## 5. Components

Components should:
- Accept a `className` prop and pass it with `cn()` for composability
- Use `forwardRef` when the component wraps a DOM element or Radix primitive
- Never use hardcoded hex colors — always use semantic tokens
- Always have explicit prop types (TypeScript interface, not `any`)
- Prefer named exports over default exports

```tsx
// ✅ Good
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = "primary", ...props }, ref) {
    return <button ref={ref} className={cn(buttonVariants({ variant }), className)} {...props} />;
  }
);

// ❌ Bad
export default ({ onClick }) => <button onClick={onClick}>click</button>
```

## 6. Design Token Rule (critical)

**NEVER use hardcoded hex, rgb, or hsl values in component className strings.**

```tsx
// ✅ Good
<p className="text-muted-foreground">subtitle</p>
<div className="bg-primary/15 text-primary">active</div>
<div className="border-border/20">divider</div>

// ❌ Bad
<p className="text-[#52525b]">subtitle</p>
<div className="bg-[#4ccbbf]/15 text-[#4ccbbf]">active</div>
<div className="border-[#27272a]/20">divider</div>
```

Exceptions: Sphere.tsx (canvas animation) and SocialIcons.tsx (brand SVG colors).

## 7. Error Handling

Async functions: always try/catch with meaningful error state
```tsx
try {
  await login(credentials);
} catch (err) {
  setError(err instanceof Error ? err.message : "Something went wrong.");
}
```

Never swallow errors silently. Never `console.log` in production code.
Use `ErrorBoundary` atom around risky subtrees.

## 8. Comments

Comments should explain:
- Why something exists (not what it does — the code shows that)
- Important tradeoffs or non-obvious decisions
- TODOs with context: `// TODO: replace with real JWT when backend is ready`

Avoid:
```tsx
// ❌ Bad — just restates the code
// increment the counter
setCount(c => c + 1);
```

## 9. Formatting

Formatter: Prettier (`.prettierrc` at root)
Linter: ESLint v9 flat config (`eslint.config.mjs`)
Type Checking: TypeScript strict mode (`tsconfig.app.json`)

Run before committing:
```bash
npm run format     # prettier
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## 10. Do

- Reuse existing atoms — check `src/components/atoms/index.ts` first
- Use `cn()` from `@/lib/utils` for all className merging
- Add new Zod schemas to `src/lib/schemas.ts` (not inline in components)
- Use `useZodForm()` hook for all React Hook Form instances
- Export new components from their layer's `index.ts` barrel

## 11. Don't

- Don't create a new Button/Input/Card if one already exists — add a variant
- Don't install a new icon library — use Lucide only, via the `Icon` atom
- Don't access `import.meta.env` directly — use `src/lib/env.ts`
- Don't import from a higher layer (e.g. atom importing an organism)
- Don't add `any` types — use `unknown` and narrow, or add proper interfaces
- Don't change unrelated files when implementing a feature
