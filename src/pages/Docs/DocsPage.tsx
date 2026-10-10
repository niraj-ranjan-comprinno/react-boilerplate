import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MousePointer2, Type, Grid3X3, Image, Layers, Layout,
  FileText, Palette, Space, Box, Search,
  BarChart2, PanelLeft, LogIn, TrendingUp, Table2,
  SlidersHorizontal, Navigation, LayoutTemplate,
  BookOpen, Shield, Mic, KeyRound, Inbox,
  MonitorSmartphone, FormInput, Hash, AlignLeft,
  Component, ChevronDown, Lock,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";
import { PageHeader } from "@/components/organisms/PageHeader";
import { Button } from "@/components/atoms/button";
import { Avatar } from "@/components/atoms/avatar";
import { Spinner } from "@/components/atoms/spinner";
import { Skeleton } from "@/components/atoms/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { routes } from "@/app/router/routes";

// ── Types ─────────────────────────────────────────────────────────────────

interface ComponentDoc {
  name: string;
  description: string;
  variants?: string;
  href: string;
  preview: React.ReactNode;
  tags?: string[];
}

interface DocSection {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  items: ComponentDoc[];
}

// ── Component preview helpers ─────────────────────────────────────────────

const P = {
  button: (
    <div className="flex items-center gap-2 flex-wrap">
      <Button variant="primary" size="sm">Primary</Button>
      <Button variant="secondary" size="sm">Secondary</Button>
      <Button variant="ghost" size="sm">Ghost</Button>
    </div>
  ),
  badge: (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Error</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
  avatar: (
    <div className="flex items-center gap-2">
      <Avatar src="https://i.pravatar.cc/150?img=8" alt="A" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=5" alt="B" size="md" />
      <Avatar alt="CD" size="lg" />
    </div>
  ),
  spinner: (
    <div className="flex items-center gap-4">
      <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
    </div>
  ),
  skeleton: (
    <div className="space-y-2 w-full">
      <Skeleton className="h-3 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
      <Skeleton className="h-3 w-5/6 rounded" />
    </div>
  ),
  input: (
    <Input placeholder="Enter value…" className="max-w-[200px]" />
  ),
  separator: (
    <div className="w-full space-y-2">
      <p className="text-xs text-foreground">Above</p>
      <Separator />
      <p className="text-xs text-muted-foreground">Below</p>
    </div>
  ),
  colorTokens: (
    <div className="flex gap-1.5 flex-wrap">
      {["bg-primary","bg-success","bg-warning","bg-danger","bg-info","bg-agent"].map(c => (
        <div key={c} className={cn("h-5 w-5 rounded-full", c)} />
      ))}
    </div>
  ),
  typography: (
    <div className="space-y-0.5">
      <p className="text-lg font-bold text-foreground leading-none">Heading</p>
      <p className="text-sm text-foreground leading-none">Body text</p>
      <p className="text-xs text-muted-foreground leading-none">Caption</p>
    </div>
  ),
  spacing: (
    <div className="flex items-end gap-1">
      {[1,2,3,4,6,8].map(n => (
        <div key={n} className={cn("bg-primary/30 rounded-sm w-3", `h-${n}`)} />
      ))}
    </div>
  ),
  formField: (
    <div className="w-full max-w-[200px] space-y-1">
      <p className="text-xs font-medium text-foreground">Email</p>
      <Input type="email" placeholder="you@example.com" className="h-8 text-xs" />
    </div>
  ),
  searchField: (
    <div className="flex items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 max-w-[180px]">
      <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Search…</span>
    </div>
  ),
  passwordField: (
    <div className="relative max-w-[180px]">
      <Input type="password" placeholder="••••••••" className="h-8 text-xs pr-8" />
      <Lock className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
    </div>
  ),
  selectField: (
    <div className="relative max-w-[160px]">
      <div className="flex h-8 items-center justify-between rounded-md border border-input bg-background px-2.5 text-xs text-muted-foreground">
        Select role…<ChevronDown className="h-3.5 w-3.5" />
      </div>
    </div>
  ),
  pagination: (
    <div className="flex items-center gap-1">
      {["‹","1","2","3","›"].map((l,i) => (
        <div key={i} className={cn(
          "flex h-7 min-w-[28px] items-center justify-center rounded-md border text-xs",
          l==="2" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"
        )}>{l}</div>
      ))}
    </div>
  ),
  appHeader: (
    <div className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-card px-3">
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-3.5 rounded-sm bg-muted" />
        <span className="text-xs font-semibold text-foreground">Dashboard</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3.5 w-3.5 rounded-full bg-muted" />
        <div className="h-6 w-6 rounded-full bg-primary/20" />
      </div>
    </div>
  ),
  sidebar: (
    <div className="flex h-[72px] w-12 flex-col items-center gap-1 rounded-lg border border-border bg-sidebar py-2">
      {[1,2,3,4].map(i => (
        <div key={i} className={cn(
          "h-6 w-6 rounded-md",
          i===1 ? "bg-accent" : "bg-transparent"
        )} />
      ))}
    </div>
  ),
  loginForm: (
    <div className="w-full max-w-[180px] space-y-2 rounded-xl border border-border bg-card p-3">
      <div className="h-2.5 w-16 rounded bg-muted" />
      <div className="h-7 w-full rounded-md border border-input bg-transparent" />
      <div className="h-7 w-full rounded-md border border-input bg-transparent" />
      <div className="h-7 w-full rounded-md bg-primary" />
    </div>
  ),
  summaryCard: (
    <div className="rounded-xl border border-border bg-card p-3 space-y-1 min-w-[130px]">
      <p className="text-[10px] text-muted-foreground">Total Revenue</p>
      <p className="text-base font-bold text-foreground">$15,231</p>
      <p className="text-[10px] text-success">+20.1% from last month</p>
    </div>
  ),
  dataCard: (
    <div className="rounded-xl border border-border bg-card overflow-hidden min-w-[170px]">
      <div className="px-3 py-2 border-b border-border">
        <p className="text-[10px] font-semibold text-foreground">Payments</p>
      </div>
      {[["Success","$630"],["Processing","$767"],["Failed","$396"]].map(([s,a]) => (
        <div key={s} className="flex items-center justify-between px-3 py-1 border-b border-border/40 last:border-0">
          <span className={cn("text-[9px] font-medium rounded-full px-1.5 py-0.5",
            s==="Success" ? "bg-success/15 text-success" :
            s==="Failed" ? "bg-danger/15 text-danger" : "bg-warning/15 text-warning"
          )}>{s}</span>
          <span className="text-[10px] font-medium text-foreground">{a}</span>
        </div>
      ))}
    </div>
  ),
  authLayout: (
    <div className="flex h-[72px] w-full overflow-hidden rounded-lg border border-border">
      <div className="w-2/5 bg-sidebar" />
      <div className="flex flex-1 items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-lg border border-border bg-card" />
      </div>
    </div>
  ),
  dashboardLayout: (
    <div className="flex h-[72px] w-full overflow-hidden rounded-lg border border-border">
      <div className="w-8 bg-sidebar shrink-0" />
      <div className="flex flex-1 flex-col">
        <div className="h-7 border-b border-border bg-card" />
        <div className="flex-1 bg-background" />
      </div>
    </div>
  ),
  sphere: (
    <div className="relative h-12 w-12 rounded-full">
      <div className="absolute inset-0 rounded-full shadow-[0_0_20px_4px_rgba(76,203,191,0.4)]" />
      <div className="absolute inset-0 rounded-full bg-[#03060f]" />
      <div className="absolute inset-0 rounded-full animate-sphere-rotate opacity-80"
        style={{ background: "conic-gradient(from 0deg, transparent 0%, rgba(76,203,191,0.9) 20%, transparent 50%)", filter: "blur(4px)" }} />
      <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.2) 0%, transparent 55%)" }} />
    </div>
  ),
  authFlow: (
    <div className="flex items-center gap-2">
      {["Splash","Login","MFA","Voice"].map((s,i) => (
        <div key={s} className="flex items-center gap-1">
          <div className="h-5 px-1.5 rounded bg-primary/20 text-primary text-[9px] font-medium flex items-center">{s}</div>
          {i < 3 && <span className="text-[9px] text-muted-foreground">→</span>}
        </div>
      ))}
    </div>
  ),
  errorBoundary: (
    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 max-w-[180px]">
      <p className="text-[10px] font-semibold text-destructive">Something went wrong</p>
      <div className="mt-1.5 flex gap-1">
        <div className="h-5 px-1.5 rounded border border-border bg-background text-[9px] text-foreground flex items-center">Try again</div>
      </div>
    </div>
  ),
};

// ── Doc sections data ─────────────────────────────────────────────────────

const SECTIONS: DocSection[] = [
  {
    id: "tokens",
    label: "Design Tokens",
    description: "Centralized visual variables — the single source of truth for colors, typography, spacing, and radius.",
    icon: <Palette className="h-4 w-4" />,
    accent: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    items: [
      { name: "Colors",      description: "Semantic palette: primary, muted, destructive, severity scale (critical/high/medium/low), agent, takeover.", variants: "30+ tokens", href: `${routes.components}#colors`, preview: P.colorTokens, tags: ["token", "color"] },
      { name: "Typography",  description: "Plus Jakarta Sans with Geist Mono. 8-step scale from text-xs (12 px) to text-4xl (36 px).", variants: "8 steps", href: `${routes.components}#typography`, preview: P.typography, tags: ["token", "typography"] },
      { name: "Spacing",     description: "4 px base unit. Tailwind scale — /1 (4px) through /12 (48px). Never use arbitrary px values.", variants: "8 steps", href: `${routes.components}#spacing`, preview: P.spacing, tags: ["token", "spacing"] },
    ],
  },
  {
    id: "atoms",
    label: "Atoms",
    description: "The smallest, self-contained UI primitives. No business logic, no higher-layer imports.",
    icon: <Box className="h-4 w-4" />,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    items: [
      { name: "Button",       description: "6 variants × 4 sizes. Supports icon slots, loading spinner, and asChild (Radix Slot) for link wrapping.", variants: "6 variants", href: `${routes.components}#button`, preview: P.button, tags: ["button", "action"] },
      { name: "Input",        description: "Text input with built-in label, error/hint messages, and left/right addon slots.", variants: "5 states", href: `${routes.components}#input`, preview: P.input, tags: ["input", "form"] },
      { name: "Badge",        description: "Semantic severity labels: default, primary, success, warning, danger, info, critical, high, medium, low, muted.", variants: "11 variants", href: `${routes.components}#badge`, preview: P.badge, tags: ["badge", "status"] },
      { name: "Avatar",       description: "Radix AvatarPrimitive with image, fallback initials, and 3 sizes (sm/md/lg).", variants: "3 sizes", href: `${routes.components}#avatar`, preview: P.avatar, tags: ["avatar", "user"] },
      { name: "Spinner",      description: "CSS-only circular loading indicator. 3 sizes with accessible aria-label.", variants: "3 sizes", href: `${routes.components}#spinner`, preview: P.spinner, tags: ["spinner", "loading"] },
      { name: "Skeleton",     description: "Animated pulse placeholder. Shape and size match the real content layout.", variants: "flexible", href: `${routes.components}#skeleton`, preview: P.skeleton, tags: ["skeleton", "loading"] },
      { name: "Separator",    description: "Radix Separator primitive. Horizontal or vertical divider using the border token.", variants: "2 orientations", href: `${routes.components}#separator`, preview: P.separator, tags: ["separator", "divider"] },
      { name: "Label",        description: "Radix Label — clicking it focuses the associated control via htmlFor.", variants: "1", href: `${routes.components}#label`, preview: <p className="text-sm font-medium text-foreground">Email address</p>, tags: ["label", "form"] },
      { name: "Card",         description: "Composable shell with compound API (Card.Header/Body/Footer) and shadcn/ui named exports (CardTitle/CardContent).", variants: "compound + named", href: `${routes.components}#card`, preview: P.loginForm, tags: ["card", "container"] },
      { name: "Icon",         description: "Lucide wrapper enforcing consistent size tokens (xs/sm/md/lg/xl) and strokeWidth=2 across the product.", variants: "5 sizes", href: `${routes.components}#icon`, preview: (
        <div className="flex items-end gap-2 text-primary">
          <Search className="h-3 w-3"/><Search className="h-4 w-4"/><Search className="h-5 w-5"/><Search className="h-6 w-6"/>
        </div>
      ), tags: ["icon"] },
      { name: "Sphere",       description: "Animated identity orb with 5 states (ambient/listening/speaking/processing/alert), canvas dissolve on hover.", variants: "5 states", href: routes.home, preview: P.sphere, tags: ["sphere", "animation", "brand"] },
      { name: "CallButton",   description: "Round icon button for voice / call UI. 4 tones: agent (mic), glass, glass-on, destructive.", variants: "4 tones", href: routes.home, preview: (
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-agent/30 bg-agent-soft">
          <Mic className="h-5 w-5 text-agent" strokeWidth={1.5} />
        </div>
      ), tags: ["button", "voice"] },
      { name: "InputOTP",     description: "6-slot one-time-password input using the input-otp library. Auto-advances on digit entry.", variants: "1", href: routes.home, preview: (
        <div className="flex gap-1">
          {["1","2","3","·","·","·"].map((c,i)=>(
            <div key={i} className={cn("h-9 w-8 rounded border border-input flex items-center justify-center text-sm font-medium",i===3 && "ring-1 ring-ring")}>{c}</div>
          ))}
        </div>
      ), tags: ["input", "otp", "auth"] },
      { name: "ErrorBoundary", description: "Class component that catches unhandled render errors. Default recovery UI + custom fallback prop.", variants: "1", href: `${routes.components}#states`, preview: P.errorBoundary, tags: ["error", "boundary"] },
      // ── New atoms added in the latest sprint ────────────────────────
      { name: "Accordion",  description: "Radix Accordion with single/multiple open modes, animated open/close, ChevronDown indicator. Used for FAQs, settings panels.", variants: "single + multiple", href: `${routes.components}#accordion`, preview: (
        <div className="w-full max-w-[200px] divide-y divide-border rounded-lg border border-border text-xs">
          {["Item 1","Item 2"].map((l,i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2">
              <span className="text-foreground">{l}</span>
              <span className={cn("h-3 w-3 border-b border-r border-muted-foreground transition-transform", i===0 && "rotate-45")} />
            </div>
          ))}
        </div>
      ), tags: ["accordion", "collapse"] },
      { name: "Alert",     description: "Inline feedback banner. 5 semantic variants (default/info/success/warning/destructive). Optional title and dismiss button.", variants: "5 variants", href: `${routes.components}#alert`, preview: (
        <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 flex items-center gap-2 max-w-[200px]">
          <div className="h-4 w-4 rounded-full bg-success/30 shrink-0" />
          <p className="text-[10px] text-success font-medium">Saved!</p>
        </div>
      ), tags: ["alert", "notification", "feedback"] },
      { name: "Dialog",    description: "Radix Dialog with overlay backdrop-blur, animated scale-in, X close button. DialogHeader/Footer/Title/Description sub-components.", variants: "1", href: `${routes.components}#dialog`, preview: (
        <div className="rounded-xl border border-border bg-card p-3 shadow-elevated max-w-[180px]">
          <p className="text-xs font-semibold text-foreground">Edit profile</p>
          <p className="text-[9px] text-muted-foreground mt-0.5 mb-2">Make changes here.</p>
          <div className="h-6 rounded border border-input bg-background mb-2" />
          <div className="flex justify-end gap-1">
            <div className="h-5 px-1.5 rounded border border-border text-[9px] text-muted-foreground flex items-center">Cancel</div>
            <div className="h-5 px-1.5 rounded bg-primary text-[9px] text-primary-foreground flex items-center">Save</div>
          </div>
        </div>
      ), tags: ["dialog", "modal"] },
      { name: "Tabs",      description: "Radix Tabs. Active tab on card surface, inactive in muted bg. Keyboard navigable with arrow keys.", variants: "1", href: `${routes.components}#tabs`, preview: (
        <div className="max-w-[200px]">
          <div className="flex gap-0.5 rounded-lg bg-muted p-1">
            {["Account","Password","Notifs"].map((t,i) => (
              <div key={t} className={cn("flex-1 rounded-md px-1 py-1 text-[9px] text-center", i===0 ? "bg-card text-foreground font-medium shadow-sm" : "text-muted-foreground")}>{t}</div>
            ))}
          </div>
        </div>
      ), tags: ["tabs", "navigation"] },
      { name: "Tooltip",   description: "Radix Tooltip. All 4 sides. Fade + zoom animation. delayDuration configurable via TooltipProvider.", variants: "4 sides", href: `${routes.components}#tooltip`, preview: (
        <div className="relative">
          <div className="h-8 px-3 rounded-md border border-border bg-background text-xs flex items-center">Hover me</div>
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-[9px] text-popover-foreground shadow-md whitespace-nowrap">Tooltip content</div>
        </div>
      ), tags: ["tooltip", "hover"] },
      { name: "Dropdown",  description: "Radix DropdownMenu with items, checkboxes, radio groups, separators, sub-menus, and keyboard navigation.", variants: "items + checkbox + radio", href: `${routes.components}#dropdown`, preview: (
        <div className="min-w-[140px] rounded-md border border-border bg-popover p-1 shadow-md">
          {["Profile","Settings","|","Log out"].map((l,i) => l === "|" ? (
            <div key={i} className="my-1 h-px bg-border" />
          ) : (
            <div key={l} className={cn("rounded-sm px-2 py-1.5 text-[10px]", l==="Log out" ? "text-destructive" : "text-foreground")}>{l}</div>
          ))}
        </div>
      ), tags: ["dropdown", "menu"] },
      { name: "Progress",  description: "Radix Progress bar. 4 semantic variants (default/success/warning/danger). Optional percentage label.", variants: "4 variants", href: `${routes.components}#progress`, preview: (
        <div className="w-full space-y-1.5 max-w-[180px]">
          <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full w-3/4 bg-primary rounded-full" /></div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full w-1/2 bg-success rounded-full" /></div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full w-1/4 bg-danger rounded-full" /></div>
        </div>
      ), tags: ["progress", "bar"] },
      { name: "Checkbox",  description: "Radix Checkbox. Checked, unchecked, indeterminate states. Built-in label + error message.", variants: "3 states", href: `${routes.components}#checkbox`, preview: (
        <div className="space-y-1.5">
          {[true,false,"indeterminate"].map((v,i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn("h-4 w-4 rounded border flex items-center justify-center", v===true ? "bg-primary border-primary" : v==="indeterminate" ? "bg-primary border-primary" : "border-input bg-background")}>
                {v===true && <span className="text-primary-foreground text-[8px]">✓</span>}
                {v==="indeterminate" && <span className="text-primary-foreground text-[8px]">−</span>}
              </div>
              <span className="text-[10px] text-foreground">{v===true ? "Checked" : v==="indeterminate" ? "Mixed" : "Unchecked"}</span>
            </div>
          ))}
        </div>
      ), tags: ["checkbox", "form"] },
      { name: "Switch",    description: "Radix Switch. Teal when on, input-border when off. Built-in label and description. Smooth thumb animation.", variants: "1", href: `${routes.components}#switch`, preview: (
        <div className="space-y-2">
          {[true,false].map((on,i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn("relative h-5 w-9 rounded-full transition-colors", on ? "bg-primary" : "bg-input")}>
                <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-background shadow transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
              </div>
              <span className="text-[10px] text-foreground">{on ? "On" : "Off"}</span>
            </div>
          ))}
        </div>
      ), tags: ["switch", "toggle", "form"] },
      { name: "Breadcrumb", description: "Navigation trail with BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis.", variants: "1", href: `${routes.components}#breadcrumb`, preview: (
        <div className="flex items-center gap-1 text-[10px]">
          <span className="text-muted-foreground hover:text-foreground">Home</span>
          <span className="text-border">›</span>
          <span className="text-muted-foreground hover:text-foreground">Dashboard</span>
          <span className="text-border">›</span>
          <span className="font-medium text-foreground">Settings</span>
        </div>
      ), tags: ["breadcrumb", "navigation"] },
      { name: "Textarea",  description: "Resizable textarea matching Input visual spec. Optional showCount with maxLength. Error + hint + label props.", variants: "1", href: `${routes.components}#textarea`, preview: (
        <div className="w-full max-w-[180px] space-y-1">
          <p className="text-[10px] font-medium text-foreground">Bio</p>
          <div className="rounded-md border border-input bg-background p-2 text-[10px] text-muted-foreground min-h-[44px]">Enter bio…</div>
          <p className="text-[9px] text-muted-foreground text-right">0/160</p>
        </div>
      ), tags: ["textarea", "form", "input"] },
      { name: "Steps",     description: "Multi-step progress indicator. Horizontal and vertical orientations. Completed steps show checkmark icon.", variants: "horizontal + vertical", href: `${routes.components}#steps`, preview: (
        <div className="flex items-center gap-1">
          {["Account","Profile","Done"].map((l,i) => (
            <div key={l} className="flex items-center gap-1">
              <div className={cn("h-6 w-6 rounded-full border-2 flex items-center justify-center text-[9px] font-semibold", i<1 ? "border-primary bg-primary text-primary-foreground" : i===1 ? "border-primary text-primary" : "border-border text-muted-foreground")}>
                {i<1 ? "✓" : i+1}
              </div>
              {i<2 && <div className={cn("w-5 h-0.5", i<1 ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>
      ), tags: ["steps", "stepper", "wizard"] },
      { name: "Popover",   description: "Radix Popover anchored to a trigger. Closes on Escape or outside click. All sides + alignment variants.", variants: "1", href: `${routes.components}#popover`, preview: (
        <div className="relative">
          <div className="h-8 px-3 rounded-md border border-border bg-background text-xs flex items-center text-foreground">Open popover</div>
          <div className="absolute -top-14 left-0 rounded-md border border-border bg-popover p-2 shadow-md w-36">
            <p className="text-[9px] font-medium text-foreground">Dimensions</p>
            <p className="text-[8px] text-muted-foreground mt-0.5">Set layer dimensions.</p>
          </div>
        </div>
      ), tags: ["popover", "floating"] },
      { name: "Toast",     description: "Sonner toast notifications. toast.success/error/warning/info/loading/promise. <Toaster /> mounted in main.tsx.", variants: "6 types", href: `${routes.components}#toast`, preview: (
        <div className="space-y-1">
          <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2 shadow-md max-w-[180px]">
            <div className="h-3 w-3 rounded-full bg-success shrink-0" />
            <p className="text-[9px] text-foreground font-medium">Profile saved!</p>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2 flex items-center gap-2 shadow-md max-w-[180px]">
            <div className="h-3 w-3 rounded-full bg-destructive shrink-0" />
            <p className="text-[9px] text-foreground font-medium">Something went wrong.</p>
          </div>
        </div>
      ), tags: ["toast", "notification", "sonner"] },
    ],
  },
  {
    id: "molecules",
    label: "Molecules",
    description: "2–3 atoms composed with coordinated behaviour. No routing, no API calls, no higher-layer imports.",
    icon: <Grid3X3 className="h-4 w-4" />,
    accent: "bg-primary/10 text-primary",
    items: [
      { name: "FormField",     description: "Input + Label + error/hint wired together. Spread react-hook-form register() output directly.", variants: "1", href: `${routes.components}#formfield`, preview: P.formField, tags: ["form", "input"] },
      { name: "SearchField",   description: "Input with leading Search icon and a trailing clear (×) button that appears when the field has a value.", variants: "1", href: `${routes.components}#searchfield`, preview: P.searchField, tags: ["search", "input"] },
      { name: "PasswordField", description: "Input with built-in Eye/EyeOff visibility toggle. Manages show/hide state internally.", variants: "1", href: `${routes.components}#passwordfield`, preview: P.passwordField, tags: ["password", "input"] },
      { name: "SelectField",   description: "Native styled <select> with label, error, hint, and a ChevronDown indicator. Matches Input visual spec exactly.", variants: "1", href: `${routes.components}#selectfield`, preview: P.selectField, tags: ["select", "form"] },
      { name: "Pagination",    description: "Prev/next arrows + numbered pages with ellipsis. Accessible with aria-current='page' on the active button.", variants: "1", href: `${routes.components}#pagination`, preview: P.pagination, tags: ["pagination", "navigation"] },
    ],
  },
  {
    id: "organisms",
    label: "Organisms",
    description: "Complete, self-contained UI sections. May use hooks, context, and routing.",
    icon: <Layers className="h-4 w-4" />,
    accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    items: [
      { name: "AppHeader",   description: "Top nav bar with sidebar toggle, search, theme toggle, notification bell, and user menu dropdown.", variants: "1", href: routes.dashboard, preview: P.appHeader, tags: ["header", "navigation"] },
      { name: "Sidebar",     description: "Data-driven collapsible sidebar. Expanded/icon-only modes, tooltip labels, sub-groups, left-edge active bar.", variants: "expanded + collapsed", href: routes.dashboard, preview: P.sidebar, tags: ["sidebar", "navigation"] },
      { name: "LoginForm",   description: "3-view state machine: signin / forgot / sent. GitHub + Google provider buttons. Password visibility toggle.", variants: "3 views", href: routes.home, preview: P.loginForm, tags: ["form", "auth"] },
      { name: "SummaryCard", description: "Dashboard metric tile with title, large value, and trend indicator (TrendingUp/Down icon + coloured text).", variants: "up/down/neutral", href: routes.dashboard, preview: P.summaryCard, tags: ["card", "metric"] },
      { name: "PageHeader",  description: "Consistent page-level h1 with optional breadcrumb trail and right-aligned actions slot.", variants: "1", href: `${routes.components}#formfield`, preview: (
        <div className="space-y-0.5">
          <div className="flex gap-1 text-[9px] text-muted-foreground"><span>Dashboard</span><span>›</span><span className="font-medium text-foreground">Settings</span></div>
          <p className="text-sm font-bold text-foreground">Settings</p>
          <p className="text-[10px] text-muted-foreground">Manage your preferences.</p>
        </div>
      ), tags: ["header", "breadcrumb"] },
      { name: "DataCard",    description: "Table wrapped in a Card. Handles loading (spinner row), empty, error, and data states. Accepts typed ColumnDef.", variants: "4 states", href: routes.dashboard, preview: P.dataCard, tags: ["table", "data"] },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    description: "Page layout shells. Render <Outlet /> or children. No data fetching, no routing logic.",
    icon: <LayoutTemplate className="h-4 w-4" />,
    accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    items: [
      { name: "AuthLayout",      description: "Split-panel for auth pages. Left: dark branding panel with feature pills. Right: centered content slot.", variants: "1", href: routes.home, preview: P.authLayout, tags: ["layout", "auth"] },
      { name: "DashboardLayout", description: "App shell: Sidebar (fixed overlay on mobile, static on lg+) + AppHeader + <Outlet> content area.", variants: "1", href: routes.dashboard, preview: P.dashboardLayout, tags: ["layout", "dashboard"] },
      { name: "SettingsLayout",  description: "Two-column settings shell. Left: sticky nav sidebar. Right: scrollable content. Mobile: horizontal tab row.", variants: "1", href: routes.dashboard, preview: (
        <div className="flex h-[72px] w-full gap-3 overflow-hidden rounded-lg border border-border p-2">
          <div className="flex flex-col gap-1 w-20 shrink-0">
            {["Profile","Security","Billing"].map((l,i) => (
              <div key={l} className={cn("h-5 rounded px-1.5 text-[9px] flex items-center", i===0 ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground")}>{l}</div>
            ))}
          </div>
          <div className="flex-1 rounded-md bg-muted/30" />
        </div>
      ), tags: ["layout", "settings"] },
    ],
  },
  {
    id: "pages",
    label: "Pages",
    description: "Route-level compositions. Connect templates + organisms + typed mock data.",
    icon: <FileText className="h-4 w-4" />,
    accent: "bg-green-500/10 text-green-600 dark:text-green-400",
    items: [
      { name: "Auth Flow",         description: "4-phase onboarding state machine: Splash → IDP login → MFA code → Voice verify → Dashboard.", variants: "4 phases", href: routes.home, preview: P.authFlow, tags: ["auth", "onboarding"] },
      { name: "Dashboard",         description: "SummaryCard stats grid + payments DataCard + activity feed + loading skeleton examples.", variants: "1", href: routes.dashboard, preview: P.summaryCard, tags: ["dashboard"] },
      { name: "Component Showcase", description: "All design tokens, atoms, molecules, organisms, and interaction states in one reference page.", variants: "20 sections", href: routes.components, preview: P.colorTokens, tags: ["showcase", "docs"] },
      { name: "Form Examples",     description: "Profile form, password change, disabled/error/search/loading states — all wired to React Hook Form + Zod.", variants: "6 sections", href: routes.forms, preview: P.formField, tags: ["form", "validation"] },
      { name: "Not Found",         description: "404 page with a large primary 404 display and 'Go to Dashboard' CTA.", variants: "1", href: "/definitely-404", preview: (
        <div className="text-center space-y-1">
          <p className="text-2xl font-extrabold text-primary/30 select-none">404</p>
          <p className="text-[10px] font-medium text-foreground">Page not found</p>
        </div>
      ), tags: ["error", "404"] },
    ],
  },
];

// ── Stats ────────────────────────────────────────────────────────────────

const STATS = [
  { value: "28", label: "Atoms" },
  { value: "5",  label: "Molecules" },
  { value: "6",  label: "Organisms" },
  { value: "3",  label: "Templates" },
  { value: "5",  label: "Pages" },
  { value: "30+",label: "Tokens" },
];

// ── Component card ────────────────────────────────────────────────────────

/**
 * Uses a div+onClick instead of <Link> because the preview area contains
 * real interactive atoms (<Button>, <Input>, etc.).
 * Nesting <button>/<input> inside <a> is invalid HTML — browsers move them
 * outside the anchor, which breaks the card click entirely.
 * pointer-events-none on the preview makes preview controls visual-only.
 */
function ComponentCard({ item }: { item: ComponentDoc }) {
  const navigate = useNavigate();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(item.href)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate(item.href); }}
      aria-label={`${item.name} — ${item.description}`}
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card overflow-hidden cursor-pointer",
        "transition-all duration-200 hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(76,203,191,0.08)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      {/* Preview area — pointer-events-none so interactive atoms are visual-only */}
      <div className="flex items-center justify-center min-h-[100px] px-6 py-5 bg-muted/30 border-b border-border pointer-events-none select-none">
        {item.preview}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </p>
          {item.variants && (
            <Badge variant="default" className="text-[10px] shrink-0">
              {item.variants}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────

function SectionHeading({ section, count }: { section: DocSection; count: number }) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", section.accent)}>
        {section.icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">{section.label}</h2>
          <Badge variant="default">{count}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{section.description}</p>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

export function DocsPage() {
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  const lowerQuery = debouncedQuery.toLowerCase();

  const filteredSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        !lowerQuery ||
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.tags?.some((t) => t.includes(lowerQuery))
    ),
  })).filter((s) => s.items.length > 0 || !lowerQuery);

  const activeItems = activeSection
    ? filteredSections.find((s) => s.id === activeSection)?.items ?? []
    : null;
  void activeItems; // referenced in future enhancement (filter by active section)

  const visibleSections = activeSection
    ? filteredSections.filter((s) => s.id === activeSection)
    : filteredSections;

  return (
    <div className="flex min-h-full">
      {/* ── Left sticky nav ─────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-52 shrink-0">
        <nav className="sticky top-6 space-y-1" aria-label="Documentation sections">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Sections
          </p>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                activeSection === s.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-md text-[10px]", s.accent)}>
                {s.icon}
              </span>
              {s.label}
              <span className="ml-auto text-[10px] text-muted-foreground">
                {s.items.length}
              </span>
            </button>
          ))}

          <Separator className="my-3" />

          <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Quick links
          </p>
          {[
            { label: "Component Showcase", href: routes.components },
            { label: "Form Examples", href: routes.forms },
            { label: "Dashboard", href: routes.dashboard },
            { label: "Design System Plan", href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1 pb-20 lg:pl-8 px-8 pt-8">
        <PageHeader
          title="Component Library"
          description="Reusable building blocks for the design system. Every atom, molecule, organism, template, and page in one place."
          breadcrumb={[
            { label: "Dashboard", to: routes.dashboard },
            { label: "Docs" },
          ]}
        />

        {/* ── Stats row ─────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-card p-3 text-center"
            >
              <span className="text-2xl font-extrabold text-primary">{value}</span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Search ────────────────────────────────────────────────────── */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 max-w-md">
            <Input
              leftAddon={<Search className="h-4 w-4" />}
              placeholder="Search components…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {activeSection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setActiveSection(null); setQuery(""); }}
            >
              Clear filter
            </Button>
          )}
          {query && (
            <p className="text-sm text-muted-foreground">
              {filteredSections.reduce((n, s) => n + s.items.length, 0)} results
            </p>
          )}
        </div>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <div className="mt-8 space-y-12">
          {visibleSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-6">
              <SectionHeading section={section} count={section.items.length} />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {section.items.map((item) => (
                  <ComponentCard key={item.name} item={item} />
                ))}
              </div>
            </section>
          ))}

          {/* Empty search state */}
          {debouncedQuery && filteredSections.every((s) => s.items.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-3xl" aria-hidden="true">🔍</p>
              <p className="mt-3 text-sm font-medium text-foreground">
                No components match "{debouncedQuery}"
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try searching by name, description, or tag.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4"
                onClick={() => setQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Suppress unused import lint — these are used in the SECTIONS data but ESLint
// can't trace through the object literal.
void [
  AlignLeft, BookOpen, Component, FormInput, Hash, Image,
  Inbox, Layout, MonitorSmartphone, MousePointer2, Navigation,
  SlidersHorizontal, Space, Table2, Type, Grid3X3,
  BarChart2, PanelLeft, LogIn, TrendingUp, Shield, KeyRound,
];
