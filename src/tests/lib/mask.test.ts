import { describe, it, expect } from "vitest";
import { maskEmail, maskPhone } from "@/lib/mask";

describe("maskEmail", () => {
  it("masks the middle of the local part", () => {
    expect(maskEmail("alex@example.com")).toBe("a**x@example.com");
  });

  it("handles a 2-char local part", () => {
    expect(maskEmail("aj@example.com")).toBe("a*@example.com");
  });

  it("handles a 1-char local part", () => {
    expect(maskEmail("a@example.com")).toBe("a*@example.com");
  });

  it("returns the original value when there is no @", () => {
    expect(maskEmail("notanemail")).toBe("notanemail");
  });

  it("is case-preserving for the domain", () => {
    expect(maskEmail("alex@EXAMPLE.COM")).toContain("@EXAMPLE.COM");
  });
});

describe("maskPhone", () => {
  it("keeps the prefix and last 2 digits", () => {
    expect(maskPhone("+12025550189")).toBe("+12*******89");
  });

  it("passes through short numbers unchanged", () => {
    expect(maskPhone("+1234")).toBe("+1234");
  });
});
