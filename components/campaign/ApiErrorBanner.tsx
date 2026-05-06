"use client";

import { AlertTriangle } from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";

/**
 * Public campaign page için API hata banner'ı.
 * Sayfa kamuya açık olduğu için anlamsız teknik detayları açıklamaz —
 * sadece "geçici sorun" mesajı verir.
 */
export function ApiErrorBanner() {
  const { apiError, statsReady } = useCampaign();
  if (!statsReady || !apiError) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2.5 flex items-start gap-2 text-[12.5px] text-amber-900">
        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
        <p>
          <span className="font-semibold">Veriler yüklenemedi.</span> Veriler
          birkaç saniye sonra otomatik yenilenecek. Sorun devam ederse lütfen
          sayfayı yenileyin.
        </p>
      </div>
    </div>
  );
}
