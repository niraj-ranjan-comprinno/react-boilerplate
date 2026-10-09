/**
 * Centralised route constants.
 * Import from here instead of hard-coding paths in components.
 */
export const routes = {
  home:        "/",
  // Auth flow — each phase has its own URL
  login:       "/login",
  loginMfa:    "/login/mfa",
  loginVoice:  "/login/voice",
  // Dashboard
  dashboard:  "/dashboard",
  analytics:  "/dashboard/analytics",
  projects:   "/dashboard/projects",
  messages:   "/dashboard/messages",
  settings:   "/dashboard/settings",
  components: "/dashboard/components",
  forms:      "/dashboard/forms",
  docs:       "/dashboard/docs",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];
