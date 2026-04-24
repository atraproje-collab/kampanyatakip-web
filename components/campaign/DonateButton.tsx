"use client";

import { useState } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { DonateModal } from "@/components/campaign/DonateModal";
import { cn } from "@/lib/utils";

interface DonateButtonProps {
  className?: string;
  size?: "md" | "lg" | "xl";
  label?: string;
  variant?: "primary" | "white" | "outline-white";
}

export function DonateButton({
  className,
  size = "xl",
  label = "Bağış Yap",
  variant = "primary",
}: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  const sizeClass = {
    md: "px-6 py-2.5 text-[14px]",
    lg: "px-8 py-3 text-[15px]",
    xl: "px-10 py-4 text-[16px]",
  }[size];

  const variantClass =
    variant === "white"
      ? "bg-white text-secondary hover:bg-secondary-container hover:text-on-secondary-container"
      : variant === "outline-white"
        ? "bg-white/10 border-2 border-white/40 text-white hover:bg-white hover:text-primary-container backdrop-blur-md"
        : "bg-secondary text-on-secondary hover:bg-on-secondary-container shadow-[0_10px_20px_rgba(0,103,127,0.3)] hover:shadow-[0_18px_30px_rgba(0,103,127,0.4)] hover:-translate-y-0.5";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-bold tracking-tight transition-all duration-250 active:scale-[0.98] group/btn",
          sizeClass,
          variantClass,
          className,
        )}
      >
        <Heart size={18} strokeWidth={2.5} className="fill-current" />
        {label}
        <ArrowRight
          size={16}
          className="transition-transform group-hover/btn:translate-x-0.5"
        />
      </button>

      <DonateModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
