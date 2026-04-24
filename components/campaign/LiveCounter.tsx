"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarClock, RefreshCw, Users } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
} from "@/lib/exchange-rate";

interface LiveCounterProps {
  variant?: "light" | "dark";
}

export function LiveCounter({ variant = "dark" }: LiveCounterProps) {
  const { raisedUsd, donorCount, campaign } = useCampaign();
  const rate = mockExchangeRate;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [animated, setAnimated] = useState(0);
  const prevRaisedRef = useRef(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Initial count-up animation once visible
  useEffect(() => {
    if (!inView || hasStarted) return;
    setHasStarted(true);
    const duration = 2000;
    const start = performance.now();
    const from = 0;
    const to = raisedUsd;
    prevRaisedRef.current = raisedUsd;

    let rafId = 0;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setAnimated(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [inView, hasStarted, raisedUsd]);

  // Smooth updates after live donations
  useEffect(() => {
    if (!hasStarted) return;
    if (raisedUsd === prevRaisedRef.current) return;
    const from = prevRaisedRef.current;
    const to = raisedUsd;
    prevRaisedRef.current = to;
    const duration = 900;
    const start = performance.now();
    let rafId = 0;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setAnimated(Math.round(from + (to - from) * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [raisedUsd, hasStarted]);

  const pct = Math.min((raisedUsd / campaign.goalUsd) * 100, 100);
  const isDark = variant === "dark";

  const animatedTry = animated * rate.usd_try;
  const goalTry = campaign.goalUsd * rate.usd_try;

  return (
    <div
      ref={ref}
      className={isDark ? "text-white" : "text-on-surface"}
    >
      {/* Primary — USD raised */}
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
            ${formatUSD(animated)}
          </span>
          <span
            className={`text-[14px] md:text-[16px] font-semibold ${
              isDark ? "text-white/70" : "text-on-surface-variant"
            }`}
          >
            USD
          </span>
        </div>

        {/* Secondary — TRY equivalent */}
        <div
          className={`mt-2 flex items-center flex-wrap gap-x-2 text-[13px] md:text-[14px] tabular-nums ${
            isDark ? "text-white/75" : "text-on-surface-variant"
          }`}
        >
          <span>≈ ₺{formatTRY(animatedTry)}</span>
          <span
            className={`text-[11px] font-medium ${
              isDark ? "text-white/45" : "text-on-surface-variant/70"
            }`}
          >
            (1$ = ₺{rate.usd_try.toFixed(2)})
          </span>
        </div>
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

      {/* Goal row */}
      <div className="mt-2 flex items-center justify-between text-[12px] md:text-[13px] font-semibold flex-wrap gap-1">
        <span className={isDark ? "text-secondary-container" : "text-secondary"}>
          %{pct.toFixed(1)} tamamlandı
        </span>
        <span
          className={
            isDark ? "text-white/70 text-right" : "text-on-surface-variant"
          }
        >
          Hedef: ${formatUSD(campaign.goalUsd)}
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
          Döviz kuru günlük güncellenir · Son: {rate.last_updated} ·{" "}
          {rate.source}
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
              {campaign.daysLeft} gün
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
