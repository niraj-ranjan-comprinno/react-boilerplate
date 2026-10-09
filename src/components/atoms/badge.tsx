import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge variants — aligned with command-center-main:
 *   Added severity scale: critical / high / medium / low / muted
 *   Existing:             default / primary / success / warning / danger / info / outline
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        // ── Neutral ───────────────────────────────────────────────────
        default:  "bg-secondary text-secondary-foreground border border-transparent",
        outline:  "border border-border text-foreground bg-transparent",
        muted:    "bg-muted text-muted-foreground border border-transparent",
        // ── Brand ─────────────────────────────────────────────────────
        primary:  "bg-primary/15 text-primary border border-transparent",
        // ── Status (semantic) ─────────────────────────────────────────
        success:  "bg-success-soft text-success border border-transparent",
        warning:  "bg-high-soft text-high border border-transparent",
        info:     "bg-info-soft text-info border border-transparent",
        // ── Severity scale (aligned with command-center-main) ─────────
        critical: "bg-critical-soft text-critical border border-transparent",
        high:     "bg-high-soft text-high border border-transparent",
        medium:   "bg-medium-soft text-medium border border-transparent",
        low:      "bg-low-soft text-low border border-transparent",
        // ── Legacy alias ──────────────────────────────────────────────
        danger:   "bg-critical-soft text-critical border border-transparent",
        agent:    "bg-agent-soft text-agent border border-transparent",
        takeover: "bg-takeover-soft text-takeover border border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Inline status / category label.
 *
 * @example
 * <Badge variant="critical">Critical</Badge>
 * <Badge variant="success">Resolved</Badge>
 */
export function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
