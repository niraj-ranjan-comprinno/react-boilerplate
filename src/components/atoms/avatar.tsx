import { forwardRef } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// ── Root ────────────────────────────────────────────────────────────────────

type AvatarRootProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>;

export const AvatarRoot = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(function AvatarRoot({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
});

// ── Image ────────────────────────────────────────────────────────────────────

type AvatarImageProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>;

export const AvatarImage = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(function AvatarImage({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
});

// ── Fallback ─────────────────────────────────────────────────────────────────

type AvatarFallbackProps = React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>;

export const AvatarFallback = forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full",
        "bg-zinc-200 text-zinc-600 text-xs font-semibold",
        "dark:bg-dark-raised dark:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});

// ── Convenience composite ────────────────────────────────────────────────────

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  /** Size in Tailwind units, e.g. "8" → h-8 w-8 */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

/**
 * Convenience avatar that handles image loading and fallback initials.
 *
 * @example
 * <Avatar src="https://..." alt="Alex" fallback="AJ" />
 */
export function Avatar({ src, alt, fallback, className, size = "md" }: AvatarProps) {
  return (
    <AvatarRoot className={cn(sizeMap[size], className)}>
      {src && <AvatarImage src={src} alt={alt ?? "avatar"} />}
      <AvatarFallback>{fallback ?? alt?.slice(0, 2).toUpperCase() ?? "?"}</AvatarFallback>
    </AvatarRoot>
  );
}
