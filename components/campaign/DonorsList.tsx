"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, EyeOff, Filter } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import type { Donation } from "@/lib/api";
import { formatTRY, formatUSD, toTRY } from "@/lib/exchange-rate";
import { formatRelativeTime, parseDonationDate } from "@/lib/donation-format";
import { cn } from "@/lib/utils";

function formatDonation(d: Donation): string {
  if (d.currency === "USD") return `$${formatUSD(d.amount)}`;
  if (d.currency === "EUR") return `€${formatTRY(d.amount)}`;
  return `₺${formatTRY(d.amount)}`;
}

type SortKey = "recent" | "amount";
type RangeKey = "24h" | "7d" | "all";

const PER_PAGE = 10;

function Initials({ name }: { name: string }) {
  const clean = name.replace(/\*/g, "");
  const parts = clean.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length
    ? parts.map((p) => p[0] ?? "").join("").slice(0, 2).toUpperCase()
    : "AB";
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary-container text-on-secondary text-[12px] font-bold shrink-0">
      {initials}
    </span>
  );
}

function withinRange(dateStr: string, range: RangeKey, now: Date): boolean {
  if (range === "all") return true;
  const d = parseDonationDate(dateStr);
  if (!d) return false;
  const diffMs = now.getTime() - d.getTime();
  if (diffMs < 0) return true;
  const hours = diffMs / 3_600_000;
  if (range === "24h") return hours <= 24;
  if (range === "7d") return hours <= 24 * 7;
  return true;
}

export function DonorsList() {
  const { donations, statsReady } = useCampaign();
  const [range, setRange] = useState<RangeKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const now = new Date();
    const base = donations.filter((d) => withinRange(d.date, range, now));
    const sorted = [...base];
    if (sortKey === "amount") {
      sorted.sort((a, b) => toTRY(b.amount, b.currency) - toTRY(a.amount, a.currency));
    } else {
      sorted.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return sorted;
  }, [donations, range, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + PER_PAGE);

  const rangeLabels: Record<RangeKey, string> = {
    "24h": "Son 24 saat",
    "7d": "Son 7 gün",
    all: "Tümü",
  };

  return (
    <div className="space-y-6">
      {/* Privacy banner */}
      <div className="rounded-2xl bg-primary-container/[0.04] border border-primary-container/15 p-5 flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-primary-container/10 text-primary-container flex items-center justify-center shrink-0">
          <EyeOff size={20} />
        </div>
        <div className="text-[13.5px] leading-[22px] text-on-surface">
          <strong className="text-primary-container">Bağışçı Gizlilik Maskesi.</strong>{" "}
          Tüm bağışçı isimleri KAMPANYATAKİP tarafından otomatik maskelenerek
          gösterilir. İsteyen bağışçılar tamamen anonim olarak listelenebilir.
          Kişisel iletişim bilgileri kampanya yöneticisi dışında kimseyle
          paylaşılmaz.
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-on-surface-variant" />
          <span className="text-[12px] font-semibold text-on-surface-variant">
            Aralık:
          </span>
          <div className="inline-flex p-0.5 rounded-lg bg-surface-container-low border border-outline-variant">
            {(["24h", "7d", "all"] as RangeKey[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-[12px] font-semibold rounded-md transition-colors",
                  range === r
                    ? "bg-white text-primary-container shadow-[0_1px_2px_rgba(0,24,53,0.06)]"
                    : "text-on-surface-variant hover:text-primary-container",
                )}
              >
                {rangeLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-on-surface-variant">
            Sırala:
          </span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[12.5px] font-semibold text-primary-container focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
          >
            <option value="recent">Yeni → Eski</option>
            <option value="amount">Tutara göre</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
        <ul className="divide-y divide-outline-variant">
          {!statsReady ? (
            Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="px-5 py-4 flex items-center gap-4 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container shrink-0" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 rounded bg-surface-container" />
                  <div className="mt-1.5 h-3 w-44 rounded bg-surface-container" />
                </div>
                <div className="h-4 w-20 rounded bg-surface-container" />
              </li>
            ))
          ) : pageItems.length === 0 ? (
            <li className="px-5 py-10 text-center text-[14px] text-on-surface-variant">
              Seçili aralıkta bağış bulunamadı.
            </li>
          ) : (
            pageItems.map((donor) => (
              <li
                key={donor.id}
                className="px-4 md:px-5 py-4 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors"
              >
                <Initials name={donor.donorName} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-primary-container truncate">
                    {donor.donorName}
                  </p>
                  <p className="text-[12px] text-on-surface-variant truncate">
                    {donor.source} · {donor.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[15.5px] font-bold text-secondary tabular-nums">
                    {formatDonation(donor)}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {formatRelativeTime(donor.date)}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-on-surface-variant">
            {filtered.length} bağış · Sayfa {currentPage} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[12.5px] font-semibold text-primary-container hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={14} />
              Önceki
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-[12.5px] font-semibold text-primary-container hover:border-secondary disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Sonraki
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
