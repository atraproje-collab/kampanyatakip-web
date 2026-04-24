import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant = "default" | "solid" | "outline" | "onDark";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-secondary/10 text-secondary",
  solid: "bg-secondary text-on-secondary",
  outline: "border border-outline-variant text-on-surface-variant bg-transparent",
  onDark: "bg-white/10 text-white border border-white/20 backdrop-blur-md",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-widest",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
