import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  /** true → only active on exact match */
  exact?: boolean;
}

export interface PageLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export interface SubItem {
  id: string;
  label: string;
  href: string;
}

export interface SubGroup {
  heading: string;
  items: SubItem[];
}

export interface UserInfo {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  logo: React.ReactNode;
  logoCollapsed: React.ReactNode;
  homeHref: string;
  navItems: NavItem[];
  navLabel?: string;
  pageLinks?: PageLink[];
  pageLinksAfter?: PageLink[];
  pagesLabel?: string;
  componentGroups?: SubGroup[];
  componentsLabel?: string;
  componentsIcon?: React.ReactNode;
  componentsHref?: string;
  user?: UserInfo;
  userAction?: React.ReactNode;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tip relative flex items-center w-full">
      {children}
      <div className="pointer-events-none absolute left-full ml-3 z-[9999] whitespace-nowrap rounded-lg border border-white/10 bg-[#0f172a] px-2.5 py-1.5 text-xs font-medium text-[#E2E8F0] opacity-0 shadow-xl transition-opacity group-hover/tip:opacity-100">
        {label}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0f172a]" />
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Organism: Application sidebar.
 *
 * Fully data-driven — pass nav items, page links, and component groups as
 * props.  Supports collapsed (icon-only) mode with tooltip labels.
 *
 * Adapted from the Next.js reference boilerplate; uses React Router's
 * NavLink instead of Next.js's Link + usePathname.
 */
export function Sidebar({
  className = "",
  collapsed = false,
  logo,
  logoCollapsed,
  homeHref,
  navItems,
  navLabel = "Main Menu",
  pageLinks = [],
  pageLinksAfter = [],
  pagesLabel = "Pages",
  componentGroups = [],
  componentsLabel = "Components",
  componentsIcon,
  componentsHref = "/dashboard/components",
  user,
  userAction,
}: SidebarProps) {
  const navigate = useNavigate();

  const hasComponents = componentGroups.length > 0;
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(componentGroups.map((g) => [g.heading, false]))
  );

  function toggleSubGroup(heading: string) {
    setOpenSubGroups((prev) => ({ ...prev, [heading]: !prev[heading] }));
  }

  // Expanded link style
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] transition-colors w-full",
      isActive
        ? "bg-primary/15 text-primary font-medium"
        : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
    );

  // Icon-only link style — left-edge active bar aligned with command-center-main NavRail
  const iconLinkCls = (active: boolean) =>
    cn(
      "relative flex items-center justify-center rounded-lg p-2 transition-colors w-full",
      active
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
    );

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar dark:bg-[#0f1318]",
        collapsed ? "overflow-visible" : "overflow-hidden",
        className
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-white/[0.06]",
          collapsed ? "justify-center px-0" : "px-4"
        )}
      >
        <NavLink to={homeHref} className="flex items-center min-w-0">
          {collapsed ? logoCollapsed : logo}
        </NavLink>
      </div>

      {/* Nav */}
      <nav
        className={cn(
          "flex-1 py-4 space-y-5 sidebar-scroll",
          collapsed ? "px-2 overflow-visible" : "px-3 overflow-y-auto overflow-x-hidden"
        )}
      >
        {/* MAIN MENU */}
        <div>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#475569]">
              {navLabel}
            </p>
          )}
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                {collapsed ? (
                  <Tooltip label={item.label}>
                    <NavLink to={item.href} end={item.exact}>
                      {({ isActive }) => (
                        <span className={iconLinkCls(isActive)}>
                          {/* Left-edge active bar — aligned with CC NavRail */}
                          {isActive && (
                            <span className="absolute -left-2 h-5 w-0.5 rounded-full bg-primary" aria-hidden="true" />
                          )}
                          {item.icon}
                          {item.badge && (
                            <span
                              className={cn(
                                "absolute right-1 top-1 flex h-3.5 min-w-[0.875rem] items-center justify-center rounded-full px-1 text-[9px] font-bold",
                                item.badgeColor
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </Tooltip>
                ) : (
                  <NavLink to={item.href} end={item.exact} className={linkCls}>
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                          item.badgeColor
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {collapsed && <div className="border-t border-white/[0.06]" />}

        {/* PAGES */}
        {(pageLinks.length > 0 || hasComponents || pageLinksAfter.length > 0) && (
          <div>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#475569]">
                {pagesLabel}
              </p>
            )}
            <ul className="space-y-0.5">
              {/* Static page links before Components */}
              {pageLinks.map((page) => (
                <li key={page.href}>
                  {collapsed ? (
                    <Tooltip label={page.label}>
                      <NavLink to={page.href}>
                        {({ isActive }) => (
                          <span className={iconLinkCls(isActive)}>{page.icon}</span>
                        )}
                      </NavLink>
                    </Tooltip>
                  ) : (
                    <NavLink to={page.href} className={linkCls}>
                      {page.icon}
                      <span className="flex-1">{page.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}

              {/* Components (collapsible) */}
              {hasComponents && (
                <li>
                  {collapsed ? (
                    <Tooltip label={componentsLabel}>
                      <NavLink to={componentsHref}>
                        {({ isActive }) => (
                          <span className={iconLinkCls(isActive)}>{componentsIcon}</span>
                        )}
                      </NavLink>
                    </Tooltip>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (!componentsOpen) {
                            setComponentsOpen(true);
                            navigate(componentsHref);
                          } else {
                            setComponentsOpen(false);
                          }
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[15px] transition-colors",
                          window.location.pathname.startsWith(componentsHref)
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#E2E8F0]"
                        )}
                      >
                        {componentsIcon}
                        <span className="flex-1 text-left">{componentsLabel}</span>
                        <ChevronRight
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                            componentsOpen && "rotate-90"
                          )}
                        />
                      </button>

                      {componentsOpen && (
                        <div className="mt-1 ml-3.5 border-l border-white/[0.06] pl-3 space-y-1">
                          {componentGroups.map((group) => {
                            const isGroupOpen = openSubGroups[group.heading] ?? false;
                            return (
                              <div key={group.heading}>
                                <button
                                  type="button"
                                  onClick={() => toggleSubGroup(group.heading)}
                                  className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors text-[#475569] hover:text-[#94A3B8]"
                                >
                                  <ChevronRight
                                    className={cn(
                                      "h-3 w-3 shrink-0 transition-transform duration-200",
                                      isGroupOpen && "rotate-90"
                                    )}
                                  />
                                  {group.heading}
                                  <span className="ml-auto text-[9px] font-normal text-[#475569]/60">
                                    {group.items.length}
                                  </span>
                                </button>

                                {isGroupOpen && (
                                  <ul className="mt-0.5 ml-2 space-y-0.5 border-l border-white/[0.04] pl-2">
                                    {group.items.map((sub) => (
                                      <li key={sub.id}>
                                        <NavLink
                                          to={sub.href}
                                          className={({ isActive }) =>
                                            cn(
                                              "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                                              isActive
                                                ? "bg-primary/10 font-medium text-primary"
                                                : "text-[#64748B] hover:bg-white/[0.03] hover:text-[#E2E8F0]"
                                            )
                                          }
                                        >
                                          {({ isActive }) => (
                                            <>
                                              <span
                                                className={cn(
                                                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                                                  isActive ? "bg-primary" : "bg-white/10"
                                                )}
                                              />
                                              {sub.label}
                                            </>
                                          )}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </li>
              )}

              {/* Static page links after Components */}
              {pageLinksAfter.map((page) => (
                <li key={page.href}>
                  {collapsed ? (
                    <Tooltip label={page.label}>
                      <NavLink to={page.href}>
                        {({ isActive }) => (
                          <span className={iconLinkCls(isActive)}>{page.icon}</span>
                        )}
                      </NavLink>
                    </Tooltip>
                  ) : (
                    <NavLink to={page.href} className={linkCls}>
                      {page.icon}
                      <span className="flex-1">{page.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User strip */}
      {user && (
        <div
          className={cn(
            "shrink-0 border-t border-white/[0.06] py-3",
            collapsed ? "px-2" : "px-4"
          )}
        >
          {collapsed ? (
            <Tooltip label={user.name}>
              <img
                src={user.avatarUrl ?? `https://ui-avatars.com/api/?name=${user.name}`}
                alt={`${user.name} avatar`}
                className="mx-auto h-8 w-8 rounded-full object-cover ring-2 ring-primary/30"
              />
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <img
                src={user.avatarUrl ?? `https://ui-avatars.com/api/?name=${user.name}`}
                alt={`${user.name} avatar`}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#E2E8F0]">{user.name}</p>
                <p className="truncate text-[11px] text-[#64748B] capitalize">{user.role}</p>
              </div>
              {userAction}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
