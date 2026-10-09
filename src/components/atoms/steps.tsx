import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description?: string;
}

export interface StepsProps {
  steps: Step[];
  /** 0-indexed current step. */
  current: number;
  className?: string;
  /** "horizontal" (default) or "vertical". */
  orientation?: "horizontal" | "vertical";
}

/**
 * Steps atom — displays a multi-step progress indicator.
 *
 * @example
 * <Steps
 *   steps={[{ label: "Account" }, { label: "Profile" }, { label: "Done" }]}
 *   current={1}
 * />
 */
export function Steps({ steps, current, className, orientation = "horizontal" }: StepsProps) {
  if (orientation === "vertical") {
    return (
      <ol className={cn("flex flex-col gap-0", className)} aria-label="Progress">
        {steps.map((step, i) => {
          const isCompleted = i < current;
          const isCurrent = i === current;
          return (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  isCompleted ? "border-primary bg-primary text-primary-foreground" :
                  isCurrent ? "border-primary text-primary bg-primary/10" :
                  "border-border text-muted-foreground"
                )}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
                </div>
                {i < steps.length - 1 && <div className={cn("mt-1 w-0.5 flex-1 min-h-[2rem]", i < current ? "bg-primary" : "bg-border")} />}
              </div>
              <div className="pb-6 pt-1">
                <p className={cn("text-sm font-medium", isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                {step.description && <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className={cn("flex items-center", className)} aria-label="Progress">
      {steps.map((step, i) => {
        const isCompleted = i < current;
        const isCurrent = i === current;
        return (
          <li key={i} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                isCompleted ? "border-primary bg-primary text-primary-foreground" :
                isCurrent ? "border-primary text-primary bg-primary/10" :
                "border-border text-muted-foreground"
              )}>
                {isCompleted ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
              </div>
              <p className={cn("text-xs font-medium whitespace-nowrap", isCurrent ? "text-foreground" : isCompleted ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1 transition-colors", i < current ? "bg-primary" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
