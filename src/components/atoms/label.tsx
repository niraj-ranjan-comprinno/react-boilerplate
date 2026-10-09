import { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

/**
 * Accessible label backed by Radix UI's Label primitive.
 *
 * Clicking the label focuses the associated control via `htmlFor`.
 */
export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(function Label({ className, ...props }, ref) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none text-zinc-700 dark:text-[#E8EDF2]",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
