# Database

> ⚠️ This boilerplate has **no real database**.
> All persistence is localStorage via `src/services/auth.service.ts`.
> This document describes the intended data model for when a real backend is connected.

## 1. Database Engine

Database: [TBD — PostgreSQL recommended for production]
Hosting: [TBD — Supabase / Railway / Neon]
ORM: [TBD — Prisma recommended]

## 2. Current Storage

All current persistence uses browser `localStorage`:

| Key | Value | Purpose |
|---|---|---|
| `auth_user` | JSON `User` object | Persisted session |
| `theme` | `"light"` / `"dark"` / `"system"` | Theme preference |

These are cleared on `authService.logout()`.

## 3. Naming Conventions (when real DB is added)

Tables: `snake_case` plural (e.g. `users`, `projects`, `sessions`)
Columns: `snake_case` (e.g. `created_at`, `user_id`)
Primary Keys: `id` (UUID)
Foreign Keys: `<table_singular>_id` (e.g. `user_id`)
Timestamps: `created_at`, `updated_at` on all tables

## 4. Data Model

### users
Purpose: Authenticated user accounts
Fields: `id`, `email`, `name`, `role`, `avatar_url`, `created_at`, `updated_at`
Roles: `admin` | `editor` | `viewer`

```typescript
// Current TypeScript shape (src/types/auth.ts)
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
}
```

### sessions (future)
Purpose: Track active user sessions for multi-device logout
Fields: `id`, `user_id`, `token_hash`, `device`, `created_at`, `expires_at`

## 5. Relationships

users → sessions: One user can have many active sessions.
(future) users → projects: One user can own many projects.

## 6. Constraints

Required: `users.email`, `users.name`, `users.role`
Unique: `users.email`
Foreign Keys: `sessions.user_id → users.id`

## 7. Data Validation

- `users.email`: valid email format (enforced by Zod `emailSchema` in `src/lib/schemas.ts`)
- `users.role`: must be one of: `admin`, `editor`, `viewer`
- `users.name`: min 2 characters

## 8. Soft Delete

Not implemented in current version.
If added: add `deleted_at TIMESTAMP NULL` column — null means active.

## 9. Auditing

Not implemented in current version.
If added: `created_by`, `updated_by` columns on mutable tables.

## 10. Sensitive Data

Sensitive fields: `users.email`, session tokens
Protection:
- Passwords: never stored (delegated to auth provider)
- Tokens: httpOnly cookies only — never localStorage in production
- PII: email masked in UI using `maskEmail()` from `src/lib/mask.ts`

## 11. Migration Rules (when Prisma is added)

Schema changes must:
1. Be documented in this file
2. Have a Prisma migration (`npx prisma migrate dev`)
3. Be tested against seed data
4. Avoid breaking existing production data (prefer additive changes)

## 12. Seed Data

Mock users (currently in `src/services/auth.service.ts`):

```typescript
const MOCK_USERS = [
  { id: "usr_1", email: "alex@example.com", password: "password123", role: "admin" },
  { id: "usr_2", email: "sofia@example.com", password: "password123", role: "editor" },
];
```

When a real database is added, these become seed files in `prisma/seed.ts`.
