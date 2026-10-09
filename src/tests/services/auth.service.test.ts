import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { authService } from "@/services/auth.service";

const VALID   = { email: "alex@example.com", password: "password123" };
const INVALID = { email: "alex@example.com", password: "wrong" };

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  describe("login", () => {
    it("resolves with the user on correct credentials", async () => {
      const promise = authService.login(VALID);
      vi.advanceTimersByTime(1000);
      const user = await promise;
      expect(user.email).toBe(VALID.email);
      expect(user.role).toBe("admin");
      expect(user).not.toHaveProperty("password");
    });

    it("persists the user to localStorage on success", async () => {
      const promise = authService.login(VALID);
      vi.advanceTimersByTime(1000);
      await promise;
      const raw = localStorage.getItem("auth_user");
      expect(raw).not.toBeNull();
      const stored = JSON.parse(raw!);
      expect(stored.email).toBe(VALID.email);
    });

    it("throws on invalid credentials", async () => {
      const promise = authService.login(INVALID);
      vi.advanceTimersByTime(1000);
      await expect(promise).rejects.toThrow("Invalid email or password");
    });

    it("is case-insensitive for email", async () => {
      const promise = authService.login({ ...VALID, email: "ALEX@EXAMPLE.COM" });
      vi.advanceTimersByTime(1000);
      const user = await promise;
      expect(user.email).toBe(VALID.email);
    });
  });

  describe("logout", () => {
    it("removes the persisted user from localStorage", async () => {
      const loginPromise = authService.login(VALID);
      vi.advanceTimersByTime(1000);
      await loginPromise;
      authService.logout();
      expect(localStorage.getItem("auth_user")).toBeNull();
    });
  });

  describe("getPersistedUser", () => {
    it("returns null when no session exists", () => {
      expect(authService.getPersistedUser()).toBeNull();
    });

    it("returns the stored user after login", async () => {
      const loginPromise = authService.login(VALID);
      vi.advanceTimersByTime(1000);
      await loginPromise;
      const user = authService.getPersistedUser();
      expect(user?.email).toBe(VALID.email);
    });

    it("returns null after logout", async () => {
      const loginPromise = authService.login(VALID);
      vi.advanceTimersByTime(1000);
      await loginPromise;
      authService.logout();
      expect(authService.getPersistedUser()).toBeNull();
    });
  });
});
