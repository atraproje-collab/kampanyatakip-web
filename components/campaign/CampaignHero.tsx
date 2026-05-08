"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Heart, Lock, Sparkles } from "lucide-react";
import { LiveCounter } from "@/components/campaign/LiveCounter";
import { DonateButton } from "@/components/campaign/DonateButton";
import { ShareButtons } from "@/components/campaign/ShareButtons";
import { useCampaign } from "@/components/campaign/CampaignContext";

export function CampaignHero() {
  const { campaign } = useCampaign();
  const { provinceApproval } = campaign;

  return (
    <section className="relative overflow-hidden">
      {/* Gradient/abstract cover */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #001835 0%, #012d59 55%, #00677f 120%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(at 20% 20%, rgba(102,218,255,0.28) 0%, transparent 50%), radial-gradient(at 80% 85%, rgba(0,103,127,0.35) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          {/* Left: title + CTAs */}
          <div className="lg:col-span-3 text-white">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary-container/20 text-secondary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] border border-secondary-container/30"
            >
              <Sparkles size={13} />
              SMA Tip 1 · Zolgensma Kampanyası
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-5 text-[34px] md:text-[48px] lg:text-[56px] font-bold tracking-[-0.02em] leading-[1.05]"
            >
              {campaign.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="mt-4 text-[15px] md:text-[17px] leading-[26px] text-white/85 max-w-2xl"
            >
              {campaign.subtitle}
            </motion.p>

            {/* Approval badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 inline-flex items-start gap-3 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/20 px-4 py-3 max-w-lg"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary-container/25 text-secondary-container flex items-center justify-center shrink-0">
                <BadgeCheck size={18} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-secondary-container uppercase tracking-[0.12em]">
                  {provinceApproval.authority} Onaylı
                </p>
                <p className="text-[12.5px] text-white/85 mt-0.5">
                  Karar No: {provinceApproval.decisionNumber} ·{" "}
                  {provinceApproval.approvalDate}
                </p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <DonateButton size="xl" label="Bağış Yap" />
              <div className="hidden sm:block">
                <ShareButtons compact />
              </div>
            </motion.div>
            <div className="sm:hidden mt-4">
              <ShareButtons compact />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 text-[12px] text-white/70 max-w-md flex items-start gap-1.5"
            >
              <Heart size={13} className="mt-0.5 text-secondary-container shrink-0" />
              Her bağış KAMPANYATAKİP değişmez veritabanına kayıt edilir.
              İşlem saniyeler içinde şeffaflık merkezinde görünür.
            </motion.p>
          </div>

          {/* Right: live counter card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 p-6 md:p-7 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
              <LiveCounter variant="dark" />
            </div>

            {/* Şeffaflık Merkezi CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32 }}
              className="mt-4"
            >
              <Link
                href="/kampanya/demo/seffaflik"
                className="group/cta flex items-center justify-between gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-400/[0.08] backdrop-blur-md px-5 py-4 text-white hover:bg-emerald-400/[0.14] hover:border-emerald-300/60 transition-all"
                aria-label="Şeffaflık Merkezi&apos;ni görüntüle"
              >
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-400/25 text-emerald-200 flex items-center justify-center">
                    <Lock size={18} />
                  </span>
                  <span>
                    <span className="block text-[14.5px] font-bold leading-tight">
                      🔒 Şeffaflık Merkezi&apos;ni Görüntüle
                    </span>
                    <span className="block mt-0.5 text-[12px] text-white/75">
                      Tüm gelir-gider kayıtları açık ve denetlenebilir
                    </span>
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  className="text-emerald-200 transition-transform group-hover/cta:translate-x-0.5 shrink-0"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
