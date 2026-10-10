import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardLayout } from "@/templates/DashboardLayout";

vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: { name: "Alex Morgan", email: "alex@example.com", role: "Admin" },
    logout: vi.fn(),
  }),
}));

vi.mock("@/app/providers/ThemeProvider", () => ({
  useTheme: () => ({ isDark: true, toggleTheme: vi.fn() }),
}));

vi.mock("@/components/atoms/popover", () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  PopoverContent: ({
    children,
    side,
  }: {
    children: React.ReactNode;
    side?: string;
  }) => (
    <div data-testid="user-menu-content" data-side={side}>
      {children}
    </div>
  ),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("DashboardLayout mobile navigation", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 375 });
  });

  it("opens from the mobile-only trigger and closes from the backdrop", () => {
    const { container } = renderLayout();

    const mobileTrigger = screen
      .getAllByRole("button", { name: "Expand sidebar" })
      .find((button) => button.className.includes("fixed left-3"));
    expect(mobileTrigger).toBeDefined();
    fireEvent.click(mobileTrigger as HTMLButtonElement);
    expect(screen.getByRole("button", { name: "Collapse sidebar" })).toBeInTheDocument();

    const backdrop = container.querySelector(".fixed.inset-0.bg-black\\/30");
    expect(backdrop).toBeInTheDocument();
    fireEvent.click(backdrop as Element);

    expect(
      screen
        .getAllByRole("button", { name: "Expand sidebar" })
        .some((button) => button.className.includes("fixed left-3"))
    ).toBe(true);
  });

  it("places the user settings menu above the mobile drawer", () => {
    renderLayout();
    const mobileTrigger = screen
      .getAllByRole("button", { name: "Expand sidebar" })
      .find((button) => button.className.includes("fixed left-3"));
    fireEvent.click(mobileTrigger as HTMLButtonElement);
    expect(screen.getByTestId("user-menu-content")).toHaveAttribute("data-side", "top");
  });
});
