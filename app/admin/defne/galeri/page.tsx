"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/admin/AdminUI";
import {
  CLOUDINARY_GALERI_CONFIG,
  createGaleriItem,
  deleteGaleriItem,
  fetchGaleri,
  loadCloudinaryWidget,
  nextSiralama,
  type CloudinaryWidgetInstance,
  type CloudinaryWidgetResult,
  type GaleriItem,
} from "@/lib/galeri";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error";
type Toast = { kind: ToastKind; message: string } | null;

export default function GaleriPage() {
  const [items, setItems] = useState<GaleriItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [openingWidget, setOpeningWidget] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);

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

  // ── Persist uploaded URLs to backend ──────────────────────────────────────
  const flushUploads = async () => {
    const urls = uploadedUrlsRef.current.splice(0);
    if (urls.length === 0) {
      setUploadInProgress(false);
      return;
    }
    setUploadInProgress(true);
    let nextOrder = nextSiralama(itemsRef.current);
    const results = await Promise.all(
      urls.map((u) =>
        createGaleriItem({
          foto_url: u,
          baslik: "",
          aciklama: "",
          tip: "galeri",
          siralama: nextOrder++,
        }),
      ),
    );
    const okCount = results.filter((r) => r.ok).length;
    const failCount = results.length - okCount;

    // 800ms eventual consistency + GET refetch
    await new Promise((r) => setTimeout(r, 800));
    await refresh(true);
    setUploadInProgress(false);

    if (failCount === 0) {
      showToast("success", `✓ ${okCount} fotoğraf yüklendi`);
    } else if (okCount > 0) {
      showToast(
        "error",
        `✓ ${okCount} yüklendi, ${failCount} başarısız`,
      );
    } else {
      showToast("error", "✗ Yükleme kaydedilemedi");
    }
  };

  // ── Open Cloudinary widget ────────────────────────────────────────────────
  const handleOpenUpload = async () => {
    if (openingWidget || uploadInProgress) return;
    setOpeningWidget(true);
    try {
      await loadCloudinaryWidget();
      const cld = window.cloudinary;
      if (!cld) throw new Error("Cloudinary widget yüklenemedi");

      // Mevcut widget'ı kapat (varsa) — temiz başlangıç
      try {
        widgetRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      widgetRef.current = null;
      uploadedUrlsRef.current = [];

      const widget = cld.createUploadWidget(
        {
          ...CLOUDINARY_GALERI_CONFIG,
        },
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
            // Tüm yüklemeler tamamlandı — kaydet ve tazele
            void flushUploads();
          }
        },
      );
      widgetRef.current = widget;
      widget.open();
    } catch (e) {
      showToast(
        "error",
        e instanceof Error ? e.message : "Yükleme açılamadı",
      );
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
            onClick={handleOpenUpload}
            disabled={openingWidget || uploadInProgress}
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

      {loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          onAdd={handleOpenUpload}
          disabled={openingWidget || uploadInProgress}
        />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((it) => (
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
        onClick={handleOpenUpload}
        disabled={openingWidget || uploadInProgress}
        aria-label="Fotoğraf ekle"
        className={cn(
          "md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full bg-secondary text-on-secondary shadow-[0_8px_20px_rgba(0,103,127,0.4)] flex items-center justify-center transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed",
        )}
      >
        {openingWidget || uploadInProgress ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        )}
      </button>

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

function GalleryCard({
  item,
  onDelete,
}: {
  item: GaleriItem;
  onDelete: () => void;
}) {
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

        {/* Sil butonu — sağ üst (mobilde her zaman, desktop'ta hover) */}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Fotoğrafı sil"
          className="absolute top-2 right-2 inline-flex items-center justify-center w-8 h-8 rounded-md bg-rose-600/90 hover:bg-rose-600 text-white shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
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
