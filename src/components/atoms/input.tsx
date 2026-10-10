import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

/**
 * Input atom — styled to the shared control specification:
 *  - Height: h-9 = 36px
 *  - Padding X: px-3 = 12px
 *  - Border: 1px var(--input) = #8a8a8a light / #66666a dark
 *  - Border radius: rounded-md = 8px
 *  - Shadow: shadow/xs = 0 1px 2px rgba(0,0,0,0.05)
 *  - Font: text-sm regular, var(--foreground)
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { label, error, hint, leftAddon, rightAddon, id, className, ...props },
    ref
  ) {
    const inputId =
      id ??
      `input-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;

    const isDateType =
      props.type === "date" ||
      props.type === "datetime-local" ||
      props.type === "time";

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium leading-none text-foreground"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftAddon && (
            <div className="pointer-events-none absolute left-3 text-muted-foreground">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={cn(
              /* Figma: h-9, px-3, rounded-md, shadow/xs, border=var(--input) */
              "h-9 w-full rounded-md border px-3 py-1 text-sm",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus-visible:ring-destructive"
                : "border-input",
              leftAddon && "pl-9",
              rightAddon && "pr-9",
              isDateType && "dark:[color-scheme:dark]",
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute right-3 flex items-center text-muted-foreground">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
