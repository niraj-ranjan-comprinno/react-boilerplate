import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sphere } from "@/components/atoms/sphere";
import { Button } from "@/components/atoms/button";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";

/**
 * Phase 1 — Splash  (route: /)
 *
 * "Get started" → navigates to /login
 */
export function SplashPhase() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleStart() {
    setExiting(true);
    // 550 ms lets the particle dissolve complete before the route change
    setTimeout(() => navigate(routes.login), 550);
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 55%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)",
        }}
      />

      <div
        className={cn(
          "flex flex-col items-center gap-10 transition-all duration-500",
          visible && !exiting
            ? "opacity-100 translate-y-0"
            : exiting
              ? "opacity-0 -translate-y-3"
              : "opacity-0 translate-y-5"
        )}
      >
        <p className="tracking-[0.35em] text-foreground/20 text-xs uppercase font-medium select-none">
          Boilerplate
        </p>

        <Sphere state="ambient" size="xl" dissolve />

        <Button variant="primary" size="md" className="mt-2" onClick={handleStart}>
          Get started
        </Button>
      </div>
    </div>
  );
}
