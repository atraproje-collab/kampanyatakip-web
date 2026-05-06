"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarClock, RefreshCw, Users } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
} from "@/lib/exchange-rate";
import { formatRemaining } from "@/lib/campaign-settings";

interface LiveCounterProps {
  variant?: "light" | "dark";
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function CounterSkeleton({ isDark }: { isDark: boolean }) {
  const p = isDark
    ? "bg-white/15 animate-pulse rounded-md"
    : "bg-surface-container-high animate-pulse rounded-md";
  return (
    <div aria-busy="true" aria-label="Yükleniyor…">
      <div className={`h-3 w-16 ${p} mb-3`} />
      <div className="flex items-baseline gap-2 mt-1">
        <div className={`h-12 w-44 ${p}`} />
        <div className={`h-4 w-9 ${p}`} />
      </div>
      <div className={`h-4 w-36 ${p} mt-2`} />
      <div
        className={`h-3 w-full rounded-full ${p} mt-5`}
        style={{ borderRadius: "9999px" }}
      />
      <div className="mt-2 flex justify-between">
        <div className={`h-3 w-24 ${p}`} />
        <div className={`h-3 w-28 ${p}`} />
      </div>
      <div className={`h-3 w-48 ${p} mt-3`} />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className={`h-[72px] rounded-xl ${p}`} style={{ borderRadius: "0.75rem" }} />
        <div className={`h-[72px] rounded-xl ${p}`} style={{ borderRadius: "0.75rem" }} />
      </div>
    </div>
  );
}

// ── Counter ──────────────────────────────────────────────────────────────────

export function LiveCounter({ variant = "dark" }: LiveCounterProps) {
  const { donations, raisedTry, raisedUsd, donorCount, campaign, statsReady } =
    useCampaign();
  const rate = mockExchangeRate;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Debug: yardımcı log — context'ten gelen değerleri ve kuru göster.
  useEffect(() => {
    if (!statsReady) return;
    // eslint-disable-next-line no-console
    console.log("[LiveCounter] data", {
      donationsCount: donations.length,
      sampleDonations: donations.slice(0, 3).map((d) => ({
        id: d.id,
        amount: d.amount,
        currency: d.currency,
        date: d.date,
      })),
      raisedTry: Math.round(raisedTry),
      raisedUsd: Math.round(raisedUsd),
      usd_try: rate.usd_try,
      goalUsd: campaign.goalUsd,
      goalTry: Math.round(campaign.goalUsd * rate.usd_try),
    });
  }, [statsReady, donations, raisedTry, raisedUsd, rate.usd_try, campaign.goalUsd]);

  const isDark = variant === "dark";

  if (!statsReady) {
    return (
      <div ref={ref}>
        <CounterSkeleton isDark={isDark} />
      </div>
    );
  }

  // Guard against 0 exchange rate (should never happen with fallback 45.15)
  const safeUsdTry = rate.usd_try > 0 ? rate.usd_try : 45.15;
  const goalUsd = campaign.goalUsd;
  const goalTry = goalUsd * safeUsdTry;
  const pct = Math.min((raisedTry / Math.max(1, goalTry)) * 100, 100);

  return (
    <div ref={ref} className={isDark ? "text-white" : "text-on-surface"}>
      {/* Primary — TRY raised */}
      <div>
        <p
          className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] ${
            isDark ? "text-white/65" : "text-on-surface-variant"
          }`}
        >
          Toplanan
        </p>
        <div className="mt-1 flex items-baseline flex-wrap gap-x-2">
          <span
            className={`text-[34px] md:text-[46px] lg:text-[54px] font-bold tracking-tight leading-none tabular-nums ${
              isDark ? "text-white" : "text-primary-container"
            }`}
          >
            ₺{formatTRY(Math.round(raisedTry))}
          </span>
          <span
            className={`text-[14px] md:text-[16px] font-semibold ${
              isDark ? "text-white/70" : "text-on-surface-variant"
            }`}
          >
            TL
          </span>
        </div>

        {/* Secondary — USD equivalent */}
        {raisedTry > 0 && (
          <div
            className={`mt-2 flex items-center flex-wrap gap-x-2 text-[13px] md:text-[14px] tabular-nums ${
              isDark ? "text-white/75" : "text-on-surface-variant"
            }`}
          >
            <span>≈ ${formatUSD(Math.round(raisedUsd))} USD</span>
            <span
              className={`text-[11px] font-medium ${
                isDark ? "text-white/45" : "text-on-surface-variant/70"
              }`}
            >
              (1$ = ₺{safeUsdTry.toFixed(2)})
            </span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div
        className={`mt-5 relative h-3 md:h-3.5 rounded-full overflow-hidden ${
          isDark ? "bg-white/15" : "bg-surface-container-high"
        }`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 2, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary-container to-secondary-fixed-dim rounded-full shadow-[0_0_16px_rgba(102,218,255,0.5)]"
        />
      </div>

      {/* Goal row — Hedef: $ primary, ≈ ₺ secondary */}
      <div className="mt-2 flex items-center justify-between text-[12px] md:text-[13px] font-semibold flex-wrap gap-1">
        <span className={isDark ? "text-secondary-container" : "text-secondary"}>
          %{pct.toFixed(1)} tamamlandı
        </span>
        <span
          className={isDark ? "text-white/70 text-right" : "text-on-surface-variant"}
        >
          Hedef: ${formatUSD(goalUsd)}
          <span
            className={`ml-2 font-normal text-[11px] ${
              isDark ? "text-white/50" : "text-on-surface-variant/80"
            }`}
          >
            ≈ ₺{formatTRY(goalTry)}
          </span>
        </span>
      </div>

      {/* Rate disclosure */}
      <div
        className={`mt-3 flex items-center gap-1.5 text-[11px] ${
          isDark ? "text-white/50" : "text-on-surface-variant/80"
        }`}
      >
        <RefreshCw size={11} />
        <span>
          Döviz kuru günlük güncellenir · Son: {rate.last_updated} · {rate.source}
        </span>
      </div>

      {/* Stats row */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div
          className={`rounded-xl p-3.5 flex items-center gap-3 ${
            isDark
              ? "bg-white/[0.08] border border-white/15"
              : "bg-surface-container-low border border-outline-variant"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark
                ? "bg-secondary-container/25 text-secondary-container"
                : "bg-secondary/10 text-secondary"
            }`}
          >
            <Users size={18} />
          </div>
          <div>
            <p
              className={`text-[10.5px] font-bold uppercase tracking-wider ${
                isDark ? "text-white/70" : "text-on-surface-variant"
              }`}
            >
              Bağışçı
            </p>
            <p
              className={`text-[18px] md:text-[20px] font-bold tabular-nums ${
                isDark ? "text-white" : "text-primary-container"
              }`}
            >
              {formatTRY(donorCount)}
            </p>
          </div>
        </div>
        <div
          className={`rounded-xl p-3.5 flex items-center gap-3 ${
            isDark
              ? "bg-white/[0.08] border border-white/15"
              : "bg-surface-container-low border border-outline-variant"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark
                ? "bg-secondary-container/25 text-secondary-container"
                : "bg-secondary/10 text-secondary"
            }`}
          >
            <CalendarClock size={18} />
          </div>
          <div>
            <p
              className={`text-[10.5px] font-bold uppercase tracking-wider ${
                isDark ? "text-white/70" : "text-on-surface-variant"
              }`}
            >
              Kalan Süre
            </p>
            <p
              className={`text-[18px] md:text-[20px] font-bold tabular-nums ${
                isDark ? "text-white" : "text-primary-container"
              }`}
            >
              {campaign.endDate
                ? formatRemaining(campaign.endDate)
                : `${campaign.daysLeft} gün`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
