"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";

export function CampaignGallery() {
  const { galeri } = useCampaign();
  const items = galeri;
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")
        setLightbox((i) => (i === null ? null : Math.max(0, i - 1)));
      if (e.key === "ArrowRight")
        setLightbox((i) =>
          i === null ? null : Math.min(items.length - 1, i + 1),
        );
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, items.length]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest p-10 md:p-14 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h3 className="text-[18px] md:text-[20px] font-semibold text-on-surface">
          Henüz fotoğraf eklenmemiş
        </h3>
        <p className="mt-1.5 text-[13.5px] text-on-surface-variant max-w-md">
          Kampanya yöneticisi galeriye fotoğraf eklediğinde burada
          görüntülenecek.
        </p>
      </div>
    );
  }

  const active = lightbox !== null ? items[lightbox] : null;

  return (
    <>
      <div className="space-y-5">
        <p className="text-[13px] text-on-surface-variant">
          {items.length.toLocaleString("tr-TR")} fotoğraf — büyütmek için
          karta tıklayın.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(i)}
              title={item.aciklama || item.baslik || undefined}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,24,53,0.15)] transition-all bg-surface-container-low"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.fotoUrl}
                alt={item.baslik || `Galeri fotoğrafı #${item.id}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {(item.baslik || item.aciklama) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 text-left">
                  {item.baslik && (
                    <h4 className="text-[13.5px] font-semibold text-white leading-tight line-clamp-2">
                      {item.baslik}
                    </h4>
                  )}
                  {item.aciklama && (
                    <p className="mt-0.5 text-[11px] text-white/85 leading-tight line-clamp-2">
                      {item.aciklama}
                    </p>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.fotoUrl}
                alt={active.baslik || `Galeri fotoğrafı #${active.id}`}
                className="block w-full max-h-[85vh] object-contain bg-black"
              />
              {(active.baslik || active.aciklama) && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-5 md:p-6">
                  {active.baslik && (
                    <h3 className="text-[18px] md:text-[20px] font-semibold text-white">
                      {active.baslik}
                    </h3>
                  )}
                  {active.aciklama && (
                    <p className="mt-1 text-[13px] md:text-[14px] text-white/85 leading-snug">
                      {active.aciklama}
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Kapat"
              className="absolute top-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
            {lightbox !== null && lightbox > 0 && (
              <button
                type="button"
                onClick={() => setLightbox(lightbox - 1)}
                aria-label="Önceki"
                className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightbox !== null && lightbox < items.length - 1 && (
              <button
                type="button"
                onClick={() => setLightbox(lightbox + 1)}
                aria-label="Sonraki"
                className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
