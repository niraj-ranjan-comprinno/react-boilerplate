import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Button variants — aligned with command-center-main:
 *  - Added: `card`, `critical-soft`, `success` (alias), `asChild` (Radix Slot)
 *  - Added sizes: `icon-sm` (h-7 w-7), `icon-xs` (h-6 w-6)
 *  - `link` uses `text-primary-ink` for accessible inline actions
 *
 * Figma spec (confirmed):
 *  bg-primary and text-primary-foreground resolve through semantic tokens
 *  h-9 = 36px, px-4 = 16px, rounded-md = 10px (--radius 0.625rem)
 */
const buttonVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium transition-colors select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** Primary accent fill */
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        /** Outlined secondary */
        secondary:
          "bg-secondary text-secondary-foreground border border-input hover:bg-secondary/80",
        /** Transparent ghost */
        ghost:
          "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        /** Destructive red */
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        /** Border only */
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        /** Underline link — uses the accessible primary-ink token */
        link: "text-primary-ink underline-offset-4 hover:underline p-0 h-auto font-normal",
        /** Card-surface button — matches command-center card variant */
        card: "border border-border/80 bg-card/80 text-foreground/70 hover:border-border hover:bg-accent hover:text-foreground",
        /** Soft critical — for dangerous inline actions */
        "critical-soft":
          "bg-critical/20 font-semibold text-critical hover:bg-critical/30",
        /** Success (alias of primary) */
        success:
          "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        sm:       "h-8 rounded-md px-3 text-xs gap-1.5",
        md:       "h-9 px-4 text-sm gap-2",           // Figma: h-9=36px, px-4=16px
        lg:       "h-10 rounded-md px-6 text-base gap-2.5",
        icon:     "h-9 w-9 p-0",
        "icon-sm":"h-7 w-7 rounded-md p-0 [&_svg]:size-[14px]",
        "icon-xs":"h-6 w-6 rounded-md p-0 [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and disables the button. */
  isLoading?: boolean;
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode;
  /**
   * Render as the child element instead of a `<button>`.
   * Useful for wrapping `<Link>` with button styles.
   * Uses Radix Slot — aligned with command-center-main.
   */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      asChild = false,
      children,
      className,
      ...props
    },
    ref
  ) {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </Comp>
    );
  }
);

export { buttonVariants };
