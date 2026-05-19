"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Loader2,
  Megaphone,
  Settings,
  Users,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  countUniqueCustomers,
  fetchMasterCampaigns,
  formatTRY,
  PAKET_BADGE_STYLE,
  saveCampaignDurum,
  type Durum,
  type MasterCampaign,
} from "@/lib/master-admin";
import { cn } from "@/lib/utils";

export default function MasterAdminDashboardPage() {
  const [items, setItems] = useState<MasterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  const refresh = async () => {
    const r = await fetchMasterCampaigns();
    setItems(r.items);
    setError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const toggleDurum = async (c: MasterCampaign) => {
    const next: Durum = c.durum === "aktif" ? "pasif" : "aktif";
    setSavingSlug(c.slug);
    // Optimistic update
    setItems((prev) =>
      prev.map((x) => (x.slug === c.slug ? { ...x, durum: next } : x)),
    );
    const r = await saveCampaignDurum(c.slug, next);
    setSavingSlug(null);
    if (!r.ok) {
      // Rollback
      setItems((prev) =>
        prev.map((x) =>
          x.slug === c.slug ? { ...x, durum: c.durum } : x,
        ),
      );
      setToast({ kind: "error", text: `✗ Durum güncellenemedi: ${r.error}` });
    } else {
      setToast({ kind: "success", text: `✓ ${c.name} → ${next}` });
    }
  };

  const aktifSayisi = items.filter((c) => c.durum === "aktif").length;
  const aylikGelir = items
    .filter((c) => c.durum === "aktif")
    .reduce((s, c) => s + c.aylikUcret, 0);
  const musteriSayisi = countUniqueCustomers(items);

  return (
    <MasterAdminLayout
      title="Master Admin"
      subtitle="Paket ve modül yönetimi"
    >
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Aktif Kampanya"
          value={loading ? "…" : aktifSayisi.toLocaleString("tr-TR")}
          icon={Megaphone}
          accent="primary"
        />
        <StatCard
          label="Toplam Aylık Gelir"
          value={loading ? "…" : formatTRY(aylikGelir)}
          icon={DollarSign}
          accent="success"
        />
        <StatCard
          label="Toplam Müşteri"
          value={loading ? "…" : musteriSayisi.toLocaleString("tr-TR")}
          icon={Users}
          accent="info"
        />
      </div>

      {error && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">Kampanyalar yüklenemedi.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {error}. n8n endpoint'ini ve CORS ayarlarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
        <header className="px-5 py-4 border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-body-lg font-semibold text-on-surface">
            Kampanyalar
          </h2>
          <span className="text-label-sm text-on-surface-variant tabular-nums">
            {items.length} kampanya
          </span>
        </header>

        {loading ? (
          <div className="p-10 text-center text-body-sm text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
            Yükleniyor…
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-body-sm text-on-surface-variant">
            Henüz kayıtlı kampanya yok.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-body-sm">
                <thead className="bg-surface-container-low text-label-sm uppercase tracking-wide text-on-surface-variant">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">
                      Kampanya Adı
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">
                      Müşteri
                    </th>
                    <th className="text-left px-5 py-3 font-semibold">Paket</th>
                    <th className="text-right px-5 py-3 font-semibold">
                      Aylık Ücret
                    </th>
                    <th className="text-center px-5 py-3 font-semibold">
                      Durum
                    </th>
                    <th className="text-right px-5 py-3 font-semibold">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c, i) => (
                    <tr
                      key={c.slug}
                      className={cn(
                        "border-t border-outline-variant hover:bg-surface-container-low/60 transition",
                        i % 2 === 1 && "bg-surface-container-low/30",
                      )}
                    >
                      <td className="px-5 py-3 text-on-surface font-medium">
                        {c.name}
                      </td>
                      <td className="px-5 py-3 text-on-surface-variant">
                        {c.musteri || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-semibold border",
                            PAKET_BADGE_STYLE[c.paket],
                          )}
                        >
                          {c.paket}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums font-semibold text-on-surface">
                        {formatTRY(c.aylikUcret)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        <DurumToggle
                          durum={c.durum}
                          loading={savingSlug === c.slug}
                          onClick={() => toggleDurum(c)}
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/master-admin/kampanyalar/${encodeURIComponent(c.slug)}/moduller`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-label-md font-semibold text-on-surface hover:border-secondary hover:text-secondary transition"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Modüller
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-outline-variant">
              {items.map((c) => (
                <li key={c.slug} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-body-md font-semibold text-on-surface truncate">
                        {c.name}
                      </p>
                      <p className="text-label-sm text-on-surface-variant truncate">
                        {c.musteri || "—"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-semibold border",
                        PAKET_BADGE_STYLE[c.paket],
                      )}
                    >
                      {c.paket}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-body-sm font-bold tabular-nums text-on-surface">
                      {formatTRY(c.aylikUcret)}
                    </span>
                    <DurumToggle
                      durum={c.durum}
                      loading={savingSlug === c.slug}
                      onClick={() => toggleDurum(c)}
                    />
                  </div>
                  <Link
                    href={`/master-admin/kampanyalar/${encodeURIComponent(c.slug)}/moduller`}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md font-semibold text-on-surface hover:border-secondary hover:text-secondary transition"
                  >
                    <Settings className="w-4 h-4" />
                    Modüller
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed left-1/2 -translate-x-1/2 bottom-6 z-50 px-4 py-2.5 rounded-lg border text-body-sm font-semibold flex items-center gap-2 shadow-[0_8px_20px_rgba(0,24,53,0.18)] animate-in fade-in slide-in-from-bottom-2 duration-200",
            toast.kind === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200",
          )}
          role="status"
          aria-live="polite"
        >
          {toast.kind === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {toast.text}
        </div>
      )}
    </MasterAdminLayout>
  );
}

// ── Sub components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  accent: "primary" | "secondary" | "success" | "info";
}) {
  const tone = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary-container/40 text-secondary",
    success: "bg-emerald-50 text-emerald-600",
    info: "bg-sky-50 text-sky-600",
  }[accent];
  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-4 md:p-5">
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
          tone,
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-label-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </p>
      <p className="mt-1 text-h2 md:text-[26px] font-bold text-on-surface tabular-nums tracking-tight leading-none">
        {value}
      </p>
    </div>
  );
}

function DurumToggle({
  durum,
  onClick,
  loading,
}: {
  durum: Durum;
  onClick: () => void;
  loading: boolean;
}) {
  const aktif = durum === "aktif";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktif}
      onClick={onClick}
      disabled={loading}
      className={cn(
        "relative inline-flex items-center gap-2 px-2.5 py-1 rounded-full border transition select-none",
        aktif
          ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
          : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high",
        loading && "opacity-60 cursor-wait",
      )}
    >
      <span
        className={cn(
          "w-2 h-2 rounded-full",
          aktif ? "bg-white" : "bg-on-surface-variant/60",
        )}
      />
      <span className="text-label-sm font-semibold">
        {aktif ? "Aktif" : "Pasif"}
      </span>
      {loading && <Loader2 className="w-3 h-3 animate-spin" />}
    </button>
  );
}
