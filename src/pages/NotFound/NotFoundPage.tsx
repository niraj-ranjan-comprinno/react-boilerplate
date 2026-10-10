import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/button";
import { routes } from "@/app/router/routes";

/**
 * Page: 404 Not Found
 */
export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-7xl font-extrabold text-primary-ink/30 select-none">404</p>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
      </p>
      <Link to={routes.dashboard}>
        <Button variant="primary" size="md" className="mt-8">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
