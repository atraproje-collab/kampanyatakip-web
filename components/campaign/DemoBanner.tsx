"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Lock } from "lucide-react";

export function DemoBanner() {
  return (
    <div className="sticky top-0 z-[60] w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-amber-950 border-b border-amber-600/30 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[12.5px] md:text-[13px]">
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertTriangle size={16} strokeWidth={2.5} className="shrink-0" />
          <span className="font-semibold leading-tight">
            Bu bir <strong className="font-extrabold">DEMO</strong> kampanya.
            Gerçek bağış alınmaz. Tüm veriler örnektir.
          </span>
        </div>
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Link
            href="/admin/defne/login"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-900/80 hover:text-amber-950 transition-colors underline-offset-2 hover:underline"
            aria-label="Kampanya Yönetim Paneli"
          >
            <Lock size={12} strokeWidth={2.5} />
            Yönetim Paneli
          </Link>
          <span className="hidden sm:inline h-3 w-px bg-amber-900/30" />
          <Link
            href="/basvuru"
            className="inline-flex items-center gap-1 font-bold text-amber-950 hover:text-black transition-colors"
          >
            Kendi Kampanyanızı Kurun
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
