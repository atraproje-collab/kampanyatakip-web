"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CreditCard,
  ExternalLink,
  Loader2,
  Lock,
  Package,
  Settings,
  Shield,
  Unlock,
  User,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  ALL_MODULE_KEYS,
  LIMIT_LABELS,
  MODULE_LABELS,
  MODULE_LIMIT_LINKS,
  PAKET_BADGE_STYLE,
  fetchMasterCampaigns,
  fetchModuleConfig,
  type LimitKey,
  type MasterCampaign,
  type ModuleConfig,
  type ModuleKey,
} from "@/lib/master-admin";
import { cn } from "@/lib/utils";

/** Standart modüller — her pakette bulunur. */
const STANDART_SET: ReadonlySet<ModuleKey> = new Set<ModuleKey>([
  "bagis_takibi",
  "kumbara",
  "stant",
  "gonullu",
  "tiktok_gelir",
  "gelir_gider",
  "galeri",
  "raporlama",
  "canva",
  "reklam_performansi",
]);

const LIMIT_KEYS: LimitKey[] = [
  "ai_mesaj_limit",
  "whatsapp_mesaj_limit",
  "video_limit",
];

function formatTRY(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [campaign, setCampaign] = useState<MasterCampaign | null>(null);
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      const [campR, modR] = await Promise.all([
        fetchMasterCampaigns(),
        fetchModuleConfig(slug),
      ]);
      if (!mounted) return;

      const match = campR.ok
        ? campR.items.find((c) => c.slug === slug)
        : null;

      if (!match && campR.ok) {
        setError("Kampanya bulunamadı.");
      } else if (!campR.ok) {
        setError(campR.error ?? "Kampanya API'sine bağlanılamadı");
      }

      setCampaign(match ?? null);
      setModules(modR.ok ? modR.config : null);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // Modül istatistikleri
  const activeModuleCount = modules
    ? ALL_MODULE_KEYS.filter((k) => STANDART_SET.has(k) || modules[k]).length
    : 0;
  const premiumModules = modules
    ? ALL_MODULE_KEYS.filter((k) => !STANDART_SET.has(k) && modules[k])
    : [];

  return (
    <MasterAdminLayout
      title={campaign?.name ?? slug}
      subtitle={campaign ? `${campaign.musteri || slug}` : "Kampanya Detayı"}
      actions={
        <Link
          href="/master-admin"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Link>
      }
    >
      {loading && (
        <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center text-body-sm text-on-surface-variant">
          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
          Yükleniyor…
        </div>
      )}

      {error && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!loading && campaign && (
        <div className="space-y-6">
          {/* ── Kampanya Bilgi Kartı ─────────────────────────────────── */}
          <section className="rounded-2xl border border-outline-variant bg-white p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-semibold border",
                    PAKET_BADGE_STYLE[campaign.paket],
                  )}
                >
                  <Package className="w-3 h-3 mr-1" />
                  {campaign.paket} Paket
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-semibold border",
                    campaign.durum === "aktif"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mr-1.5",
                      campaign.durum === "aktif"
                        ? "bg-emerald-500"
                        : "bg-rose-500",
                    )}
                  />
                  {campaign.durum === "aktif" ? "Aktif" : "Pasif"}
                </span>
                <span className="text-label-sm text-on-surface-variant font-mono px-2 py-1 rounded-md bg-surface-container">
                  {campaign.slug}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/kampanya/${slug === "demo-defne" ? "demo" : slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Kampanya Sayfası
                </Link>
                <Link
                  href={`/admin/${slug === "demo-defne" ? "defne" : slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary/90 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Admin Paneli
                </Link>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem
                icon={User}
                label="Müşteri"
                value={campaign.musteri || "—"}
              />
              <InfoItem
                icon={CreditCard}
                label="Aylık Ücret"
                value={formatTRY(campaign.aylikUcret)}
              />
              <InfoItem
                icon={Calendar}
                label="Paket"
                value={campaign.paket}
              />
              <InfoItem
                icon={Building2}
                label="Slug"
                value={campaign.slug}
              />
            </div>
          </section>

          {/* ── Grid: Sol = Modüller, Sağ = Limitler ────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SOL: Modül Özeti */}
            <section className="lg:col-span-2 rounded-2xl border border-outline-variant bg-white overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-body-lg font-semibold text-on-surface">
                    Modül Durumu
                  </h2>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">
                    {activeModuleCount} / {ALL_MODULE_KEYS.length} modül aktif
                  </p>
                </div>
                <Link
                  href={`/master-admin/kampanyalar/${encodeURIComponent(slug)}/moduller`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary/90 transition"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Modülleri Yönet
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {modules ? (
                <ul className="divide-y divide-outline-variant">
                  {ALL_MODULE_KEYS.map((key) => {
                    const isStandard = STANDART_SET.has(key);
                    const isActive = isStandard || modules[key];
                    return (
                      <li
                        key={key}
                        className={cn(
                          "px-5 py-2.5 flex items-center justify-between gap-3",
                          !isActive && "opacity-50",
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isActive ? (
                            <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                          )}
                          <span className="text-body-sm text-on-surface truncate">
                            {MODULE_LABELS[key]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isStandard && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200">
                              Standart ✓
                            </span>
                          )}
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-surface-container text-on-surface-variant border-outline-variant",
                            )}
                          >
                            {isActive ? "Açık" : "Kapalı"}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-6 text-center text-body-sm text-on-surface-variant">
                  Modül bilgisi yüklenemedi.
                </div>
              )}
            </section>

            {/* SAĞ: Kullanım Limitleri + Ödeme */}
            <div className="space-y-6">
              {/* Kullanım Limitleri */}
              <section className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant">
                  <h2 className="text-body-lg font-semibold text-on-surface">
                    Kullanım Limitleri
                  </h2>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">
                    Aylık modül limitleri
                  </p>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {modules ? (
                    LIMIT_KEYS.map((lk) => {
                      const parentModule = Object.entries(MODULE_LIMIT_LINKS).find(
                        ([, v]) => v === lk,
                      );
                      const parentKey = parentModule?.[0] as
                        | ModuleKey
                        | undefined;
                      const parentActive = parentKey
                        ? STANDART_SET.has(parentKey) || modules[parentKey]
                        : true;

                      return (
                        <div
                          key={lk}
                          className={cn(!parentActive && "opacity-40")}
                        >
                          <div className="flex items-center justify-between text-body-sm mb-1">
                            <span className="text-on-surface">
                              {LIMIT_LABELS[lk]}
                            </span>
                            <span className="text-on-surface-variant font-semibold tabular-nums">
                              {modules[lk].toLocaleString("tr-TR")}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                            <div
                              className="h-full bg-secondary rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, modules[lk] > 0 ? 100 : 0)}%`,
                              }}
                            />
                          </div>
                          {!parentActive && (
                            <p className="text-[10px] text-on-surface-variant mt-0.5">
                              Modül kapalı
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-body-sm text-on-surface-variant text-center">
                      Yüklenemedi
                    </p>
                  )}
                </div>
              </section>

              {/* Premium modüller */}
              {premiumModules.length > 0 && (
                <section className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
                  <div className="px-5 py-4 border-b border-outline-variant">
                    <h2 className="text-body-lg font-semibold text-on-surface flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-violet-600" />
                      Aktif Premium Modüller
                    </h2>
                  </div>
                  <ul className="px-5 py-3 space-y-1.5">
                    {premiumModules.map((key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2 text-body-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                        <span className="text-on-surface">
                          {MODULE_LABELS[key]}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Ödeme Bilgisi */}
              <section className="rounded-2xl border border-outline-variant bg-white overflow-hidden">
                <div className="px-5 py-4 border-b border-outline-variant">
                  <h2 className="text-body-lg font-semibold text-on-surface">
                    Ödeme Bilgisi
                  </h2>
                </div>
                <dl className="px-5 py-4 space-y-3">
                  <PaymentRow
                    label="Paket Ücreti"
                    value={formatTRY(campaign.aylikUcret)}
                  />
                  <PaymentRow label="Paket Tipi" value={campaign.paket} />
                  <PaymentRow
                    label="Durum"
                    value={
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                          campaign.durum === "aktif"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200",
                        )}
                      >
                        {campaign.durum === "aktif" ? "Aktif" : "Pasif"}
                      </span>
                    }
                  />
                </dl>
              </section>
            </div>
          </div>
        </div>
      )}
    </MasterAdminLayout>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </p>
      <p className="mt-1 text-on-surface text-body-md font-medium">{value}</p>
    </div>
  );
}

function PaymentRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-body-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface text-right font-medium">{value}</dd>
    </div>
  );
}
