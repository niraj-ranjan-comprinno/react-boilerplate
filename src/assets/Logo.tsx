interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

/**
 * Application logo.
 * Renders a teal wordmark in expanded mode and a monogram in collapsed mode.
 */
export function Logo({ className = "", collapsed = false }: LogoProps) {
  if (collapsed) {
    return (
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#4CCBBF] font-bold text-white text-sm ${className}`}
      >
        R
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4CCBBF] font-bold text-white text-sm">
        R
      </div>
      <span className="text-[15px] font-bold text-[#E2E8F0]">
        React<span className="text-[#4CCBBF]">UI</span>
      </span>
    </div>
  );
}
