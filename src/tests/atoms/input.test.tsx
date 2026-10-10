import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/atoms/input";

describe("Input", () => {
  it("renders without a label", () => {
    render(<Input placeholder="Enter value" />);
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });

  it("renders a label that is associated with the input", () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
  });

  it("shows a required asterisk when required", () => {
    render(<Input label="Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays an error message with aria-invalid", () => {
    render(<Input label="Email" error="Invalid email." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email.");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("aria-invalid", "true");
  });

  it("displays a hint when no error", () => {
    render(<Input label="Username" hint="Letters only." />);
    expect(screen.getByText("Letters only.")).toBeInTheDocument();
  });

  it("does not show hint when error is present", () => {
    render(<Input label="Email" error="Required." hint="Your work email." />);
    expect(screen.queryByText("Your work email.")).not.toBeInTheDocument();
    expect(screen.getByText("Required.")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input label="Disabled" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    await user.type(screen.getByLabelText(/name/i), "Alex");
    expect(screen.getByLabelText(/name/i)).toHaveValue("Alex");
  });
});
