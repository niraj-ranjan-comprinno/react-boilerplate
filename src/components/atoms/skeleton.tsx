import { cn } from "@/lib/utils";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Animated placeholder used while content is loading.
 *
 * @example
 * <Skeleton className="h-4 w-32 rounded" />
 * <Skeleton className="h-10 w-full rounded-xl" />
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md",
        "bg-zinc-200 dark:bg-dark-raised",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
