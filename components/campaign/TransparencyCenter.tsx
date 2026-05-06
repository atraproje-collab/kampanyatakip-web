"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Loader2,
  Paperclip,
  Shield,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
  WifiOff,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { DocumentsSection } from "@/components/campaign/DocumentsSection";
import type { CurrencyCode, ExpenseRow } from "@/lib/mock-campaign-data";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
  toTRY,
} from "@/lib/exchange-rate";
import { fetchExpenses } from "@/lib/api";
import { cn } from "@/lib/utils";

const POLL_INTERVAL_MS = 30_000;

const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

const CURRENCY_CHIP: Record<CurrencyCode, string> = {
  TRY: "bg-secondary/10 text-secondary",
  USD: "bg-emerald-500/10 text-emerald-700",
  EUR: "bg-blue-500/10 text-blue-700",
};

function formatNative(amount: number, currency: CurrencyCode): string {
  const symbol = CURRENCY_SYMBOL[currency];
  if (currency === "USD") return `${symbol}${formatUSD(amount)}`;
  return `${symbol}${formatTRY(amount)}`;
}

type Tab = "income" | "expenses";

type DataStatus = "loading" | "live" | "mock";

function handleDemoAction(message: string) {
  if (typeof window !== "undefined") window.alert(message);
}

function StatusBadge({ status }: { status: DataStatus }) {
  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <Loader2 size={10} className="animate-spin" />
        Veri yükleniyor…
      </span>
    );
  }
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        Canlı Veri
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <WifiOff size={10} />
      Demo Veri
    </span>
  );
}

export function TransparencyCenter() {
  const { donations, raisedUsd, raisedTry } = useCampaign();
  const rate = mockExchangeRate;

  // Income rows derived from real donations.
  const incomeRows = donations.map((d) => ({
    date: d.date.slice(0, 10),
    source: d.source,
    amount: d.amount,
    currency: d.currency,
    details: d.donorName,
  }));

  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>([]);
  const [status, setStatus] = useState<DataStatus>("loading");
  const [tab, setTab] = useState<Tab>("income");

  // ── Expenses polling (donations come from context) ──────────────────────────
  useEffect(() => {
    let mounted = true;

    const syncData = async () => {
      const result = await fetchExpenses();
      if (!mounted) return;
      if (result) {
        setExpenseRows(result);
        setStatus("live");
      } else {
        setStatus("mock");
      }
    };

    syncData();
    const interval = setInterval(syncData, POLL_INTERVAL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Totals
  const totalExpensesTry = expenseRows.reduce((s, e) => s + e.amount, 0);
  const totalExpensesUsd = totalExpensesTry / rate.usd_try;
  const netRemainingUsd = raisedUsd - totalExpensesUsd;
  const netRemainingTry = raisedTry - totalExpensesTry;
  const expenseRatio = raisedUsd > 0 ? (totalExpensesUsd / raisedUsd) * 100 : 0;

  const stats = [
    {
      label: "Toplam Gelir",
      value: `₺${formatTRY(raisedTry)}`,
      sub: `≈ $${formatUSD(Math.round(raisedUsd))}`,
      icon: TrendingUp,
      tone: "secondary" as const,
    },
    {
      label: "Toplam Gider",
      value: `₺${formatTRY(totalExpensesTry)}`,
      sub: `≈ $${formatUSD(Math.round(totalExpensesUsd))}`,
      icon: TrendingDown,
      tone: "neutral" as const,
    },
    {
      label: "Net Kalan",
      value: `₺${formatTRY(netRemainingTry)}`,
      sub: `≈ $${formatUSD(Math.round(netRemainingUsd))}`,
      icon: Wallet,
      tone: "primary" as const,
    },
    {
      label: "Gider Oranı",
      value: `%${expenseRatio.toFixed(2)}`,
      sub: "Düşük oran = yüksek tasarruf",
      icon: Shield,
      tone: "secondary" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Documents */}
      <DocumentsSection />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => {
          const toneCls =
            tone === "secondary"
              ? "bg-secondary/10 text-secondary"
              : tone === "primary"
                ? "bg-primary-container/10 text-primary-container"
                : "bg-surface-container-high text-on-surface-variant";
          return (
            <div
              key={label}
              className="rounded-2xl bg-white border border-outline-variant p-4 md:p-5"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  toneCls,
                )}
              >
                <Icon size={18} />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                {label}
              </p>
              <p className="mt-1 text-[18px] md:text-[22px] font-bold text-primary-container tabular-nums tracking-tight leading-none">
                {value}
              </p>
              {sub && (
                <p className="mt-1 text-[11px] text-on-surface-variant/85 tabular-nums">
                  {sub}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Tabs + toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div
            role="tablist"
            className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant"
          >
            {(["income", "expenses"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-semibold transition-all",
                  tab === t
                    ? "bg-white text-primary-container shadow-[0_1px_2px_rgba(0,24,53,0.06)]"
                    : "text-on-surface-variant hover:text-primary-container",
                )}
              >
                {t === "income" ? "Gelir" : "Gider"}
              </button>
            ))}
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              handleDemoAction(
                "Demo sayfası: Excel dışa aktarımı ürün ortamında aktif olur.",
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white px-3 py-2 text-[12.5px] font-semibold text-on-surface-variant hover:border-secondary hover:text-secondary transition-all"
          >
            <FileSpreadsheet size={14} />
            Excel
          </button>
          <button
            type="button"
            onClick={() =>
              handleDemoAction(
                "Demo sayfası: PDF rapor ürün ortamında otomatik oluşturulur.",
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-white px-3 py-2 text-[12.5px] font-semibold text-on-surface-variant hover:border-secondary hover:text-secondary transition-all"
          >
            <FileText size={14} />
            PDF Raporu
          </button>
        </div>
      </div>

      {/* Income table */}
      {tab === "income" && (
        <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                <tr>
                  <th className="px-4 md:px-5 py-3 text-left">Tarih</th>
                  <th className="px-4 md:px-5 py-3 text-left">Kaynak</th>
                  <th className="px-4 md:px-5 py-3 text-right">Tutar</th>
                  <th className="px-4 md:px-5 py-3 text-center">Döviz</th>
                  <th className="px-4 md:px-5 py-3 text-right hidden md:table-cell">
                    TL Karşılığı
                  </th>
                  <th className="px-4 md:px-5 py-3 text-left hidden lg:table-cell">
                    Detay
                  </th>
                  <th className="px-4 md:px-5 py-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {incomeRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-[13px] text-on-surface-variant"
                    >
                      Gelir kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  incomeRows.map((row, i) => {
                    const tryEquivalent = toTRY(row.amount, row.currency, rate);
                    return (
                      <tr
                        key={i}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="px-4 md:px-5 py-3.5 text-on-surface-variant whitespace-nowrap">
                          {row.date}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-primary-container font-medium">
                          {row.source}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right text-secondary font-bold tabular-nums whitespace-nowrap">
                          +{formatNative(row.amount, row.currency)}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold tracking-wider",
                              CURRENCY_CHIP[row.currency],
                            )}
                          >
                            {row.currency}
                          </span>
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-right tabular-nums text-on-surface whitespace-nowrap hidden md:table-cell">
                          {row.currency === "TRY" ? (
                            <span className="text-on-surface-variant">—</span>
                          ) : (
                            <>≈ ₺{formatTRY(tryEquivalent)}</>
                          )}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-on-surface-variant hidden lg:table-cell">
                          {row.details}
                        </td>
                        <td className="px-4 md:px-5 py-3.5 text-center">
                          <ImmutableBadge />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 md:px-5 py-3 border-t border-outline-variant bg-surface-container-low/60 text-[11.5px] text-on-surface-variant flex items-center gap-2 flex-wrap">
            <span>
              Döviz dönüşümleri kur:{" "}
              <strong className="text-primary-container">
                1$ = ₺{rate.usd_try.toFixed(2)}
              </strong>{" "}
              ·{" "}
              <strong className="text-primary-container">
                1€ = ₺{rate.eur_try.toFixed(2)}
              </strong>
            </span>
            <span className="text-on-surface-variant/75">
              ({rate.source} · {rate.last_updated})
            </span>
          </div>
        </div>
      )}

      {/* Expenses category breakdown */}
      {tab === "expenses" && expenseRows.length > 0 && (
        <ExpenseCategoryBreakdown rows={expenseRows} />
      )}

      {/* Expenses table */}
      {tab === "expenses" && (
        <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <thead className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">
                <tr>
                  <th className="px-4 md:px-5 py-3 text-left">Tarih</th>
                  <th className="px-4 md:px-5 py-3 text-left">Kategori</th>
                  <th className="px-4 md:px-5 py-3 text-left hidden md:table-cell">Satıcı</th>
                  <th className="px-4 md:px-5 py-3 text-right">Tutar</th>
                  <th className="px-4 md:px-5 py-3 text-left hidden lg:table-cell">Açıklama</th>
                  <th className="px-4 md:px-5 py-3 text-center">Belge</th>
                  <th className="px-4 md:px-5 py-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {expenseRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-8 text-center text-[13px] text-on-surface-variant"
                    >
                      Gider kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  expenseRows.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-4 md:px-5 py-3.5 text-on-surface-variant whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-primary-container font-medium whitespace-nowrap">
                        {row.category}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-on-surface-variant hidden md:table-cell whitespace-nowrap">
                        {row.vendor}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-right text-error font-bold tabular-nums whitespace-nowrap">
                        −₺{formatTRY(row.amount)}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-on-surface-variant hidden lg:table-cell">
                        {row.description}
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleDemoAction(
                              `Demo belgesi: ${row.category} · ${row.vendor}. Gerçek ortamda PDF/JPG önizleme açılır.`,
                            )
                          }
                          className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-[12px] font-semibold"
                        >
                          <Paperclip size={13} />
                          Görüntüle
                        </button>
                      </td>
                      <td className="px-4 md:px-5 py-3.5 text-center">
                        <ImmutableBadge />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="rounded-2xl border border-secondary/30 bg-secondary/[0.06] p-5 md:p-6 flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div className="text-[13.5px] leading-[22px] text-on-surface">
          <strong className="text-primary-container">
            Tüm kayıtlar KAMPANYATAKİP değişmez veritabanında tutulur.
          </strong>{" "}
          Silinme veya değiştirme yapılamaz. Hatalı giriş olursa düzeltme yeni
          bir kayıt olarak eklenir — orijinal kayıt tarih ve imzasıyla
          korunur. Her belge denetim için arşivlenir.
          <div className="mt-2 flex items-center gap-2 text-[12px] text-secondary font-semibold">
            <Download size={13} />
            Tüm veri istenildiğinde dışa aktarılabilir.
          </div>
        </div>
      </div>
    </div>
  );
}

function ImmutableBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap">
      <ShieldCheck size={11} strokeWidth={2.5} />
      Değişmez
    </span>
  );
}

function ExpenseCategoryBreakdown({ rows }: { rows: ExpenseRow[] }) {
  const totals = new Map<string, number>();
  for (const r of rows) {
    const key = (r.category || "Diğer").trim() || "Diğer";
    totals.set(key, (totals.get(key) ?? 0) + r.amount);
  }
  const grandTotal = Array.from(totals.values()).reduce((s, v) => s + v, 0);
  if (grandTotal <= 0) return null;
  const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-5 md:p-6">
      <h3 className="text-[14px] font-bold uppercase tracking-[0.12em] text-on-surface-variant mb-4">
        Kategori Dağılımı
      </h3>
      <ul className="space-y-3">
        {entries.map(([category, amount]) => {
          const widthPct = (amount / max) * 100;
          const sharePct = (amount / grandTotal) * 100;
          return (
            <li key={category} className="text-[13px]">
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="font-semibold text-primary-container truncate">
                  {category}
                </span>
                <span className="tabular-nums text-on-surface-variant whitespace-nowrap">
                  ₺{formatTRY(amount)}
                  <span className="ml-2 text-[11.5px] text-secondary font-semibold">
                    %{sharePct.toFixed(1)}
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-primary-container"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
