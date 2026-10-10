/**
 * Dashboard page using the boilerplate's dark-first semantic token system.
 *
 * Forms in this page:
 *  - "Upgrade subscription" & "Create account": demo/visual cards (CC faithful reproduction)
 *    — they are intentionally NOT validated since they're display components, not real forms.
 *    See src/pages/FormExamples/ for full useZodForm validation examples.
 *  - "Report an issue": interactive form, uses useZodForm + Zod schema.
 */
import { useState } from "react";
import { z } from "zod";
import { useZodForm } from "@/hooks/use-zod-form";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Separator } from "@/components/atoms/separator";
import { Switch } from "@/components/atoms/switch";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@/components/atoms/avatar";
import { Checkbox } from "@/components/atoms/checkbox";
import { SelectField } from "@/components/molecules/SelectField";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────

type PaymentStatus = "success" | "warning" | "danger";
interface Payment {
  id: string;
  status: PaymentStatus;
  label: string;
  email: string;
  amount: string;
  selected: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────

const PAYMENTS: Payment[] = [
  { id: "1", status: "success",  label: "Success",    email: "michael.mitc@exampl...", amount: "$630.44", selected: false },
  { id: "2", status: "success",  label: "Success",    email: "felicia.reid@example.c...", amount: "$767.50", selected: false },
  { id: "3", status: "warning",  label: "Processing", email: "georgia.young@examp...", amount: "$396.84", selected: false },
  { id: "4", status: "success",  label: "Success",    email: "alma.lawson@example...", amount: "$475.22", selected: false },
  { id: "5", status: "danger",   label: "Failed",     email: "dolores.chambers@ex...", amount: "$275.43", selected: false },
];

const TEAM = [
  { name: "Sofia Davis",    email: "m@example.com", role: "Owner",     avatar: "https://i.pravatar.cc/150?img=5" },
  { name: "Jackson Lee",    email: "p@example.com", role: "Developer", avatar: "https://i.pravatar.cc/150?img=12" },
  { name: "Isabella Nguyen",email: "i@example.com", role: "Member",    avatar: "https://i.pravatar.cc/150?img=9" },
];

const PEOPLE_WITH_ACCESS = [
  { name: "Olivia Martin",   email: "m@example.com",  perm: "Can edit", avatar: "https://i.pravatar.cc/150?img=3" },
  { name: "Isabella Nguyen", email: "b@example.com",  perm: "Can view", avatar: "https://i.pravatar.cc/150?img=9" },
  { name: "Sofia Davis",     email: "p@example.com",  perm: "Can view", avatar: "https://i.pravatar.cc/150?img=5" },
];

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TODAY = new Date(2025, 0, 15); // Jan 15 2025

function calendarGrid(year: number, month: number): Array<number | null> {
  const days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();
  const cells: Array<number | null> = Array(start).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Sparkline SVG ─────────────────────────────────────────────────────────

function Sparkline({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 40;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - ((v - min) / range) * (h - 6) - 3,
  ]);
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[60px]" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkline-gradient)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={color} />
      ))}
    </svg>
  );
}

// ── BarChart SVG ─────────────────────────────────────────────────────────

function MiniBarChart({ data, color = "var(--primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-[60px] px-1" aria-hidden="true">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, opacity: 0.7 + (v / max) * 0.3 }}
        />
      ))}
    </div>
  );
}

// ── Report issue schema ───────────────────────────────────────────────────

const reportSchema = z.object({
  area:        z.string().min(1, "Please select an area."),
  severity:    z.string().min(1, "Please select a severity."),
  subject:     z.string().min(3, "Subject must be at least 3 characters."),
  description: z.string().min(10, "Please describe the issue in detail."),
});
type ReportValues = z.infer<typeof reportSchema>;

// ── Card shell ────────────────────────────────────────────────────────────

function DCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { user } = useAuth();
  const [calMonth, setCalMonth] = useState(0); // Jan 2025
  const [calYear] = useState(2025);
  const [calories, setCalories] = useState(350);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "sofia", text: "Hi, how can I help you today?" },
    { sender: "me",    text: "Hey, I'm having trouble with my account." },
    { sender: "sofia", text: "What seems to be the problem?" },
  ]);
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set());
  const [strictCookies, setStrictCookies] = useState(true);
  const [funcCookies, setFuncCookies] = useState(false);

  // Report issue form — uses useZodForm (interactive form, not a demo card)
  const reportForm = useZodForm(reportSchema, {
    defaultValues: { area: "", severity: "", subject: "", description: "" },
  });

  function handleReport(values: ReportValues) {
    // In production: call an API endpoint here
    console.info("Report submitted:", values);
    reportForm.reset();
  }

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const calGrid = calendarGrid(calYear, calMonth);

  const revenueData = [40, 65, 45, 70, 55, 80, 60, 75, 50, 85, 65, 90];
  const subData     = [30, 50, 40, 60, 45, 70, 50, 65, 55, 75, 60, 80];
  const exerciseData = [55, 70, 45, 80, 60, 75, 50, 65, 70, 85, 55, 90, 60, 75, 80];
  const barData      = [40, 80, 50, 65, 45, 60, 45, 55, 50, 55, 45, 75, 35];

  function sendChat(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((m) => [...m, { sender: "me", text: chatInput.trim() }]);
    setChatInput("");
  }

  function togglePayment(id: string) {
    setSelectedPayments((s) => {
      const n = new Set(s);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }

  return (
    <div className="p-6 lg:p-8">
      {/* ── Header (only shown on this page, matches CC "nav === dashboard" — no PageHeader component) */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">
          Operational Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}.
        </p>
      </div>

      {/* ── Three-column grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* ════ COLUMN 1 ════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Total Revenue */}
          <DCard className="p-5">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="mt-1 text-2xl font-bold text-foreground">$15,231.89</p>
            <p className="mt-0.5 text-xs text-success">+20.1% from last month</p>
            <div className="mt-3">
              <Sparkline data={revenueData} />
            </div>
          </DCard>

          {/* Subscriptions */}
          <DCard className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Subscriptions</p>
                <p className="mt-1 text-2xl font-bold text-foreground">+2350</p>
                <p className="mt-0.5 text-xs text-success">+180.1% from last month</p>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                View More
              </Button>
            </div>
            <div className="mt-3">
              <Sparkline data={subData} />
            </div>
          </DCard>

          {/* Upgrade your subscription */}
          <DCard className="p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Upgrade your subscription</p>
              <p className="text-xs text-muted-foreground mt-1">
                You are currently on the free plan. Upgrade to the pro plan to get access to all features.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First name" className="h-8 text-xs" />
              <Input placeholder="example@email.c..." type="email" className="h-8 text-xs" />
            </div>
            <Input placeholder="1234 5678 912..." className="h-8 text-xs" />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM/YY" className="h-8 text-xs" />
              <Input placeholder="CVC" className="h-8 text-xs" />
            </div>

            <div>
              <p className="text-xs font-medium text-foreground mb-1">Plan</p>
              <p className="text-[11px] text-muted-foreground mb-2">Select the plan that best fits your needs.</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "starter", name: "Starter Plan", desc: "Perfect for small businesses.", active: true },
                  { id: "pro",     name: "Pro Plan",      desc: "More features and storage.",   active: false },
                ].map((p) => (
                  <div key={p.id} className={cn("rounded-lg border p-3 cursor-pointer transition-colors", p.active ? "border-primary" : "border-border bg-background")}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className={cn("h-2 w-2 rounded-full", p.active ? "bg-primary" : "bg-muted")} />
                      <p className="text-xs font-medium text-foreground">{p.name}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <Input placeholder="Enter notes" className="h-8 text-xs" />

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox />
                <span className="text-xs text-foreground">I agree to the terms and conditions</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox defaultChecked />
                <span className="text-xs text-foreground">Allow us to send you emails</span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs">Cancel</Button>
              <Button variant="primary" size="sm" className="h-8 text-xs">Upgrade Plan</Button>
            </div>
          </DCard>

          {/* Team Members */}
          <DCard className="p-5">
            <p className="text-sm font-semibold text-foreground">Team Members</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Invite your team members to collaborate.</p>
            <div className="space-y-3">
              {TEAM.map((member) => (
                <div key={member.email} className="flex items-center gap-3">
                  <AvatarRoot className="h-8 w-8 shrink-0">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name.slice(0, 2)}</AvatarFallback>
                  </AvatarRoot>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <SelectField
                    options={[
                      { value: "owner",    label: "Owner" },
                      { value: "developer",label: "Developer" },
                      { value: "member",   label: "Member" },
                    ]}
                    value={member.role.toLowerCase()}
                    onChange={() => undefined}
                    className="h-7 text-xs w-28 shrink-0"
                  />
                </div>
              ))}
            </div>
          </DCard>

          {/* Cookie Settings */}
          <DCard className="p-5">
            <p className="text-sm font-semibold text-foreground">Cookie Settings</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Manage your cookie settings here.</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">Strictly Necessary</p>
                  <Switch checked={strictCookies} onCheckedChange={setStrictCookies} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  These cookies are essential in order to use the website and use its features.
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-foreground">Functional Cookies</p>
                  <Switch checked={funcCookies} onCheckedChange={setFuncCookies} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  These cookies allow the website to provide personalised functionality.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">Save preferences</Button>
            </div>
          </DCard>
        </div>

        {/* ════ COLUMN 2 ════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Calendar */}
          <DCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCalMonth((m) => (m - 1 + 12) % 12)} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" aria-label="Previous month">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <p className="text-sm font-medium text-foreground">
                {MONTH_NAMES[calMonth]} {calYear}
              </p>
              <button onClick={() => setCalMonth((m) => (m + 1) % 12)} className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground" aria-label="Next month">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS.map((d) => (
                <p key={d} className="text-center text-[10px] font-medium text-muted-foreground">{d}</p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calGrid.map((day, i) => {
                const isToday = day === TODAY.getDate() && calMonth === TODAY.getMonth() && calYear === TODAY.getFullYear();
                const isSelected = day === 10;
                return (
                  <button key={i}
                    className={cn("h-7 w-7 rounded-full text-xs flex items-center justify-center mx-auto transition-colors",
                      !day && "invisible",
                      isToday && "bg-primary text-primary-foreground font-semibold",
                      isSelected && !isToday && "bg-primary/20 text-primary font-medium",
                      !isToday && !isSelected && day && "text-foreground hover:bg-accent"
                    )}
                    disabled={!day}
                    aria-label={day ? `${MONTH_NAMES[calMonth]} ${day}` : undefined}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </DCard>

          {/* Create an account form */}
          <DCard className="p-5">
            <p className="text-xl font-semibold text-foreground">Create an account</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Enter your email below to create your account
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button className="flex items-center justify-center gap-2 h-9 rounded-2xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground/70">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </button>
              <button className="flex items-center justify-center gap-2 h-9 rounded-2xl border border-border bg-card hover:bg-muted transition-colors text-sm font-medium text-foreground/70">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-foreground">E-mail</label>
                <Input type="email" placeholder="m@example.com" className="h-9 text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-foreground">Password</label>
                <Input type="password" placeholder="*********" className="h-9 text-sm" />
              </div>
              <Button variant="primary" className="w-full h-9">Create account</Button>
            </div>
          </DCard>

          {/* Chat */}
          <DCard className="overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <AvatarRoot className="h-8 w-8 shrink-0">
                <AvatarImage src="https://i.pravatar.cc/150?img=5" alt="Sofia Davis" />
                <AvatarFallback className="text-xs">SD</AvatarFallback>
              </AvatarRoot>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">Sofia Davis</p>
                <p className="text-[11px] text-muted-foreground">m@example.com</p>
              </div>
              <button className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="space-y-3 px-4 py-3 max-h-48 overflow-y-auto">
              {chatMessages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 text-xs", msg.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={sendChat} className="flex items-center gap-2 border-t border-border px-3 py-2">
              <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Placeholder" className="flex-1 h-8 text-xs border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
              <button type="submit" className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90" aria-label="Send message">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </DCard>

          {/* Report an issue — useZodForm wired */}
          <DCard className="p-5 space-y-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Report an issue</p>
              <p className="text-xs text-muted-foreground mt-0.5">What area are you having problems with?</p>
            </div>
            <form onSubmit={reportForm.handleSubmit(handleReport)} noValidate className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Area"
                  options={[{ value: "billing", label: "Billing" }, { value: "tech", label: "Technical" }, { value: "access", label: "Access" }]}
                  {...reportForm.register("area")}
                  error={reportForm.formState.errors.area?.message}
                  className="h-8 text-xs" />
                <SelectField label="Security Level"
                  options={[{ value: "2", label: "Severity 2" }, { value: "1", label: "Severity 1" }, { value: "3", label: "Severity 3" }]}
                  {...reportForm.register("severity")}
                  error={reportForm.formState.errors.severity?.message}
                  className="h-8 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-foreground">Subject</label>
                <Input placeholder="I need help with..." className="h-8 text-xs"
                  {...reportForm.register("subject")}
                  aria-invalid={Boolean(reportForm.formState.errors.subject)} />
                {reportForm.formState.errors.subject && (
                  <p role="alert" className="text-[10px] text-destructive">{reportForm.formState.errors.subject.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-foreground">Description</label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px] resize-none"
                  placeholder="Please include all information relevant to your issue."
                  {...reportForm.register("description")}
                  aria-invalid={Boolean(reportForm.formState.errors.description)}
                />
                {reportForm.formState.errors.description && (
                  <p role="alert" className="text-[10px] text-destructive">{reportForm.formState.errors.description.message}</p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={() => reportForm.reset()}>Cancel</Button>
                <Button type="submit" variant="primary" size="sm" className="h-8 text-xs" isLoading={reportForm.formState.isSubmitting}>Submit</Button>
              </div>
            </form>
          </DCard>
        </div>

        {/* ════ COLUMN 3 ════════════════════════════════════════════════ */}
        <div className="space-y-4">

          {/* Move Goal */}
          <DCard className="p-5">
            <p className="text-sm font-semibold text-foreground">Move Goal</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-4">Set your daily activity goal.</p>

            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalories((c) => Math.max(100, c - 50))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Decrease calories"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{calories}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Calories/day</p>
              </div>
              <button
                onClick={() => setCalories((c) => c + 50)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Increase calories"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <MiniBarChart data={barData} />

            <Button variant="outline" size="sm" className="w-full mt-4 h-8 text-xs">Set Goal</Button>
          </DCard>

          {/* Exercise Minutes */}
          <DCard className="p-5">
            <p className="text-sm font-semibold text-foreground">Exercise Minutes</p>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">
              Your exercise minutes are ahead of where you normally are.
            </p>
            <Sparkline data={exerciseData} />
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              {["Jan","Feb","Mar","Apr","May","Jun"].map((m) => <span key={m}>{m}</span>)}
            </div>
          </DCard>

          {/* Payments */}
          <DCard className="overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Payments</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your payments.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" aria-label="Recent payments">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2.5 w-8">
                      <Checkbox
                        checked={selectedPayments.size === PAYMENTS.length}
                        onCheckedChange={(v) => setSelectedPayments(v ? new Set(PAYMENTS.map(p => p.id)) : new Set())}
                      />
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Status</th>
                    <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">Email</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">Amount</th>
                    <th className="px-3 py-2.5 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENTS.map((p) => (
                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <Checkbox checked={selectedPayments.has(p.id)} onCheckedChange={() => togglePayment(p.id)} />
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={p.status} className="text-[10px] px-1.5 py-0.5">{p.label}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground max-w-[120px] truncate">{p.email}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-foreground">{p.amount}</td>
                      <td className="px-3 py-2.5">
                        <button className="text-muted-foreground hover:text-foreground" aria-label="More options">
                          <span className="text-base tracking-widest leading-none">⋯</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">{selectedPayments.size} of {PAYMENTS.length} row(s) selected.</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs">Previous</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">Next</Button>
              </div>
            </div>
          </DCard>

          {/* Share this document */}
          <DCard className="p-5 space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Share this document</p>
              <p className="text-xs text-muted-foreground mt-0.5">Anyone with the link can view this document.</p>
            </div>
            <div className="flex gap-2">
              <Input value="http://example.com/link/to/document" readOnly className="h-8 text-xs flex-1" />
              <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">Copy Link</Button>
            </div>
            <Separator />
            <p className="text-xs font-medium text-foreground">People with access</p>
            <div className="space-y-3">
              {PEOPLE_WITH_ACCESS.map((p) => (
                <div key={p.email} className="flex items-center gap-3">
                  <AvatarRoot className="h-8 w-8 shrink-0">
                    <AvatarImage src={p.avatar} alt={p.name} />
                    <AvatarFallback className="text-xs">{p.name.slice(0,2)}</AvatarFallback>
                  </AvatarRoot>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{p.email}</p>
                  </div>
                  <SelectField
                    options={[
                      { value: "edit", label: "Can edit" },
                      { value: "view", label: "Can view" },
                    ]}
                    value={p.perm === "Can edit" ? "edit" : "view"}
                    onChange={() => undefined}
                    className="h-7 text-xs w-24 shrink-0"
                  />
                </div>
              ))}
            </div>
          </DCard>
        </div>
      </div>
    </div>
  );
}
