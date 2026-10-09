import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Size scale — always use this atom instead of raw Lucide icons so
 * size and stroke-width stay consistent everywhere.
 *
 * Rule (from design-system-plan.md):
 *   xs = 12px  — chips, tight inline text
 *   sm = 16px  — default inline / button icons   ← use most of the time
 *   md = 20px  — sidebar nav items
 *   lg = 24px  — section headings, empty state illustrations
 *   xl = 32px  — hero / page-level illustration spots
 */
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

const sizeMap: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export interface IconProps extends Omit<LucideProps, "size" | "ref"> {
  /** The Lucide icon component to render. */
  icon: LucideIcon;
  /** Consistent size token — maps to `h-* w-*` classes. Default: `sm`. */
  size?: IconSize;
  /**
   * Accessible label for non-decorative icons.
   * When provided, sets `aria-label` and removes `aria-hidden`.
   * Omit (or leave undefined) for purely decorative icons.
   */
  label?: string;
}

/**
 * Icon atom — wraps a Lucide icon with design-system sizing and
 * consistent accessibility attributes.
 *
 * @example
 * // Decorative (hidden from screen readers)
 * <Icon icon={Search} size="sm" />
 *
 * // Meaningful (announced by screen readers)
 * <Icon icon={AlertCircle} size="md" label="Warning" />
 */
export function Icon({ icon: LucideIcon, size = "sm", label, className, ...props }: IconProps) {
  return (
    <LucideIcon
      className={cn(sizeMap[size], className)}
      strokeWidth={2}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      {...props}
    />
  );
}
