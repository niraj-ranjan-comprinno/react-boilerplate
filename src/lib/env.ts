/**
 * Typed, validated environment variable access.
 *
 * All `VITE_*` variables are inlined at build time by Vite.
 * Accessing them through this module gives you:
 *   - A single place to see what the app expects
 *   - TypeScript types
 *   - Clear runtime error if a required variable is missing in production
 *
 * Add new variables here — never access `import.meta.env.*` directly in components.
 */

function required(key: string): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  if (!value && import.meta.env.PROD) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value ?? "";
}

function optional(key: string, fallback = ""): string {
  return (import.meta.env as Record<string, string | undefined>)[key] ?? fallback;
}

function bool(key: string, fallback = false): boolean {
  const raw = optional(key);
  if (raw === "") return fallback;
  return raw === "true" || raw === "1";
}

export const env = {
  /** Backend API base URL. Required in production. */
  apiUrl: optional("VITE_API_URL", "http://localhost:4000/api"),

  /** Google OAuth client ID for SSO. */
  googleClientId: optional("VITE_GOOGLE_CLIENT_ID"),

  /** Feature: enable MFA verification step. */
  enableMfa: bool("VITE_ENABLE_MFA", true),

  /** Feature: enable voice verification step. */
  enableVoiceVerify: bool("VITE_ENABLE_VOICE_VERIFY", true),

  /** Vite mode: "development" | "production" | "test" */
  mode: import.meta.env.MODE as "development" | "production" | "test",

  /** True in development / Vite dev server. */
  isDev: import.meta.env.DEV,

  /** True in production build. */
  isProd: import.meta.env.PROD,
} as const;

/** Use this helper in auth.service.ts instead of hardcoding the base URL. */
export const API_URL = env.apiUrl;

// Eagerly validate required vars in production to fail fast at startup.
if (import.meta.env.PROD) {
  required("VITE_API_URL");
}
