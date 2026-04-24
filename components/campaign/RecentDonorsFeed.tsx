"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, Heart, Minimize2, Users } from "lucide-react";
import { useState } from "react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

interface RecentDonorsFeedProps {
  limit?: number;
}

function Initials({ name }: { name: string }) {
  const clean = name.replace(/\*/g, "");
  const parts = clean.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length
    ? parts.map((p) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "AB";
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-primary-container text-on-secondary text-[11px] font-bold shrink-0">
      {initials}
    </span>
  );
}

export function RecentDonorsFeed({ limit = 6 }: RecentDonorsFeedProps) {
  const { recentDonors } = useCampaign();
  const visible = recentDonors.slice(0, limit);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl bg-white border border-outline-variant overflow-hidden shadow-[0_4px_6px_rgba(0,24,53,0.04)]">
          <FeedHeader />
          <ul className="divide-y divide-outline-variant max-h-[520px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {visible.map((donor) => (
                <motion.li
                  key={donor.id}
                  layout
                  initial={{ opacity: 0, y: -20, backgroundColor: "rgba(16, 185, 129, 0.18)" }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: donor.isFresh
                      ? "rgba(16, 185, 129, 0.10)"
                      : "rgba(255, 255, 255, 0)",
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    backgroundColor: { duration: 1.8 },
                  }}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <Initials name={donor.name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-primary-container truncate">
                      {donor.name}
                    </p>
                    <p className="text-[11.5px] text-on-surface-variant truncate">
                      {donor.method}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13.5px] font-bold text-secondary tabular-nums">
                      ₺{formatTRY(donor.amount)}
                    </p>
                    <p className="text-[10.5px] text-on-surface-variant">
                      {donor.time}
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <div className="px-4 py-3 border-t border-outline-variant bg-surface-container-low">
            <p className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
              <Activity size={11} className="text-secondary" />
              Canlı akış · Sayfa yenilenmeden güncellenir
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom sheet trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-primary-container text-on-primary px-4 py-2.5 shadow-[0_10px_20px_rgba(0,24,53,0.25)] border border-white/15 text-[12.5px] font-semibold"
      >
        <Heart size={14} className="fill-secondary-container text-secondary-container" />
        Canlı Bağışlar
        <span className="inline-flex items-center justify-center min-w-[22px] h-5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold px-1.5">
          {visible.length}
        </span>
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-[90]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-primary/65 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="p-5 border-b border-outline-variant flex items-center justify-between">
                <div>
                  <h3 className="text-[16px] font-semibold text-primary-container">
                    Canlı Bağışlar
                  </h3>
                  <p className="text-[12px] text-on-surface-variant">
                    Son {visible.length} bağış · Canlı güncelleniyor
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Kapat"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <Minimize2 size={18} />
                </button>
              </div>
              <ul className="flex-1 overflow-y-auto divide-y divide-outline-variant">
                <AnimatePresence initial={false}>
                  {visible.map((donor) => (
                    <motion.li
                      key={donor.id}
                      layout
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "px-5 py-3.5 flex items-center gap-3 transition-colors",
                        donor.isFresh && "bg-emerald-50",
                      )}
                    >
                      <Initials name={donor.name} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold text-primary-container truncate">
                          {donor.name}
                        </p>
                        <p className="text-[12px] text-on-surface-variant truncate">
                          {donor.method}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[14px] font-bold text-secondary tabular-nums">
                          ₺{formatTRY(donor.amount)}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          {donor.time}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function FeedHeader() {
  return (
    <div className="px-4 py-3.5 border-b border-outline-variant bg-gradient-to-r from-primary-container to-secondary text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={15} />
          <h3 className="text-[13px] font-bold uppercase tracking-[0.14em]">
            Canlı Bağışlar
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-secondary-container">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container/70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary-container" />
          </span>
          CANLI
        </span>
      </div>
    </div>
  );
}
