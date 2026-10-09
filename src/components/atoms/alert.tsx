import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex items-start gap-3 rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default:     "border-border bg-card text-foreground",
        info:        "border-info/30 bg-info-soft text-info",
        success:     "border-success/30 bg-success-soft text-success",
        warning:     "border-warning/30 bg-warning/10 text-warning",
        destructive: "border-destructive/30 bg-destructive/10 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const ICONS = {
  default:     Info,
  info:        Info,
  success:     CheckCircle2,
  warning:     AlertTriangle,
  destructive: AlertCircle,
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  /** Whether the dismiss button is shown. */
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Alert atom — inline feedback banner.
 *
 * @example
 * <Alert variant="success" title="Saved!" onDismiss={() => setShow(false)} dismissible>
 *   Your profile has been updated.
 * </Alert>
 */
export function Alert({
  variant = "default",
  title,
  dismissible,
  onDismiss,
  children,
  className,
  ...props
}: AlertProps) {
  const Icon = ICONS[variant ?? "default"];

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        {children && <p className="leading-relaxed opacity-90">{children}</p>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export const AlertTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("font-semibold leading-none tracking-tight mb-1", className)}>{children}</p>
);

export const AlertDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-sm opacity-90 leading-relaxed", className)}>{children}</p>
);
