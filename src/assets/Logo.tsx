import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

/**
 * Application logo.
 * Uses semantic design tokens — no hardcoded hex.
 * Renders an accent wordmark in expanded mode and a monogram in collapsed mode.
 */
export function Logo({ className, collapsed = false }: LogoProps) {
  if (collapsed) {
    return (
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          "bg-primary font-bold text-primary-foreground text-sm",
          className
        )}
      >
        R
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          "bg-primary font-bold text-primary-foreground text-sm"
        )}
      >
        R
      </div>
      <span className="text-[15px] font-bold text-foreground">
        React<span className="text-primary">UI</span>
      </span>
    </div>
  );
}
