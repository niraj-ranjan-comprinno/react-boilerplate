import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/organisms/LoginForm";
import { Sphere } from "@/components/atoms/sphere";
import { Logo } from "@/assets/Logo";
import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/app/router/routes";
import type { LoginFormValues } from "@/lib/schemas";
import type { SphereState } from "@/components/atoms/sphere";
import { cn } from "@/lib/utils";

/**
 * Page: Login
 *
 * Full-screen layout aligned with command-center-main IdpLoginScreen:
 *  - Fixed inset-0, centered content
 *  - Radial gradient background tint
 *  - Entrance animation (opacity + translateY on mount)
 *  - Animated Sphere identity orb — state-driven (ambient → processing → alert/speaking)
 *  - LoginForm organism handles signin / forgot / sent views internally
 */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [sphereState, setSphereState] = useState<SphereState>("ambient");
  const [serverError, setServerError] = useState<string | undefined>();

  // Entrance animation on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(values: LoginFormValues) {
    setServerError(undefined);
    setSphereState("processing"); // sphere pulses blue-teal while loading
    try {
      await login({ email: values.email, password: values.password });
      setSphereState("speaking");
      navigate(routes.dashboard, { replace: true });
    } catch (err) {
      setSphereState("alert");
      setTimeout(() => setSphereState("ambient"), 2000);
      setServerError(
        err instanceof Error ? err.message : "Sign in failed. Please try again."
      );
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Subtle radial tint — aligned with CC background treatment */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Content column — entrance animation */}
      <div
        className={cn(
          "relative flex flex-col items-center gap-8 w-full max-w-sm px-6",
          "transition-all duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-1">
          <Logo collapsed />
          <p className="tracking-[0.35em] text-foreground/30 text-xs uppercase font-medium select-none mt-1">
            Boilerplate
          </p>
        </div>

        {/* Sphere — animated identity orb, state-driven */}
        <Sphere state={sphereState} size="md" />

        {/* Form organism — handles signin / forgot / sent views */}
        <LoginForm
          onSubmit={handleSubmit}
          error={serverError}
          className="w-full"
        />

        {/* Demo hint */}
        <p className="text-center text-xs text-muted-foreground">
          Demo:{" "}
          <span className="font-mono text-foreground/80">alex@example.com</span>
          {" · "}
          <span className="font-mono text-foreground/80">password123</span>
        </p>
      </div>
    </div>
  );
}
