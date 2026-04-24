"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CalendarClock, Users } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";

interface LiveCounterProps {
  variant?: "light" | "dark";
}

export function LiveCounter({ variant = "dark" }: LiveCounterProps) {
  const { raised, donorCount, campaign } = useCampaign();
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
    const to = raised;
    prevRaisedRef.current = raised;

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
  }, [inView, hasStarted, raised]);

  // Smooth updates after live donations
  useEffect(() => {
    if (!hasStarted) return;
    if (raised === prevRaisedRef.current) return;
    const from = prevRaisedRef.current;
    const to = raised;
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
  }, [raised, hasStarted]);

  const pct = Math.min((raised / campaign.goal) * 100, 100);
  const isDark = variant === "dark";

  return (
    <div
      ref={ref}
      className={
        isDark ? "text-white" : "text-on-surface"
      }
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <div>
          <p
            className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] ${
              isDark ? "text-white/65" : "text-on-surface-variant"
            }`}
          >
            Toplanan Bağış
          </p>
          <p
            className={`mt-1 text-[34px] md:text-[46px] lg:text-[56px] font-bold tracking-tight leading-none tabular-nums ${
              isDark ? "text-white" : "text-primary-container"
            }`}
          >
            ₺{formatTRY(animated)}
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-[11px] md:text-[12px] font-bold uppercase tracking-[0.14em] ${
              isDark ? "text-white/65" : "text-on-surface-variant"
            }`}
          >
            Hedef
          </p>
          <p
            className={`mt-1 text-[18px] md:text-[22px] font-semibold tracking-tight tabular-nums ${
              isDark ? "text-white/90" : "text-on-surface-variant"
            }`}
          >
            ₺{formatTRY(campaign.goal)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div
        className={`relative h-3 md:h-3.5 rounded-full overflow-hidden ${
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
      <div className="mt-2 flex items-center justify-between text-[12px] md:text-[13px] font-semibold">
        <span className={isDark ? "text-secondary-container" : "text-secondary"}>
          %{pct.toFixed(1)} tamamlandı
        </span>
        <span className={isDark ? "text-white/70" : "text-on-surface-variant"}>
          ₺{formatTRY(campaign.goal - raised)} kaldı
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
