import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card atom — aligned with both patterns:
 *
 * 1. **Compound API** (existing boilerplate convention):
 *    `Card.Header` / `Card.Body` / `Card.Footer`
 *
 * 2. **Named exports** (shadcn/ui standard, command-center-main compatible):
 *    `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
 *
 * Figma spec: rounded-xl (12px), shadow/sm, border=var(--border), bg=var(--card).
 * Aligned: radius uses `--radius` (0.625rem = 10px after update).
 */

// ── Shared base types ─────────────────────────────────────────────────────

type DivProps = React.HTMLAttributes<HTMLDivElement>;

// ── Root ─────────────────────────────────────────────────────────────────

export const Card = forwardRef<HTMLDivElement, DivProps>(
  function Card({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground",
          "shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]",
          className
        )}
        {...props}
      />
    );
  }
) as CardWithSubComponents;

// ── Compound sub-components (boilerplate convention) ─────────────────────

Card.Header = forwardRef<HTMLDivElement, DivProps>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("border-b border-border px-6 py-4", className)}
        {...props}
      />
    );
  }
);

Card.Body = forwardRef<HTMLDivElement, DivProps>(
  function CardBody({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-6 py-4", className)} {...props} />;
  }
);

Card.Footer = forwardRef<HTMLDivElement, DivProps>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("border-t border-border px-6 py-3", className)}
        {...props}
      />
    );
  }
);

// ── Named exports (shadcn/ui standard, CC-compatible) ────────────────────

/** shadcn/ui-style named header — use `CardTitle` + `CardDescription` inside. */
export const CardHeader = forwardRef<HTMLDivElement, DivProps>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-4", className)}
        {...props}
      />
    );
  }
);

/** Primary heading inside `CardHeader`. */
export const CardTitle = forwardRef<HTMLDivElement, DivProps>(
  function CardTitle({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);

/** Subtitle inside `CardHeader`. */
export const CardDescription = forwardRef<HTMLDivElement, DivProps>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);

/** Main body area — note: `p-4 pt-0` (shadcn/ui convention). */
export const CardContent = forwardRef<HTMLDivElement, DivProps>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
    );
  }
);

/** Footer — `flex items-center p-4 pt-0`. */
export const CardFooter = forwardRef<HTMLDivElement, DivProps>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-4 pt-0", className)}
        {...props}
      />
    );
  }
);

// ── Type for compound pattern ─────────────────────────────────────────────

type CardWithSubComponents = React.ForwardRefExoticComponent<
  DivProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof CardHeader;
  Body: React.ForwardRefExoticComponent<DivProps & React.RefAttributes<HTMLDivElement>>;
  Footer: typeof CardFooter;
};
