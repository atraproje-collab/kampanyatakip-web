"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import { fetchMasterCampaigns } from "@/lib/master-admin";

interface CampaignActiveGateProps {
  /** Master admin tarafında tanımlı slug ("demo-defne", "minik-defne" gibi). */
  slug: string;
  children: ReactNode;
  /** Eşleşme bulunamazsa erişime izin ver (varsayılan: true — failsafe). */
  allowOnNotFound?: boolean;
}

type State =
  | { status: "loading" }
  | { status: "active" }
  | { status: "disabled" }
  | { status: "error"; message: string };

/**
 * /api/master/kampanyalar listesini çekip ilgili slug'ın `aktif` alanını
 * kontrol eder. Pasifse "kampanya aktif değil" sayfası gösterir. API hatası
 * durumunda failsafe olarak içeriği gösterir (whitelist yaklaşımı yok).
 */
export function CampaignActiveGate({
  slug,
  children,
  allowOnNotFound = true,
}: CampaignActiveGateProps) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const r = await fetchMasterCampaigns();
      if (!mounted) return;
      if (!r.ok) {
        // API erişilemiyorsa erişimi engelleme — failsafe.
        setState({
          status: "error",
          message: r.error ?? "API'ye bağlanılamadı",
        });
        return;
      }
      const match = r.items.find((c) => c.slug === slug);
      if (!match) {
        setState({ status: allowOnNotFound ? "active" : "disabled" });
        return;
      }
      setState({ status: match.durum === "aktif" ? "active" : "disabled" });
    })();
    return () => {
      mounted = false;
    };
  }, [slug, allowOnNotFound]);

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface px-4 text-center">
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Kampanya durumu kontrol ediliyor…
        </div>
      </div>
    );
  }

  if (state.status === "disabled") {
    return <CampaignDisabledScreen slug={slug} />;
  }

  // "active" veya "error" (failsafe) → içeriği göster.
  return <>{children}</>;
}

function CampaignDisabledScreen({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-h2 font-semibold text-on-surface tracking-[-0.01em]">
          Bu kampanya şu an aktif değil
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Kampanya yöneticisi tarafından geçici olarak duraklatıldı.
          Bilgi için iletişim sayfasını kullanabilirsiniz.
        </p>
        <p className="mt-4 text-label-sm text-on-surface-variant/75 tabular-nums">
          Kampanya kodu: <code className="font-mono">{slug}</code>
        </p>
      </div>
    </div>
  );
}
