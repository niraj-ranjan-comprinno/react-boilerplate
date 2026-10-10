import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ComponentShowcasePage } from "@/pages/ComponentShowcase/ComponentShowcasePage";

const themeState = vi.hoisted(() => ({ isDark: false }));

vi.mock("@/app/providers/ThemeProvider", () => ({
  useTheme: () => ({
    isDark: themeState.isDark,
    theme: themeState.isDark ? "dark" : "light",
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

describe("ComponentShowcasePage semantic tokens", () => {
  beforeEach(() => {
    themeState.isDark = false;
  });

  it("shows the active light-theme token labels", () => {
    render(
      <MemoryRouter>
        <ComponentShowcasePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Semantic (light)")).toBeInTheDocument();
    expect(screen.getByText("#f7f7f5")).toBeInTheDocument();
    expect(screen.getByText("#ffffff")).toBeInTheDocument();
  });

  it("shows the active dark-theme token labels", () => {
    themeState.isDark = true;
    render(
      <MemoryRouter>
        <ComponentShowcasePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Semantic (dark)")).toBeInTheDocument();
    expect(screen.getByText("#0a0a0b")).toBeInTheDocument();
    expect(screen.getByText("#121214")).toBeInTheDocument();
  });
});
