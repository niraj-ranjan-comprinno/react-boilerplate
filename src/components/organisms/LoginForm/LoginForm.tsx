import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useZodForm } from "@/hooks/use-zod-form";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * View state machine — aligned with command-center-main IdpLoginScreen.
 * signin → forgot → sent  (with back-to-signin path)
 */
type View = "signin" | "forgot" | "sent";

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  error?: string;
  className?: string;
}

// ── Social button (matches CC ProviderButton: rounded-2xl, taller, card-bg) ──

function ProviderButton({
  icon,
  label,
  busy,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  busy?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-3.5 w-full rounded-2xl border px-5 py-3.5",
        "border-border bg-card",
        "hover:bg-muted",
        "active:scale-[0.98] transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        (busy || disabled) && "pointer-events-none",
        busy && "opacity-70",
        !busy && disabled && "opacity-30"
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center shrink-0">
        {icon}
      </span>
      <span className="text-sm text-foreground/70 font-medium flex-1 text-left">
        {label}
      </span>
      {busy && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-border border-t-muted-foreground animate-spin shrink-0" />
      )}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

/**
 * Organism: Login form with 3-view state machine.
 *
 * Aligned with command-center-main IdpLoginScreen:
 *  - signin / forgot / sent view machine
 *  - ProviderButton style (rounded-2xl, full-width, card-bg)
 *  - label + input gap-1.5 convention
 *  - "Forgot password?" self-end link (primary-ink)
 *  - Inline password toggle (Eye/EyeOff)
 */
export function LoginForm({ onSubmit, error, className }: LoginFormProps) {
  const [view, setView] = useState<View>("signin");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useZodForm(loginSchema, {
    defaultValues: { email: "", password: "" },
  });

  function handleSocial(provider: string) {
    setSocialLoading(provider);
    setTimeout(() => setSocialLoading(null), 1500);
  }

  function openForgot() {
    setResetEmail(getValues("email"));
    setView("forgot");
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    await new Promise((r) => setTimeout(r, 900));
    setView("sent");
  }

  const anyLoading = isSubmitting || !!socialLoading;

  return (
    <div className={cn("flex flex-col items-center gap-10 w-full", className)}>
      {/* ── Sign in view ──────────────────────────────────────────────── */}
      {view === "signin" && (
        <>
          <div className="text-center">
            <h1 className="text-foreground/80 text-base font-medium tracking-wide">
              Sign in to continue
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              Use your organisation account
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {/* Social buttons — CC-aligned ProviderButton style */}
            <ProviderButton
              icon={<GoogleIcon />}
              label="Continue with Google"
              busy={socialLoading === "google"}
              disabled={anyLoading}
              onClick={() => handleSocial("google")}
            />
            <ProviderButton
              icon={<GitHubIcon />}
              label="Continue with GitHub"
              busy={socialLoading === "github"}
              disabled={anyLoading}
              onClick={() => handleSocial("github")}
            />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                or continue with email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Email/password form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
              aria-label="Sign in form"
            >
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </div>
              )}

              {/* Email field — label gap-1.5 (CC convention) */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signin-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  disabled={anyLoading}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
                {errors.email && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field with inline toggle */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="signin-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={anyLoading}
                    className="pr-9"
                    aria-invalid={Boolean(errors.password)}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
                {/* Forgot password — self-end, primary-ink colour (CC convention) */}
                <button
                  type="button"
                  onClick={openForgot}
                  className="self-end text-sm text-primary-ink hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
                disabled={anyLoading}
              >
                Sign in
              </Button>
            </form>
          </div>
        </>
      )}

      {/* ── Forgot password view ───────────────────────────────────────── */}
      {view === "forgot" && (
        <>
          <div className="text-center">
            <h1 className="text-foreground/80 text-base font-medium tracking-wide">
              Forgot password?
            </h1>
            <p className="mt-1 text-muted-foreground text-sm max-w-xs">
              Enter the email you used to sign up and we'll send reset instructions.
            </p>
          </div>

          <form
            onSubmit={handleResetSubmit}
            className="flex flex-col gap-4 w-full"
            aria-label="Reset password form"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reset-email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={!resetEmail.trim()}
            >
              Send instructions
            </Button>

            <button
              type="button"
              onClick={() => setView("signin")}
              className="self-center text-sm text-primary-ink hover:underline transition-colors"
            >
              Back to sign in
            </button>
          </form>
        </>
      )}

      {/* ── Email sent view ───────────────────────────────────────────── */}
      {view === "sent" && (
        <>
          <div className="text-center">
            <p className="text-3xl" aria-hidden="true">📬</p>
            <h1 className="mt-3 text-foreground/80 text-base font-medium tracking-wide">
              Check your email
            </h1>
            <p className="mt-1 text-muted-foreground text-sm max-w-xs">
              We've sent reset instructions to{" "}
              <span className="font-medium text-foreground">{resetEmail}</span>.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => setView("signin")}
            autoFocus
          >
            Back to sign in
          </Button>
        </>
      )}
    </div>
  );
}
