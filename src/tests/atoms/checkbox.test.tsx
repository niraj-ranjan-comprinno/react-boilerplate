import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "@/components/atoms/checkbox";

describe("Checkbox", () => {
  it("renders without a label", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders a label that is associated with the checkbox", () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox");
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox label="Test" />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("calls onCheckedChange when clicked", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={handler} />);
    await user.click(screen.getByRole("checkbox"));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Checkbox label="Disabled" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("shows an error message", () => {
    render(<Checkbox label="Accept" error="You must accept." />);
    expect(screen.getByRole("alert")).toHaveTextContent("You must accept.");
  });
});
