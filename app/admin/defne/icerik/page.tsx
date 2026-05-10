"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
  Stethoscope,
  Type,
  Upload,
  X,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, PanelCard, inputClass } from "@/components/admin/AdminUI";
import {
  ICERIK_LIMITS,
  contentEquals,
  defaultIcerikContent,
  fetchIcerik,
  formatRelativeTr,
  saveIcerik,
  uploadCoverToCloudinary,
  type IcerikContent,
} from "@/lib/icerik";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error";
type Toast = { kind: ToastKind; message: string } | null;

export default function IcerikPage() {
  const [content, setContent] = useState<IcerikContent>(defaultIcerikContent);
  const [original, setOriginal] = useState<IcerikContent>(defaultIcerikContent);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Last-update label re-render trigger (her dakika tazele)
  const [, setNowTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setNowTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // İlk yükleme
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchIcerik();
      if (!mounted) return;
      setContent(result.content);
      setOriginal(result.content);
      setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dirty = useMemo(() => !contentEquals(content, original), [content, original]);

  // Kaydedilmemiş değişiklik varsa sayfa kapatma uyarısı
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern tarayıcılar mesajı yok sayar ama dialog yine de çıkar
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Toast helper
  const showToast = (kind: ToastKind, message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const updateField = <K extends keyof IcerikContent>(
    key: K,
    value: IcerikContent[K],
  ) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleDiscard = () => {
    if (!dirty) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm("Kaydedilmemiş değişiklikleri at?")
    ) {
      return;
    }
    setContent(original);
    setUploadError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await saveIcerik(content);

    if (!result.ok) {
      setSaving(false);
      showToast("error", `✗ Kaydedilemedi: ${result.error ?? "bilinmeyen hata"}`);
      return;
    }

    // Eventual consistency için kısa bekleme + GET refetch
    await new Promise((r) => setTimeout(r, 800));
    const refetched = await fetchIcerik();
    const finalContent = refetched.ok ? refetched.content : result.content;

    setContent(finalContent);
    setOriginal(finalContent);
    setSaving(false);
    showToast("success", "✓ İçerik kaydedildi");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadCoverToCloudinary(file);
      updateField("coverUrl", url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      // Aynı dosyayı tekrar seçebilmek için input'u sıfırla
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const lastUpdateLabel = formatRelativeTr(original.guncellenmeTarihi);

  return (
    <AdminLayout
      title="İçerik Yönetimi"
      subtitle="Hikaye, doktor görüşü ve kapak fotoğrafı"
      actions={
        <div className="flex items-center gap-2">
          {dirty && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-label-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Kaydedilmemiş
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={loading || saving || !dirty}
          >
            <Save className="w-4 h-4" />
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </Button>
        </div>
      }
    >
      {/* Last-update + load error */}
      <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant text-label-sm text-on-surface-variant">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          Son güncelleme: <span className="font-semibold text-on-surface">{lastUpdateLabel}</span>
        </div>
        {dirty && (
          <span className="sm:hidden inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-label-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Kaydedilmemiş değişiklikler var
          </span>
        )}
      </div>

      {loadError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">
              İçerik yüklenemedi — boş form gösteriliyor.
            </p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {loadError}. Form kaydedildiğinde yeni değerler API'ye yazılır.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <FormSkeleton />
      ) : (
        <div className="space-y-4">
          {/* Hero card */}
          <PanelCard
            title="Hero (Üst Bölüm)"
            description="Kampanya sayfasının en üstünde görünen başlık ve alt başlık"
          >
            <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Hero Başlık" required>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                  <input
                    className={cn(inputClass, "pl-9")}
                    value={content.heroBaslik}
                    onChange={(e) =>
                      updateField(
                        "heroBaslik",
                        e.target.value.slice(0, ICERIK_LIMITS.heroBaslik),
                      )
                    }
                    placeholder="Örn: Minik Defne'ye Umut Ol"
                    maxLength={ICERIK_LIMITS.heroBaslik}
                  />
                </div>
                <CharCounter
                  current={content.heroBaslik.length}
                  max={ICERIK_LIMITS.heroBaslik}
                />
              </FormField>

              <FormField label="Hero Alt Başlık">
                <input
                  className={inputClass}
                  value={content.heroAltBaslik}
                  onChange={(e) =>
                    updateField(
                      "heroAltBaslik",
                      e.target.value.slice(0, ICERIK_LIMITS.heroAltBaslik),
                    )
                  }
                  placeholder="Örn: SMA Tip 1 - Zolgensma Tedavisi"
                  maxLength={ICERIK_LIMITS.heroAltBaslik}
                />
                <CharCounter
                  current={content.heroAltBaslik.length}
                  max={ICERIK_LIMITS.heroAltBaslik}
                />
              </FormField>
            </div>
          </PanelCard>

          {/* Cover photo card */}
          <PanelCard
            title="Kapak Fotoğrafı"
            description="Kampanya sayfasının üstündeki ana görsel — 1920×1080 px (16:9) önerilir"
          >
            <div className="px-5 py-4 space-y-3">
              {content.coverUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={content.coverUrl}
                    alt="Kapak fotoğrafı önizleme"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("coverUrl", "")}
                    className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-label-sm font-semibold hover:bg-black/75 transition"
                    aria-label="Kapak fotoğrafını kaldır"
                  >
                    <X className="w-3.5 h-3.5" />
                    Kaldır
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-low/40 flex items-center justify-center text-center px-4">
                  <div className="text-on-surface-variant">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <p className="text-body-sm font-medium">Henüz kapak fotoğrafı yok</p>
                    <p className="text-label-sm mt-0.5">
                      Aşağıdaki butonla yükleyebilirsiniz
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant={content.coverUrl ? "ghost" : "primary"}
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Yükleniyor…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {content.coverUrl ? "Değiştir" : "Yükle"}
                    </>
                  )}
                </Button>
                <span className="text-label-sm text-on-surface-variant">
                  Cloudinary klasörü:{" "}
                  <code className="font-mono">kampanyatakip/kapak</code>
                </span>
              </div>

              {uploadError && (
                <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-body-sm text-rose-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  {uploadError}
                </div>
              )}
            </div>
          </PanelCard>

          {/* Story card */}
          <PanelCard
            title="Hikaye Metni"
            description="Bağışçılara kampanyanızı anlatan ana metin. 2-4 paragraf önerilir."
          >
            <div className="px-5 py-4">
              <textarea
                className={cn(inputClass, "min-h-[260px] resize-y leading-relaxed")}
                rows={12}
                value={content.hikayeMetni}
                onChange={(e) =>
                  updateField(
                    "hikayeMetni",
                    e.target.value.slice(0, ICERIK_LIMITS.hikayeMetni),
                  )
                }
                placeholder="Bağışçılara kampanyanızı anlatın. **kalın**, *italik* desteklenir."
                maxLength={ICERIK_LIMITS.hikayeMetni}
              />
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-label-sm text-on-surface-variant">
                  Markdown:{" "}
                  <code className="font-mono">**kalın**</code>,{" "}
                  <code className="font-mono">*italik*</code> desteklenir
                </p>
                <CharCounter
                  current={content.hikayeMetni.length}
                  max={ICERIK_LIMITS.hikayeMetni}
                />
              </div>
            </div>
          </PanelCard>

          {/* Doctor quote card */}
          <PanelCard
            title="Doktor Görüşü"
            description="Tedavi süreci hakkında uzman alıntısı (opsiyonel)"
          >
            <div className="px-5 py-4 space-y-4">
              <FormField label="Doktor Alıntısı">
                <textarea
                  className={cn(inputClass, "min-h-[110px] resize-y leading-relaxed")}
                  rows={4}
                  value={content.doktorAlintisi}
                  onChange={(e) =>
                    updateField(
                      "doktorAlintisi",
                      e.target.value.slice(0, ICERIK_LIMITS.doktorAlintisi),
                    )
                  }
                  placeholder='Örn: "SMA Tip 1 hastalarında erken tanı ve tedavi çok önemlidir…"'
                  maxLength={ICERIK_LIMITS.doktorAlintisi}
                />
                <CharCounter
                  current={content.doktorAlintisi.length}
                  max={ICERIK_LIMITS.doktorAlintisi}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Doktor Adı">
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      className={cn(inputClass, "pl-9")}
                      value={content.doktorAdi}
                      onChange={(e) =>
                        updateField(
                          "doktorAdi",
                          e.target.value.slice(0, ICERIK_LIMITS.doktorAdi),
                        )
                      }
                      placeholder="Örn: Prof. Dr. Mehmet Demir"
                      maxLength={ICERIK_LIMITS.doktorAdi}
                    />
                  </div>
                </FormField>

                <FormField label="Doktor Ünvanı">
                  <input
                    className={inputClass}
                    value={content.doktorUnvan}
                    onChange={(e) =>
                      updateField(
                        "doktorUnvan",
                        e.target.value.slice(0, ICERIK_LIMITS.doktorUnvan),
                      )
                    }
                    placeholder="Örn: Çocuk Nöroloji Uzmanı"
                    maxLength={ICERIK_LIMITS.doktorUnvan}
                  />
                </FormField>
              </div>
            </div>
          </PanelCard>
        </div>
      )}

      {/* Sticky save bar — alt mobil bottom nav (~64px) üzerinde durur */}
      {!loading && (
        <div className="sticky bottom-[64px] md:bottom-0 -mx-4 md:-mx-6 lg:-mx-8 mt-6 z-10 border-t border-outline-variant bg-surface-container-lowest/95 backdrop-blur supports-[backdrop-filter]:bg-surface-container-lowest/85">
          <div className="max-w-[1600px] px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-label-sm text-on-surface-variant">
              {dirty
                ? "Kaydedilmemiş değişiklikler var."
                : "Tüm değişiklikler kaydedildi."}
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

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed left-1/2 -translate-x-1/2 bottom-[140px] md:bottom-20 z-50 px-4 py-2.5 rounded-lg shadow-[0_8px_20px_rgba(0,24,53,0.18)] border text-body-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200",
            toast.kind === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200",
          )}
          role="status"
          aria-live="polite"
        >
          {toast.kind === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </AdminLayout>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function CharCounter({ current, max }: { current: number; max: number }) {
  const ratio = current / max;
  const cls =
    ratio >= 1
      ? "text-rose-700"
      : ratio >= 0.9
        ? "text-amber-700"
        : "text-on-surface-variant";
  return (
    <p className={cn("mt-1 text-label-sm tabular-nums text-right", cls)}>
      {current}/{max}
    </p>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4">
      {[260, 220, 280, 200].map((h, i) => (
        <div
          key={i}
          className="rounded-xl border border-outline-variant bg-surface-container-lowest"
        >
          <div className="px-5 py-4 border-b border-outline-variant">
            <div className="h-4 w-40 rounded bg-surface-container animate-pulse" />
            <div className="mt-2 h-3 w-64 rounded bg-surface-container animate-pulse" />
          </div>
          <div className="px-5 py-4">
            <div
              className="rounded-lg bg-surface-container animate-pulse"
              style={{ height: h }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
