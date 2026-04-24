"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronDown, Lock, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type TrustBadge = {
  icon: typeof BadgeCheck;
  title: string;
  summary: string;
  details: string;
};

interface TrustPanelProps {
  approvalNumber: string;
  approvalAuthority: string;
  approvalDate: string;
}

export function TrustPanel({
  approvalNumber,
  approvalAuthority,
  approvalDate,
}: TrustPanelProps) {
  const badges: TrustBadge[] = [
    {
      icon: BadgeCheck,
      title: "Valilik Onayı",
      summary: `${approvalAuthority} · ${approvalNumber}`,
      details: `Bu kampanya ${approvalAuthority} tarafından ${approvalDate} tarihinde ${approvalNumber} sayılı kararla onaylanmıştır. Kampanya, valilik denetimi altında yürütülmektedir.`,
    },
    {
      icon: ShieldCheck,
      title: "KVKK Uyumu",
      summary: "Kişisel veriler maskelenerek yayımlanır",
      details:
        "Bağışçı isim ve iletişim bilgileri KVKK kapsamında işlenir, şeffaflık merkezinde otomatik olarak maskelenir. İsteyen bağışçılar tamamen anonim kalabilir.",
    },
    {
      icon: Shield,
      title: "Değişmez Kayıt",
      summary: "Tüm işlemler append-only veritabanında",
      details:
        "Sistemdeki hiçbir gelir veya gider kaydı silinemez, değiştirilemez. Hatalı giriş olursa düzeltme yeni bir kayıt olarak eklenir — orijinal kayıt korunur.",
    },
    {
      icon: Lock,
      title: "SSL Güvenlik",
      summary: "Uçtan uca şifreli iletişim",
      details:
        "Kampanya sayfası ve yönetim paneli TLS 1.3 ile şifrelenir. Günlük otomatik veritabanı yedeği alınır, izole sunucu altyapısında çalışır.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {badges.map((badge, i) => {
        const isOpen = open === i;
        return (
          <button
            key={badge.title}
            type="button"
            onClick={() => setOpen(isOpen ? null : i)}
            aria-expanded={isOpen}
            className={cn(
              "text-left flex flex-col h-full p-5 rounded-2xl border bg-white transition-all duration-250",
              isOpen
                ? "border-secondary shadow-[0_10px_20px_rgba(0,24,53,0.08)]"
                : "border-outline-variant hover:border-secondary/60 hover:-translate-y-0.5",
            )}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <badge.icon size={20} strokeWidth={1.9} />
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-on-surface-variant transition-transform duration-250 mt-2",
                  isOpen && "rotate-180",
                )}
              />
            </div>
            <h3 className="text-[15px] font-semibold text-primary-container tracking-[-0.01em] mb-1.5">
              {badge.title}
            </h3>
            <p className="text-[12.5px] leading-[18px] text-on-surface-variant">
              {badge.summary}
            </p>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.p
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="text-[12.5px] leading-[19px] text-on-surface overflow-hidden"
                >
                  {badge.details}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
