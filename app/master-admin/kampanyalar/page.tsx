"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  Loader2,
  Plus,
  Search,
  Settings,
  X,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import { Button } from "@/components/ui/Button";
import {
  fetchMasterCampaigns,
  PAKET_BADGE_STYLE,
  formatTRY,
  type MasterCampaign,
  type Paket,
} from "@/lib/master-admin";
import { cn } from "@/lib/utils";

const PAKETLER: Paket[] = ["Temel", "Standart", "Premium", "Özel"];

export default function MasterAdminCampaignsPage() {
  const [items, setItems] = useState<MasterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [pkgFilter, setPkgFilter] = useState<"all" | Paket>("all");

  useEffect(() => {
    (async () => {
      const r = await fetchMasterCampaigns();
      setItems(r.items);
      setError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (pkgFilter !== "all" && c.paket !== pkgFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.musteri.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, query, pkgFilter]);

  return (
    <MasterAdminLayout
      title="Kampanyalar"
      subtitle="Yönetilen tüm kampanya hesapları"
    >
      {error && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Filtre bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kampanya, müşteri veya slug ara…"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            active={pkgFilter === "all"}
            onClick={() => setPkgFilter("all")}
          >
            Tümü ({items.length})
          </FilterChip>
          {PAKETLER.map((p) => {
            const count = items.filter((c) => c.paket === p).length;
            return (
              <FilterChip
                key={p}
                active={pkgFilter === p}
                onClick={() => setPkgFilter(p)}
              >
                {p} ({count})
              </FilterChip>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center text-body-sm text-on-surface-variant">
          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
          Yükleniyor…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest py-16 text-center">
          <p className="text-body-md text-on-surface-variant">
            Eşleşen kampanya bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <article
              key={c.slug}
              className="rounded-2xl border border-outline-variant bg-white overflow-hidden flex flex-col"
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-body-lg font-semibold text-on-surface truncate">
                      {c.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {c.musteri || "—"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-semibold border shrink-0",
                      c.durum === "aktif"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1",
                        c.durum === "aktif" ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    />
                    {c.durum === "aktif" ? "Aktif" : "Pasif"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full border text-label-sm font-semibold",
                      PAKET_BADGE_STYLE[c.paket],
                    )}
                  >
                    {c.paket}
                  </span>
                  <span className="text-label-sm text-on-surface-variant font-mono">
                    {c.slug}
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low/40 flex items-center justify-between">
                <span className="text-body-sm font-bold tabular-nums text-on-surface">
                  {formatTRY(c.aylikUcret)}
                </span>
              </div>

              <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between gap-2">
                <Link
                  href={`/kampanya/${c.slug === "demo-defne" ? "demo" : c.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-secondary transition"
                >
                  Kamuya açık <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/master-admin/kampanyalar/${encodeURIComponent(c.slug)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary/90 transition"
                >
                  Yönet
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </MasterAdminLayout>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-label-md font-medium border transition",
        active
          ? "bg-primary text-on-primary border-primary"
          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
