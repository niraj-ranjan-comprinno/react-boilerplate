import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/atoms/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("defaults to variant=default", () => {
    render(<Badge>Label</Badge>);
    const el = screen.getByText("Label");
    expect(el.className).toMatch(/bg-secondary/);
  });

  it("applies success variant styles", () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success").className).toMatch(/bg-success/);
  });

  it("applies danger/critical variant styles", () => {
    render(<Badge variant="critical">Critical</Badge>);
    expect(screen.getByText("Critical").className).toMatch(/bg-critical/);
  });

  it("applies outline variant styles", () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline").className).toMatch(/border-border/);
  });

  it("merges additional className", () => {
    render(<Badge className="test-class">X</Badge>);
    expect(screen.getByText("X").className).toContain("test-class");
  });

  it("renders all severity variants without error", () => {
    const variants = ["default","primary","success","warning","danger","info","critical","high","medium","low","muted"] as const;
    const { unmount } = render(
      <div>
        {variants.map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
      </div>
    );
    variants.forEach((v) => expect(screen.getByText(v)).toBeInTheDocument());
    unmount();
  });
});
