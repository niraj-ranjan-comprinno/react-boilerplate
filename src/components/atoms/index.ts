// Atoms — smallest self-contained UI primitives.
// These are the canonical shadcn/ui-compatible implementations.
// Run `npx shadcn add <component>` to generate additional atoms here.

export { Button, buttonVariants } from "./button";
export type { ButtonProps } from "./button";

export { Input } from "./input";
export type { InputProps } from "./input";

export { Label } from "./label";
export type { LabelProps } from "./label";

export { Badge, badgeVariants } from "./badge";
export type { BadgeProps } from "./badge";

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback } from "./avatar";
export type { AvatarProps } from "./avatar";

export { Separator } from "./separator";
export type { SeparatorProps } from "./separator";

export { Spinner } from "./spinner";
export type { SpinnerProps } from "./spinner";

export { Skeleton } from "./skeleton";
export type { SkeletonProps } from "./skeleton";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card";

export { Icon } from "./icon";
export type { IconProps, IconSize } from "./icon";

export { Sphere } from "./sphere";
export type { SphereProps, SphereState, SphereSize } from "./sphere";

export { CallButton } from "./call-button";
export type { CallButtonProps, CallButtonTone } from "./call-button";

export { ErrorBoundary } from "./error-boundary";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./input-otp";

// ── New atoms (aligned with Front Dashboard component set) ─────────────────
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";
export { Alert, AlertTitle, AlertDescription } from "./alert";
export type { AlertProps } from "./alert";
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "./breadcrumb";
export { Checkbox } from "./checkbox";
export type { CheckboxProps } from "./checkbox";
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose, DialogPortal, DialogOverlay } from "./dialog";
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from "./dropdown-menu";
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "./popover";
export { Progress } from "./progress";
export type { ProgressProps } from "./progress";
export { Steps } from "./steps";
export type { StepsProps, Step } from "./steps";
export { Switch } from "./switch";
export type { SwitchProps } from "./switch";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export { Textarea } from "./textarea";
export type { TextareaProps } from "./textarea";
export { Toaster, toast } from "./toast";
export { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./tooltip";
