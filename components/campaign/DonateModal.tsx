"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Info,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";
import { mockExchangeRate, toUSD, formatUSD } from "@/lib/exchange-rate";
import { cn } from "@/lib/utils";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_AMOUNTS = [50, 100, 250, 500, 750, 1000, 2000, 5000, 10000];

const CURRENCY_SYMBOL: Record<"TRY" | "USD" | "EUR", string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

const CURRENCY_TONE: Record<
  "TRY" | "USD" | "EUR",
  {
    badge: string;
    label: string;
    border: string;
    footerBg: string;
    footerBorder: string;
  }
> = {
  TRY: {
    badge: "bg-secondary/10 text-secondary",
    label: "text-secondary",
    border: "border-secondary/25",
    footerBg: "bg-secondary/[0.04]",
    footerBorder: "border-secondary/20",
  },
  USD: {
    badge: "bg-emerald-500/10 text-emerald-600",
    label: "text-emerald-700",
    border: "border-emerald-500/25",
    footerBg: "bg-emerald-500/[0.05]",
    footerBorder: "border-emerald-500/20",
  },
  EUR: {
    badge: "bg-blue-500/10 text-blue-600",
    label: "text-blue-700",
    border: "border-blue-500/25",
    footerBg: "bg-blue-500/[0.05]",
    footerBorder: "border-blue-500/20",
  },
};

// TR FAST Karekod-style EMV payload. Amount field (5406) is injected dynamically
// so that every amount produces a visually distinct QR. Static fields carry the
// recipient IBAN and fixed 'Defne SMA' reference.
function buildFastQr(amount: number): string {
  return [
    "000201010211",
    "26330016TR.GOV.BKM.TPSFAST0112TR0000000000",
    "52044829",
    `5406${amount}.00`,
    "5303949",
    "5802TR",
    "5914Defne Yardim Fonu",
    "6005Istanbul",
    "6216050401DefneSMA",
    "6304A1B2",
  ].join("");
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const { campaign } = useCampaign();
  const [amount, setAmount] = useState<number>(500);
  const [ibanOpen, setIbanOpen] = useState(false);
  const [copiedIban, setCopiedIban] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  const handleCopyIban = async (index: number, iban: string) => {
    await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedIban(index);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-modal-title"
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full md:max-w-2xl max-h-[95vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 md:px-7 py-4 md:py-5 border-b border-outline-variant bg-surface-container-low">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-secondary" />
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">
                    Bağış Yap
                  </span>
                </div>
                <h2
                  id="donate-modal-title"
                  className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em] truncate"
                >
                  {campaign.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary-container transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scroll area */}
            <div className="flex-1 overflow-y-auto">
              {/* 1. Amount selector */}
              <section className="px-5 md:px-7 pt-6">
                <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-3">
                  1 · Tutar Seçin
                </h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {QUICK_AMOUNTS.map((val) => {
                    const isSel = amount === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-[13.5px] font-bold tabular-nums transition-all border",
                          isSel
                            ? "bg-secondary text-on-secondary border-secondary shadow-[0_4px_6px_rgba(0,103,127,0.25)]"
                            : "bg-white text-primary-container border-outline-variant hover:border-secondary hover:text-secondary",
                        )}
                      >
                        ₺{formatTRY(val)}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 2. QR card — dynamic */}
              <section className="px-5 md:px-7 pt-7">
                <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-3">
                  2 · FAST Karekod
                </h3>

                <div className="rounded-2xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/[0.06] to-secondary-container/[0.12] p-5 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-6 items-center">
                    <div className="bg-white p-3 rounded-xl shadow-[0_4px_6px_rgba(0,24,53,0.08)] border border-outline-variant w-fit mx-auto sm:mx-0">
                      <QRCodeSVG
                        value={buildFastQr(amount)}
                        size={180}
                        bgColor="#ffffff"
                        fgColor="#001835"
                        level="M"
                        marginSize={0}
                      />
                    </div>

                    <div className="text-center sm:text-left">
                      <div className="flex items-center gap-1.5 text-secondary text-[11px] font-bold uppercase tracking-[0.14em] justify-center sm:justify-start">
                        <QrCode size={13} />
                        FAST Karekod
                      </div>
                      <p className="mt-2 text-[15px] md:text-[16px] font-semibold text-primary-container leading-[22px]">
                        Defne Yardım Fonu
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-on-surface-variant font-mono">
                        TR&nbsp;**&nbsp;****&nbsp;****&nbsp;****&nbsp;****&nbsp;****
                      </p>
                      <p className="mt-3 text-[26px] md:text-[30px] font-bold text-primary-container tabular-nums tracking-tight leading-none">
                        ₺{formatTRY(amount)}
                      </p>
                      <p className="mt-1 text-[12.5px] tabular-nums text-on-surface-variant">
                        ≈ ${formatUSD(Math.round(toUSD(amount, "TRY")))} USD
                        <span className="text-on-surface-variant/70">
                          {" "}(1$ = ₺{mockExchangeRate.usd_try.toFixed(2)})
                        </span>
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[19px] text-on-surface-variant max-w-sm mx-auto sm:mx-0">
                        Bağışınız seçili tutar (₺{formatTRY(amount)}) ile
                        bankanızda otomatik dolar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inline how-to */}
                <p className="mt-4 text-[13px] leading-[21px] text-on-surface-variant">
                  <Smartphone
                    size={14}
                    className="inline-block mr-1.5 -mt-0.5 text-secondary"
                  />
                  <strong className="text-primary-container">
                    Nasıl bağış yaparım?
                  </strong>{" "}
                  Bankanızın mobil uygulamasını açın, &ldquo;FAST QR Karekod
                  ile Öde&rdquo; menüsüne girin, yukarıdaki QR kodu okutun ve
                  onaylayın.
                </p>
              </section>

              {/* 4. IBAN accordion */}
              <section className="px-5 md:px-7 pt-6 pb-4">
                <button
                  type="button"
                  onClick={() => setIbanOpen((v) => !v)}
                  aria-expanded={ibanOpen}
                  className="w-full flex items-center justify-between gap-3 rounded-xl border border-outline-variant bg-white hover:border-secondary/60 transition-colors px-4 py-3.5"
                >
                  <span className="flex items-center gap-2.5 text-left">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container-high text-primary-container">
                      <Wallet size={16} />
                    </span>
                    <span>
                      <span className="block text-[13.5px] font-semibold text-primary-container">
                        Alternatif: Banka Havalesi (IBAN)
                      </span>
                      <span className="block text-[11.5px] text-on-surface-variant">
                        3 döviz seçeneği · IBAN kopyala, havale yap
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "text-on-surface-variant transition-transform duration-250 shrink-0",
                      ibanOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {ibanOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 10 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[12px] text-on-surface-variant mb-3">
                        Tüm hesaplar{" "}
                        <strong className="text-primary-container">
                          Ziraat Bankası
                        </strong>
                        &apos;ndadır. İhtiyacınıza uygun döviz cinsini seçin.
                      </p>

                      <ul className="space-y-2">
                        {campaign.bankAccounts.map((acc, i) => {
                          const isCopied = copiedIban === i;
                          const tone = CURRENCY_TONE[acc.currency];
                          const symbol = CURRENCY_SYMBOL[acc.currency];
                          return (
                            <li
                              key={i}
                              className={cn(
                                "rounded-lg border bg-white overflow-hidden",
                                tone.border,
                              )}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4">
                                <div
                                  className={cn(
                                    "inline-flex h-12 w-12 items-center justify-center rounded-lg shrink-0 font-bold text-[22px]",
                                    tone.badge,
                                  )}
                                  aria-hidden
                                >
                                  {symbol}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={cn(
                                      "text-[13.5px] font-semibold",
                                      tone.label,
                                    )}
                                  >
                                    {acc.currencyLabel}
                                  </p>
                                  <p className="text-[11.5px] text-on-surface-variant">
                                    {acc.bank}
                                  </p>
                                  <p className="mt-1 text-[12px] text-on-surface font-mono break-all">
                                    {acc.iban}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyIban(i, acc.iban)}
                                  className={cn(
                                    "shrink-0 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-colors w-full sm:w-auto",
                                    isCopied
                                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                                      : "bg-surface-container-low text-primary-container border border-outline-variant hover:border-secondary hover:text-secondary",
                                  )}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check size={13} strokeWidth={2.5} />
                                      Kopyalandı
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={13} />
                                      IBAN Kopyala
                                    </>
                                  )}
                                </button>
                              </div>

                              {acc.currency !== "TRY" && (
                                <div
                                  className={cn(
                                    "px-4 py-2 border-t text-[11.5px] font-mono text-on-surface-variant flex items-center gap-2 flex-wrap",
                                    tone.footerBorder,
                                    tone.footerBg,
                                  )}
                                >
                                  <span className="font-sans font-semibold text-on-surface-variant">
                                    SWIFT/BIC:
                                  </span>
                                  <span className="text-primary-container font-semibold">
                                    {acc.swift}
                                  </span>
                                  <span className="font-sans text-on-surface-variant/80">
                                    · Yurtdışından transfer için gerekli
                                  </span>
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>

                      <p className="mt-3 text-[12px] text-on-surface-variant">
                        Hesap sahibi:{" "}
                        <strong className="text-primary-container">
                          {campaign.bankAccounts[0].accountName}
                        </strong>
                        . Bağış açıklamasına{" "}
                        <strong className="text-primary-container">
                          &ldquo;Defne SMA&rdquo;
                        </strong>{" "}
                        yazınız.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Role disclosure — directly below the IBAN accordion */}
                <div className="mt-3 flex items-start gap-3 p-4 rounded-lg border-l-4 border-secondary bg-secondary/[0.06]">
                  <ShieldCheck
                    size={20}
                    className="text-secondary shrink-0 mt-[2px]"
                    strokeWidth={2}
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-secondary mb-1 tracking-tight">
                      Güvenli & Şeffaf Bağış
                    </p>
                    <p className="text-[12.5px] leading-[19px] text-on-surface-variant">
                      Bağışınız{" "}
                      <strong className="text-primary-container">
                        KAMPANYATAKİP aracılığıyla değil
                      </strong>
                      , doğrudan{" "}
                      <strong className="text-primary-container">
                        Defne Yardım Fonu&apos;nun
                      </strong>{" "}
                      banka hesabına geçer. KAMPANYATAKİP sadece bağışı takip
                      ve raporlama için kullanılır.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer info strip */}
            <div className="shrink-0 border-t border-outline-variant bg-emerald-50 px-5 md:px-7 py-4">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-700 shrink-0">
                  <Info size={16} />
                </div>
                <div className="text-[12.5px] leading-[19px] text-emerald-900">
                  <strong className="font-semibold">
                    Bu bir demo kampanyadır.
                  </strong>{" "}
                  KAMPANYATAKİP, kampanya sahiplerine platform sağlar ve
                  bağışları takip eder. Paralar doğrudan kampanya sahibinin
                  banka hesabına aktarılır.{" "}
                  <Link
                    href="/basvuru"
                    onClick={onClose}
                    className="font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 inline-flex items-center gap-0.5"
                  >
                    Başvuru Yapın <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
