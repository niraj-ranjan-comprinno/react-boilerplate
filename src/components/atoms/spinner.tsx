import { cn } from "@/lib/utils";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Accessible label for screen readers. */
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
};

/**
 * CSS-only circular loading indicator.
 *
 * @example
 * <Spinner size="lg" label="Loading dashboard…" />
 */
export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full",
        "border-zinc-200 border-t-primary",
        "dark:border-dark-raised dark:border-t-primary",
        sizeMap[size],
        className
      )}
    />
  );
}
