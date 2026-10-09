/**
 * InputOTP atoms — ported from command-center-main.
 * Wraps the `input-otp` library with shadcn/ui-compatible styling.
 */
import { forwardRef, useContext } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Root ─────────────────────────────────────────────────────────────────

export const InputOTP = forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(function InputOTP({ className, containerClassName, ...props }, ref) {
  return (
    <OTPInput
      ref={ref}
      containerClassName={cn(
        "flex items-center gap-2 has-[:disabled]:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
});

// ── Group ─────────────────────────────────────────────────────────────────

export const InputOTPGroup = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(function InputOTPGroup({ className, ...props }, ref) {
  return (
    <div ref={ref} className={cn("flex items-center", className)} {...props} />
  );
});

// ── Slot ─────────────────────────────────────────────────────────────────

export const InputOTPSlot = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(function InputOTPSlot({ index, className, ...props }, ref) {
  const { char, hasFakeCaret, isActive } =
    useContext(OTPInputContext).slots[index];

  return (
    <div
      ref={ref}
      data-active={isActive || undefined}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center",
        "border-y border-r border-input text-sm",
        "shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all",
        "first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  );
});

// ── Separator ─────────────────────────────────────────────────────────────

export const InputOTPSeparator = forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(function InputOTPSeparator({ ...props }, ref) {
  return (
    <div ref={ref} role="separator" {...props}>
      <Minus className="h-4 w-4 text-muted-foreground" />
    </div>
  );
});
