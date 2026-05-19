"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { ModuleActiveGate } from "@/components/master-admin/ModuleActiveGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/AdminUI";
import {
  CLOUDINARY_GALERI_CONFIG,
  GALERI_KATEGORILER,
  createGaleriItem,
  deleteGaleriItem,
  fetchGaleri,
  getKategoriLabel,
  loadCloudinaryWidget,
  nextSiralama,
  type CloudinaryWidgetInstance,
  type CloudinaryWidgetResult,
  type GaleriItem,
} from "@/lib/galeri";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error";
type Toast = { kind: ToastKind; message: string } | null;

const FILTER_ALL = "all";

export default function GaleriPage() {
  return (
    <ModuleActiveGate slug="demo-defne" moduleKey="galeri">
      <GaleriPageInner />
    </ModuleActiveGate>
  );
}

function GaleriPageInner() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [openingWidget, setOpeningWidget] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

  // Pre-upload kategori seçim modal'ı
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerKategori, setPickerKategori] = useState<string>("diger");
  // Widget callback'inde okunabilmesi için ref — pickerKategori ile sürekli senkron.
  const pendingKategoriRef = useRef<string>("diger");
  useEffect(() => {
    pendingKategoriRef.current = pickerKategori;
  }, [pickerKategori]);

  // Aktif filtre
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_ALL);

  const [deleteTarget, setDeleteTarget] = useState<GaleriItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<Toast>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Latest items'a widget callback'inden okumak için ref
  const itemsRef = useRef<GaleriItem[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const widgetRef = useRef<CloudinaryWidgetInstance | null>(null);
  const uploadedUrlsRef = useRef<string[]>([]);

  // ── Toast ─────────────────────────────────────────────────────────────────
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

  // ── Initial fetch ─────────────────────────────────────────────────────────
  const refresh = async (silent = false) => {
    if (!silent) setLoading(true);
    const result = await fetchGaleri();
    setItems(result.items);
    setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchGaleri();
      if (!mounted) return;
      setItems(result.items);
      setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Cleanup widget on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      const w = widgetRef.current;
      try {
        w?.destroy?.();
      } catch {
        /* ignore */
      }
      widgetRef.current = null;
    };
  }, []);

  // ── Filter + counts ───────────────────────────────────────────────────────
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) {
      m.set(it.kategori, (m.get(it.kategori) ?? 0) + 1);
    }
    return m;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === FILTER_ALL) return items;
    return items.filter((it) => it.kategori === activeFilter);
  }, [items, activeFilter]);

  // ── Persist uploaded URLs to backend ──────────────────────────────────────
  const flushUploads = async () => {
    const urls = uploadedUrlsRef.current.splice(0);
    if (urls.length === 0) {
      setUploadInProgress(false);
      return;
    }
    setUploadInProgress(true);
    const kategori = pendingKategoriRef.current || "diger";
    let nextOrder = nextSiralama(itemsRef.current);

    // eslint-disable-next-line no-console
    console.log("[GaleriEkle] Batch başlatılıyor:", {
      kategori,
      pickerSelection: pickerKategori,
      urlCount: urls.length,
      startSiralama: nextOrder,
    });

    const results = await Promise.all(
      urls.map((u) => {
        const body = {
          foto_url: u,
          baslik: "",
          aciklama: "",
          tip: "galeri" as const,
          kategori,
          siralama: nextOrder++,
        };
        // eslint-disable-next-line no-console
        console.log("[GaleriEkle] Yüklenecek body:", body);
        return createGaleriItem(body);
      }),
    );
    const okCount = results.filter((r) => r.ok).length;
    const failCount = results.length - okCount;

    // 800ms eventual consistency + GET refetch
    await new Promise((r) => setTimeout(r, 800));
    await refresh(true);
    setUploadInProgress(false);

    const katLabel = getKategoriLabel(kategori).label;
    if (failCount === 0) {
      showToast("success", `✓ ${okCount} fotoğraf "${katLabel}" kategorisine yüklendi`);
    } else if (okCount > 0) {
      showToast("error", `✓ ${okCount} yüklendi, ${failCount} başarısız`);
    } else {
      showToast("error", "✗ Yükleme kaydedilemedi");
    }
  };

  // ── Pre-upload picker → Cloudinary widget ─────────────────────────────────
  const handleOpenPicker = () => {
    if (openingWidget || uploadInProgress) return;
    setPickerOpen(true);
  };

  const handleConfirmPicker = async () => {
    pendingKategoriRef.current = pickerKategori;
    setPickerOpen(false);
    setOpeningWidget(true);
    try {
      await loadCloudinaryWidget();
      const cld = window.cloudinary;
      if (!cld) throw new Error("Cloudinary widget yüklenemedi");

      try {
        widgetRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      widgetRef.current = null;
      uploadedUrlsRef.current = [];

      const widget = cld.createUploadWidget(
        { ...CLOUDINARY_GALERI_CONFIG },
        (error, result: CloudinaryWidgetResult | null) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.warn("[galeri] cloudinary error:", error);
            return;
          }
          if (!result) return;
          if (result.event === "success") {
            const url = result.info?.secure_url;
            if (url) uploadedUrlsRef.current.push(url);
          } else if (result.event === "queues-end") {
            void flushUploads();
          }
        },
      );
      widgetRef.current = widget;
      widget.open();
    } catch (e) {
      showToast("error", e instanceof Error ? e.message : "Yükleme açılamadı");
    } finally {
      setOpeningWidget(false);
    }
  };

  // ── Delete flow ───────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteGaleriItem(deleteTarget.id);
    if (!result.ok) {
      setDeleting(false);
      showToast("error", `✗ Silinemedi: ${result.error ?? "bilinmeyen hata"}`);
      return;
    }
    await new Promise((r) => setTimeout(r, 800));
    await refresh(true);
    setDeleting(false);
    setDeleteTarget(null);
    showToast("success", "✓ Fotoğraf silindi");
  };

  const isUploadBusy = openingWidget || uploadInProgress;

  return (
    <AdminLayout
      title="Galeri Yönetimi"
      subtitle="Kampanya sayfasında gösterilen fotoğrafları yönetin"
      actions={
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-label-sm font-semibold tabular-nums">
            {items.length} fotoğraf
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenPicker}
            disabled={isUploadBusy}
            className="hidden md:inline-flex"
          >
            {openingWidget ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Hazırlanıyor…
              </>
            ) : uploadInProgress ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Kaydediliyor…
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Fotoğraf Ekle
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
            <p className="font-semibold">Galeri yüklenemedi.</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {loadError}. n8n endpoint'ini ve CORS ayarlarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Kategori filtre çubuğu — admin'de hep tüm kategoriler görünür,
          0 olan kategori soluk + tıklanamaz */}
      {!loading && items.length > 0 && (
        <div className="mb-4 -mx-4 md:mx-0 px-4 md:px-0 overflow-x-auto">
          <div className="flex flex-wrap gap-2 min-w-max md:min-w-0">
            <FilterChip
              active={activeFilter === FILTER_ALL}
              label="Tümü"
              count={items.length}
              onClick={() => setActiveFilter(FILTER_ALL)}
            />
            {GALERI_KATEGORILER.map((k) => {
              const c = counts.get(k.value) ?? 0;
              return (
                <FilterChip
                  key={k.value}
                  active={activeFilter === k.value}
                  emoji={k.emoji}
                  label={k.label}
                  count={c}
                  disabled={c === 0}
                  onClick={() => c > 0 && setActiveFilter(k.value)}
                />
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState onAdd={handleOpenPicker} disabled={isUploadBusy} />
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center text-body-sm text-on-surface-variant">
          Bu kategoride henüz fotoğraf yok.
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredItems.map((it) => (
            <GalleryCard
              key={it.id}
              item={it}
              onDelete={() => setDeleteTarget(it)}
            />
          ))}
        </ul>
      )}

      {/* Mobile floating action button */}
      <button
        type="button"
        onClick={handleOpenPicker}
        disabled={isUploadBusy}
        aria-label="Fotoğraf ekle"
        className={cn(
          "md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-[0_8px_20px_rgba(0,103,127,0.4)] flex items-center justify-center transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {isUploadBusy ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        )}
      </button>

      {/* Pre-upload kategori picker */}
      <Modal
        open={pickerOpen}
        onClose={() => !openingWidget && setPickerOpen(false)}
        title="Kategori seç"
        description="Bu yüklemedeki tüm fotoğraflar seçilen kategoriye atanır."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPickerOpen(false)}
              disabled={openingWidget}
            >
              Vazgeç
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmPicker}
              disabled={openingWidget}
            >
              {openingWidget ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Açılıyor…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Devam et → Yükle
                </>
              )}
            </Button>
          </>
        }
      >
        <fieldset className="space-y-2">
          <legend className="sr-only">Kategori</legend>
          {GALERI_KATEGORILER.map((k) => {
            const checked = pickerKategori === k.value;
            return (
              <label
                key={k.value}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition",
                  checked
                    ? "border-secondary bg-secondary/10"
                    : "border-outline-variant hover:border-secondary/60 hover:bg-surface-container-low",
                )}
              >
                <input
                  type="radio"
                  name="kategori"
                  value={k.value}
                  checked={checked}
                  onChange={() => setPickerKategori(k.value)}
                  className="accent-secondary w-4 h-4"
                />
                <span className="text-xl leading-none" aria-hidden>
                  {k.emoji}
                </span>
                <span
                  className={cn(
                    "text-body-sm font-semibold",
                    checked ? "text-on-surface" : "text-on-surface",
                  )}
                >
                  {k.label}
                </span>
              </label>
            );
          })}
        </fieldset>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Fotoğrafı sil"
        description="Bu işlem geri alınamaz."
        size="sm"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Vazgeç
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="!bg-rose-600 hover:!bg-rose-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Siliniyor…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Sil
                </>
              )}
            </Button>
          </>
        }
      >
        {deleteTarget && (
          <div className="space-y-3">
            <div className="aspect-video rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={deleteTarget.fotoUrl}
                alt={deleteTarget.baslik || "Fotoğraf"}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-body-sm text-on-surface">
              <strong>
                {deleteTarget.baslik || `Fotoğraf #${deleteTarget.id}`}
              </strong>{" "}
              silinecek. Yayındaki kampanya sayfasından kaldırılır.
            </p>
          </div>
        )}
      </Modal>

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

function FilterChip({
  active,
  emoji,
  label,
  count,
  onClick,
  disabled,
}: {
  active: boolean;
  emoji?: string;
  label: string;
  count: number;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-label-md font-semibold whitespace-nowrap transition",
        active
          ? "bg-secondary text-on-secondary border-secondary"
          : "bg-white text-on-surface border-outline-variant hover:border-secondary hover:text-secondary",
        disabled && "opacity-40 cursor-not-allowed hover:border-outline-variant hover:text-on-surface-variant",
      )}
      aria-pressed={active}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      <span>{label}</span>
      <span
        className={cn(
          "tabular-nums px-1.5 py-0.5 rounded-full text-[10.5px]",
          active
            ? "bg-on-secondary/15 text-on-secondary"
            : "bg-surface-container text-on-surface-variant",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function GalleryCard({
  item,
  onDelete,
}: {
  item: GaleriItem;
  onDelete: () => void;
}) {
  const kat = getKategoriLabel(item.kategori);
  return (
    <li className="group relative rounded-xl overflow-hidden border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:shadow-[0_8px_18px_rgba(0,24,53,0.08)] transition-all">
      <div className="relative aspect-square bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.fotoUrl}
          alt={item.baslik || `Galeri fotoğrafı #${item.id}`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Sıralama badge — sol üst */}
        <span className="absolute top-2 left-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/60 text-white text-label-sm font-bold tabular-nums">
          #{item.siralama || item.id}
        </span>

        {/* Sil butonu — sağ üst */}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Fotoğrafı sil"
          className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Kategori badge — sol alt */}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-label-sm font-semibold">
          <span aria-hidden>{kat.emoji}</span>
          <span>{kat.label}</span>
        </span>
      </div>
      {item.baslik && (
        <div className="px-3 py-2">
          <p className="text-label-md font-medium text-on-surface truncate">
            {item.baslik}
          </p>
        </div>
      )}
    </li>
  );
}

function EmptyState({
  onAdd,
  disabled,
}: {
  onAdd: () => void;
  disabled: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-10 md:p-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8" />
      </div>
      <h3 className="text-h3 font-semibold text-on-surface">
        Henüz fotoğraf eklenmemiş
      </h3>
      <p className="mt-1.5 text-body-sm text-on-surface-variant max-w-md">
        Kampanya sayfasının galerisinde gösterilecek görselleri buradan
        yükleyebilirsiniz.
      </p>
      <Button
        variant="primary"
        size="sm"
        onClick={onAdd}
        disabled={disabled}
        className="mt-5"
      >
        <Plus className="w-4 h-4" />
        İlk Fotoğrafınızı Ekleyin
      </Button>
    </div>
  );
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <li
          key={i}
          className="aspect-square rounded-xl border border-outline-variant bg-surface-container animate-pulse"
        />
      ))}
    </ul>
  );
}
