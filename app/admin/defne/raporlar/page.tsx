"use client";

import { useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  Download,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  Printer,
  Send,
} from "lucide-react";
import { ModuleActiveGate } from "@/components/master-admin/ModuleActiveGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Modal, PanelCard, formatCurrency } from "@/components/admin/AdminUI";
import { adminDonations, dailyDonationChart } from "@/lib/admin-mock-data";
import { demoCampaign } from "@/lib/mock-campaign-data";

type ReportPeriod = {
  key: "daily" | "weekly" | "monthly";
  label: string;
  description: string;
  icon: typeof CalendarDays;
  income: number;
  expense: number;
  donors: number;
  currency: "TRY" | "USD";
};

const reports: ReportPeriod[] = [
  {
    key: "daily",
    label: "Günlük Rapor",
    description: "Bugünün özeti — 24.04.2026",
    icon: CalendarDays,
    income: 8450,
    expense: 0,
    donors: 187,
    currency: "USD",
  },
  {
    key: "weekly",
    label: "Haftalık Rapor",
    description: "Son 7 günlük özet",
    icon: CalendarRange,
    income: 54730,
    expense: 12500,
    donors: 1248,
    currency: "USD",
  },
  {
    key: "monthly",
    label: "Aylık Rapor",
    description: "Nisan 2026",
    icon: FileBarChart,
    income: 248500,
    expense: 5025750,
    donors: 4862,
    currency: "USD",
  },
];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((cell) => {
          const s = String(cell ?? "");
          return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadXlsx(filename: string, rows: (string | number)[][]) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 28 }, { wch: 22 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rapor");
  XLSX.writeFile(wb, filename);
}

function buildReportRows(label: string, period: string, income: number, expense: number, donors: number, currency: "TRY" | "USD") {
  const symbol = currency === "USD" ? "$" : "₺";
  return [
    ["Minik Defne Kampanyası — " + label],
    ["Dönem", period],
    [],
    ["Kalem", "Tutar"],
    ["Toplam Gelir", `${symbol}${income.toLocaleString("tr-TR")}`],
    ["Toplam Gider", `${symbol}${expense.toLocaleString("tr-TR")}`],
    ["Net Kalan", `${symbol}${(income - expense).toLocaleString("tr-TR")}`],
    ["Bağışçı Sayısı", donors.toString()],
    [],
    ["Oluşturma", new Date().toLocaleString("tr-TR")],
  ];
}

export default function ReportsPage() {
  return (
    <ModuleActiveGate slug="demo-defne" moduleKey="raporlama">
      <ReportsPageInner />
    </ModuleActiveGate>
  );
}

function ReportsPageInner() {
  const [downloadTarget, setDownloadTarget] = useState<ReportPeriod | null>(null);

  const totalIncome = demoCampaign.transparency.income.reduce(
    (s, i) => s + (i.currency === "USD" ? i.amount * 34 : i.currency === "EUR" ? i.amount * 37 : i.amount),
    0,
  );
  const totalExpense = demoCampaign.transparency.expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = totalIncome - totalExpense;

  const total = totalIncome + totalExpense;
  const incomePct = (totalIncome / total) * 100;
  const expensePct = (totalExpense / total) * 100;

  const buildRowsFor = (r: ReportPeriod) => {
    const rows = buildReportRows(r.label, r.description, r.income, r.expense, r.donors, r.currency);
    rows.push([], ["Son Bağışlar"]);
    rows.push(["Tarih", "Bağışçı", "Kaynak", "Tutar", "Para Birimi", "Durum"]);
    adminDonations.slice(0, 20).forEach((d) => {
      rows.push([d.date, d.donorName, d.source, String(d.amount), d.currency, d.status]);
    });
    return rows;
  };

  const handleCsv = (r: ReportPeriod) => {
    const filename = `defne-${r.key}-rapor-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, buildRowsFor(r));
    setDownloadTarget(null);
  };

  const handleXlsx = async (r: ReportPeriod) => {
    const filename = `defne-${r.key}-rapor-${new Date().toISOString().slice(0, 10)}.xlsx`;
    await downloadXlsx(filename, buildRowsFor(r));
    setDownloadTarget(null);
  };

  const handlePdf = () => {
    setDownloadTarget(null);
    setTimeout(() => window.print(), 50);
  };

  const handleWhatsApp = (r: ReportPeriod) => {
    const symbol = r.currency === "USD" ? "$" : "₺";
    const fmt = (n: number) => n.toLocaleString("tr-TR");
    const text = [
      `📊 *Minik Defne Kampanyası — ${r.label}*`,
      `Dönem: ${r.description}`,
      "",
      `💰 Gelir: ${symbol}${fmt(r.income)}`,
      `💸 Gider: ${symbol}${fmt(r.expense)}`,
      `✅ Net Kalan: ${symbol}${fmt(r.income - r.expense)}`,
      `👥 Bağışçı: ${fmt(r.donors)}`,
      "",
      `Detaylı rapor için yönetim paneline göz atın.`,
    ].join("\n");
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <AdminLayout
      title="Raporlar"
      subtitle="Dönemsel finansal özetler ve dağılımlar"
      actions={
        <Button variant="ghost" size="sm" onClick={() => window.print()}>
          <Printer className="w-4 h-4" />
          Sayfayı Yazdır (PDF)
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => {
          const Icon = r.icon;
          const net = r.income - r.expense;
          return (
            <article
              key={r.key}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:border-secondary hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition flex flex-col"
            >
              <div className="px-5 pt-4 pb-3 border-b border-outline-variant flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">{r.label}</h3>
                  <p className="text-label-sm text-on-surface-variant">{r.description}</p>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3 flex-1">
                <Row label="Gelir" value={formatCurrency(r.income, r.currency)} positive />
                <Row label="Gider" value={formatCurrency(r.expense, r.currency)} negative />
                <div className="border-t border-outline-variant pt-3">
                  <Row
                    label="Net Kalan"
                    value={formatCurrency(net, r.currency)}
                    bold
                  />
                </div>
                <Row label="Bağışçı Sayısı" value={r.donors.toLocaleString("tr-TR")} />
              </div>

              <div className="px-5 pb-4 pt-1 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDownloadTarget(r)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  İndir
                </button>
                <button
                  onClick={() => handleWhatsApp(r)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-label-md hover:bg-on-secondary-container transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Gelir / Gider Dağılımı"
          description="Kampanya başlangıcından bugüne"
          className="lg:col-span-2"
        >
          <div className="px-5 py-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 text-label-md">
                <span className="text-emerald-700 font-semibold">Gelir</span>
                <span className="tabular-nums text-on-surface">
                  ₺{(totalIncome / 1_000_000).toFixed(2)}M ({incomePct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${incomePct}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5 text-label-md">
                <span className="text-rose-700 font-semibold">Gider</span>
                <span className="tabular-nums text-on-surface">
                  ₺{(totalExpense / 1_000_000).toFixed(2)}M ({expensePct.toFixed(1)}%)
                </span>
              </div>
              <div className="h-3 rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
                  style={{ width: `${expensePct}%` }}
                />
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant">
              <div className="flex items-center justify-between text-body-md">
                <span className="text-on-surface font-semibold">Net Kalan</span>
                <span className="tabular-nums font-bold text-on-surface">
                  ₺{(remaining / 1_000_000).toFixed(2)}M
                </span>
              </div>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Son 7 Gün — Trend" description="Günlük bağış (USD)">
          <div className="px-5 py-5 space-y-2">
            {dailyDonationChart.map((d) => {
              const max = Math.max(...dailyDonationChart.map((x) => x.amountUsd));
              const pct = (d.amountUsd / max) * 100;
              return (
                <div key={d.date} className="flex items-center gap-2 text-label-sm">
                  <span className="w-10 text-on-surface-variant tabular-nums">{d.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary-container"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-on-surface font-medium tabular-nums">
                    ${(d.amountUsd / 1000).toFixed(1)}K
                  </span>
                </div>
              );
            })}
          </div>
        </PanelCard>
      </div>

      <div className="mt-6 p-5 rounded-xl bg-primary-fixed border border-primary-fixed-dim/40">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
            <FileBarChart className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-body-md font-semibold text-on-primary-fixed">
              Rapor paylaşımı
            </h3>
            <p className="text-body-sm text-on-primary-fixed-variant mt-1">
              <span className="font-semibold">İndir:</span> Açılan pencereden CSV, Excel
              (.xlsx) veya PDF (yazdırma) seçeneklerinden birini seçebilirsiniz.
              <span className="font-semibold"> WhatsApp:</span> Rapor özeti otomatik
              hazırlanır, alıcıyı seçtiğiniz pencerede gönderirsiniz.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={downloadTarget !== null}
        onClose={() => setDownloadTarget(null)}
        title={downloadTarget ? `${downloadTarget.label} - İndirme Formatı` : ""}
        description="Rapor hangi formatta indirilsin?"
        size="sm"
      >
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => downloadTarget && handleCsv(downloadTarget)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-outline-variant text-left hover:border-secondary hover:bg-surface-container-low transition"
          >
            <span className="w-9 h-9 shrink-0 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-body-md font-semibold text-on-surface">
                CSV olarak indir
              </span>
              <span className="block text-label-sm text-on-surface-variant">
                Excel ve veri araçlarıyla uyumlu metin dosyası
              </span>
            </span>
          </button>

          <button
            onClick={() => downloadTarget && handleXlsx(downloadTarget)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-outline-variant text-left hover:border-secondary hover:bg-surface-container-low transition"
          >
            <span className="w-9 h-9 shrink-0 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-body-md font-semibold text-on-surface">
                Excel (.xlsx) olarak indir
              </span>
              <span className="block text-label-sm text-on-surface-variant">
                Microsoft Excel için biçimli çalışma kitabı
              </span>
            </span>
          </button>

          <button
            onClick={handlePdf}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-outline-variant text-left hover:border-secondary hover:bg-surface-container-low transition"
          >
            <span className="w-9 h-9 shrink-0 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-body-md font-semibold text-on-surface">
                PDF olarak yazdır
              </span>
              <span className="block text-label-sm text-on-surface-variant">
                Yazdırma penceresini açar (Hedef: PDF olarak kaydet)
              </span>
            </span>
          </button>

          <button
            onClick={() => setDownloadTarget(null)}
            className="mt-1 px-4 py-2.5 rounded-lg text-label-md font-medium text-on-surface-variant hover:bg-surface-container-low transition"
          >
            İptal
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
}

function Row({
  label,
  value,
  positive,
  negative,
  bold,
}: {
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-body-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span
        className={`tabular-nums ${bold ? "font-bold text-on-surface text-body-md" : "font-medium"} ${positive ? "text-emerald-700" : negative ? "text-rose-700" : "text-on-surface"}`}
      >
        {value}
      </span>
    </div>
  );
}
