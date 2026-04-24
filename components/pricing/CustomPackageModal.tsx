"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Sliders,
  X,
} from "lucide-react";
import {
  calculateTotal,
  CUSTOM_BASE,
  CUSTOM_MODULES,
  isCustomMinimumMet,
  MINIMUM_CUSTOM_TOTAL,
  missingToMinimum,
  type Selection,
} from "@/lib/packages-data";
import { cn } from "@/lib/utils";

function formatAmount(n: number): string {
  return new Intl.NumberFormat("tr-TR").format(n);
}

interface CustomPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomPackageModal({
  isOpen,
  onClose,
}: CustomPackageModalProps) {
  const router = useRouter();
  const [selections, setSelections] = useState<Selection>({});
  const [showBaseFeatures, setShowBaseFeatures] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const total = useMemo(() => calculateTotal(selections), [selections]);
  const selectedCount = useMemo(
    () => Object.values(selections).filter((v) => v > 0).length,
    [selections],
  );

  const toggleCheckbox = useCallback((id: string) => {
    setSelections((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  }, []);

  const updateStepper = useCallback((id: string, delta: number) => {
    setSelections((prev) => {
      const mod = CUSTOM_MODULES.find((m) => m.id === id);
      if (!mod) return prev;
      const current = prev[id] || 0;
      const next = Math.max(
        mod.min ?? 0,
        Math.min(mod.max ?? 999, current + delta),
      );
      return { ...prev, [id]: next };
    });
  }, []);

  const meetsMinimum = isCustomMinimumMet(total);
  const missing = missingToMinimum(total);

  const handleConfirm = () => {
    if (!meetsMinimum) return;
    const params = new URLSearchParams({
      selections: JSON.stringify(selections),
      total: String(total),
    });
    router.push(`/ozel-paket/onay?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-package-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
          />

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full md:max-w-3xl max-h-[92vh] bg-white md:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-5 md:px-8 py-5 md:py-6 border-b border-outline-variant bg-surface-container-low">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Sliders size={15} className="text-secondary" />
                  <span className="text-[11.5px] font-bold text-secondary uppercase tracking-[0.14em]">
                    Özel Paket
                  </span>
                </div>
                <h2
                  id="custom-package-title"
                  className="text-[22px] md:text-[26px] font-semibold text-primary-container tracking-[-0.01em]"
                >
                  Paketinizi Oluşturun
                </h2>
                <p className="mt-1.5 text-[13px] md:text-[14px] text-on-surface-variant">
                  İhtiyacınıza göre modül seçin, fiyat canlı güncellensin.
                </p>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-8">
              {/* Base card */}
              <section className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary-container uppercase tracking-[0.14em]">
                      <Check size={12} strokeWidth={3} /> Zorunlu
                    </span>
                    <h3 className="mt-1.5 text-[17px] font-semibold text-primary-container">
                      {CUSTOM_BASE.name}
                    </h3>
                    <p className="mt-1 text-[13px] leading-[20px] text-on-surface-variant">
                      {CUSTOM_BASE.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[22px] md:text-[24px] font-bold text-primary-container tracking-tight leading-none">
                      {CUSTOM_BASE.price.toLocaleString("tr-TR")} ₺
                    </p>
                    <p className="mt-1 text-[11.5px] text-on-surface-variant">
                      /ay
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBaseFeatures((v) => !v)}
                  aria-expanded={showBaseFeatures}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-on-secondary-container transition-colors"
                >
                  Taban altyapıda neler var?
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-250",
                      showBaseFeatures && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {showBaseFeatures && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 overflow-hidden"
                    >
                      {CUSTOM_BASE.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[13px] leading-[20px] text-on-surface"
                        >
                          <Check
                            size={14}
                            className="mt-0.5 text-secondary shrink-0"
                            strokeWidth={2.5}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </section>

              {/* Modules header */}
              <section>
                <div className="mb-4">
                  <h3 className="text-[12px] font-bold text-primary-container uppercase tracking-[0.14em]">
                    Ek Modüller
                  </h3>
                  <p className="mt-1 text-[13px] text-on-surface-variant">
                    İhtiyacınıza göre seçin — istediğiniz kadar ekleyebilirsiniz.
                  </p>
                </div>

                <div className="space-y-3">
                  {CUSTOM_MODULES.map((module) => {
                    const value = selections[module.id] || 0;
                    const isSelected = value > 0;

                    if (module.type === "checkbox") {
                      return (
                        <label
                          key={module.id}
                          className={cn(
                            "flex items-start justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all",
                            isSelected
                              ? "border-secondary bg-secondary/[0.06]"
                              : "border-outline-variant bg-white hover:border-secondary/60",
                          )}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <span
                              className={cn(
                                "mt-0.5 shrink-0 inline-flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                                isSelected
                                  ? "bg-secondary border-secondary text-on-secondary"
                                  : "border-outline",
                              )}
                              aria-hidden
                            >
                              {isSelected && (
                                <Check size={13} strokeWidth={3.5} />
                              )}
                            </span>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCheckbox(module.id)}
                              className="sr-only"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[14.5px] font-semibold text-primary-container leading-tight">
                                {module.name}
                              </p>
                              <p className="mt-1 text-[12.5px] leading-[18px] text-on-surface-variant">
                                {module.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 whitespace-nowrap">
                            <p className="text-[14.5px] font-semibold text-primary-container">
                              +{module.price.toLocaleString("tr-TR")} ₺
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              /ay
                            </p>
                          </div>
                        </label>
                      );
                    }

                    return (
                      <div
                        key={module.id}
                        className={cn(
                          "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all",
                          isSelected
                            ? "border-secondary bg-secondary/[0.06]"
                            : "border-outline-variant bg-white hover:border-secondary/60",
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-[14.5px] font-semibold text-primary-container leading-tight">
                            {module.name}
                          </p>
                          <p className="mt-1 text-[12.5px] leading-[18px] text-on-surface-variant">
                            {module.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateStepper(module.id, -1)}
                              disabled={value <= (module.min ?? 0)}
                              aria-label={`${module.name} azalt`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-white text-primary-container hover:border-secondary hover:text-secondary disabled:opacity-35 disabled:cursor-not-allowed transition"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[28px] text-center text-[14px] font-bold text-primary-container">
                              {value}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateStepper(module.id, 1)}
                              disabled={value >= (module.max ?? 999)}
                              aria-label={`${module.name} arttır`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant bg-white text-primary-container hover:border-secondary hover:text-secondary disabled:opacity-35 disabled:cursor-not-allowed transition"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="min-w-[90px] text-right whitespace-nowrap">
                            {value > 0 ? (
                              <p className="text-[14.5px] font-semibold text-secondary">
                                +{(value * module.price).toLocaleString("tr-TR")}{" "}
                                ₺
                              </p>
                            ) : (
                              <p className="text-[12px] text-on-surface-variant">
                                +{module.price.toLocaleString("tr-TR")} ₺/
                                {module.unit}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-5 md:px-8 py-5 md:py-6 border-t border-outline-variant bg-surface-container-low">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    Aylık Toplam
                  </p>
                  <p className="mt-1 text-[26px] md:text-[30px] font-bold text-primary-container tracking-tight leading-none">
                    {total.toLocaleString("tr-TR")}{" "}
                    <span className="text-[18px] text-on-surface-variant">₺</span>
                    <span className="text-[14px] font-normal text-on-surface-variant">
                      {" "}
                      / ay
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                    Seçili Ek
                  </p>
                  <p className="mt-1 text-[20px] font-semibold text-secondary">
                    {selectedCount} modül
                  </p>
                </div>
              </div>

              {!meetsMinimum && (
                <div className="mb-3 rounded-lg border border-amber-400/50 bg-amber-50 p-3 flex items-start gap-2.5">
                  <span className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-[13px] font-bold">
                    !
                  </span>
                  <div className="text-[12.5px] leading-[18px] text-amber-900">
                    <strong className="font-bold">
                      Minimum tutar ₺{formatAmount(MINIMUM_CUSTOM_TOTAL)}
                    </strong>{" "}
                    — ₺{formatAmount(missing)} daha ekleyin. Ek modül
                    seçiminizi genişleterek bu tutara ulaşabilirsiniz.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!meetsMinimum}
                aria-disabled={!meetsMinimum}
                className={cn(
                  "group/btn inline-flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3.5 text-[15px] font-semibold transition-all duration-250",
                  meetsMinimum
                    ? "bg-secondary text-on-secondary shadow-[0_4px_6px_rgba(0,24,53,0.08)] hover:bg-on-secondary-container hover:shadow-[0_10px_20px_rgba(0,103,127,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                    : "bg-surface-container-high text-on-surface-variant/70 cursor-not-allowed",
                )}
              >
                Paketimi Onayla ve Talep Gönder
                <ArrowRight
                  size={16}
                  className="transition-transform duration-250 group-hover/btn:translate-x-1"
                />
              </button>
              <p className="mt-2.5 text-center text-[12px] text-on-surface-variant">
                Bu bir ön taleptir. Ekibimiz 1 iş günü içinde size dönüş yapacak.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
