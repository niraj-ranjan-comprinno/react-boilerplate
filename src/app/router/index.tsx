import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/atoms/spinner";
import { ErrorBoundary } from "@/components/atoms/error-boundary";
import { routes } from "./routes";

// ── Lazy-loaded routes ────────────────────────────────────────────────────
// Each is its own JS chunk — loads only when the user navigates there.

const SplashPhase       = lazy(() => import("@/pages/AuthFlow/phases/SplashPhase").then(m => ({ default: m.SplashPhase })));
const IdpPhase          = lazy(() => import("@/pages/AuthFlow/phases/IdpPhase").then(m => ({ default: m.IdpPhase })));
const MfaPhase          = lazy(() => import("@/pages/AuthFlow/phases/MfaPhase").then(m => ({ default: m.MfaPhase })));
const VoiceVerifyPhase  = lazy(() => import("@/pages/AuthFlow/phases/VoiceVerifyPhase").then(m => ({ default: m.VoiceVerifyPhase })));

const DashboardLayout     = lazy(() => import("@/templates/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const DashboardPage       = lazy(() => import("@/pages/Dashboard").then(m => ({ default: m.DashboardPage })));
const ComponentShowcasePage = lazy(() => import("@/pages/ComponentShowcase").then(m => ({ default: m.ComponentShowcasePage })));
const FormExamplesPage    = lazy(() => import("@/pages/FormExamples").then(m => ({ default: m.FormExamplesPage })));
const DocsPage            = lazy(() => import("@/pages/Docs").then(m => ({ default: m.DocsPage })));
const NotFoundPage        = lazy(() => import("@/pages/NotFound").then(m => ({ default: m.NotFoundPage })));

// ── Shared loading UI ─────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <Spinner size="lg" label="Loading…" />
    </div>
  );
}

// ── Auth guards ────────────────────────────────────────────────────────────

/**
 * Redirects unauthenticated users to the splash screen.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  return isAuthenticated ? <>{children}</> : <Navigate to={routes.home} replace />;
}

/**
 * Redirects authenticated users away from the auth flow.
 * When VoiceVerifyPhase calls refreshUser() and isAuthenticated becomes
 * true, this guard fires automatically and sends the user to /dashboard
 * — without any explicit navigate() call in VoiceVerifyPhase.
 */
function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  return isAuthenticated ? <Navigate to={routes.dashboard} replace /> : <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────────────────

/**
 * Auth flow — each phase has its own URL:
 *
 *   /              →  SplashPhase       (XL Sphere + "Get started")
 *   /login         →  IdpPhase          (Google SSO + email/password)
 *   /login/mfa     →  MfaPhase          (6-digit OTP)
 *   /login/voice   →  VoiceVerifyPhase  (mic + passphrase)
 *   /dashboard     →  DashboardLayout
 *
 * Email is passed forward via location.state (not query params).
 * VoiceVerifyPhase calls refreshUser() — GuestRoute auto-redirects.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Auth flow ─────────────────────────────────────────────── */}
          <Route path={routes.home} element={
            <GuestRoute><ErrorBoundary><SplashPhase /></ErrorBoundary></GuestRoute>
          } />

          <Route path={routes.login} element={
            <GuestRoute><ErrorBoundary><IdpPhase /></ErrorBoundary></GuestRoute>
          } />

          <Route path={routes.loginMfa} element={
            <GuestRoute><ErrorBoundary><MfaPhase /></ErrorBoundary></GuestRoute>
          } />

          <Route path={routes.loginVoice} element={
            <GuestRoute><ErrorBoundary><VoiceVerifyPhase /></ErrorBoundary></GuestRoute>
          } />

          {/* ── Protected dashboard ───────────────────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ErrorBoundary><DashboardLayout /></ErrorBoundary>
            </ProtectedRoute>
          }>
            <Route index             element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="components" element={<ErrorBoundary><ComponentShowcasePage /></ErrorBoundary>} />
            <Route path="forms"      element={<ErrorBoundary><FormExamplesPage /></ErrorBoundary>} />
            <Route path="docs"       element={<ErrorBoundary><DocsPage /></ErrorBoundary>} />
            <Route path="analytics"  element={<ComingSoon title="Analytics" />} />
            <Route path="projects"   element={<ComingSoon title="Projects" />} />
            <Route path="messages"   element={<ComingSoon title="Messages" />} />
            <Route path="settings"   element={<ComingSoon title="Settings" />} />
          </Route>

          {/* ── 404 ──────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl" aria-hidden="true">🚧</span>
      <h2 className="mt-4 text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">This page is under construction.</p>
    </div>
  );
}
