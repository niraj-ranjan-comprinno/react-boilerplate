import { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { Input, type InputProps } from "@/components/atoms/input";
import { cn } from "@/lib/utils";

export interface SearchFieldProps extends Omit<InputProps, "leftAddon" | "rightAddon" | "type"> {
  /** Called when the user clicks the clear button. */
  onClear?: () => void;
}

/**
 * Molecule: Search input with a leading search icon and a trailing clear
 * button that appears when the field has a value.
 *
 * @example
 * <SearchField
 *   placeholder="Search users…"
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   onClear={() => setQuery("")}
 * />
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField({ onClear, value, className, ...props }, ref) {
    const hasValue = Boolean(value);

    const clearButton = hasValue ? (
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear search"
        className="flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    ) : null;

    return (
      <div className={cn("w-full", className)}>
        <Input
          ref={ref}
          type="search"
          value={value}
          leftAddon={<Search className="h-4 w-4" />}
          rightAddon={clearButton}
          {...props}
        />
      </div>
    );
  }
);
