import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Show live character counter — pass maxLength to enable. */
  showCount?: boolean;
}

/**
 * Textarea atom — matches the Input atom's visual spec exactly.
 *
 * @example
 * <Textarea label="Bio" maxLength={160} showCount rows={3} />
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, showCount, id, className, value, ...props }, ref) {
    const textareaId = id ?? `textarea-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-foreground">
            {label}
            {props.required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-y",
            "bg-background text-foreground placeholder:text-muted-foreground",
            "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
            "transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-input",
            className
          )}
          {...props}
        />

        <div className="flex items-center justify-between">
          <div>
            {error && <p id={`${textareaId}-error`} role="alert" className="text-xs text-destructive">{error}</p>}
            {!error && hint && <p id={`${textareaId}-hint`} className="text-xs text-muted-foreground">{hint}</p>}
          </div>
          {showCount && props.maxLength && (
            <p className={cn("text-xs", charCount > props.maxLength * 0.9 ? "text-warning" : "text-muted-foreground")}>
              {charCount}/{props.maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
