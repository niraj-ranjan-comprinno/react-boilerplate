import { useState } from "react";
import {
  Search, Mail, Lock, Plus, Star, Trash2, ArrowRight,
  User, Settings, Bell, Home, BarChart2, Check, AlertCircle,
  Info, AlertTriangle, Loader2, ChevronDown, LogOut, MoreHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/organisms/PageHeader";
import { DataCard, DataCardSkeleton } from "@/components/organisms/DataCard";
import { SummaryCard } from "@/components/organisms/SummaryCard";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Badge } from "@/components/atoms/badge";
import { Avatar } from "@/components/atoms/avatar";
import { Separator } from "@/components/atoms/separator";
import { Spinner } from "@/components/atoms/spinner";
import { Skeleton } from "@/components/atoms/skeleton";
import { Card } from "@/components/atoms/card";
import { Icon } from "@/components/atoms/icon";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/atoms/accordion";
import { Alert } from "@/components/atoms/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/atoms/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/atoms/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/atoms/dropdown-menu";
import { Progress } from "@/components/atoms/progress";
import { Checkbox } from "@/components/atoms/checkbox";
import { Switch } from "@/components/atoms/switch";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "@/components/atoms/breadcrumb";
import { Textarea } from "@/components/atoms/textarea";
import { Steps } from "@/components/atoms/steps";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/atoms/popover";
import { toast } from "@/components/atoms/toast";
import { FormField } from "@/components/molecules/FormField";
import { SearchField } from "@/components/molecules/SearchField";
import { PasswordField } from "@/components/molecules/PasswordField";
import { SelectField } from "@/components/molecules/SelectField";
import { Pagination } from "@/components/molecules/Pagination";
import { cn } from "@/lib/utils";

// ── Section scaffold ──────────────────────────────────────────────────────

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-6 space-y-4", className)}>
      <h2 className="text-base font-semibold text-foreground border-b border-border pb-2">
        {title}
      </h2>
      {children}
      <div className="pt-2" />
    </section>
  );
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function TokenSwatch({ name, hex, cls }: { name: string; hex: string; cls?: string }) {
  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <div className={cn("h-12 rounded-lg border border-black/10", cls)} style={cls ? undefined : { backgroundColor: hex }} />
      <p className="text-xs font-medium text-foreground leading-tight">{name}</p>
      <p className="font-mono text-[10px] text-muted-foreground">{hex}</p>
    </div>
  );
}

// ── Mock data for DataCard ────────────────────────────────────────────────

type Payment = { id: string; status: "success" | "warning" | "danger"; label: string; email: string; amount: string };
const PAYMENTS: Payment[] = [
  { id: "1", status: "success", label: "Success",    email: "michael@example.com",  amount: "$630.44" },
  { id: "2", status: "warning", label: "Processing", email: "felicia@example.com",   amount: "$767.50" },
  { id: "3", status: "danger",  label: "Failed",     email: "georgia@example.com",   amount: "$396.84" },
  { id: "4", status: "success", label: "Success",    email: "alma@example.com",      amount: "$475.22" },
];

// ── Page ─────────────────────────────────────────────────────────────────

export function ComponentShowcasePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(2);

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20 px-8 pt-8">
      <PageHeader
        title="Component Showcase"
        description="Every design token, atom, molecule, and interaction state in one place."
        breadcrumb={[{ label: "Dashboard", to: "/dashboard" }, { label: "Components" }]}
      />

      {/* ── 1. Design tokens — Colors ─────────────────────────────────── */}
      <Section id="colors" title="Design Tokens — Colors">
        <p className="text-sm text-muted-foreground">
          Semantic tokens map public Vorflux values → CSS custom properties → Tailwind utilities.
          Source of truth: <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">src/styles/globals.css</code>.
        </p>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Semantic (light)</p>
          <div className="flex flex-wrap gap-3">
            <TokenSwatch name="background" hex="#f7f7f5" cls="bg-background" />
            <TokenSwatch name="card" hex="#ffffff" cls="bg-card border" />
            <TokenSwatch name="primary" hex="#3d5bff" cls="bg-primary" />
            <TokenSwatch name="secondary" hex="#efefed" cls="bg-secondary" />
            <TokenSwatch name="muted" hex="#efefed" cls="bg-muted" />
            <TokenSwatch name="accent" hex="#e6e9ff" cls="bg-accent" />
            <TokenSwatch name="destructive" hex="#ef4444" cls="bg-destructive" />
            <TokenSwatch name="border" hex="#dededa" cls="bg-border" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Primary scale (blue)</p>
          <div className="flex flex-wrap gap-3">
            {[50,100,200,300,400,500,600,700,800,900].map((w) => (
              <div key={w} className="flex flex-col gap-1 min-w-[52px]">
                <div className={`h-8 rounded border border-black/10 bg-primary-${w}`} />
                <p className="text-[10px] text-muted-foreground text-center">{w}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Status</p>
          <div className="flex flex-wrap gap-3">
            <TokenSwatch name="success" hex="#22c55e" cls="bg-success" />
            <TokenSwatch name="warning" hex="#f59e0b" cls="bg-warning" />
            <TokenSwatch name="danger" hex="#ef4444" cls="bg-danger" />
            <TokenSwatch name="info" hex="#3b82f6" cls="bg-info" />
          </div>
        </div>
      </Section>

      {/* ── 2. Typography ─────────────────────────────────────────────── */}
      <Section id="typography" title="Design Tokens — Typography">
        <p className="text-sm text-muted-foreground mb-4">
          Font: <strong>Plus Jakarta Sans</strong>. Use <strong>Geist Mono</strong> for code and data labels. Never use <code className="text-xs font-mono bg-muted px-1 rounded">text-[15px]</code> — use the scale.
        </p>
        <div className="space-y-2 border-l-2 border-border pl-4">
          {[
            { cls: "text-4xl font-extrabold", label: "text-4xl / 36px / extrabold" },
            { cls: "text-3xl font-bold",      label: "text-3xl / 30px / bold" },
            { cls: "text-2xl font-semibold",  label: "text-2xl / 24px / semibold" },
            { cls: "text-xl font-semibold",   label: "text-xl / 20px / semibold" },
            { cls: "text-lg font-medium",     label: "text-lg / 18px / medium" },
            { cls: "text-base",               label: "text-base / 16px / regular" },
            { cls: "text-sm",                 label: "text-sm / 14px / regular" },
            { cls: "text-xs text-muted-foreground", label: "text-xs / 12px / muted" },
          ].map(({ cls, label }) => (
            <div key={label} className="flex items-baseline gap-4">
              <p className={cn(cls, "text-foreground")}>Aa</p>
              <p className="text-xs text-muted-foreground font-mono">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. Spacing & Radius ───────────────────────────────────────── */}
      <Section id="spacing" title="Design Tokens — Spacing & Radius">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { label: "1 · 4px",   cls: "w-1 h-1" },
            { label: "2 · 8px",   cls: "w-2 h-2" },
            { label: "3 · 12px",  cls: "w-3 h-3" },
            { label: "4 · 16px",  cls: "w-4 h-4" },
            { label: "6 · 24px",  cls: "w-6 h-6" },
            { label: "8 · 32px",  cls: "w-8 h-8" },
            { label: "12 · 48px", cls: "w-12 h-12" },
            { label: "16 · 64px", cls: "w-16 h-16" },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={cn("bg-primary/40 rounded-sm shrink-0", cls)} />
              <p className="text-xs font-mono text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Border radius</p>
          <div className="flex flex-wrap gap-4">
            {[
              { name: "rounded-sm · 4px",  cls: "rounded-sm" },
              { name: "rounded-md · 8px",  cls: "rounded-md" },
              { name: "rounded-xl · 12px", cls: "rounded-xl" },
              { name: "rounded-full",      cls: "rounded-full" },
            ].map(({ name, cls }) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <div className={cn("h-12 w-12 bg-primary/30 border border-primary/50", cls)} />
                <p className="text-xs text-muted-foreground font-mono whitespace-nowrap">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── 4. Button ─────────────────────────────────────────────────── */}
      <Section id="button" title="Atom — Button">
        <Row label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add"><Plus className="h-4 w-4" /></Button>
        </Row>
        <Row label="With icons">
          <Button leftIcon={<Mail className="h-4 w-4" />}>Send email</Button>
          <Button rightIcon={<ArrowRight className="h-4 w-4" />} variant="secondary">Continue</Button>
          <Button leftIcon={<Trash2 className="h-4 w-4" />} variant="danger">Delete</Button>
          <Button leftIcon={<Star className="h-4 w-4" />} variant="ghost">Favourite</Button>
        </Row>
        <Row label="States">
          <Button isLoading>Loading</Button>
          <Button isLoading variant="secondary">Saving</Button>
          <Button disabled>Disabled</Button>
          <Button disabled variant="secondary">Disabled</Button>
        </Row>
      </Section>

      {/* ── 5. Badge ──────────────────────────────────────────────────── */}
      <Section id="badge" title="Atom — Badge">
        <Row label="Variants">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
        <Row label="With icon">
          <Badge variant="success"><Check className="mr-1 h-3 w-3" />Active</Badge>
          <Badge variant="danger"><AlertCircle className="mr-1 h-3 w-3" />Error</Badge>
          <Badge variant="warning"><AlertTriangle className="mr-1 h-3 w-3" />Warning</Badge>
          <Badge variant="info"><Info className="mr-1 h-3 w-3" />Info</Badge>
        </Row>
      </Section>

      {/* ── 6. Avatar ─────────────────────────────────────────────────── */}
      <Section id="avatar" title="Atom — Avatar">
        <Row label="Sizes (with image)">
          <Avatar src="https://i.pravatar.cc/150?img=8"  alt="Alex"   size="sm" />
          <Avatar src="https://i.pravatar.cc/150?img=5"  alt="Sofia"  size="md" />
          <Avatar src="https://i.pravatar.cc/150?img=12" alt="Jordan" size="lg" />
        </Row>
        <Row label="Fallback initials">
          <Avatar alt="Alex Johnson"  size="sm" />
          <Avatar alt="Sofia Davis"   size="md" />
          <Avatar alt="Chris Park"    size="lg" />
        </Row>
      </Section>

      {/* ── 7. Icon ───────────────────────────────────────────────────── */}
      <Section id="icon" title="Atom — Icon">
        <p className="text-sm text-muted-foreground">
          Always use the <code className="text-xs font-mono bg-muted px-1 rounded">Icon</code> atom — never bare Lucide icons — to guarantee consistent size and stroke-width across the product.
        </p>
        <Row label="Sizes (xs → xl)">
          <div className="flex items-end gap-3">
            <Icon icon={Home}     size="xs" className="text-muted-foreground" />
            <Icon icon={Home}     size="sm" className="text-muted-foreground" />
            <Icon icon={Home}     size="md" className="text-muted-foreground" />
            <Icon icon={Home}     size="lg" className="text-muted-foreground" />
            <Icon icon={Home}     size="xl" className="text-muted-foreground" />
          </div>
        </Row>
        <Row label="Coloured">
          <Icon icon={User}      size="md" className="text-primary" />
          <Icon icon={Settings}  size="md" className="text-muted-foreground" />
          <Icon icon={Bell}      size="md" className="text-warning" />
          <Icon icon={AlertCircle} size="md" className="text-destructive" />
          <Icon icon={BarChart2} size="md" className="text-success" />
        </Row>
        <Row label="With accessible label (sr-only)">
          <Icon icon={Trash2} size="md" className="text-destructive" label="Delete item" />
          <p className="text-xs text-muted-foreground">← has aria-label="Delete item"</p>
        </Row>
      </Section>

      {/* ── 8. Spinner ────────────────────────────────────────────────── */}
      <Section id="spinner" title="Atom — Spinner">
        <Row label="Sizes">
          <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
        </Row>
        <Row label="Inline usage">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="sm" /><span>Loading data…</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /><span>Saving…</span>
          </div>
        </Row>
      </Section>

      {/* ── 9. Skeleton ───────────────────────────────────────────────── */}
      <Section id="skeleton" title="Atom — Skeleton">
        <p className="text-sm text-muted-foreground">Use as a placeholder while content loads. Match the shape and size of the real content.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Card skeleton */}
          <div className="space-y-3 rounded-xl border border-border p-5">
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </div>
          {/* List skeleton */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DataCardSkeleton rows={3} cols={3} title="Payments loading" className="mt-2" />
      </Section>

      {/* ── 10. Separator ─────────────────────────────────────────────── */}
      <Section id="separator" title="Atom — Separator">
        <p className="text-sm text-muted-foreground">Horizontal (default) and vertical.</p>
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center gap-4 h-8">
            <span className="text-sm text-foreground">Left content</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">Right content</span>
          </div>
          <div className="relative flex items-center">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-xs text-muted-foreground">OR</span>
          </div>
        </div>
      </Section>

      {/* ── 11. Card ──────────────────────────────────────────────────── */}
      <Section id="card" title="Atom — Card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <Card.Header>
              <p className="text-sm font-semibold text-foreground">Card.Header</p>
              <p className="text-xs text-muted-foreground mt-0.5">With Card.Body + Card.Footer</p>
            </Card.Header>
            <Card.Body>
              <p className="text-sm text-muted-foreground">Body content lives here. Cards always use <code className="text-xs font-mono bg-muted px-1 rounded">rounded-xl</code> and <code className="text-xs font-mono bg-muted px-1 rounded">shadow/sm</code>.</p>
            </Card.Body>
            <Card.Footer className="flex justify-end gap-2">
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Save</Button>
            </Card.Footer>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Plain card</p>
            <p className="text-sm text-muted-foreground">You can skip sub-components and add custom padding directly via <code className="text-xs font-mono bg-muted px-1 rounded">className</code>.</p>
            <Badge variant="primary">Flexible</Badge>
          </Card>
        </div>
      </Section>

      {/* ── 12. Input ─────────────────────────────────────────────────── */}
      <Section id="input" title="Atom — Input">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input placeholder="Default" />
          <Input label="With label" placeholder="Enter value" />
          <Input label="With left addon" type="email" placeholder="you@example.com" leftAddon={<Mail className="h-4 w-4" />} />
          <Input label="With right addon" type="password" placeholder="••••••••" rightAddon={<Lock className="h-4 w-4" />} />
          <Input label="Error state" placeholder="e.g. name" error="This field is required." />
          <Input label="With hint" placeholder="Enter username" hint="Letters and numbers only." />
          <Input label="Required field" placeholder="Required" required />
          <Input label="Disabled" placeholder="Not editable" disabled value="Read-only value" readOnly />
        </div>
      </Section>

      {/* ── 13. Label ─────────────────────────────────────────────────── */}
      <Section id="label" title="Atom — Label">
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-input">Standard label</Label>
            <Input id="demo-input" placeholder="Linked via htmlFor" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="demo-checkbox" className="h-4 w-4 accent-primary rounded border-input" />
            <Label htmlFor="demo-checkbox">Checkbox label</Label>
          </div>
        </div>
      </Section>

      {/* ── 14. FormField molecule ────────────────────────────────────── */}
      <Section id="formfield" title="Molecule — FormField">
        <p className="text-sm text-muted-foreground">Composes Input + Label + error/hint. Use inside React Hook Form — spread <code className="text-xs font-mono bg-muted px-1 rounded">register()</code> output.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name" placeholder="Alex Johnson" hint="Your full display name." />
          <FormField label="Email" type="email" placeholder="you@example.com" required error="Enter a valid email." />
        </div>
      </Section>

      {/* ── 15. SearchField molecule ──────────────────────────────────── */}
      <Section id="searchfield" title="Molecule — SearchField">
        <div className="max-w-sm space-y-2">
          <SearchField
            placeholder="Search users, projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
          {search && (
            <p className="text-xs text-muted-foreground">
              Query: <span className="font-medium text-foreground">{search}</span>
            </p>
          )}
        </div>
      </Section>

      {/* ── 16. PasswordField molecule ────────────────────────────────── */}
      <Section id="passwordfield" title="Molecule — PasswordField">
        <div className="max-w-xs space-y-3">
          <PasswordField label="Password" placeholder="Min 8 characters" />
          <PasswordField label="Error state" placeholder="••••••••" error="Must be at least 8 characters." />
          <PasswordField label="Disabled" disabled placeholder="Cannot change" />
        </div>
      </Section>

      {/* ── 17. SelectField molecule ──────────────────────────────────── */}
      <Section id="selectfield" title="Molecule — SelectField">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
          <SelectField
            label="Role"
            placeholder="Select a role…"
            options={[
              { value: "admin",   label: "Admin" },
              { value: "editor",  label: "Editor" },
              { value: "viewer",  label: "Viewer" },
            ]}
          />
          <SelectField
            label="Error state"
            placeholder="Select a plan…"
            options={[
              { value: "free", label: "Free" },
              { value: "pro",  label: "Pro" },
            ]}
            error="Please select a plan."
          />
          <SelectField
            label="Disabled"
            options={[{ value: "admin", label: "Admin" }]}
            value="admin"
            onChange={() => undefined}
            disabled
          />
        </div>
      </Section>

      {/* ── 18. Pagination molecule ───────────────────────────────────── */}
      <Section id="pagination" title="Molecule — Pagination">
        <p className="text-sm text-muted-foreground">Prev / next / numbered pages with ellipsis. Accessible — uses <code className="text-xs font-mono bg-muted px-1 rounded">aria-current="page"</code>.</p>
        <div className="space-y-4 rounded-xl border border-border p-4">
          <Pagination page={page} pageSize={10} total={127} onPageChange={setPage} />
          <Separator />
          <Pagination page={1} pageSize={10} total={8} onPageChange={() => undefined} />
          <Separator />
          <Pagination page={1} pageSize={10} total={0} onPageChange={() => undefined} />
        </div>
      </Section>

      {/* ── 19. SummaryCard organism ──────────────────────────────────── */}
      <Section id="summarycard" title="Organism — SummaryCard">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Revenue" value="$15,231" change={20.1} icon={<Search className="h-5 w-5" />} />
          <SummaryCard title="Active Users"  value="2,350"   change={18.1} icon={<User className="h-5 w-5" />} />
          <SummaryCard title="New Orders"    value="1,247"   change={-4.6} icon={<Bell className="h-5 w-5" />} />
          <SummaryCard title="Conversion"    value="3.24%"   change={1.9}  icon={<BarChart2 className="h-5 w-5" />} />
        </div>
      </Section>

      {/* ── 20. DataCard organism ─────────────────────────────────────── */}
      <Section id="datacard" title="Organism — DataCard">
        <p className="text-sm text-muted-foreground">Table inside a card. Handles loading, empty, and error states.</p>
        <div className="space-y-4">
          {/* Normal */}
          <DataCard
            title="Recent Payments"
            description="Last 4 transactions."
            data={PAYMENTS as unknown as Record<string, unknown>[]}
            keyExtractor={(r) => r.id as string}
            columns={[
              { accessor: "label",  header: "Status", render: (_, r) => <Badge variant={(r as unknown as Payment).status}>{(r as unknown as Payment).label}</Badge> },
              { accessor: "email",  header: "Email",  render: (v) => <span className="text-xs text-muted-foreground">{String(v)}</span> },
              { accessor: "amount", header: "Amount", render: (v) => <span className="font-medium">{String(v)}</span> },
            ]}
          />
          {/* Loading */}
          <DataCard
            title="Loading state"
            data={[]}
            keyExtractor={() => ""}
            columns={[{ accessor: "a", header: "Col A" }, { accessor: "b", header: "Col B" }]}
            isLoading
          />
          {/* Empty */}
          <DataCard
            title="Empty state"
            data={[]}
            keyExtractor={() => ""}
            columns={[{ accessor: "a", header: "Col A" }, { accessor: "b", header: "Col B" }]}
          />
          {/* Error */}
          <DataCard
            title="Error state"
            data={[]}
            keyExtractor={() => ""}
            columns={[{ accessor: "a", header: "Col A" }]}
            error="Failed to load data. Please try again."
          />
        </div>
      </Section>

      {/* ── 21. Interaction states ────────────────────────────────────── */}
      <Section id="states" title="Interaction States">
        <p className="text-sm text-muted-foreground mb-2">Every component must define all states. Never leave a state visually undefined.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Success */}
          <div className="rounded-xl border border-success/30 bg-success/10 p-4 flex items-start gap-3">
            <Check className="h-5 w-5 text-success mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Success state</p>
              <p className="text-xs text-muted-foreground mt-0.5">Profile saved successfully.</p>
            </div>
          </div>
          {/* Error */}
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Error state</p>
              <p className="text-xs text-muted-foreground mt-0.5">Something went wrong. Please try again.</p>
            </div>
          </div>
          {/* Warning */}
          <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Warning state</p>
              <p className="text-xs text-muted-foreground mt-0.5">Your plan is approaching its limit.</p>
            </div>
          </div>
          {/* Info */}
          <div className="rounded-xl border border-info/30 bg-info/10 p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-info mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Info state</p>
              <p className="text-xs text-muted-foreground mt-0.5">A new version is available.</p>
            </div>
          </div>
          {/* Empty */}
          <div className="rounded-xl border border-border p-8 text-center col-span-full">
            <p className="text-3xl" aria-hidden="true">📭</p>
            <p className="mt-2 text-sm font-medium text-foreground">Empty state</p>
            <p className="mt-1 text-xs text-muted-foreground">No items yet. Create one to get started.</p>
            <Button variant="primary" size="sm" className="mt-4">
              Create item
            </Button>
          </div>
        </div>
      </Section>

      {/* ── NEW: Accordion ─────────────────────────────────────────── */}
      <Section id="accordion" title="Atom — Accordion">
        <p className="text-sm text-muted-foreground mb-4">Collapsible content panels using Radix Accordion. Supports single or multiple open items.</p>
        <div className="max-w-xl space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="a1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. Uses Radix Accordion with full keyboard nav and ARIA attributes baked in.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. Uses design tokens — border, foreground, muted-foreground — so it adapts to light/dark automatically.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a3">
              <AccordionTrigger>Can I animate it?</AccordionTrigger>
              <AccordionContent>
                Yes. Open/close uses <code className="text-xs font-mono bg-muted px-1 rounded">animate-accordion-down/up</code> CSS animations defined in globals.css.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="m1">
              <AccordionTrigger>Multiple mode — item 1</AccordionTrigger>
              <AccordionContent>Multiple items can be open simultaneously. Pass <code className="font-mono text-xs bg-muted px-1 rounded">type="multiple"</code>.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="m2">
              <AccordionTrigger>Multiple mode — item 2</AccordionTrigger>
              <AccordionContent>Both this and the item above can be open at the same time.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      {/* ── NEW: Alert ─────────────────────────────────────────────── */}
      <Section id="alert" title="Atom — Alert">
        <p className="text-sm text-muted-foreground mb-4">Inline feedback banner. 5 semantic variants. Dismissible option.</p>
        <div className="max-w-xl space-y-3">
          <Alert variant="default" title="Default alert">This is a neutral informational message.</Alert>
          <Alert variant="info" title="Info">A new version of the app is available.</Alert>
          <Alert variant="success" title="Saved!">Your changes have been saved successfully.</Alert>
          <Alert variant="warning" title="Warning">Your plan is approaching its usage limit.</Alert>
          <Alert variant="destructive" title="Error">Something went wrong. Please try again.</Alert>
          <Alert variant="success" title="Dismissible" dismissible onDismiss={() => {}}>
            Click ✕ to dismiss this alert.
          </Alert>
        </div>
      </Section>

      {/* ── NEW: Dialog (Modal) ─────────────────────────────────────── */}
      <Section id="dialog" title="Atom — Dialog (Modal)">
        <p className="text-sm text-muted-foreground mb-4">Accessible modal overlay using Radix Dialog. Focus trapping, scroll lock, Escape to close.</p>
        <Row label="Trigger">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Name</label>
                  <Input defaultValue="Alex Johnson" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input type="email" defaultValue="alex@example.com" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button variant="primary">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="danger">Delete account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button variant="danger">Yes, delete account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Row>
      </Section>

      {/* ── NEW: Tabs ──────────────────────────────────────────────── */}
      <Section id="tabs" title="Atom — Tabs">
        <p className="text-sm text-muted-foreground mb-4">Tabbable panels using Radix Tabs. Active tab shows on a card surface.</p>
        <Tabs defaultValue="account" className="max-w-lg">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="mt-4 rounded-xl border border-border p-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Account settings</p>
              <p className="text-xs text-muted-foreground">Manage your account information and preferences.</p>
              <Input label="Display name" defaultValue="Alex Johnson" />
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="mt-4 rounded-xl border border-border p-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Change password</p>
              <PasswordField label="New password" placeholder="Min 8 characters" />
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="mt-4 rounded-xl border border-border p-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Notification preferences</p>
              <Switch label="Email notifications" defaultChecked />
              <Switch label="Push notifications" />
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      {/* ── NEW: Tooltip ───────────────────────────────────────────── */}
      <Section id="tooltip" title="Atom — Tooltip">
        <p className="text-sm text-muted-foreground mb-4">Floating label on hover/focus. Uses Radix Tooltip. All 4 sides supported.</p>
        <TooltipProvider>
          <Row label="Positions">
            {(["top","right","bottom","left"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">{side}</Button>
                </TooltipTrigger>
                <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
              </Tooltip>
            ))}
          </Row>
          <Row label="On icon buttons">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </Row>
        </TooltipProvider>
      </Section>

      {/* ── NEW: Dropdown Menu ─────────────────────────────────────── */}
      <Section id="dropdown" title="Atom — Dropdown Menu">
        <p className="text-sm text-muted-foreground mb-4">Contextual action menu using Radix DropdownMenu. Supports items, checkboxes, radio groups, separators.</p>
        <Row label="Variants">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" rightIcon={<ChevronDown className="h-4 w-4" />}>Open menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="h-4 w-4" />Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive"><LogOut className="h-4 w-4" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More options"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked>Show toolbar</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Show sidebar</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>View</DropdownMenuLabel>
              <DropdownMenuRadioGroup value="compact">
                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </Row>
      </Section>

      {/* ── NEW: Progress ──────────────────────────────────────────── */}
      <Section id="progress" title="Atom — Progress">
        <p className="text-sm text-muted-foreground mb-4">Animated progress bar. 4 semantic variants + optional label.</p>
        <div className="max-w-sm space-y-4">
          <Progress value={72} showLabel />
          <Progress value={85} variant="success" showLabel />
          <Progress value={45} variant="warning" showLabel />
          <Progress value={28} variant="danger" showLabel />
          <Progress value={0} showLabel />
          <Progress value={100} variant="success" showLabel />
        </div>
      </Section>

      {/* ── NEW: Checkbox ──────────────────────────────────────────── */}
      <Section id="checkbox" title="Atom — Checkbox">
        <p className="text-sm text-muted-foreground mb-4">Radix Checkbox. Supports checked, unchecked, indeterminate states. Built-in label + error.</p>
        <div className="flex flex-col gap-3 max-w-xs">
          <Checkbox label="Accept terms and conditions" />
          <Checkbox label="Send me product updates" defaultChecked />
          <Checkbox label="Indeterminate state" indeterminate />
          <Checkbox label="Disabled unchecked" disabled />
          <Checkbox label="Disabled checked" disabled defaultChecked />
          <Checkbox label="With error" error="You must accept the terms." />
        </div>
      </Section>

      {/* ── NEW: Switch ────────────────────────────────────────────── */}
      <Section id="switch" title="Atom — Switch">
        <p className="text-sm text-muted-foreground mb-4">Radix Switch. Teal when on, input-border when off. Built-in label and description.</p>
        <div className="flex flex-col gap-4 max-w-sm">
          <Switch label="Dark mode" />
          <Switch label="Email notifications" defaultChecked />
          <Switch label="Push notifications" description="Receive alerts on your device." />
          <Switch label="Samantha speaks aloud" description="AI assistant will use text-to-speech." defaultChecked />
          <Switch label="Disabled off" disabled />
          <Switch label="Disabled on" disabled defaultChecked />
        </div>
      </Section>

      {/* ── NEW: Breadcrumb ────────────────────────────────────────── */}
      <Section id="breadcrumb" title="Atom — Breadcrumb">
        <p className="text-sm text-muted-foreground mb-4">Navigation trail. Standalone atom; also embedded in PageHeader organism.</p>
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Current page</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </Section>

      {/* ── NEW: Textarea ──────────────────────────────────────────── */}
      <Section id="textarea" title="Atom — Textarea">
        <p className="text-sm text-muted-foreground mb-4">Resizable textarea. Matches Input visual spec. Optional character counter.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl">
          <Textarea label="Default" placeholder="Enter text…" rows={3} />
          <Textarea label="With hint" placeholder="Tell us about yourself…" hint="Max 160 characters." rows={3} />
          <Textarea label="Character counter" placeholder="Enter bio…" maxLength={160} showCount rows={3} />
          <Textarea label="Error state" placeholder="Required field…" error="This field is required." rows={3} />
          <Textarea label="Disabled" placeholder="Not editable" disabled rows={3} />
        </div>
      </Section>

      {/* ── NEW: Steps ─────────────────────────────────────────────── */}
      <Section id="steps" title="Atom — Steps">
        <p className="text-sm text-muted-foreground mb-4">Multi-step progress indicator. Horizontal (default) and vertical. Completed steps show a checkmark.</p>
        <div className="space-y-8 max-w-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Horizontal</p>
            <Steps steps={[{ label: "Account" }, { label: "Profile" }, { label: "Review" }, { label: "Done" }]} current={2} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Vertical</p>
            <Steps
              orientation="vertical"
              current={1}
              steps={[
                { label: "Sign in",          description: "Enter your credentials" },
                { label: "Verify identity",  description: "Complete MFA" },
                { label: "Voice check",      description: "Read the passphrase" },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* ── NEW: Popover ───────────────────────────────────────────── */}
      <Section id="popover" title="Atom — Popover">
        <p className="text-sm text-muted-foreground mb-4">Floating panel anchored to a trigger. Uses Radix Popover. Closes on Escape or outside click.</p>
        <Row label="Examples">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Dimensions</p>
                <p className="text-xs text-muted-foreground">Set the dimensions for the layer.</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Input label="Width" defaultValue="100%" className="h-8 text-xs" />
                  <Input label="Height" defaultValue="25px" className="h-8 text-xs" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User settings"><User className="h-4 w-4" /></Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1">
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                <User className="h-4 w-4" />Profile
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent">
                <Settings className="h-4 w-4" />Settings
              </button>
            </PopoverContent>
          </Popover>
        </Row>
      </Section>

      {/* ── NEW: Toast ─────────────────────────────────────────────── */}
      <Section id="toast" title="Atom — Toast (Sonner)">
        <p className="text-sm text-muted-foreground mb-4">
          Push notifications via <code className="font-mono text-xs bg-muted px-1 rounded">sonner</code>. Call <code className="font-mono text-xs bg-muted px-1 rounded">toast.success()</code> anywhere in the app.{" "}
          <code className="font-mono text-xs bg-muted px-1 rounded">&lt;Toaster /&gt;</code> is mounted in <code className="font-mono text-xs bg-muted px-1 rounded">main.tsx</code>.
        </p>
        <Row label="Trigger toasts">
          <Button variant="primary" size="sm" onClick={() => toast.success("Profile saved successfully.")}>Success</Button>
          <Button variant="danger"  size="sm" onClick={() => toast.error("Something went wrong.")}>Error</Button>
          <Button variant="outline" size="sm" onClick={() => toast.warning("Plan nearing limit.")}>Warning</Button>
          <Button variant="secondary" size="sm" onClick={() => toast.info("A new update is available.")}>Info</Button>
          <Button variant="ghost"   size="sm" onClick={() => toast.loading("Uploading file…")}>Loading</Button>
          <Button variant="ghost"   size="sm" onClick={() => toast("Default notification message.")}>Default</Button>
        </Row>
      </Section>
    </div>
  );
}
