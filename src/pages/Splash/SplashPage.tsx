import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sphere } from "@/components/atoms/sphere";
import { Button } from "@/components/atoms/button";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";

/**
 * Page: Splash
 *
 * Entry screen before login — ported from command-center-main SplashScreen.
 *
 * Flow:
 *   /  (root)  →  SplashPage  →  "Start" →  /login  →  /dashboard
 *
 * Features:
 *  - Full-screen, centred content (same layout as LoginPage)
 *  - Radial agent-tint background
 *  - Entrance animation: opacity 0 + translateY 5 → visible (300 ms delay)
 *  - Exit animation:    opacity 0 + translateY -3 (slides up on "Start")
 *  - XL Sphere with dissolve enabled (hover scatters particles)
 *  - 550 ms exit transition before navigation (lets particles fly)
 */
export function SplashPage() {
  const navigate  = useNavigate();
  const [visible,  setVisible]  = useState(false);
  const [exiting,  setExiting]  = useState(false);

  // Entrance: fade in after 300 ms — matches CC timing
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  function handleStart() {
    setExiting(true);
    // 550 ms matches the particle dissolve travel time in Sphere
    setTimeout(() => navigate(routes.login), 550);
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Radial gradient background tint */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 55%, hsl(174 55% 55% / 0.07) 0%, transparent 70%)",
        }}
      />

      {/* Content — entrance / exit animated */}
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
        {/* Brand lettermark */}
        <p className="tracking-[0.35em] text-foreground/20 text-xs uppercase font-medium select-none">
          Boilerplate
        </p>

        {/*
         * XL Sphere with dissolve — hover scatters particles across the
         * screen. Clicking "Start" while hovered creates a dramatic exit.
         */}
        <Sphere state="ambient" size="xl" dissolve />

        {/* Start button — triggers exit animation then navigates */}
        <Button
          variant="primary"
          size="md"
          className="mt-2"
          onClick={handleStart}
        >
          Get started
        </Button>
      </div>
    </div>
  );
}
