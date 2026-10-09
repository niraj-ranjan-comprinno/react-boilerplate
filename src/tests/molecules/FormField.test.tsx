import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "@/components/molecules/FormField";

describe("FormField", () => {
  it("renders a labelled input", () => {
    render(<FormField label="Email" placeholder="you@example.com" />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("shows the required indicator when required", () => {
    render(<FormField label="Email" required />);
    const label = screen.getByText(/email/i);
    // The asterisk is rendered as a sibling inside the <label>
    expect(label.closest("label")).toContainElement(screen.getByText("*"));
  });

  it("displays an error message and sets aria-invalid", () => {
    render(<FormField label="Email" error="Invalid email address." />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email address.");
  });

  it("does not show the error when no error prop is passed", () => {
    render(<FormField label="Email" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("displays a hint when no error is present", () => {
    render(<FormField label="Username" hint="Letters and numbers only." />);
    expect(screen.getByText(/letters and numbers/i)).toBeInTheDocument();
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<FormField label="Name" placeholder="Enter name" />);
    const input = screen.getByLabelText(/name/i);
    await user.type(input, "Alex");
    expect(input).toHaveValue("Alex");
  });
});
