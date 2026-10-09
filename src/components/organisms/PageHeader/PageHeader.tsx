import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** If provided, the item is rendered as a link. */
  to?: string;
}

export interface PageHeaderProps {
  /** Primary page title — always `h1`. */
  title: string;
  /** Optional subtitle / description below the title. */
  description?: string;
  /** Optional breadcrumb trail above the title. */
  breadcrumb?: BreadcrumbItem[];
  /**
   * Action buttons/controls rendered right-aligned on desktop,
   * stacked below the title on mobile.
   */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Organism: Consistent page-level header.
 *
 * Every page in the product must use this component as its topmost
 * heading block so title, breadcrumb, and action placement are uniform.
 *
 * Placement: inside the `<main>` area, before page content.
 *
 * @example
 * <PageHeader
 *   title="Settings"
 *   description="Manage your account preferences."
 *   breadcrumb={[{ label: "Dashboard", to: "/dashboard" }, { label: "Settings" }]}
 *   actions={<Button>Save changes</Button>}
 * />
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-1",
        "sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {breadcrumb.map((item, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-border select-none">
                      ›
                    </span>
                  )}
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={
                        i === breadcrumb.length - 1
                          ? "font-medium text-foreground"
                          : ""
                      }
                      aria-current={
                        i === breadcrumb.length - 1 ? "page" : undefined
                      }
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        {/* Description */}
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="mt-3 flex shrink-0 flex-wrap items-center gap-2 sm:ml-4 sm:mt-0">
          {actions}
        </div>
      )}
    </header>
  );
}
