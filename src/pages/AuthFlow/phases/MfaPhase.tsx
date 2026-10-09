import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound, Mail, Smartphone } from "lucide-react";
import { Sphere } from "@/components/atoms/sphere";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/atoms/input-otp";
import { maskEmail, maskPhone } from "@/lib/mask";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
const ACCOUNT_PHONE: string | null = "+12025550189";
const HAS_RECOVERY_CODES = true;

type Method = "email" | "phone" | "recovery";

/**
 * Phase 3 — MFA code  (route: /login/mfa)
 *
 * Reads the email from location.state (passed by IdpPhase).
 * On success → navigate to /login/voice  (passes email forward)
 * If no state.email → redirect back to /login
 */
export function MfaPhase() {
  const navigate = useNavigate();
  const location = useLocation();
  const email: string = (location.state as { email?: string })?.email ?? "";

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [method, setMethod] = useState<Method>("email");
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Guard: if arrived without email, go back to login
  useEffect(() => {
    if (!email) navigate(routes.login, { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      inputRef.current?.focus();
    }, 200);
    return () => clearTimeout(t);
  }, []);

  function succeed() {
    setExiting(true);
    setTimeout(
      () => navigate(routes.loginVoice, { state: { email } }),
      600
    );
  }

  function handleCodeChange(next: string) {
    if (done) return;
    setCode(next);
    if (next.length === CODE_LENGTH) {
      setDone(true);
      setTimeout(succeed, 500);
    }
  }

  const canVerify =
    method === "recovery" ? !!recoveryCode.trim() : code.length === CODE_LENGTH;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canVerify || done) return;
    setDone(true);
    setTimeout(succeed, 500);
  }

  function switchMethod(next: Method) {
    setMethod(next);
    setCode("");
    setRecoveryCode("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  const methods = (
    [
      { key: "email"    as const, label: "Send code to email",   Icon: Mail,       available: true },
      { key: "phone"    as const, label: "Send code to phone",   Icon: Smartphone, available: !!ACCOUNT_PHONE },
      { key: "recovery" as const, label: "Use a recovery code",  Icon: KeyRound,   available: HAS_RECOVERY_CODES },
    ] as const
  ).filter((m) => m.available);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 55% 45% at 50% 45%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)" }} />

      <div className={cn(
        "flex flex-col items-center gap-8 w-full max-w-sm px-6 transition-all duration-500",
        visible && !exiting ? "opacity-100 translate-y-0"
          : exiting ? "opacity-0 scale-95"
          : "opacity-0 translate-y-5"
      )}>
        <Sphere state={done ? "processing" : "ambient"} size="md" />

        <div className="text-center">
          <h2 className="text-foreground/80 text-base font-medium tracking-wide">
            {done ? "Code accepted" : "Enter verification code"}
          </h2>
          <p className="mt-1 text-muted-foreground text-sm">
            {method === "recovery" ? "Enter one of your recovery codes." : (
              <>We sent a code to{" "}
                <span className="font-medium text-foreground">
                  {method === "phone" && ACCOUNT_PHONE
                    ? maskPhone(ACCOUNT_PHONE)
                    : maskEmail(email)}
                </span>
              </>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full" aria-label="Verification code">
          {method === "recovery" ? (
            <Input ref={inputRef} value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)}
              disabled={done} autoComplete="one-time-code" placeholder="Recovery code" />
          ) : (
            <InputOTP ref={inputRef} maxLength={CODE_LENGTH} inputMode="numeric" pattern="^[0-9]*$"
              value={code} onChange={handleCodeChange} disabled={done} aria-label="Verification code">
              <InputOTPGroup className="gap-2">
                {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="rounded-md border border-l h-10 w-10 text-base" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={done || !canVerify} isLoading={done}>
            Verify
          </Button>

          {method !== "recovery" && (
            <Button type="button" variant="link" size="sm" onClick={() => { setCode(""); requestAnimationFrame(() => inputRef.current?.focus()); }} disabled={done}>
              Resend code
            </Button>
          )}
        </form>

        {methods.length > 1 && (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Other ways to get the code</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            {methods.map(({ key, label, Icon }) => (
              <Button key={key} type="button" variant="outline" className="w-full" onClick={() => switchMethod(key)} disabled={done} leftIcon={<Icon className="h-4 w-4" />}>
                {label}
              </Button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Demo: type any 6 digits — auto-verifies
        </p>
      </div>
    </div>
  );
}
