/**
 * Sphere atom — animated identity orb.
 *
 * Ported from command-center-main/src/components/domain/Sphere.tsx.
 *
 * Visual layers (back → front):
 *   1. Dark void base (#03060f)
 *   2. Two counter-rotating conic-gradient rings (blur 10–14 px)
 *   3. Slower third ring
 *   4. Central dark void via radial-gradient
 *   5. State overlays: waveform bars (listening) / radial pulse (speaking)
 *   6. Specular highlight (top-left ellipse)
 *   7. Inner rim glow (inset box-shadow)
 *
 * State changes drive:
 *   - Outer glow shadow size/colour
 *   - breathing / listen / speak CSS animations
 *   - Optional canvas particle-dissolve on hover (opt-in via `dissolve`)
 *
 * NOTE: Gradient strings use `rgba(76,203,191,X)` instead of
 * `hsl(var(--primary)/X)` because our design token is a HEX variable.
 * If the project migrates to HSL-space tokens, swap to the HSL form.
 */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────

export type SphereState = "ambient" | "listening" | "speaking" | "processing" | "alert";
export type SphereSize  = "xs" | "sm" | "md" | "lg" | "xl";

// ── Constants ─────────────────────────────────────────────────────────────

const SIZES: Record<SphereSize, string> = {
  xs: "h-[46px] w-[46px]",
  sm: "h-20 w-20",
  md: "h-36 w-36",
  lg: "h-56 w-56",
  xl: "h-72 w-72",
};

const SPHERE_PX: Record<SphereSize, number> = {
  xs: 23, sm: 40, md: 72, lg: 112, xl: 144,
};

const GLOW: Record<SphereState, string> = {
  ambient:    "shadow-[0_0_55px_10px_rgba(45,180,200,0.22)]",
  processing: "shadow-[0_0_55px_12px_rgba(60,150,235,0.30)]",
  listening:  "shadow-[0_0_75px_20px_rgba(70,220,200,0.48)] animate-sphere-listen",
  speaking:   "shadow-[0_0_75px_20px_rgba(90,210,240,0.52)] animate-sphere-speak",
  alert:      "shadow-[0_0_55px_10px_rgba(45,180,200,0.22)] animate-sphere-speak",
};

// Vivid glowing particle colours
const PARTICLE_COLORS: [number, number, number][] = [
  [70,  220, 200],
  [90,  240, 215],
  [45,  160, 210],
  [34,  100, 200],
  [130, 220, 255],
  [200, 248, 255],
  [60,  180, 240],
];

interface Particle {
  ox: number; oy: number;
  dx: number; dy: number;
  x:  number; y:  number;
  r:  number;
  color: string;
}

const SCATTER_MS = 700;
const RETURN_MS  = 980;
const GRID       = 16;
const BURST_PERIOD    = 860;
const BURST_OFFSETS   = [0, 130, 240];
const BURST_STRENGTHS = [1.0, 0.45, 0.20];
const RING_LIFE       = 1100;
const RING_STEPS      = 90;

function easeOut  (t: number) { return 1 - (1 - t) ** 3; }
function easeInOut(t: number) { return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2; }

function organicOffset(angle: number, amount: number, now: number): number {
  const t = now / 2000;
  return amount * (
    Math.sin(angle * 2.1  + t * 0.8) * 0.38 +
    Math.sin(angle * 4.9  + t * 1.3) * 0.28 +
    Math.sin(angle * 8.3  + t * 0.5) * 0.20 +
    Math.sin(angle * 13.7 + t * 1.6) * 0.14
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

export interface SphereProps {
  state?: SphereState;
  size?:  SphereSize;
  className?: string;
  /** Enable the particle-scatter dissolve on hover. Off by default. */
  dissolve?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────

export function Sphere({
  state = "ambient",
  size  = "lg",
  className,
  dissolve = false,
}: SphereProps) {
  const breathing = state === "ambient" || state === "processing";

  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef      = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const cxRef        = useRef(0);
  const cyRef        = useRef(0);
  const phaseRef     = useRef<"idle" | "scatter" | "hold" | "return">("idle");
  const t0Ref        = useRef(0);
  const waveStartRef = useRef(0);
  const rafRef       = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      canvasRef.current?.remove();
    };
  }, []);

  // ── Particle builder ─────────────────────────────────────────────────────

  function buildParticles(cx: number, cy: number, r: number): Particle[] {
    const out: Particle[] = [];
    const step = (2 * r) / GRID;

    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const ox  = cx - r + step * (i + 0.5);
        const oy  = cy - r + step * (j + 0.5);
        const ddx = ox - cx;
        const ddy = oy - cy;
        const nd  = Math.sqrt(ddx * ddx + ddy * ddy) / r;
        if (nd > 0.97) continue;

        const brightness = 0.35 + nd * 0.65;
        const [rr, gg, bb] = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const alpha = (0.35 + brightness * 0.45 + Math.random() * 0.15).toFixed(2);

        const dotR = 1.5 + brightness * 2.0 + Math.random() * 0.5;
        const angle = Math.atan2(ddy, ddx) + (Math.random() - 0.5) * Math.PI * 0.85;
        const reach = Math.max(window.innerWidth, window.innerHeight) * (0.15 + Math.random() * 0.95);

        out.push({
          ox, oy,
          dx: Math.max(-80, Math.min(window.innerWidth  + 80, cx + Math.cos(angle) * reach)),
          dy: Math.max(-80, Math.min(window.innerHeight + 80, cy + Math.sin(angle) * reach)),
          x: ox, y: oy,
          r: dotR,
          color: `rgba(${rr},${gg},${bb},${alpha})`,
        });
      }
    }
    return out;
  }

  // ── Draw helpers ─────────────────────────────────────────────────────────

  function drawParticles(ctx: CanvasRenderingContext2D) {
    ctx.shadowBlur  = 10;
    ctx.shadowColor = "rgba(70,220,200,0.9)";
    for (const p of particlesRef.current) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function drawWaveform(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    baseR: number,
    now: number,
    pulseAlpha: number,
  ) {
    if (pulseAlpha <= 0.01) return;

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.8);
    grd.addColorStop(0,   `rgba(70,220,200,${(pulseAlpha * 0.18).toFixed(3)})`);
    grd.addColorStop(0.5, `rgba(45,150,200,${(pulseAlpha * 0.07).toFixed(3)})`);
    grd.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, baseR * 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.filter = "blur(13px)";

    const elapsed  = now - waveStartRef.current;
    const cyclePos = elapsed % BURST_PERIOD;

    for (let i = 0; i < BURST_OFFSETS.length; i++) {
      const candidates = [cyclePos - BURST_OFFSETS[i], cyclePos - BURST_OFFSETS[i] + BURST_PERIOD];

      for (const ph of candidates) {
        if (ph < 0 || ph > RING_LIFE) continue;

        const age      = ph / RING_LIFE;
        const strength = BURST_STRENGTHS[i];
        const envelope = Math.sin(age * Math.PI) * (1 - age * 0.35);
        const alpha    = pulseAlpha * strength * envelope * 0.85;
        if (alpha < 0.01) continue;

        const ringR     = baseR * (0.08 + age * 3.6);
        const wobbleAmt = baseR * 0.20 * (1 - age * 0.6);
        const strokeW   = Math.max(3, baseR * (0.38 - age * 0.26));

        ctx.beginPath();
        for (let s = 0; s <= RING_STEPS; s++) {
          const angle = (s / RING_STEPS) * Math.PI * 2;
          const rad   = ringR + organicOffset(angle, wobbleAmt, now);
          const x     = cx + Math.cos(angle) * rad;
          const y     = cy + Math.sin(angle) * rad;
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(70,220,200,${alpha.toFixed(3)})`;
        ctx.lineWidth   = strokeW;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ── Animation loop ───────────────────────────────────────────────────────

  function tick(now: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = now - t0Ref.current;
    const ps      = particlesRef.current;
    const body    = bodyRef.current;
    const cx      = cxRef.current;
    const cy      = cyRef.current;
    const baseR   = SPHERE_PX[size];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let pulseAlpha = 0;

    if (phaseRef.current === "scatter") {
      const t = Math.min(elapsed / SCATTER_MS, 1);
      const e = easeOut(t);
      for (const p of ps) {
        p.x = p.ox + (p.dx - p.ox) * e;
        p.y = p.oy + (p.dy - p.oy) * e;
      }
      if (body) body.style.opacity = (1 - e).toFixed(3);
      pulseAlpha = e;
      if (t >= 1) phaseRef.current = "hold";

    } else if (phaseRef.current === "hold") {
      pulseAlpha = 1.0;

    } else if (phaseRef.current === "return") {
      const t = Math.min(elapsed / RETURN_MS, 1);
      const e = easeInOut(t);
      for (const p of ps) {
        p.x = p.dx + (p.ox - p.dx) * e;
        p.y = p.dy + (p.oy - p.dy) * e;
      }
      if (body) body.style.opacity = e.toFixed(3);
      pulseAlpha = 1 - e;
      if (t >= 1) {
        phaseRef.current = "idle";
        if (body) body.style.opacity = "";
        canvas.remove();
        canvasRef.current    = null;
        particlesRef.current = [];
        rafRef.current       = null;
        return;
      }
    }

    drawWaveform(ctx, cx, cy, baseR, now, pulseAlpha);
    drawParticles(ctx);

    rafRef.current = requestAnimationFrame(tick);
  }

  // ── Dissolve hover handlers ───────────────────────────────────────────────

  function onEnter() {
    if (!dissolve) return;
    if (phaseRef.current === "scatter" || phaseRef.current === "hold") return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    cxRef.current = rect.left + rect.width  / 2;
    cyRef.current = rect.top  + rect.height / 2;

    if (!canvasRef.current) {
      const c = document.createElement("canvas");
      c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;";
      c.width  = window.innerWidth;
      c.height = window.innerHeight;
      document.body.appendChild(c);
      canvasRef.current = c;
    }

    particlesRef.current = buildParticles(cxRef.current, cyRef.current, SPHERE_PX[size]);
    phaseRef.current     = "scatter";
    t0Ref.current        = performance.now();
    waveStartRef.current = performance.now();
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  function onLeave() {
    if (!dissolve) return;
    if (phaseRef.current === "idle" || phaseRef.current === "return") return;

    if (phaseRef.current === "scatter") {
      for (const p of particlesRef.current) { p.x = p.dx; p.y = p.dy; }
      if (bodyRef.current) bodyRef.current.style.opacity = "0";
    }

    phaseRef.current = "return";
    t0Ref.current    = performance.now();
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center justify-center", SIZES[size], className)}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {/* Ground shadow / bloom */}
      <div
        className="absolute -bottom-6 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full pointer-events-none"
        style={{ background: "rgba(76,203,191,0.20)", filter: "blur(20px)" }}
        aria-hidden="true"
      />

      {/* Outer glow ring — driven by state */}
      <div
        className={cn("absolute inset-0 rounded-full transition-all duration-700", GLOW[state])}
        aria-hidden="true"
      />

      {/* Sphere body */}
      <div
        ref={bodyRef}
        className={cn(
          "relative h-full w-full rounded-full overflow-hidden will-change-[transform,opacity]",
          breathing && "animate-sphere-breathe"
        )}
        aria-hidden="true"
      >
        {/* Base: deep dark void */}
        <div className="absolute inset-0 rounded-full bg-[#03060f]" />

        {/* Ring 1 — clockwise conic gradient, primary accent */}
        <div
          className="absolute inset-0 rounded-full animate-sphere-rotate"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(76,203,191,0.9) 18%, rgba(45,150,200,0.75) 32%, transparent 52%, rgba(70,220,200,0.55) 72%, transparent 88%)",
            filter: "blur(10px)",
          }}
        />

        {/* Ring 2 — counter-clockwise, slightly offset origin */}
        <div
          className="absolute inset-0 rounded-full animate-sphere-rotate-reverse"
          style={{
            background:
              "conic-gradient(from 90deg at 42% 62%, transparent 0%, rgba(45,150,200,0.85) 18%, rgba(76,203,191,0.7) 38%, transparent 58%, rgba(90,240,215,0.5) 78%, transparent 95%)",
            filter: "blur(14px)",
          }}
        />

        {/* Ring 3 — slow clockwise, accent highlights */}
        <div
          className="absolute inset-0 rounded-full animate-sphere-rotate"
          style={{
            animationDuration: "28s",
            background:
              "conic-gradient(from 210deg at 60% 38%, transparent 0%, rgba(70,220,200,0.55) 12%, transparent 32%, rgba(76,203,191,0.45) 58%, transparent 78%)",
            filter: "blur(8px)",
          }}
        />

        {/* Central void — makes the sphere look hollow/deep */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "18%",
            background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.95) 0%, transparent 68%)",
          }}
        />

        {/* Listening state — waveform bars */}
        {state === "listening" && (
          <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full bg-white/65 animate-waveform-bar"
                style={{ width: "3px", height: "32%", animationDelay: `${i * 0.08}s` }}
              />
            ))}
          </div>
        )}

        {/* Speaking state — radial inner pulse */}
        {state === "speaking" && (
          <div
            className="absolute inset-0 rounded-full animate-sphere-speak"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(90,220,240,0.35) 0%, transparent 58%)",
            }}
          />
        )}

        {/* Specular highlight — top-left ellipse */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 38%, transparent 62%)",
          }}
        />

        {/* Inner rim glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow:
              "inset 0 0 0 1.5px rgba(150,250,225,0.30), inset 2px 3px 10px rgba(200,255,245,0.10)",
          }}
        />
      </div>
    </div>
  );
}
