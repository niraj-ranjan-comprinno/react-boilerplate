import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mic, ShieldAlert, Check } from "lucide-react";
import { Sphere } from "@/components/atoms/sphere";
import { CallButton } from "@/components/atoms/call-button";
import { useAuth } from "@/hooks/use-auth";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";
import type { SphereState } from "@/components/atoms/sphere";

const PHRASES = [
  "Every secure system begins with a trusted voice.",
  "Clarity of purpose defines every decision I make.",
  "The integrity of this system depends on authenticated access.",
  "I confirm my identity and accept responsibility for this session.",
  "Samantha, initialise verification sequence now.",
];

const MAX_ATTEMPTS = 3;

type Stage = "ready" | "listening" | "passed" | "failed" | "bypassed";

/**
 * Phase 4 — Voice verification  (route: /login/voice)
 *
 * THE CRITICAL STEP that makes the dashboard work:
 *   After the voice check passes, we call `refreshUser()` from the
 *   AuthContext. This re-reads the user that IdpPhase persisted to
 *   localStorage, sets `isAuthenticated = true` in React state, and
 *   causes the wrapping `GuestRoute` to automatically redirect to
 *   `/dashboard` — no explicit navigate() call needed.
 *
 * Guard: if no location.state.email, sends user back to /login.
 */
export function VoiceVerifyPhase() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  const email: string = (location.state as { email?: string })?.email ?? "";

  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("ready");
  const [attempts, setAttempts] = useState(0);
  const [phrase] = useState(
    () => PHRASES[Math.floor(Math.random() * PHRASES.length)]
  );

  // Guard: if arrived without email, go back to login
  useEffect(() => {
    if (!email) navigate(routes.login, { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Enter key shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && (stage === "ready" || stage === "failed")) startListening();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  /**
   * This is the KEY fix:
   * refreshUser() re-reads localStorage (where IdpPhase stored the user)
   * and sets the AuthProvider's user state → isAuthenticated = true.
   * GuestRoute detects this and redirects to /dashboard automatically.
   */
  function succeed() {
    refreshUser();
    // GuestRoute will now redirect to /dashboard. The visual exit
    // animation plays while the redirect is happening.
  }

  function startListening() {
    setStage("listening");
    setTimeout(() => {
      setStage("passed");
      // Small delay so user sees the "passed" state before navigating
      setTimeout(succeed, 900);
    }, 2600);
  }

  function simulateFail() {
    if (stage !== "listening") return;
    const next = attempts + 1;
    setAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setStage("bypassed");
      setTimeout(succeed, 2800);
    } else {
      setStage("failed");
    }
  }

  const sphereState: SphereState =
    stage === "listening" ? "listening"
    : stage === "passed"   ? "speaking"
    : stage === "bypassed" ? "processing"
    : "ambient";

  const heading =
    stage === "ready"    ? "Voice verification"
    : stage === "listening" ? "Listening…"
    : stage === "passed"    ? "Voice recognised"
    : stage === "failed"    ? "Not recognised — try again"
    : "Voice check skipped";

  const sub =
    stage === "ready"       ? "Read the phrase below aloud"
    : stage === "listening" ? "Keep speaking clearly"
    : stage === "passed"    ? "Identity confirmed"
    : stage === "failed"
      ? `${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts === 1 ? "" : "s"} remaining`
    : "Failure logged — entering app";

  const subColor =
    stage === "failed"   ? "text-destructive/70"
    : stage === "bypassed" ? "text-high"
    : "text-muted-foreground";

  const showPhrase = stage === "ready" || stage === "listening" || stage === "failed";

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 55% 45% at 50% 45%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)" }} />

      <div className={cn(
        "flex flex-col items-center gap-8 w-full max-w-md px-8 transition-all duration-500",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}>
        <Sphere state={sphereState} size="md" />

        <div className="text-center">
          <h2 className="text-foreground/80 text-base font-medium tracking-wide">{heading}</h2>
          <p className={cn("mt-1 text-sm", subColor)}>{sub}</p>
        </div>

        {showPhrase && (
          <div className="w-full rounded-2xl border border-border bg-card px-6 py-5 text-center">
            <p className="text-xs tracking-[0.2em] text-muted-foreground/50 uppercase mb-3">Read aloud</p>
            <p className="text-foreground/70 text-sm leading-relaxed font-medium italic">
              &ldquo;{phrase}&rdquo;
            </p>
          </div>
        )}

        {/* Waveform (click to simulate fail — demo only) */}
        {stage === "listening" && (
          <div className="flex items-center gap-[3px] cursor-pointer" onClick={simulateFail}
            role="button" tabIndex={0} aria-label="Simulate failed attempt" title="Click to simulate fail">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={i} className="w-[3px] rounded-full bg-agent/70 animate-waveform-bar"
                style={{ height: "40px", animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
        )}

        {stage === "passed" && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-success/40 bg-success-soft">
            <Check className="h-6 w-6 text-success" aria-hidden="true" />
          </div>
        )}

        {stage === "bypassed" && (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-high/30 bg-high-soft">
            <ShieldAlert className="h-6 w-6 text-high" aria-hidden="true" />
          </div>
        )}

        {(stage === "ready" || stage === "failed") && (
          <>
            <CallButton tone="agent" onClick={startListening} aria-label="Start voice check">
              <Mic className="h-6 w-6 text-agent" strokeWidth={1.5} aria-hidden="true" />
            </CallButton>

            <div className="flex gap-2" aria-label={`${attempts} of ${MAX_ATTEMPTS} attempts`}>
              {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                <div key={i} className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  i < attempts ? "bg-destructive/60" : "bg-border")} />
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Demo: click mic → 2.6 s → passes. Click waveform to fail.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
