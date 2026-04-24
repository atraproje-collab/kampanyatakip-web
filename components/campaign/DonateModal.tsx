"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Copy,
  Info,
  QrCode,
  Smartphone,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_AMOUNTS = [50, 100, 250, 500, 750, 1000, 2000, 5000, 10000];
const MIN_CUSTOM = 10;
const MAX_CUSTOM = 1_000_000;

const SUPPORTED_BANKS = [
  "Ziraat",
  "Vakıfbank",
  "İş Bankası",
  "Akbank",
  "Garanti BBVA",
  "Yapı Kredi",
  "Halkbank",
  "Denizbank",
  "QNB",
  "TEB",
  "Albaraka",
  "Kuveyt Türk",
  "ING",
  "Türkiye Finans",
  "Vakıf Katılım",
];

// Static TR FAST-style payload — never changes with amount. Amount is entered
// manually by the donor in their banking app. KAMPANYATAKİP is not a payment
// intermediary: the QR just carries the recipient IBAN + name + fixed reference.
const FAST_QR_PAYLOAD = [
  "TR-FAST",
  "IBAN:TR000000000000000000000000",
  "ALICI:Defne Yardim Fonu",
  "ACIKLAMA:Defne SMA Kampanyasi",
].join("|");

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  const { campaign } = useCampaign();
  const [selected, setSelected] = useState<number | "custom">(500);
  const [customInput, setCustomInput] = useState<string>("");
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

  const amount = useMemo(() => {
    if (selected === "custom") {
      const n = Number(customInput.replace(/[^\d]/g, ""));
      if (isNaN(n) || n < MIN_CUSTOM) return 0;
      return Math.min(n, MAX_CUSTOM);
    }
    return selected;
  }, [selected, customInput]);

  const amountValid = amount >= MIN_CUSTOM;

  const handleCopyIban = async (index: number, iban: string) => {
    await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
    setCopiedIban(index);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  const steps = [
    {
      label: "Bankanızın mobil uygulamasını açın",
      sub: "Aşağıda listelenen bankaların tamamı desteklenir.",
    },
    {
      label: "'FAST · Karekod ile Öde' menüsünü bulun",
      sub: "Her bankada farklı isimde olabilir (QR ile Öde, Karekod, FAST).",
    },
    {
      label: "Yukarıdaki QR kodu okutun",
      sub: "Alıcı IBAN ve isim otomatik yüklenecektir.",
    },
    {
      label: amountValid
        ? `Tutarı ₺${formatTRY(amount)} olarak girin`
        : "Bağış tutarını kendiniz girin",
      sub: "Tutar QR'a dâhil değildir — miktarı uygulamada siz belirlersiniz.",
    },
    {
      label: "Açıklamaya 'Defne SMA' yazıp onaylayın",
      sub: "Bu referans, bağışınızın kampanyaya doğru eşleşmesini sağlar.",
    },
  ];

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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {QUICK_AMOUNTS.map((val) => {
                    const isSel = selected === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSelected(val)}
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
                  <button
                    type="button"
                    onClick={() => setSelected("custom")}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-[13.5px] font-bold transition-all border",
                      selected === "custom"
                        ? "bg-secondary text-on-secondary border-secondary shadow-[0_4px_6px_rgba(0,103,127,0.25)]"
                        : "bg-white text-primary-container border-outline-variant hover:border-secondary hover:text-secondary",
                    )}
                  >
                    Özel
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {selected === "custom" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <label className="block">
                        <span className="block text-[12px] font-semibold text-on-surface-variant mb-1.5">
                          Özel tutar (₺ {formatTRY(MIN_CUSTOM)} –{" "}
                          {formatTRY(MAX_CUSTOM)})
                        </span>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-semibold">
                            ₺
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={customInput}
                            onChange={(e) =>
                              setCustomInput(
                                e.target.value.replace(/[^\d]/g, ""),
                              )
                            }
                            placeholder="Örn. 750"
                            className="w-full rounded-lg border border-outline-variant pl-9 pr-4 py-3 text-[15px] text-on-surface font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                          />
                        </div>
                        {customInput &&
                          Number(customInput) > 0 &&
                          Number(customInput) < MIN_CUSTOM && (
                            <p className="mt-1.5 text-[12px] text-error font-medium">
                              Minimum bağış tutarı ₺{formatTRY(MIN_CUSTOM)}.
                            </p>
                          )}
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected amount info card */}
                <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-secondary/25 bg-secondary/[0.06] px-4 py-3">
                  <div>
                    <p className="text-[11px] font-bold text-secondary uppercase tracking-[0.14em]">
                      Seçili Tutar
                    </p>
                    <p className="mt-0.5 text-[12px] text-on-surface-variant leading-[18px] max-w-xs">
                      Bu tutarı banka uygulamanızda manuel olarak gireceksiniz.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[26px] md:text-[28px] font-bold text-primary-container tabular-nums tracking-tight leading-none">
                      ₺{formatTRY(amountValid ? amount : 0)}
                    </span>
                  </div>
                </div>
              </section>

              {/* 2. QR card — static */}
              <section className="px-5 md:px-7 pt-7">
                <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-3">
                  2 · FAST Karekod
                </h3>

                <div className="rounded-2xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/[0.06] to-secondary-container/[0.12] p-5 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-6 items-center">
                    <div className="bg-white p-3 rounded-xl shadow-[0_4px_6px_rgba(0,24,53,0.08)] border border-outline-variant w-fit mx-auto sm:mx-0">
                      <QRCodeSVG
                        value={FAST_QR_PAYLOAD}
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
                        FAST Karekod · Sabit
                      </div>
                      <p className="mt-2 text-[15px] md:text-[16px] font-semibold text-primary-container leading-[22px]">
                        Defne Yardım Fonu
                      </p>
                      <p className="mt-0.5 text-[12.5px] text-on-surface-variant font-mono">
                        TR&nbsp;**&nbsp;****&nbsp;****&nbsp;****&nbsp;****&nbsp;****
                      </p>
                      <p className="mt-3 text-[12.5px] leading-[19px] text-on-surface-variant max-w-sm mx-auto sm:mx-0">
                        QR yalnızca alıcı bilgilerini taşır. Bağış tutarını
                        banka uygulamanızda siz girersiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. How-to steps */}
              <section className="px-5 md:px-7 pt-7">
                <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-3 inline-flex items-center gap-1.5">
                  <Smartphone size={13} />
                  Nasıl Bağış Yaparım?
                </h3>
                <ol className="space-y-2.5">
                  {steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-outline-variant bg-white px-4 py-3"
                    >
                      <span
                        aria-hidden
                        className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary/10 text-secondary text-[12px] font-bold"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-primary-container leading-[20px]">
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-[18px] text-on-surface-variant">
                          {step.sub}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* 4. Supported banks */}
              <section className="px-5 md:px-7 pt-6">
                <h3 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-2">
                  Desteklenen Bankalar
                </h3>
                <p className="text-[12px] text-on-surface-variant mb-3">
                  Tüm FAST destekli Türk bankaları.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_BANKS.map((bank) => (
                    <span
                      key={bank}
                      className="inline-flex items-center text-[11.5px] font-semibold text-primary-container bg-white border border-outline-variant rounded-full px-2.5 py-1"
                    >
                      {bank}
                    </span>
                  ))}
                </div>
              </section>

              {/* 5. Role disclosure */}
              <section className="px-5 md:px-7 pt-6">
                <div className="rounded-xl border border-primary-container/20 bg-primary-container/[0.04] p-4 flex items-start gap-3">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container/10 text-primary-container shrink-0">
                    <Info size={16} />
                  </div>
                  <p className="text-[12.5px] leading-[20px] text-on-surface">
                    Bağışınız{" "}
                    <strong className="text-primary-container">
                      KAMPANYATAKİP aracılığıyla değil
                    </strong>
                    , doğrudan{" "}
                    <strong className="text-primary-container">
                      Defne Yardım Fonu&apos;nun
                    </strong>{" "}
                    banka hesabına geçer. KAMPANYATAKİP sadece bağışı takip ve
                    raporlama için kullanılır.
                  </p>
                </div>
              </section>

              {/* 6. IBAN accordion */}
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
                        3 banka · IBAN kopyala, havale yap
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
                      <ul className="space-y-2">
                        {campaign.bankAccounts.map((acc, i) => {
                          const isCopied = copiedIban === i;
                          return (
                            <li
                              key={i}
                              className="flex items-center gap-3 rounded-lg border border-outline-variant bg-white px-4 py-3"
                            >
                              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                                <Building2 size={18} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-primary-container">
                                  {acc.bank}
                                </p>
                                <p className="text-[11.5px] text-on-surface-variant font-mono truncate">
                                  {acc.iban}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopyIban(i, acc.iban)}
                                className={cn(
                                  "shrink-0 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-colors",
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
                                    IBAN
                                  </>
                                )}
                              </button>
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
