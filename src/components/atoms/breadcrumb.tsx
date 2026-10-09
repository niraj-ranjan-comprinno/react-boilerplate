import { forwardRef } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Breadcrumb = forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & { separator?: React.ReactNode }
>(function Breadcrumb({ ...props }, ref) {
  return <nav ref={ref} aria-label="breadcrumb" {...props} />;
});

export const BreadcrumbList = forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(function BreadcrumbList({ className, ...props }, ref) {
  return (
    <ol
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(function BreadcrumbItem({ className, ...props }, ref) {
  return <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
});

export const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(function BreadcrumbLink({ className, ...props }, ref) {
  return (
    <a
      ref={ref}
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
});

export const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(function BreadcrumbPage({ className, ...props }, ref) {
  return (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
});

export const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>
    {children ?? <ChevronRight />}
  </li>
);

export const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
