"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Database,
  Download,
  Printer,
  ShieldCheck,
  Stethoscope,
  X,
  type LucideIcon,
} from "lucide-react";
import type { OfficialDocument } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

interface DocumentViewerModalProps {
  document: OfficialDocument | null;
  onClose: () => void;
}

type ThemeName = "navy" | "medical" | "hospital";

const THEME: Record<
  ThemeName,
  {
    accent: string;
    accentBg: string;
    accentText: string;
    sealGradient: string;
    headerBg: string;
    eyebrow: string;
    labelTop: string;
    Icon: LucideIcon;
  }
> = {
  navy: {
    accent: "border-primary-container/30",
    accentBg: "bg-primary-container",
    accentText: "text-primary-container",
    sealGradient: "from-primary-container to-secondary",
    headerBg: "from-primary-container to-primary",
    eyebrow: "Resmi Karar",
    labelTop: "T.C. İSTANBUL VALİLİĞİ",
    Icon: ShieldCheck,
  },
  medical: {
    accent: "border-secondary/30",
    accentBg: "bg-secondary",
    accentText: "text-secondary",
    sealGradient: "from-secondary to-secondary-fixed-dim",
    headerBg: "from-secondary to-on-secondary-container",
    eyebrow: "Tıbbi Rapor",
    labelTop: "TIBBİ RAPOR",
    Icon: Stethoscope,
  },
  hospital: {
    accent: "border-emerald-500/30",
    accentBg: "bg-emerald-600",
    accentText: "text-emerald-700",
    sealGradient: "from-emerald-600 to-emerald-400",
    headerBg: "from-emerald-700 to-emerald-500",
    eyebrow: "Hastane Belgesi",
    labelTop: "HOSPITAL DOCUMENT",
    Icon: Building2,
  },
};

function themeForKind(kind: OfficialDocument["kind"]): ThemeName {
  return kind === "official" ? "navy" : kind === "medical" ? "medical" : "hospital";
}

function handlePrint() {
  if (typeof window !== "undefined") window.print();
}

export function DocumentViewerModal({
  document,
  onClose,
}: DocumentViewerModalProps) {
  const isOpen = document !== null;

  useEffect(() => {
    if (!isOpen) return;
    const prev = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!document) return null;
  const theme = THEME[themeForKind(document.kind)];
  const { Icon } = theme;

  const issuerLabel =
    document.issuer || document.hospital || "KAMPANYATAKİP";
  const issuerSub =
    document.doctor || document.hospital || document.issuer || "";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
          className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full md:max-w-3xl max-h-[95vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal header */}
            <div
              className={cn(
                "flex items-start justify-between gap-4 px-5 md:px-7 py-4 md:py-5 border-b border-outline-variant text-white bg-gradient-to-r",
                theme.headerBg,
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Icon size={14} className="text-white/90" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                    {theme.eyebrow}
                  </span>
                </div>
                <h2
                  id="doc-modal-title"
                  className="mt-1 text-[18px] md:text-[20px] font-semibold tracking-[-0.01em] text-white truncate"
                >
                  {document.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/85 hover:bg-white/15 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Document "paper" */}
            <div className="flex-1 overflow-y-auto bg-[#fafaf7]">
              <div className="relative mx-auto max-w-[760px] p-6 md:p-10 min-h-full">
                {/* DEMO watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-[72px] md:text-[120px] font-extrabold tracking-widest text-black/[0.05] rotate-[-18deg]"
                >
                  DEMO BELGE
                </span>

                <div className="relative">
                  {/* Top bar */}
                  <div
                    className={cn(
                      "flex items-start justify-between gap-4 pb-5 border-b-2",
                      theme.accent,
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.15)]",
                          theme.sealGradient,
                        )}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-[11px] font-bold uppercase tracking-[0.18em]",
                            theme.accentText,
                          )}
                        >
                          {theme.labelTop}
                        </p>
                        <p className="mt-0.5 text-[14px] font-semibold text-on-surface">
                          {issuerLabel}
                        </p>
                        {issuerSub && issuerSub !== issuerLabel && (
                          <p className="text-[12px] text-on-surface-variant">
                            {issuerSub}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {document.number && (
                        <>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Karar No
                          </p>
                          <p
                            className={cn(
                              "text-[15px] font-bold",
                              theme.accentText,
                            )}
                          >
                            {document.number}
                          </p>
                        </>
                      )}
                      <p className="mt-1 text-[11px] text-on-surface-variant">
                        Tarih:{" "}
                        <strong className="text-on-surface">
                          {document.date}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="mt-8 text-[22px] md:text-[28px] font-bold text-center text-on-surface tracking-[-0.01em] leading-tight">
                    {document.title}
                  </h1>

                  {/* Meta grid */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg bg-white border border-outline-variant p-4">
                    {document.diagnosis && (
                      <MetaRow label="Teşhis" value={document.diagnosis} />
                    )}
                    {document.amount && (
                      <MetaRow label="Tutar" value={document.amount} />
                    )}
                    {document.hospital && (
                      <MetaRow label="Kurum" value={document.hospital} />
                    )}
                    {document.doctor && (
                      <MetaRow label="Düzenleyen" value={document.doctor} />
                    )}
                    {document.issuer && !document.doctor && (
                      <MetaRow label="Düzenleyen" value={document.issuer} />
                    )}
                    <MetaRow label="Düzenleme Tarihi" value={document.date} />
                  </div>

                  {/* Description summary */}
                  <div className="mt-5 text-[13.5px] leading-[22px] text-on-surface">
                    <span className="font-semibold">Özet:</span>{" "}
                    {document.description}
                  </div>

                  {/* Body paragraphs */}
                  {document.body && document.body.length > 0 && (
                    <div className="mt-6 space-y-4 text-[13.5px] leading-[22px] text-on-surface">
                      {document.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Footer: signature + seal */}
                  <div className="mt-12 grid grid-cols-2 gap-6 items-end">
                    <div>
                      <div className="h-10 border-b-2 border-on-surface/30" />
                      <p className="mt-1.5 text-[12.5px] italic text-on-surface/85">
                        {document.signatory || "Yetkili İmza"}
                      </p>
                      {document.signatoryTitle && (
                        <p className="text-[11px] text-on-surface-variant">
                          {document.signatoryTitle}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <div
                        className={cn(
                          "relative w-24 h-24 rounded-full border-2 flex items-center justify-center text-center",
                          theme.accent,
                        )}
                      >
                        <div
                          className={cn(
                            "absolute inset-1.5 rounded-full border bg-gradient-to-br opacity-90 flex items-center justify-center",
                            theme.accent,
                            theme.sealGradient,
                          )}
                        >
                          <span className="text-[9px] font-bold text-white uppercase tracking-[0.14em] leading-tight">
                            RESMİ
                            <br />
                            MÜHÜR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attribution */}
                  <div className="mt-10 pt-5 border-t border-outline-variant flex items-start gap-3 text-[11.5px] leading-[18px] text-on-surface-variant">
                    <Database
                      size={14}
                      className="mt-0.5 text-secondary shrink-0"
                    />
                    <div>
                      Bu belge{" "}
                      <strong className="text-primary-container">
                        KAMPANYATAKİP
                      </strong>{" "}
                      değişmez veritabanında tutulmaktadır. Belge ID:{" "}
                      <code className="font-mono text-primary-container">
                        {document.id}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="shrink-0 border-t border-outline-variant px-5 md:px-7 py-4 bg-surface-container-low flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[13.5px] font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Kapat
              </button>
              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <button
                  type="button"
                  disabled
                  title="Yakında eklenecek"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-semibold border border-outline-variant bg-white text-on-surface-variant/60 cursor-not-allowed"
                >
                  <Download size={14} />
                  PDF İndir
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-[13.5px] font-semibold bg-secondary text-on-secondary hover:bg-on-secondary-container transition-colors shadow-[0_4px_6px_rgba(0,103,127,0.2)]"
                >
                  <Printer size={14} />
                  Yazdır
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-semibold text-on-surface">
        {value}
      </p>
    </div>
  );
}
