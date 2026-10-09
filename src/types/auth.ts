/** Authenticated user shape returned by the auth service. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  avatarUrl?: string;
}

/** Credentials used for the login mutation. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Auth context value exposed to consumers. */
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  /**
   * Re-reads the persisted user from localStorage and updates React state.
   * Call this after an external write to the auth store (e.g. at the end
   * of a multi-step onboarding flow) so `isAuthenticated` reflects reality.
   */
  refreshUser: () => void;
}
