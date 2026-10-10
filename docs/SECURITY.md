# Security Guidelines

> ⚠️ This boilerplate uses **mock authentication** (localStorage).
> All sections below describe the TARGET security posture when connected to a real backend.
> Replace `src/services/auth.service.ts` before shipping to production.

## 1. Authentication

Authentication Provider: [Replace with Supabase / Auth0 / custom JWT]
Methods:
- Email/password (currently mocked)
- Google OAuth (currently mocked)
- GitHub OAuth (currently mocked)
- MFA — TOTP 6-digit code (currently simulated, auto-accepts any 6 digits)
- Voice verification (currently simulated)

## 2. Authorization

Roles: admin, editor, viewer (defined in `src/types/auth.ts`)
Permissions:
### admin
- Full access to all routes and features
### editor
- Read + write own resources
### viewer
- Read-only access

Authorization MUST be enforced server-side. Client-side role checks (e.g. in ProtectedRoute) are UX-only — they can be bypassed. Never trust client-sent role claims.

## 3. Secrets

- Never hard-code credentials in source files
- Never commit `.env.local` (it is in `.gitignore`)
- Never expose VERCEL_TOKEN or VERCEL_PROJECT_ID to the frontend
- Use `src/lib/env.ts` as the only place to read `import.meta.env.*`
- Rotate immediately if any secret is accidentally committed

## 4. Environment Variables

Public (safe to expose to browser — prefix `VITE_`):
- `VITE_API_URL` — backend base URL
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID
- `VITE_ENABLE_MFA` — feature flag
- `VITE_ENABLE_VOICE_VERIFY` — feature flag

Private (GitHub Actions only — never in Vite):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 5. API Security (when real backend is connected)

Input validation: Validate all inputs server-side with Zod schemas mirroring frontend
Rate limiting: Apply on login endpoint (max 5 attempts / 15 min)
CORS: Restrict to known frontend origins
Authentication: JWT in httpOnly cookies (not localStorage — XSS-safe)
Authorization: Check role on every protected endpoint

## 6. Data Protection

Sensitive data: passwords, tokens, session data
Encryption: HTTPS everywhere; passwords hashed with bcrypt on server
Retention: Tokens expire; sessions invalidated on logout
Deletion: User-requested account deletion must purge all PII

## 7. Logging

Never log:
- Passwords
- API keys
- JWT tokens
- OTP codes
- Personally identifiable information

Log:
- Authentication events (login, logout, failed attempts)
- MFA verification results (pass/fail — not the code)
- Security events (unexpected role escalation, rate limit hit)

## 8. File Uploads

Not implemented in current boilerplate.
When added:
- Allow: jpg, png, pdf only
- Maximum size: 10 MB
- Validate MIME type server-side (not just extension)
- Store in S3/R2, never serve from app server

## 9. Current Mock Auth Risks

The following apply to the current boilerplate state and must be fixed before production:

| Risk | Impact | Fix |
|---|---|---|
| User stored in `localStorage` | XSS can steal session | Use httpOnly cookie JWT |
| Any 6 digits passes MFA | No real verification | Integrate real TOTP |
| Hardcoded demo passwords | Credential exposure | Remove demo hints |
| No rate limiting on login | Brute force possible | Add server-side limiting |

## 10. Security Checklist

- [x] No secrets in source code
- [x] `.env.local` in `.gitignore`
- [x] Environment variable access centralised in `src/lib/env.ts`
- [x] TypeScript strict mode — catches type-unsafe API calls
- [ ] Real authentication (httpOnly JWT) — pending backend
- [ ] Server-side authorization — pending backend
- [ ] Rate limiting — pending backend
- [ ] File upload validation — not yet implemented
- [ ] Sentry / error reporting without PII exposure — pending
