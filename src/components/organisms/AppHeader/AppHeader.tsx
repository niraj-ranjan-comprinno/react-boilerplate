import { useState } from "react";
import { Moon, Sun, Bell, Menu, Search, LogOut, User, Settings } from "lucide-react";
import { Avatar } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface AppHeaderProps {
  /** Called when the hamburger menu is clicked. */
  onMenuToggle?: () => void;
  /** Display name for the current page. */
  pageTitle?: string;
}

/**
 * Organism: Top navigation bar.
 *
 * Contains a sidebar toggle, page title, search, theme toggle,
 * notification bell, and user avatar with a dropdown menu.
 */
export function AppHeader({ onMenuToggle, pageTitle = "Dashboard" }: AppHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const iconBtn = cn(
    "rounded-lg p-2 transition-colors cursor-pointer",
    "text-slate-400 hover:bg-slate-100 hover:text-slate-600",
    "dark:text-[#64748B] dark:hover:bg-[#262D35] dark:hover:text-[#E2E8F0]"
  );

  const notifications = [
    { icon: "🎉", title: "New project created", time: "2m ago", unread: true },
    { icon: "👤", title: "New team member joined", time: "1h ago", unread: true },
    { icon: "✅", title: "Task #42 completed", time: "3h ago", unread: true },
    { icon: "📊", title: "Monthly report ready", time: "Yesterday", unread: false },
  ];

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between",
        "border-b border-slate-200 bg-white px-3 sm:px-5",
        "dark:border-border dark:bg-dark-surface"
      )}
      aria-label="Top navigation"
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={onMenuToggle}
          className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-[#64748B] dark:hover:bg-[#262D35] dark:hover:text-[#E2E8F0]"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-sm font-semibold text-slate-800 dark:text-[#E2E8F0]">
            {pageTitle}
          </h1>
          <p className="hidden text-[11px] text-slate-400 sm:block dark:text-[#64748B]">
            Dashboard {pageTitle !== "Dashboard" && <>› {pageTitle}</>}
          </p>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1">
        {/* Desktop search */}
        <div
          className={cn(
            "mr-2 hidden items-center gap-2 rounded-lg px-3 py-1.5 sm:flex",
            "border border-slate-200 bg-slate-50",
            "dark:border-border dark:bg-dark-canvas",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-[#64748B]" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Site search"
            className={cn(
              "w-32 bg-transparent text-xs outline-none",
              "text-slate-700 placeholder:text-slate-400",
              "dark:text-[#E2E8F0] dark:placeholder:text-[#64748B]"
            )}
          />
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggleTheme}
          className={iconBtn}
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={`relative ${iconBtn}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-dark-surface" />
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setNotifOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg sm:w-80 dark:border-border dark:bg-dark-surface">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-border">
                  <p className="text-sm font-semibold text-slate-800 dark:text-[#E2E8F0]">
                    Notifications
                  </p>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary">
                    3 new
                  </span>
                </div>
                <ul className="max-h-64 divide-y divide-slate-50 overflow-y-auto dark:divide-border/50">
                  {notifications.map((n, i) => (
                    <li
                      key={i}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors",
                        "hover:bg-slate-50 dark:hover:bg-dark-raised/40",
                        n.unread && "dark:bg-primary/[0.03]"
                      )}
                    >
                      <span className="mt-0.5 text-base" aria-hidden="true">
                        {n.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm",
                            n.unread
                              ? "font-medium text-slate-700 dark:text-[#E2E8F0]"
                              : "text-slate-500 dark:text-muted-foreground"
                          )}
                        >
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-[#64748B]">{n.time}</p>
                      </div>
                      {n.unread && (
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 px-4 py-2.5 dark:border-border">
                  <button className="w-full text-center text-xs font-medium text-primary hover:text-primary/80">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mx-1.5 hidden h-5 w-px bg-slate-200 sm:block dark:bg-border" />

        {/* User menu */}
        <div className="relative">
          <button
            type="button"
            aria-label="User menu"
            aria-expanded={userOpen}
            aria-haspopup="true"
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-slate-100 sm:px-2 dark:hover:bg-[#262D35]"
          >
            <Avatar
              src={user?.avatarUrl}
              alt={user?.name ?? "User"}
              fallback={user?.name?.slice(0, 2)}
              size="sm"
            />
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-700 dark:text-[#E2E8F0]">
                {user?.name ?? "Guest"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-[#64748B] capitalize">
                {user?.role ?? ""}
              </p>
            </div>
          </button>

          {userOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                aria-hidden="true"
                onClick={() => setUserOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-border dark:bg-dark-surface">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-border">
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#E2E8F0]">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-[#64748B]">{user?.email}</p>
                </div>
                <ul className="p-1">
                  {[
                    { label: "Profile", Icon: User },
                    { label: "Settings", Icon: Settings },
                  ].map(({ label, Icon }) => (
                    <li key={label}>
                      <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-slate-600 hover:bg-slate-50 dark:text-muted-foreground dark:hover:bg-dark-raised/60 dark:hover:text-[#E2E8F0]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 p-1 dark:border-border">
                  <button
                    onClick={logout}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
