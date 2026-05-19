"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import { Button } from "@/components/ui/Button";
import {
  ALL_MODULE_KEYS,
  DEFAULT_MODULE_CONFIG,
  LIMIT_LABELS,
  MODULE_LABELS,
  MODULE_LIMIT_LINKS,
  PAKET_BADGE_STYLE,
  fetchMasterCampaigns,
  fetchModuleConfig,
  type LimitKey,
  type ModuleConfig,
  type ModuleKey,
  type Paket,
} from "@/lib/master-admin";
import { cn } from "@/lib/utils";

const PAKETLER: Paket[] = ["Temel", "Standart", "Premium", "Özel"];
const LIMIT_KEYS: LimitKey[] = [
  "ai_mesaj_limit",
  "whatsapp_mesaj_limit",
  "video_limit",
];

/** Her pakette bulunan standart modüller — kapatılamaz. */
const STANDART_MODULES_SET: ReadonlySet<ModuleKey> = new Set<ModuleKey>([
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

/** Paket seçilince otomatik uygulanan modül + limit değerleri. */
type PaketPreset = {
  moduller: Record<ModuleKey, boolean>;
  limitler: Partial<Record<LimitKey, number>>;
};

const PAKET_PRESETS_FULL: Record<string, PaketPreset | null> = {
  Temel: {
    moduller: {
      bagis_takibi: true, kumbara: true, stant: true, gonullu: true,
      tiktok_gelir: true, gelir_gider: true, galeri: true,
      raporlama: true, canva: true, reklam_performansi: true,
      ai_sohbet: true,
      fb_ig_dm: false, youtube_yorum: false, whatsapp: false,
      ivr_0850: false, video: false, influencer_radar: false,
      kurumsal_bagis: false, hukuk: false,
    },
    limitler: { ai_mesaj_limit: 1000, whatsapp_mesaj_limit: 0, video_limit: 0 },
  },
  Standart: {
    moduller: {
      bagis_takibi: true, kumbara: true, stant: true, gonullu: true,
      tiktok_gelir: true, gelir_gider: true, galeri: true,
      raporlama: true, canva: true, reklam_performansi: true,
      ai_sohbet: true, fb_ig_dm: true, youtube_yorum: false,
      video: true, whatsapp: false, ivr_0850: false,
      influencer_radar: false, kurumsal_bagis: false, hukuk: false,
    },
    limitler: { ai_mesaj_limit: 3000, whatsapp_mesaj_limit: 0, video_limit: 5 },
  },
  Premium: {
    moduller: {
      bagis_takibi: true, kumbara: true, stant: true, gonullu: true,
      tiktok_gelir: true, gelir_gider: true, galeri: true,
      raporlama: true, canva: true, reklam_performansi: true,
      ai_sohbet: true, fb_ig_dm: true, youtube_yorum: true,
      video: true, whatsapp: true, ivr_0850: true,
      influencer_radar: true, kurumsal_bagis: true, hukuk: true,
    },
    limitler: { ai_mesaj_limit: 5000, whatsapp_mesaj_limit: 0, video_limit: 15 },
  },
  Özel: null, // manuel — hiçbir otomatik değişiklik
};

export default function MasterModulesPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [config, setConfig] = useState<ModuleConfig>({
    ...DEFAULT_MODULE_CONFIG,
  });
  const [originalConfig, setOriginalConfig] = useState<ModuleConfig>({
    ...DEFAULT_MODULE_CONFIG,
  });
  const [paket, setPaket] = useState<Paket>("Özel");
  const [originalPaket, setOriginalPaket] = useState<Paket>("Özel");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

  // İlk yükleme — modüller + kampanya paketini paralel çek
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      const [modulR, campR] = await Promise.all([
        fetchModuleConfig(slug),
        fetchMasterCampaigns(),
      ]);
      if (!mounted) return;

      // Standart modülleri her zaman true olarak zorla
      const merged: ModuleConfig = { ...modulR.config };
      for (const k of STANDART_MODULES_SET) {
        merged[k] = true;
      }

      // Kampanya listesinden mevcut paketi bul
      const campaign = campR.ok
        ? campR.items.find((c) => c.slug === slug)
        : null;
      const p = campaign?.paket ?? modulR.paket ?? "Özel";

      setConfig(merged);
      setOriginalConfig(merged);
      setPaket(p);
      setOriginalPaket(p);
      setLoadError(modulR.ok ? null : modulR.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  // Paket seçince modüller + limitler otomatik işaretlenir (Özel dışında).
  const applyPaket = (next: Paket) => {
    setPaket(next);
    const preset = PAKET_PRESETS_FULL[next];
    if (preset) {
      setConfig((prev) => ({
        ...prev,
        ...preset.moduller,
        ...preset.limitler,
      }));
    }
  };

  const toggleModule = (key: ModuleKey) => {
    if (STANDART_MODULES_SET.has(key)) return;
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateLimit = (key: LimitKey, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: Number.isFinite(value) && value >= 0 ? value : 0,
    }));
  };

  const dirty =
    paket !== originalPaket ||
    ALL_MODULE_KEYS.some((k) => config[k] !== originalConfig[k]) ||
    LIMIT_KEYS.some((k) => config[k] !== originalConfig[k]);

  const handleDiscard = () => {
    if (!dirty) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm("Kaydedilmemiş değişiklikleri at?")
    )
      return;
    setConfig(originalConfig);
    setPaket(originalPaket);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Modüller ve limitler ayrı objeler
      const moduller: Record<string, boolean> = {};
      for (const k of ALL_MODULE_KEYS) {
        moduller[k] = config[k];
      }
      const limitler: Record<string, number> = {
        ai_mesaj_limit: config.ai_mesaj_limit,
        whatsapp_mesaj_limit: config.whatsapp_mesaj_limit,
        video_limit: config.video_limit,
      };

      const payload = {
        kampanya_slug: slug,
        paket: paket.toLocaleLowerCase("tr-TR"),
        moduller,
        limitler,
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

      setOriginalConfig({ ...config });
      setOriginalPaket(paket);
      setToast({ kind: "success", text: "✓ Kaydedildi" });
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error("Hata:", err);
      setToast({ kind: "error", text: "✗ Kayıt başarısız" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MasterAdminLayout
      title="Modül Yönetimi"
      subtitle={slug ? `Kampanya: ${slug}` : "Kampanya"}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/master-admin"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-label-md text-on-surface hover:bg-surface-container-low transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={loading || saving || !dirty}
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
          {/* Paket seçimi */}
          <section className="rounded-2xl border border-outline-variant bg-white p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div>
                <h2 className="text-body-lg font-semibold text-on-surface">
                  Paket
                </h2>
                <p className="text-label-sm text-on-surface-variant mt-0.5">
                  Hazır paket seçince modüller otomatik işaretlenir. Özel'de tüm
                  modülleri manuel seçersiniz.
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-label-sm font-semibold border",
                  PAKET_BADGE_STYLE[paket],
                )}
              >
                Aktif: {paket}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {PAKETLER.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyPaket(p)}
                  className={cn(
                    "px-4 py-3 rounded-xl border-2 text-body-md font-semibold transition text-center",
                    paket === p
                      ? `${PAKET_BADGE_STYLE[p]} border-current shadow-[0_4px_12px_rgba(0,24,53,0.08)]`
                      : "bg-white text-on-surface border-outline-variant hover:border-secondary hover:text-secondary",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          {/* Modüller */}
          <section className="rounded-2xl border border-outline-variant bg-white">
            <header className="px-5 py-4 border-b border-outline-variant">
              <h2 className="text-body-lg font-semibold text-on-surface">
                Modüller
              </h2>
              <p className="text-label-sm text-on-surface-variant mt-0.5">
                Her modülü açıp kapatabilirsiniz. Limit gerektiren modüllerde
                ayrıca aylık limit girin.
              </p>
            </header>
            <ul className="divide-y divide-outline-variant">
              {ALL_MODULE_KEYS.map((key) => {
                const limitKey = MODULE_LIMIT_LINKS[key];
                const isStandard = STANDART_MODULES_SET.has(key);
                return (
                  <li
                    key={key}
                    className={cn(
                      "px-5 py-3 flex items-center justify-between gap-4 flex-wrap",
                      isStandard && "bg-surface-container-lowest",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-body-md font-medium text-on-surface">
                          {MODULE_LABELS[key]}
                        </p>
                        {isStandard && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            Standart ✓
                          </span>
                        )}
                      </div>
                      <p className="text-label-sm text-on-surface-variant">
                        <code className="font-mono">{key}</code>
                      </p>
                    </div>

                    {limitKey && (
                      <label
                        className={cn(
                          "flex items-center gap-2 text-label-sm",
                          !config[key] && "opacity-50",
                        )}
                      >
                        <span className="text-on-surface-variant whitespace-nowrap">
                          {LIMIT_LABELS[limitKey]}
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          disabled={!config[key]}
                          value={config[limitKey]}
                          onChange={(e) =>
                            updateLimit(limitKey, Number(e.target.value) || 0)
                          }
                          className="w-28 px-2.5 py-1 rounded-lg border border-outline-variant bg-white text-body-sm text-on-surface text-right tabular-nums focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary disabled:bg-surface-container disabled:cursor-not-allowed"
                        />
                      </label>
                    )}

                    <Toggle
                      checked={isStandard ? true : config[key]}
                      onChange={() => toggleModule(key)}
                      disabled={isStandard}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Sticky save bar (mobil) */}
          <div className="sticky bottom-4 z-10 mt-6 rounded-xl border border-outline-variant bg-surface-container-lowest/95 backdrop-blur supports-[backdrop-filter]:bg-surface-container-lowest/85 px-4 py-3 flex items-center justify-between gap-3 flex-wrap shadow-[0_8px_20px_rgba(0,24,53,0.08)]">
            <p className="text-label-sm text-on-surface-variant inline-flex items-center gap-1.5">
              {dirty ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Kaydedilmemiş değişiklikler var
                </>
              ) : (
                "Tüm değişiklikler kaydedildi."
              )}
            </p>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                disabled={!dirty || saving}
              >
                <RotateCcw className="w-4 h-4" />
                Vazgeç
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={loading || saving || !dirty}
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
          </div>
        </div>
      )}

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

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
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
          ? "bg-surface-container-high opacity-50 cursor-not-allowed"
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
