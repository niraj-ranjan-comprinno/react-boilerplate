import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/atoms/button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled and shows a spinner when isLoading is true", () => {
    render(<Button isLoading>Submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Submit</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders leftIcon before children", () => {
    const icon = <span data-testid="left-icon">★</span>;
    render(<Button leftIcon={icon}>Go</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toContainElement(screen.getByTestId("left-icon"));
  });

  it("applies variant classes via cva", () => {
    render(<Button variant="danger">Delete</Button>);
    const btn = screen.getByRole("button");
    // The danger variant applies bg-destructive
    expect(btn.className).toMatch(/destructive/);
  });
});
