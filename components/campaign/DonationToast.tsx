"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";

export function DonationToast() {
  const { toasts, dismissToast } = useCampaign();

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 z-[80] flex flex-col gap-2 max-w-[90vw]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-3 rounded-xl bg-white border border-outline-variant shadow-[0_10px_20px_rgba(0,24,53,0.18)] pl-3 pr-2 py-3 max-w-[340px]"
          >
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Heart size={18} className="fill-current" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-primary-container leading-tight">
                <span className="text-secondary">
                  ₺{formatTRY(toast.amount)}
                </span>{" "}
                bağış alındı 🎉
              </p>
              <p className="text-[11.5px] text-on-surface-variant truncate mt-0.5">
                {toast.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Kapat"
              className="shrink-0 w-7 h-7 rounded-md inline-flex items-center justify-center text-on-surface-variant/70 hover:bg-surface-container hover:text-primary-container transition"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
