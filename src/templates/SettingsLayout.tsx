import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface SettingsNavItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SettingsLayoutProps {
  /** Navigation items rendered in the left sidebar. */
  navItems: SettingsNavItem[];
  children: React.ReactNode;
  className?: string;
}

/**
 * Template: Settings page shell.
 *
 * Two-column layout:
 *   - Left: sticky nav sidebar with section links
 *   - Right: scrollable content area (`children`)
 *
 * On mobile, the nav collapses to a horizontal scrollable tab row.
 *
 * @example
 * <SettingsLayout navItems={SETTINGS_NAV}>
 *   <Outlet />
 * </SettingsLayout>
 */
export function SettingsLayout({
  navItems,
  children,
  className,
}: SettingsLayoutProps) {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
      isActive
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
    );

  return (
    <div className={cn("flex flex-col gap-6 lg:flex-row lg:gap-10", className)}>
      {/* ── Side nav ──────────────────────────────────────────────────── */}
      <aside className="lg:w-56 lg:shrink-0">
        {/* Mobile: horizontal scroll tab bar */}
        <nav
          aria-label="Settings navigation"
          className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end className={linkCls}>
              {item.icon && (
                <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="whitespace-nowrap lg:whitespace-normal">
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <main className="min-w-0 flex-1" aria-label="Settings content">
        {children}
      </main>
    </div>
  );
}
