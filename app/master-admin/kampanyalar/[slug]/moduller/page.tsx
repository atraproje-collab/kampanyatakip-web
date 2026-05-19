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
  PAKET_PRESETS,
  fetchModuleConfig,
  saveModuleConfig,
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

  // İlk yükleme
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      const r = await fetchModuleConfig(slug);
      if (!mounted) return;
      setConfig(r.config);
      setOriginalConfig(r.config);
      const p = r.paket ?? "Özel";
      setPaket(p);
      setOriginalPaket(p);
      setLoadError(r.ok ? null : r.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  // Paket seçince modüller otomatik işaretlenir (Özel dışında).
  // Özel'i seçince mevcut seçimi koruyoruz.
  const applyPaket = (next: Paket) => {
    setPaket(next);
    if (next !== "Özel") {
      setConfig({ ...PAKET_PRESETS[next] });
    }
  };

  const toggleModule = (key: ModuleKey) => {
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
    const r = await saveModuleConfig(slug, paket, config);
    setSaving(false);
    if (!r.ok) {
      setToast({ kind: "error", text: `✗ Kaydedilemedi: ${r.error}` });
      return;
    }
    setOriginalConfig({ ...config });
    setOriginalPaket(paket);
    setToast({ kind: "success", text: "✓ Modül ayarları kaydedildi" });
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
                return (
                  <li
                    key={key}
                    className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-body-md font-medium text-on-surface">
                        {MODULE_LABELS[key]}
                      </p>
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
                      checked={config[key]}
                      onChange={() => toggleModule(key)}
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
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition shrink-0",
        checked ? "bg-emerald-500" : "bg-surface-container-high",
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
