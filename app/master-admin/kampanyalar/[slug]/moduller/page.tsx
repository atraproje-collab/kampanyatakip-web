"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Save,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import { Button } from "@/components/ui/Button";
import {
  fetchModuleConfig,
  LIMIT_LABELS,
  MODULE_LABELS,
  MODULE_LIMIT_LINKS,
  type LimitKey,
  type ModuleConfig,
  type ModuleKey,
} from "@/lib/master-admin";
import { cn } from "@/lib/utils";

/* ── Standart modüller — her zaman açık, kapatılamaz ──────────────────────── */
const STANDART_MODULLER: { key: ModuleKey; label: string }[] = [
  { key: "bagis_takibi", label: "Bağış Takibi" },
  { key: "kumbara", label: "Kumbara Takibi" },
  { key: "stant", label: "Stant Takibi" },
  { key: "gonullu", label: "Gönüllü Yönetimi" },
  { key: "tiktok_gelir", label: "TikTok Canlı Yayın Geliri" },
  { key: "gelir_gider", label: "Gelir-Gider Şeffaflık" },
  { key: "galeri", label: "Galeri" },
  { key: "raporlama", label: "Otomatik Raporlama" },
  { key: "canva", label: "Canva Pro Tasarım Aracı" },
  { key: "reklam_performansi", label: "Reklam Performansı (Meta Ads)" },
];

/* ── Ek modüller — açılıp kapatılabilir ───────────────────────────────────── */
const EK_MODULLER: { key: ModuleKey; label: string; limitKey?: LimitKey }[] = [
  { key: "ai_sohbet", label: "AI Sohbet Botu", limitKey: "ai_mesaj_limit" },
  { key: "fb_ig_dm", label: "Facebook + Instagram DM Otomasyonu" },
  { key: "youtube_yorum", label: "YouTube Yorum Otomasyonu" },
  { key: "video", label: "Video Üretim", limitKey: "video_adet_limit" },
  { key: "whatsapp", label: "WhatsApp Mesaj", limitKey: "whatsapp_mesaj_limit" },
  { key: "ivr_0850", label: "Sesli Bilgi Hattı (0850)", limitKey: "ivr_dakika_limit" },
  { key: "influencer_radar", label: "Influencer Radar" },
  { key: "kurumsal_bagis", label: "Kurumsal Bağış Sistemi" },
  { key: "hukuk", label: "Hukuk Danışmanlığı" },
  { key: "twitter", label: "Twitter (X) Otomasyonu" },
];

const STANDART_SET = new Set(STANDART_MODULLER.map((m) => m.key));

export default function MasterModulesPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  /* ── State ─────────────────────────────────────────────────────────────── */
  const [moduller, setModuller] = useState<Record<string, boolean>>({});
  const [limitler, setLimitler] = useState<Record<string, number>>({
    ai_mesaj_limit: 0,
    whatsapp_mesaj_limit: 0,
    ivr_dakika_limit: 0,
    video_adet_limit: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  /* ── İlk yükleme: GET /api/master/moduller?slug=... ────────────────────── */
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      const result = await fetchModuleConfig(slug);
      if (!mounted) return;

      const cfg = result.config;

      // Ek modüllerin boolean durumlarını al
      const m: Record<string, boolean> = {};
      for (const mod of EK_MODULLER) {
        m[mod.key] = cfg[mod.key] ?? false;
      }
      setModuller(m);

      // Limit değerlerini al
      setLimitler({
        ai_mesaj_limit: cfg.ai_mesaj_limit ?? 0,
        whatsapp_mesaj_limit: cfg.whatsapp_mesaj_limit ?? 0,
        ivr_dakika_limit: cfg.ivr_dakika_limit ?? 0,
        video_adet_limit: cfg.video_adet_limit ?? 0,
      });

      setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  /* ── Toast timer ───────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const toggleModule = (key: ModuleKey) => {
    setModuller((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateLimit = (key: LimitKey, value: number) => {
    setLimitler((prev) => ({
      ...prev,
      [key]: Number.isFinite(value) && value >= 0 ? value : 0,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Standart modülleri de ekle (hepsi true)
      const allModuller: Record<string, boolean> = {};
      for (const mod of STANDART_MODULLER) {
        allModuller[mod.key] = true;
      }
      for (const mod of EK_MODULLER) {
        allModuller[mod.key] = moduller[mod.key] ?? false;
      }

      const payload = {
        kampanya_slug: slug,
        moduller: allModuller,
        limitler: { ...limitler },
      };

      console.log("POST gönderiliyor:", JSON.stringify(payload));

      const res = await fetch("/api/master/moduller-guncelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Yanıt:", JSON.stringify(data));

      if (!res.ok) throw new Error("Kayıt başarısız");

      setToast({ kind: "success", text: "✓ Kaydedildi" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Hata:", err);
      setToast({ kind: "error", text: "✗ Kayıt başarısız" });
    } finally {
      setSaving(false);
    }
  };

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <MasterAdminLayout
      title={`Modül Yönetimi — ${slug}`}
      subtitle=""
      actions={
        <div className="flex items-center gap-2">
          <Link
            href={`/master-admin/kampanyalar/${slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor…
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      }
    >
      {/* Yükleme hatası */}
      {loadError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">Modüller yüklenemedi.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {loadError}. Varsayılan değerler gösteriliyor.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-outline-variant bg-white p-10 text-center text-body-sm text-on-surface-variant">
          <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
          Yükleniyor…
        </div>
      ) : (
        <div className="space-y-5">
          {/* ── STANDART MODÜLLER ─────────────────────────────────────────── */}
          <section className="rounded-2xl border border-outline-variant bg-white">
            <header className="px-5 py-4 border-b border-outline-variant">
              <h2 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                Standart Modüller
              </h2>
              <p className="text-label-sm text-on-surface-variant mt-0.5">
                Her kampanyada varsayılan olarak açıktır. Kapatılamaz.
              </p>
            </header>
            <ul className="divide-y divide-outline-variant">
              {STANDART_MODULLER.map((mod) => (
                <li
                  key={mod.key}
                  className="px-5 py-3 flex items-center justify-between gap-4 bg-surface-container-lowest"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-body-md font-medium text-on-surface">
                        {mod.label}
                      </p>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                        Standart
                      </span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant">
                      <code className="font-mono">{mod.key}</code>
                    </p>
                  </div>
                  <Toggle checked disabled />
                </li>
              ))}
            </ul>
          </section>

          {/* ── EK MODÜLLER ──────────────────────────────────────────────── */}
          <section className="rounded-2xl border border-outline-variant bg-white">
            <header className="px-5 py-4 border-b border-outline-variant">
              <h2 className="text-body-lg font-semibold text-on-surface">
                Ek Modüller
              </h2>
              <p className="text-label-sm text-on-surface-variant mt-0.5">
                Açıp kapatabilirsiniz. Limit gerektiren modüllerde aylık limit
                girin. Değişiklikler "Kaydet" butonuyla kaydedilir.
              </p>
            </header>
            <ul className="divide-y divide-outline-variant">
              {EK_MODULLER.map((mod) => {
                const isActive = moduller[mod.key] ?? false;
                return (
                  <li
                    key={mod.key}
                    className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-body-md font-medium text-on-surface">
                        {mod.label}
                      </p>
                      <p className="text-label-sm text-on-surface-variant">
                        <code className="font-mono">{mod.key}</code>
                      </p>
                    </div>

                    {/* Limit input — sadece ilgili modüller */}
                    {mod.limitKey && (
                      <label
                        className={cn(
                          "flex items-center gap-2 text-label-sm",
                          !isActive && "opacity-50",
                        )}
                      >
                        <span className="text-on-surface-variant whitespace-nowrap">
                          {LIMIT_LABELS[mod.limitKey]}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          disabled={!isActive}
                          value={limitler[mod.limitKey] ?? 0}
                          onChange={(e) =>
                            updateLimit(
                              mod.limitKey!,
                              Number(e.target.value) || 0,
                            )
                          }
                          className="w-28 px-2.5 py-1 rounded-lg border border-outline-variant bg-white text-body-sm text-on-surface text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:bg-surface-container disabled:cursor-not-allowed"
                        />
                      </label>
                    )}

                    <Toggle
                      checked={isActive}
                      onChange={() => toggleModule(mod.key)}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed left-1/2 -translate-x-1/2 bottom-24 z-50 px-4 py-2.5 rounded-lg border text-body-sm font-semibold flex items-center gap-2 shadow-[0_8px_20px_rgba(0,24,53,0.18)] animate-in fade-in slide-in-from-bottom-2 duration-200",
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

/* ── Toggle bileşeni ─────────────────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={cn(
        "relative w-11 h-6 rounded-full transition shrink-0",
        disabled
          ? "bg-emerald-500 opacity-70 cursor-not-allowed"
          : checked
            ? "bg-emerald-500"
            : "bg-surface-container-high",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
