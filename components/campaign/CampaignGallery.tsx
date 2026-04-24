"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Stethoscope,
  Store,
  Users as UsersIcon,
  Users2,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import type { GalleryItem } from "@/lib/mock-campaign-data";

const ICONS: Record<GalleryItem["placeholder"], LucideIcon> = {
  family: Heart,
  hospital: Stethoscope,
  "donation-box": Camera,
  stand: Store,
  video: Video,
  volunteers: UsersIcon,
  team: Users2,
  treatment: Stethoscope,
};

const GRADIENTS: Record<GalleryItem["placeholder"], string> = {
  family:
    "linear-gradient(135deg, #012d59 0%, #00677f 80%, #66daff 160%)",
  hospital:
    "linear-gradient(135deg, #00677f 0%, #5fd5f9 100%)",
  "donation-box":
    "linear-gradient(135deg, #001835 0%, #012d59 100%)",
  stand:
    "linear-gradient(135deg, #3f5f8e 0%, #66daff 130%)",
  video: "linear-gradient(135deg, #001835 0%, #00677f 100%)",
  volunteers:
    "linear-gradient(135deg, #00677f 0%, #012d59 110%)",
  team: "linear-gradient(135deg, #012d59 0%, #5fd5f9 150%)",
  treatment:
    "linear-gradient(135deg, #00677f 0%, #d3e4fe 170%)",
};

export function CampaignGallery() {
  const { campaign } = useCampaign();
  const items = campaign.gallery;
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

  return (
    <>
      <div className="space-y-5">
        <p className="text-[13px] text-on-surface-variant">
          Bu bölümdeki görseller demo amaçlı soyut kart tasarımlarıdır.
          Gerçek kampanya sayfasında fotoğraf ve video içerikleri görüntülenir.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((item, i) => {
            const Icon = ICONS[item.placeholder];
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setLightbox(i)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,24,53,0.15)] transition-all"
              >
                <div
                  className="absolute inset-0"
                  style={{ background: GRADIENTS[item.placeholder] }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 opacity-20 mix-blend-soft-light"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden
                />
                <Icon
                  size={72}
                  strokeWidth={1.2}
                  aria-hidden
                  className="absolute -right-4 -bottom-4 text-white/30 transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-4 bottom-4 text-left">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {item.type === "video" ? "Video" : "Fotoğraf"}
                  </span>
                  <h4 className="mt-1 text-[15px] font-semibold text-white leading-tight">
                    {item.title}
                  </h4>
                </div>
                {item.type === "video" && (
                  <span className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/90 text-primary-container shadow-[0_6px_12px_rgba(0,0,0,0.2)]">
                    <Play size={20} className="fill-current" strokeWidth={0} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
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
              className="relative w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: GRADIENTS[items[lightbox].placeholder],
                }}
                aria-hidden
              />
              {(() => {
                const Icon = ICONS[items[lightbox].placeholder];
                return (
                  <Icon
                    size={260}
                    strokeWidth={1}
                    className="absolute inset-0 m-auto text-white/30"
                  />
                );
              })()}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white/80">
                  {items[lightbox].type === "video" ? "Video" : "Fotoğraf"}
                </span>
                <h3 className="mt-1 text-[20px] font-semibold text-white">
                  {items[lightbox].title}
                </h3>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Kapat"
              className="absolute top-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
            {lightbox > 0 && (
              <button
                type="button"
                onClick={() => setLightbox(lightbox - 1)}
                aria-label="Önceki"
                className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {lightbox < items.length - 1 && (
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
