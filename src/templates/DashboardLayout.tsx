import { forwardRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart2,
  FolderOpen,
  MessageCircle,
  Settings,
  Blocks,
  WandSparkles,
  BookOpen,
  Sparkles,
  LifeBuoy,
  Moon,
  Sun,
  LogOut,
  Volume2,
} from "lucide-react";
import { AvatarRoot, AvatarFallback } from "@/components/atoms/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Separator } from "@/components/atoms/separator";
import { Switch } from "@/components/atoms/switch";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/atoms/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/app/providers/ThemeProvider";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";

// ── Nav items ─────────────────────────────────────────────────────────────

type NavKey = string;

interface NavDest {
  key: NavKey;
  label: string;
  icon: React.ElementType;
  href: string;
  exact?: boolean;
}

const NAV: NavDest[] = [
  { key: "mission",    label: "Action Space",        icon: Sparkles,       href: routes.dashboard,   exact: true },
  { key: "analytics",  label: "Analytics",            icon: BarChart2,      href: routes.analytics },
  { key: "projects",   label: "Projects",             icon: FolderOpen,     href: routes.projects },
  { key: "messages",   label: "Messages",             icon: MessageCircle,  href: routes.messages },
  { key: "forms",      label: "Form Examples",        icon: WandSparkles,   href: routes.forms },
  { key: "components", label: "Component Showcase",   icon: Blocks,         href: routes.components },
  { key: "docs",       label: "Documentation",        icon: BookOpen,       href: routes.docs },
  { key: "settings",   label: "Settings",             icon: Settings,       href: routes.settings },
];

// ── NavItem ───────────────────────────────────────────────────────────────

const NavItem = forwardRef<
  HTMLButtonElement,
  { dest: NavDest; onClick: () => void }
>(function NavItem({ dest, onClick }, ref) {
  const Icon = dest.icon;
  return (
    <NavLink to={dest.href} end={dest.exact} onClick={onClick}>
      {({ isActive }) => (
        <button
          ref={ref}
          aria-label={dest.label}
          aria-current={isActive ? "page" : undefined}
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            isActive
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          )}
        >
          {/* Left-edge active bar — matches CC NavRail exactly */}
          {isActive && (
            <span
              className="absolute -left-3 h-5 w-0.5 rounded-full bg-primary"
              aria-hidden="true"
            />
          )}
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      )}
    </NavLink>
  );
});

// ── UserMenu ──────────────────────────────────────────────────────────────

function UserMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="User menu"
          className="rounded-full ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AvatarRoot className="h-8 w-8 cursor-pointer">
            <AvatarFallback className="bg-secondary text-xs font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </AvatarRoot>
        </button>
      </PopoverTrigger>

      <PopoverContent side="right" align="end" sideOffset={12} className="w-56 p-1">
        {/* User info */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>

        <Separator className="my-1" />

        {/* Theme toggle */}
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          {isDark ? (
            <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
          <span className="flex-1 text-sm text-foreground">Dark theme</span>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </div>

        {/* Samantha (placeholder) */}
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="flex-1 text-sm text-foreground">Samantha speaks</span>
          <Switch />
        </div>

        <Separator className="my-1" />

        {/* Logout */}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </PopoverContent>
    </Popover>
  );
}

// ── NavRail ───────────────────────────────────────────────────────────────

/**
 * 56 px icon-only nav rail — matches command-center-main NavRail exactly.
 *
 * Structure:
 *   Logo (teal square, top)
 *   Nav items (flex-1, with active bar indicator)
 *   UserMenu avatar (bottom)
 */
function NavRail() {
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={200}>
      <nav
        className="flex h-full w-14 shrink-0 flex-col items-center border-r border-border bg-card/60 py-3"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <button
          onClick={() => navigate(routes.dashboard)}
          aria-label="Go to dashboard"
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <LifeBuoy className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Nav items */}
        <div className="flex flex-1 flex-col items-center gap-1">
          {NAV.map((dest) => (
            <Tooltip key={dest.key}>
              <TooltipTrigger asChild>
                <NavItem dest={dest} onClick={() => {}} />
              </TooltipTrigger>
              <TooltipContent side="right">{dest.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* User avatar */}
        <UserMenu />
      </nav>
    </TooltipProvider>
  );
}

// ── PageHeader (CC style) ─────────────────────────────────────────────────

/**
 * CC-style inline page header — `px-8 pt-8`, `text-lg font-semibold`.
 * No separate top bar — lives inside the <main> scroll area.
 */
export function CCPageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="shrink-0 px-8 pt-8">
      <div className="flex min-h-8 items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {actions}
      </div>
    </header>
  );
}

// ── Page title map (kept for external use / future PageHeader) ────────────

/** Returns a human-readable title for a given pathname. Export for use in page PageHeaders. */
export function getPageTitle(pathname: string): string {
  if (pathname === routes.dashboard) return "Operational Dashboard";
  if (pathname.startsWith(routes.analytics)) return "Analytics";
  if (pathname.startsWith(routes.projects)) return "Projects";
  if (pathname.startsWith(routes.messages)) return "Messages";
  if (pathname.startsWith(routes.settings)) return "Settings";
  if (pathname.startsWith(routes.components)) return "Components";
  if (pathname.startsWith(routes.forms)) return "Form Examples";
  if (pathname.startsWith(routes.docs)) return "Documentation";
  return "Dashboard";
}

// ── Template ──────────────────────────────────────────────────────────────

/**
 * DashboardLayout — matches command-center-main App.tsx layout exactly.
 *
 * ```
 * flex h-screen w-screen overflow-hidden bg-background
 *   NavRail (w-14 shrink-0 — always visible, icon-only)
 *   div (flex-1 flex flex-col)
 *     PageHeader (only on non-dashboard routes)
 *     main (flex-1 overflow-y-auto)
 *       Outlet
 * ```
 *
 * Notable differences from the old layout:
 *  - NO h-14 AppHeader bar — UserMenu + theme toggle live in NavRail
 *  - Sidebar is always narrow (56 px), never expands
 *  - PageHeader is the first element inside the scrollable main area
 */
export function DashboardLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* ── NavRail (56 px, always visible) ─────────────────────────── */}
      <NavRail />

      {/* ── Scrollable content column ────────────────────────────────── */}
      <main
        className="min-h-0 min-w-0 flex-1 overflow-y-auto"
        id="main-content"
        aria-label="Page content"
      >
        <Outlet />
      </main>
    </div>
  );
}
