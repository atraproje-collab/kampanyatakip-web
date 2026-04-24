import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline-navy" | "outline-white" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-secondary text-on-secondary hover:bg-on-secondary-container shadow-[0_4px_6px_rgba(0,24,53,0.06)] hover:shadow-[0_10px_20px_rgba(0,103,127,0.3)] hover:-translate-y-0.5",
  secondary:
    "bg-primary-container text-on-primary hover:bg-primary",
  "outline-navy":
    "border-2 border-primary-container text-primary-container hover:bg-primary-container hover:text-on-primary bg-transparent",
  "outline-white":
    "border-2 border-white/40 text-white hover:bg-white hover:text-primary-container bg-white/10 backdrop-blur-md",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-2.5 text-[14px]",
  lg: "px-8 py-3 text-[15px]",
  xl: "px-10 py-4 text-[16px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight",
        "transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        "active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
