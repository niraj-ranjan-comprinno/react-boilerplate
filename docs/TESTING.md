# Testing

## 1. Testing Goals

Critical functionality that must always have tests:
- Authentication service (login, logout, session persistence)
- Form validation (error messages, required fields, aria attributes)
- UI components (render, interactions, accessibility attributes)
- Utility functions (mask, cn, formatters)
- React hooks (useAuth, state transitions)

## 2. Test Types

### Unit Testing
Test utility functions, business logic, atoms, molecules, and hooks in isolation.
Tools: Vitest + @testing-library/react + @testing-library/user-event

### Integration Testing
Test auth flow, service layer, hook + provider combinations.
Currently covered by `use-auth.test.tsx` + `auth.service.test.ts`.

### End-to-End Testing
Not yet implemented. Target: Playwright for the full auth flow.
- Navigate to `/`
- Complete splash → login → MFA → voice → dashboard
- Verify dashboard loads

## 3. Testing Tools

Unit + Integration: Vitest (`npm run test`)
DOM: jsdom (configured in `vitest.config.ts`)
Render: @testing-library/react
User interaction: @testing-library/user-event
Matchers: @testing-library/jest-dom
E2E (future): Playwright

## 4. Test File Structure

```
src/tests/
  atoms/
    button.test.tsx      ✅
    badge.test.tsx       ✅
    checkbox.test.tsx    ✅
    error-boundary.test.tsx ✅
    input.test.tsx       ✅
    switch.test.tsx      ✅
  hooks/
    use-auth.test.tsx    ✅
  lib/
    mask.test.ts         ✅
  molecules/
    FormField.test.tsx   ✅
    Pagination.test.tsx  ✅
  services/
    auth.service.test.ts ✅
```

## 5. Critical User Flows

### Flow: Login with email/password
Steps:
1. Navigate to `/`
2. Click "Get started" (SplashPhase)
3. Enter `alex@example.com` / `password123`
4. Click "Sign in" (IdpPhase)
5. Type any 6 digits (MfaPhase — auto-verifies)
6. Click mic button, wait 2.6s (VoiceVerifyPhase)
Expected result: Redirected to `/dashboard`, NavRail visible, dashboard content loads.

### Flow: Wrong credentials
Steps:
1. Navigate to `/login`
2. Enter wrong email or password
3. Click "Sign in"
Expected result: Error banner shown, sphere turns red (`alert` state), resets to `ambient` after 2s.

### Flow: Component docs navigation
Steps:
1. Navigate to `/dashboard/docs`
2. Click a component card
Expected result: Navigates to `/dashboard/components` or relevant showcase section.

## 6. Coverage

Current: 72 tests across 11 files.
Target: 80%+ for atoms, molecules, hooks, and services.

Prioritize:
- Auth service (login/logout/session)
- Form molecules (validation, aria)
- Atoms used in critical paths (Button, Input, Checkbox, Badge)
- useAuth hook (authentication state transitions)
- Utility functions (mask, cn, formatDate)

Not required:
- Pure presentational atoms with no logic (Skeleton, Separator)
- Storybook-style visual tests (not yet set up)

## 7. Commands

```bash
npm run test          # vitest run (single pass, CI-safe)
npm run test:watch    # vitest (interactive watch)
npm run lint          # eslint . (0 errors required)
npm run typecheck     # tsc --noEmit (0 errors required)
npm run build         # tsc -b && vite build (full validation)
```

## 8. Writing a New Test

```tsx
// src/tests/atoms/my-atom.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MyAtom } from "@/components/atoms/my-atom";

describe("MyAtom", () => {
  it("renders children", () => {
    render(<MyAtom>Hello</MyAtom>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<MyAtom onClick={handler}>Click</MyAtom>);
    await user.click(screen.getByText("Click"));
    expect(handler).toHaveBeenCalledOnce();
  });
});
```

## 9. Definition of Done

- [ ] Tests pass (`npm run test` — all green)
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint` — 0 errors)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Critical user flow verified (at least manually)
- [ ] No blocking errors in browser console
