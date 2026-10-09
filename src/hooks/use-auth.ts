import { useContext } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";

/**
 * Returns the auth context value.
 * Must be used inside `<AuthProvider>`.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
