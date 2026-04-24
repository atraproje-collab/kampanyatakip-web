import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-low p-8 rounded-xl border border-outline-variant",
        "transition-all duration-250 hover:border-secondary hover:-translate-y-1",
        "hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] group",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
