import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { AppRouter } from "@/app/router";
import { ErrorBoundary } from "@/components/atoms/error-boundary";
import { Toaster } from "@/components/atoms/toast";
import "@/styles/globals.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found in the DOM.");

createRoot(rootElement).render(
  <StrictMode>
    {/* Root-level boundary — catches any unhandled render error */}
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
          {/* Toaster — renders toast notifications globally */}
          <Toaster position="bottom-right" richColors closeButton />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
