# Product Requirements Document

## 1. Product Overview

Product Name: React Boilerplate
One-Line Description: A production-ready React 19 + TypeScript + shadcn/ui starter with Atomic Design, full auth flow, and a CC-style dark dashboard.
Product Type: Developer Boilerplate / Internal Tool
Primary Platform: Web

## 2. Problem

What problem are we solving?
Starting a new React project from scratch wastes days setting up design tokens, component architecture, auth flows, routing, testing, and CI/CD.

Why does this problem matter?
Teams repeatedly solve the same foundational problems instead of focusing on product-specific features.

How are users solving this today?
Manually scaffolding with CRA/Vite, copy-pasting components from shadcn/ui docs, and recreating design systems on every project.

## 3. Goal

Primary Goal: Give developers a fully-wired, production-quality React app they can clone and immediately build product features on top of.

Secondary Goals:
- Demonstrate Atomic Design applied to a real app
- Match command-center-main design language exactly
- Provide a living component library / documentation page

## 4. Target Users

### User Type 1
Name: Frontend Developer
Description: A mid-to-senior React developer starting a new internal tool or SaaS dashboard.
Needs:
- Working auth flow out of the box
- Consistent design system with tokens
- Reusable components following a clear architecture
Pain Points:
- Spending 2+ days on boilerplate setup before writing features
- Inconsistent component styles across a project

### User Type 2
Name: AI Coding Agent (Kiro / Claude / Cursor)
Description: An AI agent that reads this documentation to understand the project before implementing features.
Needs:
- Clear architectural rules
- Explicit component inventory
- Known token values and naming conventions
Pain Points:
- Guessing where files belong
- Inventing new components instead of reusing existing ones

## 5. User Stories

- As a developer, I want to clone the boilerplate and run `npm run dev` to see a working app in < 5 minutes.
- As a developer, I want a complete auth flow so I don't have to build splash/login/MFA/voice screens from scratch.
- As a developer, I want a component library page so I can see all available atoms/molecules/organisms.
- As a developer, I want dark mode by default so the app matches the command-center design aesthetic.
- As an AI agent, I want AGENTS.md to tell me the architecture rules so I don't introduce inconsistencies.

## 6. Core Features

### Feature 1 - Auth Flow (Splash → IDP → MFA → Voice → Dashboard)
Purpose: Complete 4-phase onboarding matching command-center-main.
User Flow: `/` → SplashPhase → "Get started" → `/login` (IdpPhase) → `/login/mfa` (MfaPhase) → `/login/voice` (VoiceVerifyPhase) → `/dashboard`
Inputs: email, password, 6-digit OTP, voice passphrase
Outputs: authenticated session in localStorage, navigation to dashboard
Acceptance Criteria:
- Google + GitHub SSO buttons visible (mock)
- Forgot password → sent confirmation view
- MFA auto-verifies at 6 digits
- Voice: mic button → 2.6s → passes; 3 failures → bypass
- URL changes at each phase
- Sphere animation state-driven (ambient → processing → speaking/alert)
Edge Cases:
- Direct navigation to /login/mfa without going through /login → redirect to /login
- Auth session exists on first load → skip flow, go to /dashboard

### Feature 2 - Dashboard (CC-style 3-column layout)
Purpose: Operational dashboard matching command-center-main dark design.
User Flow: Authenticated user lands on /dashboard
Acceptance Criteria:
- 3-column grid: Revenue/forms/team left, Calendar/chat/forms middle, Charts/table/share right
- NavRail (56px) on the left, no top AppHeader bar
- All cards use design tokens, no hardcoded hex
- Dark by default

### Feature 3 - Component Library (/dashboard/docs)
Purpose: Docs page showing all atoms, molecules, organisms, templates, pages.
Acceptance Criteria:
- Stat row: 28 atoms, 5 molecules, 6 organisms, 3 templates
- Component cards: live preview + description + variant count
- Card clicks navigate to ComponentShowcase section
- Search and section filter work

## 7. Non-Goals

The following are intentionally NOT part of this version:
- Real backend API (all auth is mock localStorage)
- Real MFA / voice verification (both simulated)
- Payments, billing, or subscription features
- Mobile-native app (web only)
- Real-time features (no WebSocket)

## 8. MVP Scope

Must Have:
- Auth flow (Splash → Login → MFA → Voice → Dashboard)
- Design tokens from Figma (shadcn-Tevico)
- Atomic Design structure (atoms/molecules/organisms/templates/pages)
- Dark mode default
- Component showcase + docs page
- CI (GitHub Actions) + Vercel deploy

Nice to Have:
- Storybook with component stories
- Shared monorepo package (@boilerplate/ui)
- E2E tests (Playwright)

Future:
- Real authentication (JWT / httpOnly cookies)
- Real MFA (TOTP via Twilio Authenticator)
- Real voice verification (Web Speech API)

## 9. Success Metrics

Primary Metrics:
- `npm run dev` works in < 2 minutes after clone
- Build: 0 errors
- Lint: 0 errors
- Tests: all pass

Secondary Metrics:
- Component count: 28+ atoms
- Test count: 72+ tests
- Docs page shows all components

## 10. Constraints

Technical: React 19 + Vite + Tailwind v4 — no SSR, no Next.js
Business: Open source boilerplate — no proprietary dependencies
Design: Must match command-center-main visual language exactly
Timeline: Iterative — ship working boilerplate, improve over time

## 11. Assumptions

- Developers using this have React 18+ knowledge
- Node ≥ 20 available (matches command-center engines field)
- Dark mode is the primary experience; light mode is secondary

## 12. Open Questions

- Should the shared `@boilerplate/ui` monorepo package be extracted?
- Should Storybook be added before or after the package extraction?
- Should real auth (Supabase / Auth0) be added as an optional integration?

## 13. Definition of Done

The feature/product is complete when:
- [ ] Requirements are implemented
- [ ] Critical user flows work (auth flow end-to-end)
- [ ] Tests pass (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint clean (`npm run lint` — 0 errors)
- [ ] Type-check clean (`npm run typecheck`)
- [ ] Documentation is updated
