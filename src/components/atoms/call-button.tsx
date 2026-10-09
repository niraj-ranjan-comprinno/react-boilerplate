import { cn } from "@/lib/utils";

/**
 * CallButton atom — round icon button for voice / call UI.
 *
 * Ported from command-center-main CallButton.tsx.
 * Used in VoiceVerifyScreen as the microphone trigger.
 *
 * @example
 * <CallButton tone="agent" onClick={startListening} aria-label="Start mic">
 *   <Mic className="h-6 w-6 text-agent" strokeWidth={1.5} />
 * </CallButton>
 */

const TONE = {
  /** Microphone button on the voice-verify screen */
  agent:
    "h-16 w-16 border border-agent/30 bg-agent-soft hover:border-agent/60 hover:bg-agent/20 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  /** Glass button on a call window */
  glass:
    "h-12 w-12 bg-white/15 text-white/80 transition-colors hover:bg-white/25",
  /** Muted / active state on a call window */
  "glass-on":
    "h-12 w-12 bg-white/30 text-white transition-colors",
  /** End-call — destructive red */
  destructive:
    "h-12 w-12 bg-destructive text-white shadow-md transition-opacity hover:opacity-90",
} as const;

export type CallButtonTone = keyof typeof TONE;

export interface CallButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tone: CallButtonTone;
}

export function CallButton({ tone, className, children, ...props }: CallButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full",
        TONE[tone],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
