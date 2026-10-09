import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { useState } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary } from "@/components/atoms/error-boundary";

// Suppress React's console.error for expected boundary catches
beforeAll(() => {
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});
afterAll(() => {
  vi.restoreAllMocks();
});

function Bomb({ throws }: { throws: boolean }) {
  if (throws) throw new Error("Boom — test error");
  return <p>Safe content</p>;
}

/**
 * Wrapper that lets tests toggle the error state from outside
 * so the reset flow can be tested properly.
 */
function ToggleBomb() {
  const [throws, setThrows] = useState(true);
  return (
    <div>
      <button onClick={() => setThrows(false)}>Fix it</button>
      <ErrorBoundary>
        <Bomb throws={throws} />
      </ErrorBoundary>
    </div>
  );
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <Bomb throws={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("renders the fallback UI when a child throws", () => {
    render(
      <ErrorBoundary>
        <Bomb throws />
      </ErrorBoundary>
    );
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
  });

  it("shows both recovery buttons in the default fallback", () => {
    render(
      <ErrorBoundary>
        <Bomb throws />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go to start/i })).toBeInTheDocument();
  });

  it("resets after clicking Try again when the child no longer throws", async () => {
    const user = userEvent.setup();
    render(<ToggleBomb />);

    // Boundary is showing the fallback
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();

    // Fix the throwing condition
    await user.click(screen.getByRole("button", { name: /fix it/i }));

    // Now reset the boundary
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /try again/i }));
    });

    // Child should render successfully now
    expect(screen.getByText("Safe content")).toBeInTheDocument();
  });

  it("accepts and renders a custom fallback", () => {
    render(
      <ErrorBoundary fallback={(err) => <p>Custom: {err.message}</p>}>
        <Bomb throws />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Custom: Boom/)).toBeInTheDocument();
  });
});
