import { forwardRef } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  description?: string;
}

/**
 * Toggle switch atom backed by Radix Switch.
 *
 * @example
 * <Switch label="Dark mode" checked={isDark} onCheckedChange={setDark} />
 */
export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(function Switch({ className, label, description, id, ...props }, ref) {
  const switchId = id ?? `switch-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex items-center gap-3">
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=unchecked]:bg-input data-[state=checked]:bg-primary",
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0",
            "transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitive.Root>
      {(label || description) && (
        <div>
          {label && (
            <label htmlFor={switchId} className="text-sm font-medium text-foreground cursor-pointer">
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  );
});
