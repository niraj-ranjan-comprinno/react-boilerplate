import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Sphere } from "@/components/atoms/sphere";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { GoogleIcon, GitHubIcon } from "@/assets/SocialIcons";
import { authService } from "@/services/auth.service";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";
import type { SphereState } from "@/components/atoms/sphere";

type View = "signin" | "forgot" | "sent";

/**
 * Phase 2 — Identity Provider login  (route: /login)
 *
 * On success → navigate to /login/mfa  (passes email in location.state)
 *
 * Important: we call authService.login() here which persists the user to
 * localStorage. After the full flow, VoiceVerifyPhase calls refreshUser()
 * to sync the AuthProvider React state, which triggers GuestRoute to
 * redirect automatically to /dashboard.
 */
export function IdpPhase() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [view, setView] = useState<View>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [signInError, setSignInError] = useState("");
  const [sphereState, setSphereState] = useState<SphereState>("ambient");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  function succeed(resolvedEmail: string) {
    setExiting(true);
    // Navigate to MFA, passing email forward via route state
    setTimeout(
      () => navigate(routes.loginMfa, { state: { email: resolvedEmail } }),
      500
    );
  }

  async function handleGoogle() {
    setLoading("google");
    setSphereState("processing");
    // Mock Google SSO — in production integrate real OAuth
    await new Promise((r) => setTimeout(r, 1400));
    // Persist mock Google user to localStorage
    await authService.login({ email: "larysa@eleken.co", password: "password123" }).catch(() => {
      // If mock google user not in list, fall back to alex
      return authService.login({ email: "alex@example.com", password: "password123" });
    });
    setSphereState("speaking");
    succeed("larysa@eleken.co");
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !email.trim() || !password) return;
    setSignInError("");
    setLoading("email");
    setSphereState("processing");
    try {
      // This persists the user to localStorage
      await authService.login({ email: email.trim(), password });
      setSphereState("speaking");
      succeed(email.trim());
    } catch (err) {
      setSphereState("alert");
      setSignInError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
      setLoading(null);
      setTimeout(() => setSphereState("ambient"), 2000);
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !resetEmail.trim()) return;
    setLoading("reset");
    await new Promise((r) => setTimeout(r, 900));
    setLoading(null);
    setView("sent");
  }

  const anyLoading = !!loading;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)",
        }}
      />

      <div
        className={cn(
          "flex flex-col items-center gap-10 w-full max-w-sm px-6 transition-all duration-500",
          visible && !exiting
            ? "opacity-100 translate-y-0"
            : exiting
              ? "opacity-0 scale-95"
              : "opacity-0 translate-y-5"
        )}
      >
        <p className="tracking-[0.35em] text-foreground/20 text-xs uppercase font-medium select-none">
          Boilerplate
        </p>

        <Sphere state={sphereState} size="md" />

        {view === "signin" && (
          <>
            <div className="text-center">
              <h2 className="text-foreground/80 text-base font-medium tracking-wide">
                Sign in to continue
              </h2>
              <p className="mt-1 text-muted-foreground text-sm">
                Use your organisation account
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <ProviderButton
                icon={<GoogleIcon />}
                label="Continue with Google"
                busy={loading === "google"}
                disabled={anyLoading}
                onClick={handleGoogle}
              />
              <ProviderButton
                icon={<GitHubIcon className="h-4 w-4 text-foreground" />}
                label="Continue with GitHub"
                busy={loading === "github"}
                disabled={anyLoading}
                onClick={() => {
                  setLoading("github");
                  setSphereState("processing");
                  setTimeout(() => { setSphereState("speaking"); succeed("alex@example.com"); }, 1400);
                }}
              />

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">
                  or continue with email
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form
                onSubmit={handleEmailSignIn}
                className="flex flex-col gap-4"
                noValidate
                aria-label="Sign in"
              >
                {signInError && (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {signInError}
                  </p>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="idp-email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="idp-email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={anyLoading}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="idp-password" className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="idp-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={anyLoading}
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setResetEmail(email); setView("forgot"); }}
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
                  disabled={anyLoading || !email.trim() || !password}
                  isLoading={loading === "email"}
                >
                  Sign in
                </Button>
              </form>
            </div>
          </>
        )}

        {view === "forgot" && (
          <>
            <div className="text-center">
              <h2 className="text-foreground/80 text-base font-medium tracking-wide">
                Forgot password?
              </h2>
              <p className="mt-1 text-muted-foreground text-sm max-w-xs">
                Enter the email you used to sign up.
              </p>
            </div>
            <form
              onSubmit={handleResetSubmit}
              className="flex flex-col gap-4 w-full"
              aria-label="Reset password"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  disabled={anyLoading}
                  autoFocus
                />
              </div>
              <Button type="submit" variant="primary" className="w-full" disabled={anyLoading || !resetEmail.trim()} isLoading={loading === "reset"}>
                Send instructions
              </Button>
              <button type="button" onClick={() => setView("signin")} className="self-center text-sm text-primary-ink hover:underline">
                Back to sign in
              </button>
            </form>
          </>
        )}

        {view === "sent" && (
          <>
            <div className="text-center">
              <h2 className="text-foreground/80 text-base font-medium tracking-wide">Check your email</h2>
              <p className="mt-1 text-muted-foreground text-sm">{resetEmail}</p>
            </div>
            <Button variant="primary" className="w-full" onClick={() => setView("signin")}>
              Back to sign in
            </Button>
          </>
        )}

        {/* Demo hint */}
        {view === "signin" && (
          <p className="text-xs text-muted-foreground text-center">
            Demo: <span className="font-mono text-foreground/70">alex@example.com</span> · <span className="font-mono text-foreground/70">password123</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ProviderButton({ icon, label, busy, disabled, onClick }: { icon: React.ReactNode; label: string; busy: boolean; disabled: boolean; onClick: () => void }) {  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={cn("flex items-center gap-3.5 w-full rounded-2xl border px-5 py-3.5", "border-border bg-card hover:bg-muted", "active:scale-[0.98] transition-all duration-200", "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", (busy || disabled) && "pointer-events-none", busy && "opacity-70", !busy && disabled && "opacity-30")}>
      <span className="flex h-6 w-6 items-center justify-center shrink-0">{icon}</span>
      <span className="text-sm text-foreground/70 font-medium flex-1 text-left">{label}</span>
      {busy && <span className="h-3.5 w-3.5 rounded-full border-2 border-border border-t-muted-foreground animate-spin shrink-0" />}
    </button>
  );
}

