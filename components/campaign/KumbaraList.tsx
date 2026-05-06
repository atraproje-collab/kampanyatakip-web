"use client";

import {
  Camera,
  Clock,
  FileText,
  Loader2,
  MapPin,
  QrCode,
  Store,
  User,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";
import { formatTRY } from "@/lib/mock-campaign-data";

function handleDemoAction(message: string) {
  if (typeof window !== "undefined") window.alert(message);
}

// Şematik pin koordinatları (soldan sağa yayılmış). Etiketler gerçek konumlardan
// türetilir; veri sayısına göre ilgili sayıda pin gösterilir.
const KUMBARA_PIN_SLOTS: Array<{ left: string; top: string }> = [
  { left: "34%", top: "42%" },
  { left: "22%", top: "62%" },
  { left: "46%", top: "36%" },
  { left: "36%", top: "32%" },
  { left: "30%", top: "48%" },
  { left: "52%", top: "60%" },
  { left: "62%", top: "44%" },
  { left: "18%", top: "38%" },
];

const STANT_PIN_SLOTS: Array<{ left: string; top: string }> = [
  { left: "56%", top: "30%" },
  { left: "48%", top: "48%" },
  { left: "40%", top: "56%" },
  { left: "66%", top: "38%" },
  { left: "26%", top: "30%" },
];

/** Konum metninden ilçe/mahalle adını çıkarır (boşluk veya virgülden önceki kısım). */
function shortLocation(full: string): string {
  if (!full) return "";
  const trimmed = full.trim();
  // "Kadıköy Meydan" → "Kadıköy"; "İstinye Park AVM" → "İstinye Park"
  const parts = trimmed.split(/[\s,]+/);
  if (parts.length <= 2) return trimmed;
  // İlk 2 kelimeyi al
  return `${parts[0]} ${parts[1]}`;
}

export function KumbaraList() {
  const { kumbaralar, stantlar, statsReady } = useCampaign();

  const activeKumbara = kumbaralar.filter((k) => k.status === "aktif");
  const activeStant = stantlar.filter((s) => s.status === "aktif");

  const kumbaraTotal = activeKumbara.reduce((s, k) => s + k.total, 0);
  const stantTotal = activeStant.reduce((s, k) => s + k.total, 0);

  const kumbaraPins = activeKumbara
    .slice(0, KUMBARA_PIN_SLOTS.length)
    .map((k, i) => ({
      ...KUMBARA_PIN_SLOTS[i],
      label: shortLocation(k.location) || `Kumbara ${k.id}`,
    }));
  const stantPins = activeStant
    .slice(0, STANT_PIN_SLOTS.length)
    .map((s, i) => ({
      ...STANT_PIN_SLOTS[i],
      label: shortLocation(s.location) || `Stant ${s.id}`,
    }));

  return (
    <div className="space-y-10">
      {/* Map (abstract) */}
      <div className="rounded-2xl border border-outline-variant bg-white p-5 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div>
            <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em]">
              İstanbul Dağılımı
            </h3>
            <p className="text-[12.5px] text-on-surface-variant">
              Kumbara ve stantların şematik konumları.
            </p>
          </div>
          <div className="flex gap-4 text-[12px] font-semibold">
            <span className="inline-flex items-center gap-1.5 text-secondary">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              Kumbara
            </span>
            <span className="inline-flex items-center gap-1.5 text-primary-container">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              Stant
            </span>
          </div>
        </div>
        <div className="relative rounded-xl bg-surface-container-low border border-outline-variant aspect-[16/8] overflow-hidden">
          <svg
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#dce9ff" />
                <stop offset="100%" stopColor="#d3e4fe" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e5eeff" />
                <stop offset="100%" stopColor="#cbdbf5" />
              </linearGradient>
            </defs>
            <rect width="800" height="400" fill="url(#waterGrad)" />
            <path
              d="M0,130 Q100,80 220,100 T440,120 T640,100 L640,10 L0,10 Z"
              fill="url(#landGrad)"
              opacity="0.85"
            />
            <path
              d="M80,360 Q200,300 340,320 T600,330 T800,310 L800,400 L0,400 Z"
              fill="url(#landGrad)"
              opacity="0.85"
            />
            <path
              d="M0,190 C80,175 180,210 260,205 C340,200 380,220 440,215 L440,260 C380,255 340,245 260,250 C180,255 80,245 0,250 Z"
              fill="url(#waterGrad)"
              opacity="0.6"
            />
          </svg>

          {!statsReady ? (
            <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : (
            <>
              {kumbaraPins.map((pin) => (
                <div
                  key={`k-${pin.label}-${pin.left}`}
                  className="absolute"
                  style={{ left: pin.left, top: pin.top }}
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-secondary/50 animate-ping" />
                    <span className="relative block w-3.5 h-3.5 rounded-full bg-secondary border-2 border-white shadow-[0_2px_4px_rgba(0,24,53,0.25)]" />
                  </div>
                  <span className="mt-1 block text-[10.5px] font-bold text-primary-container whitespace-nowrap bg-white/80 backdrop-blur rounded px-1.5 py-0.5">
                    {pin.label}
                  </span>
                </div>
              ))}
              {stantPins.map((pin, i) => (
                <div
                  key={`s-${pin.label}-${pin.left}`}
                  className="absolute"
                  style={{ left: pin.left, top: pin.top }}
                >
                  <div className="relative">
                    {i === 0 && (
                      <span className="absolute inset-0 rounded-full bg-primary-container/40 animate-ping" />
                    )}
                    <span className="relative block w-3.5 h-3.5 rounded-full bg-primary-container border-2 border-white" />
                  </div>
                  <span className="mt-1 block text-[10.5px] font-bold text-primary-container whitespace-nowrap bg-white/80 backdrop-blur rounded px-1.5 py-0.5">
                    {pin.label}
                  </span>
                </div>
              ))}
              {kumbaraPins.length === 0 && stantPins.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[12.5px] text-on-surface-variant">
                  Kayıtlı aktif lokasyon yok.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Kumbaralar */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <h3 className="text-[20px] font-semibold text-primary-container tracking-[-0.01em] inline-flex items-center gap-2">
            <QrCode size={18} className="text-secondary" />
            Kumbaralar · {activeKumbara.length} adet
          </h3>
          <p className="text-[13px] text-on-surface-variant">
            Toplam:{" "}
            <span className="font-bold text-primary-container">
              ₺{formatTRY(kumbaraTotal)}
            </span>
          </p>
        </div>
        {!statsReady ? (
          <KumbaraGridSkeleton count={3} />
        ) : activeKumbara.length === 0 ? (
          <EmptyState message="Aktif kumbara kaydı yok." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeKumbara.map((k) => (
              <div
                key={k.id}
                className="rounded-2xl border border-outline-variant bg-white p-5 hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Kumbara {k.id}
                    </span>
                    <h4 className="mt-1 text-[15.5px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-1.5">
                      <MapPin size={14} className="text-secondary" />
                      {k.location || "Konum belirtilmedi"}
                    </h4>
                  </div>
                  <div className="w-14 h-14 shrink-0 rounded-lg bg-white border border-outline-variant p-1.5">
                    <svg
                      viewBox="0 0 40 40"
                      aria-hidden
                      className="w-full h-full text-primary-container"
                    >
                      <rect x="2" y="2" width="10" height="10" fill="currentColor" />
                      <rect x="28" y="2" width="10" height="10" fill="currentColor" />
                      <rect x="2" y="28" width="10" height="10" fill="currentColor" />
                      <rect x="16" y="16" width="4" height="4" fill="currentColor" />
                      <rect x="22" y="16" width="4" height="4" fill="currentColor" />
                      <rect x="16" y="22" width="4" height="4" fill="currentColor" />
                      <rect x="28" y="22" width="4" height="4" fill="currentColor" />
                      <rect x="22" y="28" width="4" height="4" fill="currentColor" />
                      <rect x="28" y="28" width="4" height="4" fill="currentColor" />
                      <rect x="34" y="28" width="4" height="4" fill="currentColor" />
                    </svg>
                  </div>
                </div>
                <dl className="space-y-1.5 text-[12.5px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-on-surface-variant flex items-center gap-1.5">
                      <User size={12} /> Sorumlu
                    </dt>
                    <dd className="font-semibold text-primary-container">
                      {k.responsible || "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-on-surface-variant flex items-center gap-1.5">
                      <Clock size={12} /> Son Açılış
                    </dt>
                    <dd className="font-semibold text-primary-container">
                      {k.lastOpened || "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-outline-variant">
                    <dt className="text-on-surface-variant">Toplanan</dt>
                    <dd className="text-[17px] font-bold text-secondary tabular-nums">
                      ₺{formatTRY(k.total)}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() =>
                    handleDemoAction(
                      `Kumbara ${k.id} açılış tutanağı önizlemesi yakında eklenecek.`,
                    )
                  }
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:border-secondary hover:text-secondary text-[12.5px] font-semibold py-2 transition-all"
                >
                  <FileText size={13} />
                  Açılış Tutanağı
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stantlar */}
      <section>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <h3 className="text-[20px] font-semibold text-primary-container tracking-[-0.01em] inline-flex items-center gap-2">
            <Store size={18} className="text-secondary" />
            Stantlar · {activeStant.length} adet
          </h3>
          <p className="text-[13px] text-on-surface-variant">
            Toplam:{" "}
            <span className="font-bold text-primary-container">
              ₺{formatTRY(stantTotal)}
            </span>
          </p>
        </div>
        {!statsReady ? (
          <KumbaraGridSkeleton count={3} />
        ) : activeStant.length === 0 ? (
          <EmptyState message="Aktif stant kaydı yok." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeStant.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-outline-variant bg-white p-5 hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Stant {s.id}
                    </span>
                    <h4 className="mt-1 text-[15.5px] font-semibold text-primary-container tracking-[-0.01em] flex items-center gap-1.5">
                      <MapPin size={14} className="text-secondary" />
                      {s.location || "Konum belirtilmedi"}
                    </h4>
                  </div>
                </div>
                <dl className="space-y-1.5 text-[12.5px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-on-surface-variant flex items-center gap-1.5">
                      <User size={12} /> Sorumlu
                    </dt>
                    <dd className="font-semibold text-primary-container">
                      {s.responsible || "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-on-surface-variant flex items-center gap-1.5">
                      <Clock size={12} /> Son Kapanış
                    </dt>
                    <dd className="font-semibold text-primary-container">
                      {s.lastClose || "—"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-outline-variant">
                    <dt className="text-on-surface-variant">Toplanan</dt>
                    <dd className="text-[17px] font-bold text-secondary tabular-nums">
                      ₺{formatTRY(s.total)}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() =>
                    handleDemoAction(
                      `Stant ${s.id} kapanış raporu önizlemesi yakında eklenecek.`,
                    )
                  }
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:border-secondary hover:text-secondary text-[12.5px] font-semibold py-2 transition-all"
                >
                  <Camera size={13} />
                  Kapanış Raporu
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function KumbaraGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-outline-variant bg-white p-5 animate-pulse"
        >
          <div className="h-3 w-20 rounded bg-surface-container" />
          <div className="mt-2 h-5 w-40 rounded bg-surface-container" />
          <div className="mt-5 space-y-2">
            <div className="h-3 w-full rounded bg-surface-container" />
            <div className="h-3 w-2/3 rounded bg-surface-container" />
          </div>
          <div className="mt-5 h-9 w-full rounded bg-surface-container" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant bg-white px-6 py-10 text-center text-[13.5px] text-on-surface-variant">
      {message}
    </div>
  );
}
