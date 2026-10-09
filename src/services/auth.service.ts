import type { LoginCredentials, User } from "@/types/auth";

const STORAGE_KEY = "auth_user";

/**
 * Mock authentication service.
 *
 * In a real app, replace these implementations with actual API calls.
 * The boundary is intentionally clear — swap the internals here without
 * touching any UI component.
 */

/** Demo users for development and testing. */
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: "usr_1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    role: "admin",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "usr_2",
    name: "Sofia Davis",
    email: "sofia@example.com",
    password: "password123",
    role: "editor",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
];

/** Simulate a network round-trip delay. */
function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const authService = {
  /** Authenticate with email + password — returns the user or throws. */
  async login(credentials: LoginCredentials): Promise<User> {
    await delay(800); // simulated latency

    const match = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === credentials.email.toLowerCase() &&
        u.password === credentials.password
    );

    if (!match) {
      throw new Error("Invalid email or password.");
    }

    const { password: _password, ...user } = match;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
    return user;
  },

  /** Remove persisted session. */
  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  },

  /** Returns the persisted user if the session is still live. */
  getPersistedUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },
};
