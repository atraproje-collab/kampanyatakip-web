"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EarlyAccessBadgeProps {
  label?: string;
  className?: string;
  variant?: "light" | "dark";
}

export function EarlyAccessBadge({
  label = "ERKEN ERİŞİM AŞAMASI",
  className,
  variant = "light",
}: EarlyAccessBadgeProps) {
  const base =
    variant === "dark"
      ? "bg-white/10 text-secondary-container border border-white/15"
      : "bg-secondary/10 text-secondary border border-secondary/20";

  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]",
        base,
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full"
        initial={{ boxShadow: "0 0 0 0 rgba(0,103,127,0.0)" }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(0,103,127,0.35)",
            "0 0 0 8px rgba(0,103,127,0)",
          ],
        }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
      />
      <Sparkles size={13} className="relative shrink-0" strokeWidth={2.25} />
      <span className="relative">{label}</span>
    </motion.span>
  );
}
