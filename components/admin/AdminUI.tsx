"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = "secondary",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: "secondary" | "primary" | "success" | "warning";
}) {
  const accentBg = {
    secondary: "bg-secondary-container/50 text-secondary",
    primary: "bg-primary-fixed text-primary",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
  }[accent];

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-[0_1px_2px_rgba(0,24,53,0.04)] hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="mt-1.5 text-[24px] md:text-[28px] font-bold text-on-surface leading-tight tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-label-sm text-on-surface-variant">{hint}</p>
          )}
        </div>
        {icon && (
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", accentBg)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function PanelCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden",
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-outline-variant">
          <div>
            {title && (
              <h2 className="text-body-lg font-semibold text-on-surface">{title}</h2>
            )}
            {description && (
              <p className="text-label-sm text-on-surface-variant mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

export function StatusPill({
  status,
}: {
  status: "Onaylandı" | "Bekliyor" | "Aktif" | "Pasif";
}) {
  const map: Record<string, string> = {
    Onaylandı: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Bekliyor: "bg-amber-50 text-amber-700 border-amber-200",
    Aktif: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pasif: "bg-surface-container text-on-surface-variant border-outline-variant",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium",
        map[status],
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "Onaylandı" || status === "Aktif" ? "bg-emerald-500" : status === "Bekliyor" ? "bg-amber-500" : "bg-on-surface-variant",
      )} />
      {status}
    </span>
  );
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthCls = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  }[size];

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-surface-container-lowest rounded-t-2xl md:rounded-2xl shadow-[0_20px_40px_rgba(0,24,53,0.2)] border border-outline-variant max-h-[90vh] overflow-hidden flex flex-col",
          widthCls,
        )}
      >
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-outline-variant">
          <div>
            <h2 className="text-body-lg font-semibold text-on-surface">{title}</h2>
            {description && (
              <p className="text-label-sm text-on-surface-variant mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mt-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="px-5 py-4 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-2 px-5 py-3 border-t border-outline-variant bg-surface-container-low">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-label-md text-on-surface mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-label-sm text-on-surface-variant mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition text-body-sm";

export function formatCurrency(amount: number, currency: "TRY" | "USD" | "EUR") {
  const symbols: Record<string, string> = { TRY: "₺", USD: "$", EUR: "€" };
  return `${symbols[currency]}${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount)}`;
}
