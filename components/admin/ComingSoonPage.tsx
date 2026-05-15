"use client";

import { Clock, Crown, Sparkles, type LucideIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";

export type ComingSoonFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

interface ComingSoonPageProps {
  /** Sidebar başlığı ve sayfa H1 */
  title: string;
  /** Üst gradient hero için kısa açıklama */
  tagline: string;
  /** Hero sol köşedeki büyük ikon */
  heroIcon: LucideIcon;
  /** Premium rozeti göster mi? */
  premium?: boolean;
  /** Üst gradient class'ı (örn. "from-amber-500 to-orange-600") */
  gradient?: string;
  /** Açıklama kartları (3-4 adet) */
  features: ComingSoonFeature[];
}

export function ComingSoonPage({
  title,
  tagline,
  heroIcon: HeroIcon,
  premium = false,
  gradient = "from-secondary to-on-secondary-container",
  features,
}: ComingSoonPageProps) {
  return (
    <AdminLayout
      title={title}
      subtitle={tagline}
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          Yakında
        </span>
      }
    >
      {/* Hero */}
      <div
        className={cn(
          "rounded-2xl p-6 md:p-8 mb-6 border bg-gradient-to-br text-white shadow-[0_10px_30px_rgba(0,24,53,0.15)]",
          gradient,
        )}
      >
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur shrink-0">
            <HeroIcon className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-[240px]">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h2 className="text-h2 font-bold">{title}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-semibold bg-white/25 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Bu özellik yakında aktif olacak
              </span>
              {premium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-bold bg-yellow-400 text-yellow-900 border border-yellow-500/40">
                  <Crown className="w-3.5 h-3.5" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-body-md text-white/90 max-w-3xl">{tagline}</p>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map(({ title: t, description, icon: Icon }) => (
          <article
            key={t}
            className="rounded-xl bg-surface-container-lowest border border-outline-variant p-5 hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-label-lg font-semibold text-on-surface">{t}</h3>
                <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-5 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-body-sm text-on-surface-variant">
          <p className="font-semibold text-on-surface mb-1">
            Geliştirme aşamasındayız
          </p>
          <p>
            Bu modülün ilk sürümü yakında hazır olacak. Aktif olduğunda buradan
            yönetebileceksiniz; şimdilik sadece önizleme görüyorsunuz.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
