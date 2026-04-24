"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DonateButtonProps {
  className?: string;
  size?: "md" | "lg" | "xl";
  label?: string;
  variant?: "primary" | "white";
}

export function DonateButton({
  className,
  size = "xl",
  label = "Bağış Yap",
  variant = "primary",
}: DonateButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const sizeClass = {
    md: "px-6 py-2.5 text-[14px]",
    lg: "px-8 py-3 text-[15px]",
    xl: "px-10 py-4 text-[16px]",
  }[size];

  const variantClass =
    variant === "white"
      ? "bg-white text-secondary hover:bg-secondary-container hover:text-on-secondary-container"
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

      <AnimatePresence>
        {open && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-primary/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full md:max-w-md max-h-[90vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="absolute top-3 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary-container transition-colors"
              >
                <X size={18} />
              </button>
              <div className="p-7 md:p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-700 mb-5">
                  <Info size={26} strokeWidth={2} />
                </div>
                <h3 className="text-[22px] font-bold text-primary-container tracking-[-0.01em] mb-2">
                  Bu bir demo kampanyadır
                </h3>
                <p className="text-[14.5px] leading-[23px] text-on-surface-variant mb-6">
                  Gerçek bağış alınmaz. Bu sayfa, KAMPANYATAKİP altyapısının
                  bir kampanya için nasıl çalıştığını göstermek amacıyla
                  hazırlanmıştır.
                </p>
                <div className="rounded-xl bg-surface-container-low border border-outline-variant p-4 mb-6">
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    <strong className="text-primary-container">
                      Kendi kampanyanızı
                    </strong>{" "}
                    2-4 iş günü içinde canlıya alabilirsiniz. Valilik
                    onaylı kampanyalar için özel kurulum yapıyoruz.
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-[14.5px] font-bold bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors shadow-[0_4px_6px_rgba(0,103,127,0.25)]"
                  >
                    Ücretsiz Demo Al
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-[14px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    Kapat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
