import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "@/components/molecules/Pagination";

describe("Pagination", () => {
  it("shows the item range summary", () => {
    render(<Pagination page={1} pageSize={10} total={50} onPageChange={vi.fn()} />);
    expect(screen.getByText("Showing 1–10 of 50")).toBeInTheDocument();
  });

  it("shows 'No results' when total is 0", () => {
    render(<Pagination page={1} pageSize={10} total={0} onPageChange={vi.fn()} />);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("disables previous button on first page", () => {
    render(<Pagination page={1} pageSize={10} total={50} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination page={5} pageSize={10} total={50} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText("Go to next page")).toBeDisabled();
  });

  it("calls onPageChange with page+1 on next click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={2} pageSize={10} total={50} onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Go to next page"));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with page-1 on previous click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={3} pageSize={10} total={50} onPageChange={onChange} />);
    await user.click(screen.getByLabelText("Go to previous page"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("marks the current page with aria-current='page'", () => {
    render(<Pagination page={2} pageSize={10} total={50} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
  });
});
