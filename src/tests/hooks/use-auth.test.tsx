import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { useAuth } from "@/hooks/use-auth";

const VALID = { email: "alex@example.com", password: "password123" };

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  function wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  it("starts unauthenticated when no persisted session", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => { vi.advanceTimersByTime(0); });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("rehydrates from localStorage on mount", async () => {
    // Pre-seed the session
    const user = { id: "usr_1", name: "Alex Johnson", email: "alex@example.com", role: "admin" };
    localStorage.setItem("auth_user", JSON.stringify(user));

    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => { vi.advanceTimersByTime(0); });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe(VALID.email);
  });

  it("sets isAuthenticated to true after login", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const promise = result.current.login(VALID);
      vi.advanceTimersByTime(1000);
      await promise;
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe("Alex Johnson");
  });

  it("clears user on logout", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const p = result.current.login(VALID);
      vi.advanceTimersByTime(1000);
      await p;
    });

    act(() => { result.current.logout(); });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("auth_user")).toBeNull();
  });

  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      /useAuth must be used within/
    );
  });
});
