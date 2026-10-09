import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card } from "@/components/atoms/card";
import { cn } from "@/lib/utils";

export interface SummaryCardProps {
  title: string;
  value: string | number;
  /** Numeric change percentage (e.g. 20.1 or -4.6). */
  change?: number;
  /** Overrides the default generated trend text. */
  trendText?: string;
  /** Direction hint when change is undefined (e.g. from an external flag). */
  trend?: "up" | "down" | "neutral";
  /** Icon rendered in the corner. Pass a Lucide icon element. */
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Organism: Dashboard metric card.
 *
 * Displays a title, large value, and an optional change indicator with
 * trend arrow and colour.  Designed to be composed in a stats grid row.
 *
 * @example
 * <SummaryCard
 *   title="Total Revenue"
 *   value="$15,231.89"
 *   change={20.1}
 *   icon={<DollarSign className="h-5 w-5" />}
 * />
 */
export function SummaryCard({
  title,
  value,
  change,
  trendText,
  trend,
  icon,
  className,
}: SummaryCardProps) {
  const isPositive = trend === "up" || (change !== undefined && change > 0);
  const isNegative = trend === "down" || (change !== undefined && change < 0);

  const TrendIcon = isNegative ? TrendingDown : isPositive ? TrendingUp : Minus;

  const trendColour = isPositive
    ? "text-success"
    : isNegative
      ? "text-danger"
      : "text-muted-foreground";

  const displayText =
    trendText ?? (change !== undefined ? `${isNegative ? "" : "+"}${change}% from last month` : undefined);

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>

        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              "bg-zinc-100 text-zinc-500 dark:bg-dark-raised dark:text-muted-foreground"
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {displayText && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendIcon className={cn("h-4 w-4 shrink-0", trendColour)} aria-hidden="true" />
          <span className={cn("text-xs font-medium", trendColour)}>{displayText}</span>
        </div>
      )}
    </Card>
  );
}
