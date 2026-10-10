# Architecture

## 1. System Overview

Client-only SPA (Single Page Application). No server-side rendering. All auth is mock
(localStorage). The service layer (`src/services/`) is the clear boundary — replace it
with real API calls without touching any UI component.

## 2. Architecture Pattern

Pattern: Atomic Design layered SPA
Reason: Enforces clear component responsibilities, prevents UI inconsistency, makes
AI-agent contributions predictable.

## 3. Technology Stack

Frontend: React 19 + TypeScript
Build Tool: Vite 6
Styling: Tailwind CSS v4 (`@tailwindcss/vite` plugin)
Component Primitives: shadcn/ui (Radix UI under the hood)
Routing: React Router v6
Forms: React Hook Form + Zod
Icons: Lucide React (single library, no others)
Toasts: Sonner
OTP Input: input-otp
Animation: CSS keyframes in globals.css (Sphere, accordion, Radix animations)
Testing: Vitest + @testing-library/react
Linting: ESLint v9 (flat config) + Prettier
CI/CD: GitHub Actions → Vercel

## 4. System Components

### Atoms (`src/components/atoms/`)
Responsibilities:
- Smallest self-contained UI primitives
- No business logic
- No imports from higher layers
- Must use semantic design tokens (no hardcoded hex)

### Molecules (`src/components/molecules/`)
Responsibilities:
- Compose 2–3 atoms with coordinated behaviour
- No routing, no API calls
- No organism/template/page imports

### Organisms (`src/components/organisms/`)
Responsibilities:
- Complete, self-contained UI sections
- May use hooks, context, routing
- No template/page imports

### Templates (`src/templates/`)
Responsibilities:
- Page layout shells
- Render `<Outlet />` or `children`
- No data fetching

### Pages (`src/pages/`)
Responsibilities:
- One per route
- Connect template + organisms + typed mock/real data
- Handle page-level state and user actions

### Services (`src/services/`)
Responsibilities:
- All API/auth calls go through here
- UI components never call fetch/localStorage directly
- Swap implementation here to change from mock to real backend

### Hooks (`src/hooks/`)
Responsibilities:
- Cross-layer reusable React hooks
- May be imported by any layer

## 5. Architecture Diagram

```
User
  ↓
React Router (BrowserRouter)
  ↓
GuestRoute / ProtectedRoute (guards in router/index.tsx)
  ↓
Templates (DashboardLayout / AuthLayout / SettingsLayout)
  ↓
Organisms (NavRail, LoginForm, DataCard, SummaryCard…)
  ↓
Molecules (FormField, SearchField, Pagination…)
  ↓
Atoms (Button, Input, Badge, Avatar…)
  ↓
Design Tokens (CSS variables in src/styles/globals.css)
```

## 6. Data Flow

1. User navigates to route
2. GuestRoute / ProtectedRoute checks `useAuth()` (reads AuthContext)
3. AuthProvider rehydrates from `authService.getPersistedUser()` (localStorage)
4. If authenticated → render requested page
5. If not → redirect to `/` (SplashPhase)
6. After auth flow completes → `refreshUser()` called → AuthContext updates → GuestRoute auto-redirects to /dashboard

## 7. Project Structure

```
src/
  app/
    providers/       ← ThemeProvider, AuthProvider
    router/          ← AppRouter, route constants, guards
  assets/            ← Logo.tsx, SocialIcons.tsx
  components/
    atoms/           ← 28 primitive UI components
    molecules/       ← 5 composed molecules
    organisms/       ← 6 complete UI sections
  hooks/             ← use-auth, use-dark-mode, use-zod-form, etc.
  lib/               ← cn(), schemas, mask, env
  pages/
    AuthFlow/        ← 4 auth phases (each has own route)
    Dashboard/
    ComponentShowcase/
    FormExamples/
    Docs/
    NotFound/
  services/          ← auth.service.ts (swap for real API here)
  styles/            ← globals.css (single source for tokens)
  templates/         ← DashboardLayout, AuthLayout, SettingsLayout
  tests/             ← mirrors src/ structure
  types/             ← shared TypeScript interfaces
```

## 8. Dependency Rules

- Pages → Templates → Organisms → Molecules → Atoms (never reverse)
- Any layer may import from: hooks/, lib/, services/, types/, assets/
- Atoms must NEVER import from molecules, organisms, templates, or pages
- Molecules must NEVER import from organisms, templates, or pages
- No circular imports

## 9. Key Technical Decisions

Decision: Tailwind v4 with `@tailwindcss/vite` (not PostCSS)
Reason: Cleaner Vite integration, no tailwind.config.ts needed, CSS-first configuration.

Decision: CSS variables in `@theme inline {}` for design tokens
Reason: Enables `bg-primary/50` alpha variants and runtime theme switching without recompilation.

Decision: Route-based auth flow (separate URL per phase)
Reason: URL changes give users browser back-button behaviour and clear navigation state. Phase state was passed via `location.state`.

Decision: `refreshUser()` in AuthContext instead of direct `navigate()` after voice verify
Reason: `GuestRoute` detects `isAuthenticated` change and auto-redirects — cleaner than explicit navigation.

Decision: Vitest + @testing-library (not Jest)
Reason: Native Vite integration, faster, no extra transpilation.

## 10. Performance Considerations

- All routes are lazy-loaded (React.lazy + Suspense)
- Sphere canvas animation uses `requestAnimationFrame` and cleans up on unmount
- No global state management library — AuthContext + ThemeContext are sufficient

## 11. Scalability Considerations

- Services layer is the extension point for real API integration
- `src/lib/env.ts` centralises all environment variable access
- Atomic Design prevents component duplication as feature count grows

## 12. Failure Scenarios

- Auth service unavailable → mock service always succeeds; real service should show error state via `useAuth().login()` rejection
- Route navigated directly without auth state → ProtectedRoute redirects to `/`
- Render error in any page → ErrorBoundary shows recovery UI and logs to console (replace with Sentry in production)
- Token missing in Vercel deploy workflow → CI fails with clear error; add VERCEL_TOKEN secret
