/**
 * Toast atom — re-exports Sonner's Toaster + a typed `toast()` helper.
 *
 * Add <Toaster /> once in main.tsx or your root layout.
 * Then call `toast.success("Saved!")` anywhere.
 *
 * @example
 * // main.tsx
 * import { Toaster } from "@/components/atoms/toast";
 * <Toaster position="bottom-right" richColors />
 *
 * // Any component
 * import { toast } from "@/components/atoms/toast";
 * toast.success("Profile saved");
 * toast.error("Something went wrong");
 * toast.loading("Uploading…");
 * toast.promise(uploadFile(), { loading: "Uploading…", success: "Done!", error: "Failed" });
 */
export { Toaster, toast } from "sonner";
