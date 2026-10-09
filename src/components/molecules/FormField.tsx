import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/atoms/input";
import { cn } from "@/lib/utils";

export interface FormFieldProps extends InputProps {
  /** Override the error displayed under the input. */
  error?: string;
}

/**
 * Molecule: Input + accessible label + validation message wired together.
 *
 * Wraps the `Input` atom and passes error / hint through.
 * Use this inside React Hook Form — forward the ref and spread register() output.
 *
 * @example
 * <FormField
 *   label="Email"
 *   type="email"
 *   required
 *   {...register("email")}
 *   error={errors.email?.message}
 * />
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ className, ...props }, ref) {
    return (
      <div className={cn("w-full", className)}>
        <Input ref={ref} {...props} />
      </div>
    );
  }
);
