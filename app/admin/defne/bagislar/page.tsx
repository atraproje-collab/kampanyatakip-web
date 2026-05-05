"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  StatusPill,
  formatCurrency,
  inputClass,
} from "@/components/admin/AdminUI";
import { adminDonations, type AdminDonation } from "@/lib/admin-mock-data";

const PAGE_SIZE = 10;

type QuickRange = "bugun" | "hafta" | "ay" | "tum" | "";

const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfWeek = (d: Date) => {
  const r = new Date(d);
  const dow = r.getDay(); // 0=Pazar ... 6=Cumartesi
  const offset = (dow + 6) % 7; // pazartesiye kadar geri sayım
  r.setDate(r.getDate() - offset);
  return r;
};

export default function DonationsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quickRange, setQuickRange] = useState<QuickRange>("tum");
  const [source, setSource] = useState("");
  const [currency, setCurrency] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<AdminDonation | null>(null);

  const applyQuickRange = (k: QuickRange) => {
    const today = new Date();
    const todayStr = ymd(today);
    if (k === "bugun") {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (k === "hafta") {
      setStartDate(ymd(startOfWeek(today)));
      setEndDate(todayStr);
    } else if (k === "ay") {
      setStartDate(ymd(new Date(today.getFullYear(), today.getMonth(), 1)));
      setEndDate(todayStr);
    } else {
      setStartDate("");
      setEndDate("");
    }
    setQuickRange(k);
    setPage(1);
  };

  const filtered = useMemo(() => {
    return adminDonations.filter((d) => {
      if (startDate && d.date.slice(0, 10) < startDate) return false;
      if (endDate && d.date.slice(0, 10) > endDate) return false;
      if (source && !d.source.toLowerCase().includes(source.toLowerCase())) return false;
      if (currency && d.currency !== currency) return false;
      if (query) {
        const q = query.toLowerCase();
        const inName = d.donorName.toLowerCase().includes(q);
        const inAmount = String(d.amount).includes(q);
        if (!inName && !inAmount) return false;
      }
      return true;
    });
  }, [startDate, endDate, source, currency, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <AdminLayout
      title="Bağışlar"
      subtitle="Tüm bağış kayıtları, kaynaklar ve onay durumları"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => alert("Excel'e aktarma özelliği yakında.")}
        >
          <Download className="w-4 h-4" />
          Excel'e Aktar
        </Button>
      }
    >
      {/* Filters */}
      <PanelCard title="Filtreler" description="Bağışları daraltmak için filtreleri kullanın" className="mb-4">
        <div className="px-5 pt-4 pb-1 flex flex-wrap gap-2">
          {(
            [
              { k: "bugun", l: "Bugün" },
              { k: "hafta", l: "Bu Hafta" },
              { k: "ay", l: "Bu Ay" },
              { k: "tum", l: "Tümü" },
            ] as { k: QuickRange; l: string }[]
          ).map(({ k, l }) => (
            <button
              key={k}
              type="button"
              onClick={() => applyQuickRange(k)}
              className={`px-3 py-1.5 rounded-full text-label-sm font-medium transition ${
                quickRange === k
                  ? "bg-secondary text-on-secondary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="p-5 pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <FormField label="Başlangıç">
            <input
              type="date"
              className={inputClass}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setQuickRange("");
                setPage(1);
              }}
            />
          </FormField>
          <FormField label="Bitiş">
            <input
              type="date"
              className={inputClass}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setQuickRange("");
                setPage(1);
              }}
            />
          </FormField>
          <FormField label="Kaynak">
            <select
              className={inputClass}
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tümü</option>
              <option value="Banka Havalesi">Banka Havalesi</option>
              <option value="Kredi Kartı">Kredi Kartı</option>
              <option value="Kumbara">Kumbara</option>
              <option value="Stant">Stant</option>
            </select>
          </FormField>
          <FormField label="Para Birimi">
            <select
              className={inputClass}
              value={currency}
              onChange={(e) => {
                setCurrency(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tümü</option>
              <option value="TRY">TL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </FormField>
          <FormField label="Arama">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
              <input
                className={`${inputClass} pl-9`}
                placeholder="bağışçı veya tutar"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </FormField>
        </div>
      </PanelCard>

      {/* Table */}
      <PanelCard
        title={`Bağış Listesi (${filtered.length})`}
        description="Onay durumu, kaynak ve tutar bilgileri"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Tarih</th>
                <th className="text-left px-5 py-3 font-semibold">Bağışçı</th>
                <th className="text-left px-5 py-3 font-semibold">Kaynak</th>
                <th className="text-right px-5 py-3 font-semibold">Tutar</th>
                <th className="text-left px-5 py-3 font-semibold">Para</th>
                <th className="text-left px-5 py-3 font-semibold">Durum</th>
                <th className="text-right px-5 py-3 font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-on-surface-variant py-10">
                    Bu filtrelere uyan bağış bulunamadı.
                  </td>
                </tr>
              ) : (
                pageRows.map((d, i) => (
                  <tr
                    key={d.id}
                    className={`border-t border-outline-variant hover:bg-surface-container-low transition ${i % 2 === 1 ? "bg-surface-container-low/40" : ""}`}
                  >
                    <td className="px-5 py-3 text-on-surface tabular-nums whitespace-nowrap">
                      {d.date}
                    </td>
                    <td className="px-5 py-3 text-on-surface font-medium">{d.donorName}</td>
                    <td className="px-5 py-3 text-on-surface-variant">{d.source}</td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface tabular-nums">
                      {formatCurrency(d.amount, d.currency)}
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant">{d.currency}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={d.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDetail(d)}
                        className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between gap-3 flex-wrap">
          <p className="text-label-sm text-on-surface-variant">
            Toplam <span className="font-semibold text-on-surface">{filtered.length}</span> kayıt — Sayfa {currentPage}/{totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none"
            >
              Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low disabled:opacity-40 disabled:pointer-events-none"
            >
              Sonraki
            </button>
          </div>
        </div>
      </PanelCard>

      {/* Detail modal */}
      <Modal
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ? `Bağış Detayı — ${detail.id}` : ""}
        description="Tüm meta bilgiler ve mutabakat durumu"
      >
        {detail && (
          <div className="space-y-3 text-body-sm">
            <DetailRow label="Bağışçı" value={detail.donorName} />
            <DetailRow label="Tarih / Saat" value={detail.date} />
            <DetailRow label="Kaynak" value={detail.source} />
            <DetailRow label="Tutar" value={`${formatCurrency(detail.amount, detail.currency)} (${detail.currency})`} />
            <DetailRow label="Durum" value={<StatusPill status={detail.status} />} />
            <DetailRow label="Referans No" value={detail.id} />
            <div className="pt-3 mt-3 border-t border-outline-variant text-label-sm text-on-surface-variant">
              Bu kayıt değiştirilemez veritabanına işlenmiştir. Düzenleme yetkisi yoktur.
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant last:border-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface text-right">{value}</span>
    </div>
  );
}
