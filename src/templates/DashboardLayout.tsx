/**
 * DashboardLayout — Vorflux-style collapsible sidebar.
 *
 * Behavior (matches screenshots):
 *   - Default: collapsed (icon-only, 60 px)
 *   - Click toggle button → expands to 240 px with labels
 *   - Toggle button floats on the sidebar's right edge
 *   - Hover state: blue accent on toggle button (like Vorflux [|>] icon)
 *   - Mobile: expanded sidebar is an overlay with backdrop
 */
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  FolderOpen,
  MessageCircle,
  Settings,
  Blocks,
  WandSparkles,
  BookOpen,
  PanelLeftOpen,
  PanelLeftClose,
  Moon,
  Sun,
  LogOut,
  Volume2,
} from "lucide-react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { AvatarRoot, AvatarFallback } from "@/components/atoms/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { Separator } from "@/components/atoms/separator";
import { Switch } from "@/components/atoms/switch";
import { Logo } from "@/assets/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/app/providers/ThemeProvider";
import { routes } from "@/app/router/routes";
import { cn } from "@/lib/utils";

// ── Nav config ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    href: routes.dashboard,
    label: "Dashboard",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" aria-hidden="true" />,
    exact: true,
  },
  {
    href: routes.analytics,
    label: "Analytics",
    icon: <BarChart2 className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
  {
    href: routes.projects,
    label: "Projects",
    icon: <FolderOpen className="h-[18px] w-[18px]" aria-hidden="true" />,
    badge: "3",
    badgeColor: "bg-primary/20 text-primary-ink",
  },
  {
    href: routes.messages,
    label: "Messages",
    icon: <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
  {
    href: routes.forms,
    label: "Form Examples",
    icon: <WandSparkles className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
  {
    href: routes.components,
    label: "Components",
    icon: <Blocks className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
  {
    href: routes.docs,
    label: "Documentation",
    icon: <BookOpen className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
];

// Settings separate so it renders after a divider at the bottom nav
const BOTTOM_ITEMS = [
  {
    href: routes.settings,
    label: "Settings",
    icon: <Settings className="h-[18px] w-[18px]" aria-hidden="true" />,
  },
];

// ── UserMenu (theme toggle + logout, shown in sidebar user strip) ──────────

function UserMenu() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
          aria-label="User settings"
          className="flex h-7 w-7 items-center justify-center rounded-full ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AvatarRoot className="h-7 w-7 cursor-pointer">
            <AvatarFallback className="bg-secondary text-[10px] font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </AvatarRoot>
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" sideOffset={12} className="w-56 p-1">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Separator className="my-1" />

        {/* Theme toggle */}
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          {isDark
            ? <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            : <Sun  className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          }
          <span className="flex-1 text-sm text-foreground">Dark theme</span>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </div>

        {/* Samantha placeholder */}
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="flex-1 text-sm text-foreground">Samantha speaks</span>
          <Switch />
        </div>

        <Separator className="my-1" />

        <button
          onClick={() => { logout(); navigate(routes.home); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </PopoverContent>
    </Popover>
  );
}

// ── getPageTitle ──────────────────────────────────────────────────────────

/** Exported so pages can use it when they need a consistent title. */
export function getPageTitle(pathname: string): string {
  if (pathname === routes.dashboard)              return "Operational Dashboard";
  if (pathname.startsWith(routes.analytics))      return "Analytics";
  if (pathname.startsWith(routes.projects))       return "Projects";
  if (pathname.startsWith(routes.messages))       return "Messages";
  if (pathname.startsWith(routes.settings))       return "Settings";
  if (pathname.startsWith(routes.components))     return "Components";
  if (pathname.startsWith(routes.forms))          return "Form Examples";
  if (pathname.startsWith(routes.docs))           return "Documentation";
  return "Dashboard";
}

// ── Template ──────────────────────────────────────────────────────────────

/**
 * Vorflux-style collapsible sidebar layout.
 *
 * Sidebar states:
 *   collapsed = true  → 60 px icon-only  (default)
 *   collapsed = false → 240 px with labels
 *
 * The floating toggle button sticks out 12 px from the sidebar's right edge.
 * On hover it shows an accent ring — matching the Vorflux [|>] interaction.
 */
export function DashboardLayout() {
  const { user } = useAuth();
  // Default to collapsed so the first experience matches Vorflux screenshot 2
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">

      {/* ── Mobile backdrop ───────────────────────────────────────────── */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          aria-hidden="true"
          onClick={() => setCollapsed(true)}
        />
      )}

      {collapsed && (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={() => setCollapsed(false)}
          className={cn(
            "fixed left-3 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-md lg:hidden",
            "border border-border bg-sidebar text-muted-foreground shadow-sm",
            "transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
        </button>
      )}

      {/* ── Sidebar wrapper ───────────────────────────────────────────── */}
      {/*
       * Desktop: static in flex row, width animates between 60px ↔ 240px
       * Mobile: fixed overlay that slides in via translateX
       * "relative" allows the floating toggle button (-right-3.5) to escape
       */}
      <aside
        className={cn(
          // Base
          "relative flex-shrink-0 h-full z-30",
          "border-r border-border bg-sidebar",
          // Desktop: animate width
          "hidden lg:flex lg:flex-col",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "lg:w-[60px]" : "lg:w-[240px]"
        )}
      >
        <Sidebar
          className="h-full w-full"
          collapsed={collapsed}
          logo={<Logo />}
          logoCollapsed={<Logo collapsed />}
          homeHref={routes.dashboard}
          navItems={NAV_ITEMS}
          pageLinksAfter={BOTTOM_ITEMS}
          navLabel=""
          pagesLabel=""
          user={
            user
              ? { name: user.name, role: user.role, avatarUrl: user.avatarUrl }
              : undefined
          }
          userAction={<UserMenu />}
        />

        {/* ── Toggle button — Vorflux [|>] / [<|] icon ───────────────── */}
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            // Float out of the sidebar's right edge
            "absolute -right-3.5 top-5 z-50",
            // Shape — rounded square like Vorflux, not circle
            collapsed ? "hidden h-7 w-7 lg:flex" : "flex h-7 w-7",
            "items-center justify-center rounded-md",
            // Default: matches sidebar bg with a border
            "border border-border bg-sidebar text-muted-foreground shadow-sm",
            // Hover — Vorflux blue/primary fill (screenshot 2)
            "transition-all duration-150",
            "hover:bg-primary hover:border-primary hover:text-primary-foreground",
            // Focus
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          )}
        >
          {collapsed
            ? <PanelLeftOpen  className="h-3.5 w-3.5" aria-hidden="true" />
            : <PanelLeftClose className="h-3.5 w-3.5" aria-hidden="true" />
          }
        </button>
      </aside>

      {/* Mobile: hamburger trigger (shown only below lg) */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setCollapsed(false)}
        className="fixed top-4 left-4 z-40 lg:hidden flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background shadow-sm"
      >
        <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main
        className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto"
        id="main-content"
        aria-label="Page content"
      >
        <Outlet />
      </main>
    </div>
  );
}
