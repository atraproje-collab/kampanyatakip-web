"use client";

import { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Paperclip,
  Shield,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { DocumentsSection } from "@/components/campaign/DocumentsSection";
import type { CurrencyCode } from "@/lib/mock-campaign-data";
import {
  formatTRY,
  formatUSD,
  mockExchangeRate,
  toTRY,
} from "@/lib/exchange-rate";
import { cn } from "@/lib/utils";

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

function handleDemoAction(message: string) {
  if (typeof window !== "undefined") window.alert(message);
}

export function TransparencyCenter() {
  const { campaign, raisedUsd } = useCampaign();
  const { income, expenses } = campaign.transparency;
  const [tab, setTab] = useState<Tab>("income");
  const rate = mockExchangeRate;

  // Totals — campaign counter is the source of truth for 'Toplam Gelir'.
  const raisedTry = raisedUsd * rate.usd_try;
  // Expenses remain denominated in TRY in the current mock.
  const totalExpensesTry = expenses.reduce((s, e) => s + e.amount, 0);
  const totalExpensesUsd = totalExpensesTry / rate.usd_try;
  const netRemainingUsd = raisedUsd - totalExpensesUsd;
  const netRemainingTry = netRemainingUsd * rate.usd_try;
  const expenseRatio = raisedUsd > 0 ? (totalExpensesUsd / raisedUsd) * 100 : 0;

  const stats = [
    {
      label: "Toplam Gelir",
      value: `$${formatUSD(Math.round(raisedUsd))}`,
      sub: `≈ ₺${formatTRY(raisedTry)}`,
      icon: TrendingUp,
      tone: "secondary" as const,
    },
    {
      label: "Toplam Gider",
      value: `$${formatUSD(Math.round(totalExpensesUsd))}`,
      sub: `≈ ₺${formatTRY(totalExpensesTry)}`,
      icon: TrendingDown,
      tone: "neutral" as const,
    },
    {
      label: "Net Kalan",
      value: `$${formatUSD(Math.round(netRemainingUsd))}`,
      sub: `≈ ₺${formatTRY(netRemainingTry)}`,
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

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
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
                {income.map((row, i) => {
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
                })}
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
                {expenses.map((row, i) => (
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
                ))}
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
