import { createContext, useState, useEffect, useCallback } from "react";
import type { AuthContextValue, LoginCredentials, User } from "@/types/auth";
import { authService } from "@/services/auth.service";

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Provides authentication state to the component tree.
 *
 * On mount, rehydrates from localStorage. Exposes:
 *  - `login()`       — validates credentials → sets user state
 *  - `logout()`      — clears user state and localStorage
 *  - `refreshUser()` — re-reads localStorage and syncs React state.
 *                      Call this at the END of a multi-step auth flow
 *                      (e.g. after voice-verify) so `isAuthenticated`
 *                      reflects what the IDP phase already persisted.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on first render
  useEffect(() => {
    const persisted = authService.getPersistedUser();
    setUser(persisted);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  /**
   * Re-reads the persisted session from localStorage and updates React state.
   *
   * When `isAuthenticated` changes to `true` inside a `GuestRoute`, that
   * route will automatically redirect to `/dashboard` — no explicit `navigate()`
   * call needed in the calling component.
   */
  const refreshUser = useCallback(() => {
    const persisted = authService.getPersistedUser();
    setUser(persisted);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
