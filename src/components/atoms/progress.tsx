import { forwardRef } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** 0–100 */
  value?: number;
  /** Show percentage label. */
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

const indicatorColor = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
};

/**
 * Progress bar atom.
 *
 * @example
 * <Progress value={65} showLabel variant="success" />
 */
export const Progress = forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value = 0, showLabel, variant = "default", ...props }, ref) {
  return (
    <div className="flex items-center gap-3">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
        value={value}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 transition-all duration-500", indicatorColor[variant])}
          style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="shrink-0 text-xs font-medium text-muted-foreground w-9 text-right">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
});
