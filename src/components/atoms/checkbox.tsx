import { forwardRef } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Label rendered next to the checkbox. */
  label?: string;
  /** Error message. */
  error?: string;
  /** Indeterminate state. */
  indeterminate?: boolean;
}

/**
 * Checkbox atom backed by Radix Checkbox.
 *
 * @example
 * <Checkbox label="Accept terms" onCheckedChange={setAccepted} />
 */
export const Checkbox = forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(function Checkbox({ className, label, error, indeterminate, id, ...props }, ref) {
  const checkboxId = id ?? `checkbox-${Math.random().toString(36).slice(2)}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          checked={indeterminate ? "indeterminate" : props.checked}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-[4px] border border-input",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
            "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
            error && "border-destructive",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
            {indeterminate ? <Minus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && (
          <label htmlFor={checkboxId} className="text-sm font-medium text-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
      </div>
      {error && <p role="alert" className="text-xs text-destructive pl-6">{error}</p>}
    </div>
  );
});
