import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/atoms/input";
import { cn } from "@/lib/utils";

export type PasswordFieldProps = Omit<InputProps, "type" | "rightAddon">;

/**
 * Molecule: Password input with a visibility toggle button.
 *
 * Manages its own show/hide state so callers don't need to.
 *
 * @example
 * <PasswordField
 *   label="Password"
 *   required
 *   {...register("password")}
 *   error={errors.password?.message}
 * />
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ className, ...props }, ref) {
    const [visible, setVisible] = useState(false);

    const toggleButton = (
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-foreground transition-colors"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    );

    return (
      <div className={cn("w-full", className)}>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          rightAddon={toggleButton}
          autoComplete="current-password"
          {...props}
        />
      </div>
    );
  }
);
