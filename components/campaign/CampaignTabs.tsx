"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Image as ImageIcon,
  QrCode,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CampaignStory } from "@/components/campaign/CampaignStory";
import { TransparencyCenter } from "@/components/campaign/TransparencyCenter";
import { DonorsList } from "@/components/campaign/DonorsList";
import { KumbaraList } from "@/components/campaign/KumbaraList";
import { CampaignGallery } from "@/components/campaign/CampaignGallery";
import { cn } from "@/lib/utils";

export type TabId =
  | "story"
  | "transparency"
  | "donors"
  | "kumbaralar"
  | "gallery";

/** Diğer kampanya bileşenlerinin sekme değişimi tetiklemesi için
 *  yayımladığı window event'i. Detail = TabId. */
export const CAMPAIGN_SET_TAB_EVENT = "campaign:set-tab";

/** Sekmeyi programatik olarak değiştirmek için yardımcı.
 *  Tab nav'ı viewport'a kaydırır ki kullanıcı yeni içeriği görsün. */
export function setCampaignTab(tab: TabId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<TabId>(CAMPAIGN_SET_TAB_EVENT, { detail: tab }));
  // Sticky nav'ı görünür yap → yeni sekme içeriği nav'ın altına gelsin
  const nav = document.querySelector(
    '[role="tablist"][aria-label="Kampanya sekmeleri"]',
  );
  nav?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const TABS: Array<{
  id: TabId;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
}> = [
  { id: "story", label: "Hikaye", icon: BookOpen },
  { id: "transparency", label: "Şeffaflık", icon: ShieldCheck, highlight: true },
  { id: "donors", label: "Bağışçılar", icon: Users },
  { id: "kumbaralar", label: "Kumbaralar & Stantlar", icon: QrCode },
  { id: "gallery", label: "Galeri", icon: ImageIcon },
];

export function CampaignTabs() {
  const [active, setActive] = useState<TabId>("story");

  // İlk yüklemede URL'de ?subtab= varsa Şeffaflık sekmesini auto aç.
  // (Şeffaflık alt-sekme state'ini TransparencyCenter kendisi yönetir.)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("subtab")) setActive("transparency");
  }, []);

  // Diğer bileşenlerden gelen sekme değişim isteklerini dinle.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<TabId>).detail;
      if (!detail) return;
      const valid: TabId[] = [
        "story",
        "transparency",
        "donors",
        "kumbaralar",
        "gallery",
      ];
      if (valid.includes(detail)) setActive(detail);
    };
    window.addEventListener(CAMPAIGN_SET_TAB_EVENT, handler);
    return () => window.removeEventListener(CAMPAIGN_SET_TAB_EVENT, handler);
  }, []);

  return (
    <div>
      {/* Tab nav */}
      <div
        role="tablist"
        aria-label="Kampanya sekmeleri"
        className="sticky top-[54px] md:top-[56px] z-30 bg-surface/95 backdrop-blur border-b border-outline-variant -mx-4 md:-mx-6 px-4 md:px-6 mb-8"
      >
        <div className="flex items-stretch gap-1 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "relative shrink-0 inline-flex items-center gap-2 px-4 py-3.5 text-[13.5px] font-semibold transition-colors whitespace-nowrap",
                  isActive
                    ? "text-primary-container"
                    : "text-on-surface-variant hover:text-primary-container",
                )}
              >
                <tab.icon
                  size={15}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-secondary"
                      : "text-on-surface-variant/75",
                  )}
                />
                {tab.label}
                {tab.highlight && !isActive && (
                  <span
                    aria-hidden
                    className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"
                  />
                )}
                {isActive && (
                  <motion.span
                    layoutId="campaign-tab-indicator"
                    className="absolute inset-x-3 bottom-0 h-[2.5px] rounded-full bg-secondary"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {active === "story" && <CampaignStory />}
          {active === "transparency" && <TransparencyCenter />}
          {active === "donors" && <DonorsList />}
          {active === "kumbaralar" && <KumbaraList />}
          {active === "gallery" && <CampaignGallery />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
