import { useState } from "react";
import { z } from "zod";
import { useZodForm } from "@/hooks/use-zod-form";
import { PageHeader } from "@/components/organisms/PageHeader";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { Badge } from "@/components/atoms/badge";
import { Spinner } from "@/components/atoms/spinner";
import { FormField } from "@/components/molecules/FormField";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SearchField } from "@/components/molecules/SearchField";
import { SelectField } from "@/components/molecules/SelectField";
import { cn } from "@/lib/utils";

// ── Schemas ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  bio: z.string().max(160, "Bio must be under 160 characters.").optional(),
  role: z.string().min(1, "Please select a role."),
  notify: z.boolean().optional(),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    current: z.string().min(1, "Current password is required."),
    next: z.string().min(8, "Must be at least 8 characters."),
    confirm: z.string().min(1, "Please confirm your password."),
  })
  .refine((v) => v.next === v.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

// ── Section wrapper ────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
      <Separator />
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

/**
 * Page: Form Examples
 *
 * Demonstrates product-wide form patterns:
 *   - Profile form (validation + success state)
 *   - Password change form (cross-field validation)
 *   - Disabled / read-only state
 *   - Loading submission state
 *   - Server error simulation
 *   - Search + Select molecules
 */
export function FormExamplesPage() {
  // ── Profile form state ──
  const [profileStatus, setProfileStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const profileForm = useZodForm(profileSchema, {
    defaultValues: { name: "Alex Johnson", email: "alex@example.com", bio: "", role: "" },
  });

  async function handleProfile(values: ProfileValues) {
    setProfileStatus("loading");
    setServerError(undefined);
    await new Promise((r) => setTimeout(r, 1200));
    if (values.email.includes("fail")) {
      setServerError("This email is already in use. Try a different one.");
      setProfileStatus("error");
    } else {
      setProfileStatus("success");
      setTimeout(() => setProfileStatus("idle"), 3000);
    }
  }

  // ── Password form state ──
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success">("idle");

  const passwordForm = useZodForm(passwordSchema, {
    defaultValues: { current: "", next: "", confirm: "" },
  });

  async function handlePassword(_values: PasswordValues) {
    setPwStatus("loading");
    await new Promise((r) => setTimeout(r, 1000));
    // In production: call your password-change API here
    setPwStatus("success");
    passwordForm.reset();
    setTimeout(() => setPwStatus("idle"), 3000);
  }

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
    { value: "billing", label: "Billing" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-16 px-8 pt-8">
      {/* Page header */}
      <PageHeader
        title="Form Examples"
        description="Demonstrates all form patterns, validation states, and interaction feedback used across the product."
        breadcrumb={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Form Examples" },
        ]}
      />

      {/* ── 1. Profile form — success path ─────────────────────────── */}
      <Section
        title="Profile form"
        description="Validation on submit, loading spinner in the button, success badge. Use email containing 'fail' to trigger a server error."
      >
        <Card>
          <Card.Body>
            <form
              onSubmit={profileForm.handleSubmit(handleProfile)}
              noValidate
              className="space-y-4"
              aria-label="Profile form"
            >
              {/* Server error banner */}
              {serverError && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {serverError}
                </div>
              )}

              {/* Success banner */}
              {profileStatus === "success" && (
                <div
                  role="status"
                  className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
                >
                  ✓ Profile saved successfully.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  label="Full name"
                  placeholder="Alex Johnson"
                  required
                  autoComplete="name"
                  {...profileForm.register("name")}
                  error={profileForm.formState.errors.name?.message}
                />
                <FormField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  {...profileForm.register("email")}
                  error={profileForm.formState.errors.email?.message}
                />
              </div>

              <SelectField
                label="Role"
                placeholder="Select a role…"
                options={roleOptions}
                required
                {...profileForm.register("role")}
                error={profileForm.formState.errors.role?.message}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-foreground">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell us a bit about yourself…"
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm",
                    "bg-background text-foreground placeholder:text-muted-foreground",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.05)] resize-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    profileForm.formState.errors.bio
                      ? "border-destructive"
                      : "border-input"
                  )}
                  {...profileForm.register("bio")}
                />
                {profileForm.formState.errors.bio && (
                  <p role="alert" className="text-xs text-destructive">
                    {profileForm.formState.errors.bio.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Max 160 characters.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="notify"
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-primary"
                  {...profileForm.register("notify")}
                />
                <label htmlFor="notify" className="text-sm text-foreground">
                  Send me product updates by email
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => profileForm.reset()}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={profileStatus === "loading"}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Section>

      {/* ── 2. Password change — cross-field validation ─────────────── */}
      <Section
        title="Password change"
        description="Cross-field validation: confirm must match new password."
      >
        <Card>
          <Card.Body>
            <form
              onSubmit={passwordForm.handleSubmit(handlePassword)}
              noValidate
              className="space-y-4"
              aria-label="Change password form"
            >
              {pwStatus === "success" && (
                <div
                  role="status"
                  className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
                >
                  ✓ Password changed successfully.
                </div>
              )}

              <PasswordField
                label="Current password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...passwordForm.register("current")}
                error={passwordForm.formState.errors.current?.message}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PasswordField
                  label="New password"
                  placeholder="Min 8 characters"
                  autoComplete="new-password"
                  {...passwordForm.register("next")}
                  error={passwordForm.formState.errors.next?.message}
                />
                <PasswordField
                  label="Confirm new password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  {...passwordForm.register("confirm")}
                  error={passwordForm.formState.errors.confirm?.message}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={pwStatus === "loading"}
                >
                  Update password
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Section>

      {/* ── 3. Disabled / read-only states ─────────────────────────── */}
      <Section
        title="Disabled & read-only states"
        description="All controls become non-interactive and visually muted at 50% opacity."
      >
        <Card>
          <Card.Body className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Disabled input"
                value="Cannot be changed"
                disabled
                readOnly
              />
              <SelectField
                label="Disabled select"
                options={roleOptions}
                value="admin"
                disabled
                onChange={() => undefined}
              />
            </div>
            <PasswordField label="Disabled password" disabled placeholder="••••••••" />
            <div className="flex gap-2">
              <Button variant="primary" disabled>Primary disabled</Button>
              <Button variant="secondary" disabled>Secondary disabled</Button>
              <Button variant="ghost" disabled>Ghost disabled</Button>
            </div>
          </Card.Body>
        </Card>
      </Section>

      {/* ── 4. Error states (pre-filled) ───────────────────────────── */}
      <Section
        title="Error states"
        description="Consistent destructive red border, aria-invalid, and role=alert message."
      >
        <Card>
          <Card.Body className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Email"
                type="email"
                value="not-an-email"
                readOnly
                error="Enter a valid email address."
              />
              <SelectField
                label="Role"
                options={roleOptions}
                value=""
                onChange={() => undefined}
                error="Please select a role."
              />
            </div>
            <PasswordField
              label="Password"
              error="Password must be at least 8 characters."
            />
          </Card.Body>
        </Card>
      </Section>

      {/* ── 5. Search field ────────────────────────────────────────── */}
      <Section
        title="Search field"
        description="Debounce-ready molecule with leading icon and clear button."
      >
        <Card>
          <Card.Body className="space-y-3">
            <SearchField
              placeholder="Search users, projects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
            {searchQuery && (
              <p className="text-xs text-muted-foreground">
                Searching for: <span className="font-medium text-foreground">{searchQuery}</span>
              </p>
            )}
          </Card.Body>
        </Card>
      </Section>

      {/* ── 6. Loading state demo ──────────────────────────────────── */}
      <Section
        title="Loading state"
        description="Button spinner, inline spinner, and progress badge together."
      >
        <Card>
          <Card.Body className="flex flex-wrap items-center gap-4">
            <Button variant="primary" isLoading size="md">
              Saving…
            </Button>
            <Button variant="secondary" isLoading size="md">
              Uploading
            </Button>
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-sm text-muted-foreground">Validating…</span>
            </div>
            <Badge variant="default">
              <Spinner size="sm" className="mr-1.5" />
              Processing
            </Badge>
          </Card.Body>
        </Card>
      </Section>
    </div>
  );
}
