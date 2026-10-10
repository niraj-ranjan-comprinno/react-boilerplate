import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./button";
import { env } from "@/lib/env";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback UI. Receives the error + a reset callback. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * ErrorBoundary atom — catches unhandled render errors in the subtree and
 * renders a recovery UI instead of crashing the whole app.
 *
 * Place at multiple levels:
 *  - Root (catches everything)
 *  - Individual page/route (isolates crashes to one route)
 *  - Around risky widgets (charts, third-party embeds)
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 *
 * // Custom fallback:
 * <ErrorBoundary fallback={(err, reset) => <MyErrorPage error={err} onReset={reset} />}>
 *   <DashboardPage />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with a real error-reporting service (Sentry, Datadog, etc.)
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
          <p className="text-3xl" aria-hidden="true">⚠️</p>
          <h2 className="text-lg font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            An unexpected error occurred. If this keeps happening, please
            contact support.
          </p>
          {/* Show error message only in development — uses env.isDev (not import.meta.env directly) */}
          {env.isDev && (
            <pre className="max-w-full overflow-auto rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-left text-xs text-destructive">
              {error.message}
            </pre>
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={this.reset}>
              Try again
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.assign("/")}
            >
              Go to start
            </Button>
          </div>
        </div>
      );
    }

    return children;
  }
}
