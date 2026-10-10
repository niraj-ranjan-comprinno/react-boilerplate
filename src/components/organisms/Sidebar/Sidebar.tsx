/**
 * Sidebar organism — collapsible icon/expanded nav.
 *
 * All hardcoded hex colors replaced with semantic design tokens.
 * Inline custom Tooltip replaced with Radix Tooltip atom.
 */
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/atoms/tooltip";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
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

// ── Component ─────────────────────────────────────────────────────────────

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

  // Expanded link — Vorflux style: more padding, subtle active bg
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors w-full",
      isActive
        ? "bg-primary/10 text-primary-ink"
        : "text-foreground/70 hover:bg-sidebar-hover hover:text-foreground"
    );

  // Icon-only link — left-edge active bar (CC NavRail pattern)
  const iconLinkCls = (active: boolean) =>
    cn(
      // 40×40 touch target, centered icon, rounded square bg
      "relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-150",
      active
        ? "bg-primary/10 text-primary-ink"
        : "text-foreground/60 hover:bg-sidebar-hover hover:text-foreground"
    );

  // Section label — muted-foreground instead of hardcoded slate
  const sectionLabel = (
    <span className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 block" />
  );
  void sectionLabel; // used inline below

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={cn(
          "flex h-full flex-col bg-sidebar",
          collapsed ? "overflow-visible" : "overflow-hidden",
          className
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-14 shrink-0 items-center border-b border-border",
            collapsed ? "justify-center px-0" : "px-4"
          )}
        >
          <NavLink to={homeHref} className="flex items-center min-w-0">
            {collapsed ? logoCollapsed : logo}
          </NavLink>
        </div>

        {/* Nav — more vertical breathing room like Vorflux */}
        <nav
          className={cn(
            "flex-1 py-3 space-y-0.5 sidebar-scroll",
            collapsed
              ? "px-2 overflow-visible"
              : "px-3 overflow-y-auto overflow-x-hidden"
          )}
        >
          {/* MAIN MENU */}
          <div>
            {!collapsed && navLabel && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 select-none">
                {navLabel}
              </p>
            )}
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* Wrapper centers the 40×40 icon button within the 60px rail */}
                        <NavLink
                          to={item.href}
                          end={item.exact}
                          className="flex items-center justify-center"
                        >
                          {({ isActive }) => (
                            <span className={iconLinkCls(isActive)}>
                              {isActive && (
                                <span
                                  className="absolute -left-1.5 h-5 w-0.5 rounded-full bg-primary"
                                  aria-hidden="true"
                                />
                              )}
                              {item.icon}
                              {item.badge && (
                                <span
                                  className={cn(
                                    "absolute -top-0.5 -right-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[9px] font-bold",
                                    item.badgeColor
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </span>
                          )}
                        </NavLink>
                      </TooltipTrigger>
                      {/* Tooltip — like Vorflux screenshot 3: label appears to the right */}
                      <TooltipContent side="right" className="font-medium text-sm">{item.label}</TooltipContent>
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

          {collapsed && <div className="border-t border-border" />}

          {/* PAGES */}
          {(pageLinks.length > 0 || hasComponents || pageLinksAfter.length > 0) && (
            <div>
              {!collapsed && pagesLabel && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 select-none">
                  {pagesLabel}
                </p>
              )}
              <ul className="space-y-0.5">
                {pageLinks.map((page) => (
                  <li key={page.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink to={page.href}>
                            {({ isActive }) => (
                              <span className={iconLinkCls(isActive)}>
                                {page.icon}
                              </span>
                            )}
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{page.label}</TooltipContent>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink to={componentsHref}>
                            {({ isActive }) => (
                              <span className={iconLinkCls(isActive)}>
                                {componentsIcon}
                              </span>
                            )}
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{componentsLabel}</TooltipContent>
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
                              ? "bg-primary/15 text-primary-ink font-medium"
                              : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
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
                          <div className="mt-1 ml-3.5 border-l border-border pl-3 space-y-1">
                            {componentGroups.map((group) => {
                              const isGroupOpen =
                                openSubGroups[group.heading] ?? false;
                              return (
                                <div key={group.heading}>
                                  <button
                                    type="button"
                                    onClick={() => toggleSubGroup(group.heading)}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors text-muted-foreground/60 hover:text-muted-foreground"
                                  >
                                    <ChevronRight
                                      className={cn(
                                        "h-3 w-3 shrink-0 transition-transform duration-200",
                                        isGroupOpen && "rotate-90"
                                      )}
                                    />
                                    {group.heading}
                                    <span className="ml-auto text-[9px] font-normal opacity-50">
                                      {group.items.length}
                                    </span>
                                  </button>

                                  {isGroupOpen && (
                                    <ul className="mt-0.5 ml-2 space-y-0.5 border-l border-border pl-2">
                                      {group.items.map((sub) => (
                                        <li key={sub.id}>
                                          <NavLink
                                            to={sub.href}
                                            className={({ isActive }) =>
                                              cn(
                                                "flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                                                isActive
                                                  ? "bg-primary/10 font-medium text-primary-ink"
                                                  : "text-muted-foreground hover:bg-sidebar-hover/60 hover:text-foreground"
                                              )
                                            }
                                          >
                                            {({ isActive }) => (
                                              <>
                                                <span
                                                  className={cn(
                                                    "h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                                                    isActive
                                                      ? "bg-primary"
                                                      : "bg-muted-foreground/20"
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

                {pageLinksAfter.map((page) => (
                  <li key={page.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink to={page.href}>
                            {({ isActive }) => (
                              <span className={iconLinkCls(isActive)}>
                                {page.icon}
                              </span>
                            )}
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{page.label}</TooltipContent>
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
              "shrink-0 border-t border-border py-3",
              collapsed ? "px-2" : "px-4"
            )}
          >
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <img
                    src={user.avatarUrl ?? `https://ui-avatars.com/api/?name=${user.name}`}
                    alt={`${user.name} avatar`}
                    className="mx-auto h-8 w-8 rounded-full object-cover ring-2 ring-primary/30 cursor-pointer"
                  />
                </TooltipTrigger>
                <TooltipContent side="right">{user.name}</TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl ?? `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={`${user.name} avatar`}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
                {userAction}
              </div>
            )}
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
