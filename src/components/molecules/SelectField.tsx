import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Options array. */
  options: SelectOption[];
  /** Accessible label rendered above the select. */
  label?: string;
  /** Placeholder text shown as the first (disabled) option. */
  placeholder?: string;
  /** Validation error — sets aria-invalid and shows in red. */
  error?: string;
  /** Helper text shown below when no error is present. */
  hint?: string;
}

/**
 * Molecule: Styled native `<select>` with label, error, and hint.
 *
 * Uses a native select element for broad a11y support without requiring
 * a Radix Select dependency. Matches the Input atom's visual spec:
 *   h-9 (36px), rounded-md (8px), border-input, shadow/xs.
 *
 * @example
 * <SelectField
 *   label="Plan"
 *   options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }]}
 *   placeholder="Select a plan…"
 *   {...register("plan")}
 *   error={errors.plan?.message}
 * />
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, options, placeholder, error, hint, id, className, ...props },
    ref
  ) {
    const selectId =
      id ??
      `select-${label?.toLowerCase().replace(/\s+/g, "-") ?? Math.random().toString(36).slice(2)}`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-destructive" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
            className={cn(
              "h-9 w-full appearance-none rounded-md border px-3 pr-8 py-1 text-sm",
              "bg-background text-foreground cursor-pointer",
              "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:[color-scheme:dark]",
              error ? "border-destructive" : "border-input",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        {error && (
          <p id={`${selectId}-error`} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${selectId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
