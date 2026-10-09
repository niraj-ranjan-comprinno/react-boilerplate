import { z } from "zod";

/**
 * Reusable Zod schemas for common form patterns.
 * Compose these inside feature-level schemas to avoid rewriting validation.
 *
 * @example
 * import { emailSchema, passwordSchema } from "@/lib/schemas";
 * const loginSchema = z.object({ email: emailSchema, password: passwordSchema });
 */

/** Standard email field. */
export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

/** Password with minimum security requirements. */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be fewer than 128 characters.");

/** Non-empty single-line text. */
export const requiredStringSchema = (fieldName = "This field") =>
  z.string().min(1, `${fieldName} is required.`);

/** Optional text — empty string coerced to undefined. */
export const optionalStringSchema = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

/** Positive integer (page number, quantity, etc.). */
export const positiveIntSchema = z
  .number({ invalid_type_error: "Must be a number." })
  .int("Must be a whole number.")
  .positive("Must be greater than 0.");

// ── Ready-made schemas ────────────────────────────────────────────────────

/** Login form. */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

/** Generic search / filter bar. */
export const searchSchema = z.object({
  query: z.string().optional(),
});
export type SearchFormValues = z.infer<typeof searchSchema>;

/** Profile update form. */
export const profileSchema = z.object({
  name: requiredStringSchema("Name"),
  email: emailSchema,
  bio: optionalStringSchema,
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
