import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z, ZodType } from "zod";

/**
 * Typed wrapper around `useForm` that automatically wires the Zod resolver.
 *
 * TypeScript infers field names and value types directly from the schema,
 * so no separate interface is needed for form values.
 *
 * @example
 * const form = useZodForm(loginSchema, {
 *   defaultValues: { email: "", password: "" },
 * });
 */
export function useZodForm<TSchema extends ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
