import { Logo } from "@/assets/Logo";
import { cn } from "@/lib/utils";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Template: Auth pages layout.
 *
 * Two-column split on lg+:
 *   - Left: dark branding panel (bg-sidebar)
 *   - Right: centered content slot (the LoginForm card lives here)
 *
 * Single column on mobile — logo at top, then content.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Branding panel (lg+) ─────────────────────────────────────── */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 xl:w-5/12",
          "flex-col items-center justify-center gap-8 px-12",
          "bg-sidebar"
        )}
        aria-hidden="true"
      >
        <div className="max-w-xs text-center">
          <Logo className="mx-auto" />
          <h2 className="mt-6 text-2xl font-bold text-[#fafafa]">
            Build faster with a solid foundation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#71717a]">
            React + TypeScript + shadcn/ui boilerplate with Atomic Design,
            Tailwind v4, and production-ready patterns baked in.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {[
            "Atomic Design",
            "Tailwind v4",
            "shadcn/ui",
            "React Router",
            "Zod + RHF",
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#a1a1aa]"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Content panel ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>

        {/* The LoginForm card — max-w-sm matches Figma card width (~372px) */}
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
