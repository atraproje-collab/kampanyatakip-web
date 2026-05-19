"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import {
  MODULE_LABELS,
  parseModuleConfig,
  type ModuleKey,
} from "@/lib/master-admin";

/** Standart modüller — DB'deki değerden bağımsız olarak her zaman aktif. */
const STANDART_MODULLER: ReadonlySet<ModuleKey> = new Set<ModuleKey>([
  "bagis_takibi",
  "kumbara",
  "stant",
  "gonullu",
  "tiktok_gelir",
  "gelir_gider",
  "galeri",
  "raporlama",
  "canva",
  "reklam_performansi",
]);

interface ModuleActiveGateProps {
  slug: string;
  moduleKey: ModuleKey;
  children: ReactNode;
  /** Failsafe: API hata verirse içeriği göster (varsayılan: true). */
  allowOnError?: boolean;
}

type State =
  | { status: "loading" }
  | { status: "enabled" }
  | { status: "disabled" }
  | { status: "error" };

/**
 * /api/master/moduller?slug=<slug> çekip ilgili `moduleKey` boolean'ını
 * kontrol eder. False ise "modül paketinizde aktif değil" sayfası gösterir.
 * Parser hem `stant` hem `modul_stant` field naming'lerini destekler
 * (parseModuleConfig içinde).
 */
export function ModuleActiveGate({
  slug,
  moduleKey,
  children,
  allowOnError = true,
}: ModuleActiveGateProps) {
  // Standart modüller her zaman aktif — DB'ye bakmadan geç
  const isStandard = STANDART_MODULLER.has(moduleKey);

  const [state, setState] = useState<State>(
    isStandard ? { status: "enabled" } : { status: "loading" },
  );

  useEffect(() => {
    // Standart modüller için API çağrısı yapma
    if (isStandard) return;

    let mounted = true;

    const check = async () => {
      try {
        const res = await fetch(
          `/api/master/moduller?slug=${slug}&_=${Date.now()}`,
          { cache: "no-store" },
        );
        if (!mounted) return;
        if (!res.ok) {
          setState({ status: "error" });
          return;
        }
        const data: unknown = await res.json();
        const config = parseModuleConfig(data);
        setState({
          status: config[moduleKey] ? "enabled" : "disabled",
        });
      } catch {
        if (mounted) setState({ status: "error" });
      }
    };

    // İlk kontrol
    check();

    // 30 saniyede bir yeniden kontrol
    const interval = setInterval(check, 30_000);

    // Tab'a geri dönüldüğünde anında kontrol
    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [slug, moduleKey, isStandard]);

  if (state.status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-surface px-4 text-center">
        <div className="flex items-center gap-2 text-on-surface-variant text-body-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Modül erişimi kontrol ediliyor…
        </div>
      </div>
    );
  }

  if (state.status === "disabled") {
    return <ModuleDisabledScreen moduleKey={moduleKey} />;
  }

  // "enabled" veya "error" (failsafe) → içeriği göster.
  if (state.status === "error" && !allowOnError) {
    return <ModuleDisabledScreen moduleKey={moduleKey} fromError />;
  }

  return <>{children}</>;
}

function ModuleDisabledScreen({
  moduleKey,
  fromError,
}: {
  moduleKey: ModuleKey;
  fromError?: boolean;
}) {
  const label = MODULE_LABELS[moduleKey] ?? moduleKey;
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-h3 font-semibold text-on-surface tracking-[-0.01em]">
          Bu modül paketinizde aktif değil
        </h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          <strong className="text-on-surface">{label}</strong> modülünü
          kullanmak için master yöneticisinden paketinizi güncellemesini
          isteyin.
        </p>
        {fromError && (
          <p className="mt-3 text-label-sm text-on-surface-variant/75">
            (Modül listesi şu an alınamadı — bilgi denetim için kapalı
            varsayıldı.)
          </p>
        )}
      </div>
    </div>
  );
}
