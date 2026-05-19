"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MailX,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";
import { ModuleActiveGate } from "@/components/master-admin/ModuleActiveGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, PanelCard, inputClass } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

// ── Tipler ──────────────────────────────────────────────────────────────────

interface Firma {
  ad: string;
  kategori: string;
  telefon: string;
  website: string;
  email: string;
  puan: number | null;
  adres?: string;
}

type Kaynak = "cache" | "apify" | "unknown";

interface AramaSonucu {
  success: boolean;
  kaynak: Kaynak;
  data: Firma[];
  error?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function unwrapList(raw: unknown): { kaynak: Kaynak; data: Firma[]; success: boolean } {
  const obj = Array.isArray(raw) ? raw[0] : raw;
  if (!obj || typeof obj !== "object") {
    return { success: false, kaynak: "unknown", data: [] };
  }
  const r = obj as Record<string, unknown>;
  const list = Array.isArray(r.data)
    ? r.data
    : Array.isArray(r.results)
      ? r.results
      : Array.isArray(r.items)
        ? r.items
        : [];
  const kaynakStr = String(r.kaynak ?? r.source ?? "").toLowerCase();
  const kaynak: Kaynak =
    kaynakStr === "cache" ? "cache" : kaynakStr === "apify" ? "apify" : "unknown";
  const success = r.success === undefined ? list.length > 0 : Boolean(r.success);

  const data = (list as Record<string, unknown>[]).map((row) => ({
    ad: String(row.ad ?? row.name ?? row.title ?? row.unvan ?? "—").trim(),
    kategori: String(row.kategori ?? row.category ?? row.sektor ?? "").trim(),
    telefon: String(row.telefon ?? row.phone ?? row.tel ?? "").trim(),
    website: String(row.website ?? row.web ?? row.url ?? "").trim(),
    email: String(row.email ?? row.eposta ?? row.mail ?? "").trim(),
    puan:
      row.puan !== undefined
        ? Number(row.puan) || null
        : row.rating !== undefined
          ? Number(row.rating) || null
          : null,
    adres: row.adres
      ? String(row.adres).trim()
      : row.address
        ? String(row.address).trim()
        : undefined,
  }));

  return { success, kaynak, data };
}

function normalizeWebsite(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function KurumsalDestekciPage() {
  return (
    <ModuleActiveGate slug="demo-defne" moduleKey="kurumsal_bagis">
      <KurumsalDestekciPageInner />
    </ModuleActiveGate>
  );
}

function KurumsalDestekciPageInner() {
  const [sehir, setSehir] = useState("İstanbul");
  const [ilce, setIlce] = useState("");
  const [sektor, setSektor] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sonuc, setSonuc] = useState<AramaSonucu | null>(null);

  async function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!sehir.trim() || !sektor.trim()) {
      setError("Şehir ve sektör alanları zorunludur.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/kurumsal-ara", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sehir: sehir.trim(),
          ilce: ilce.trim(),
          sektor: sektor.trim(),
          kampanya_slug: "demo-defne",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const raw: unknown = await res.json();
      const parsed = unwrapList(raw);
      setSonuc({
        success: parsed.success,
        kaynak: parsed.kaynak,
        data: parsed.data,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      console.error("Kurumsal arama hatası:", err);
      setError(msg);
      setSonuc(null);
    } finally {
      setLoading(false);
    }
  }

  const hasResults = sonuc && sonuc.data.length > 0;

  return (
    <AdminLayout
      title="Kurumsal Destekçi"
      subtitle="Şehir + ilçe + sektör bazlı kurumsal firma arama"
    >
      {/* Arama formu */}
      <PanelCard
        title="Firma Arama"
        description="Kampanyanıza destek olabilecek kurumsal firmaları aratın"
      >
        <form
          onSubmit={handleSearch}
          className="p-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
        >
          <FormField label="Şehir" required>
            <input
              className={inputClass}
              value={sehir}
              onChange={(e) => setSehir(e.target.value)}
              placeholder="İstanbul"
              autoComplete="address-level1"
              disabled={loading}
            />
          </FormField>
          <FormField label="İlçe" hint="opsiyonel">
            <input
              className={inputClass}
              value={ilce}
              onChange={(e) => setIlce(e.target.value)}
              placeholder="Kadıköy"
              autoComplete="address-level2"
              disabled={loading}
            />
          </FormField>
          <FormField label="Sektör" required>
            <input
              className={inputClass}
              value={sektor}
              onChange={(e) => setSektor(e.target.value)}
              placeholder="Eczane, restoran, tekstil…"
              disabled={loading}
            />
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading || !sehir.trim() || !sektor.trim()}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {loading ? "Aranıyor…" : "Ara"}
          </Button>
        </form>
      </PanelCard>

      {/* Hata banner */}
      {error && (
        <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 px-4 py-3 flex items-start gap-2 text-body-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">Arama yapılamadı.</p>
            <p className="text-rose-800/85 break-all">{error}</p>
          </div>
        </div>
      )}

      {/* Loading ekranı */}
      {loading && (
        <div className="mt-4 rounded-2xl border border-outline-variant bg-white p-10 text-center">
          <Loader2 className="w-8 h-8 animate-spin inline-block text-secondary mb-3" />
          <p className="text-body-md text-on-surface font-medium">
            Firmalar aranıyor…
          </p>
          <p className="text-label-sm text-on-surface-variant mt-1">
            İlk arama Apify üzerinden sürebilir, sonraki aramalar önbellekten
            saniyeler içinde gelir.
          </p>
        </div>
      )}

      {/* Sonuçlar */}
      {!loading && sonuc && (
        <PanelCard
          title={`Bulunan Firmalar (${sonuc.data.length})`}
          description={
            sonuc.data.length === 0
              ? "Bu kriterlere uyan firma bulunamadı."
              : `${sehir}${ilce ? ` · ${ilce}` : ""} · ${sektor}`
          }
          actions={
            sonuc.data.length > 0 ? <KaynakBadge kaynak={sonuc.kaynak} /> : undefined
          }
          className="mt-4"
        >
          {sonuc.data.length === 0 ? (
            <div className="px-5 py-10 text-center text-on-surface-variant text-body-sm">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Bu kriterlere uyan firma bulunamadı. Farklı şehir veya sektör
              deneyin.
            </div>
          ) : (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {hasResults &&
                sonuc.data.map((firma, i) => (
                  <FirmaKart key={`${firma.ad}-${i}`} firma={firma} />
                ))}
            </div>
          )}
        </PanelCard>
      )}

      {/* İlk açılış — empty state */}
      {!loading && !sonuc && !error && (
        <div className="mt-6 rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-h3 font-semibold text-on-surface">
            Arama yapmak için yukarıdaki formu kullanın
          </h3>
          <p className="mt-2 text-body-sm text-on-surface-variant max-w-md mx-auto">
            Şehir + sektör girip{" "}
            <strong className="text-on-surface">Ara</strong> butonuna basın.
            Sonuçlar 7 gün önbellekte tutulur — aynı arama tekrar yapılırsa
            anında gelir.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function KaynakBadge({ kaynak }: { kaynak: Kaynak }) {
  if (kaynak === "cache") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 text-label-sm font-semibold">
        <Clock className="w-3.5 h-3.5" />
        Önbellekten
      </span>
    );
  }
  if (kaynak === "apify") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 text-label-sm font-semibold">
        <RefreshCw className="w-3.5 h-3.5" />
        Yeni Arama
      </span>
    );
  }
  return null;
}

function FirmaKart({ firma }: { firma: Firma }) {
  const hasEmail = Boolean(firma.email);
  const websiteUrl = normalizeWebsite(firma.website);

  return (
    <article className="rounded-xl border border-outline-variant bg-white p-5 flex flex-col hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-label-lg font-semibold text-on-surface leading-tight">
            {firma.ad}
          </h3>
          {firma.kategori && (
            <p className="mt-0.5 text-label-sm text-on-surface-variant truncate">
              {firma.kategori}
            </p>
          )}
        </div>
        {firma.puan !== null && firma.puan > 0 && (
          <span className="shrink-0 inline-flex items-center gap-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 text-label-sm font-semibold tabular-nums">
            <Star className="w-3 h-3" fill="currentColor" />
            {firma.puan.toFixed(1)}
          </span>
        )}
      </div>

      <dl className="space-y-1.5 text-body-sm flex-1">
        {firma.adres && (
          <div className="flex items-start gap-2 text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-on-surface-variant/70" />
            <span className="text-label-sm leading-snug">{firma.adres}</span>
          </div>
        )}
        {firma.telefon && (
          <div className="flex items-center gap-2 text-on-surface">
            <Phone className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
            <a
              href={`tel:${firma.telefon.replace(/\s+/g, "")}`}
              className="font-medium hover:text-secondary truncate"
            >
              {firma.telefon}
            </a>
          </div>
        )}
        {firma.website && (
          <div className="flex items-center gap-2 text-on-surface">
            <Globe className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-secondary truncate flex items-center gap-1"
            >
              {firma.website.replace(/^https?:\/\//, "")}
              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
            </a>
          </div>
        )}
        {hasEmail && (
          <div className="flex items-center gap-2 text-on-surface">
            <Mail className="w-3.5 h-3.5 shrink-0 text-on-surface-variant/70" />
            <span className="font-medium truncate">{firma.email}</span>
          </div>
        )}
      </dl>

      {/* Action */}
      <div className="mt-4 pt-4 border-t border-outline-variant">
        {hasEmail ? (
          <button
            type="button"
            disabled
            title="Otomatik mail gönderimi yakında aktif olacak"
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-label-md font-semibold transition",
              "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            <Mail className="w-4 h-4" />
            Mail Gönder
            <span className="inline-flex items-center gap-1 ml-1 rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-2.5 h-2.5" /> Yakında
            </span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-label-md font-semibold bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
          >
            <MailX className="w-4 h-4" />
            Email Yok
          </button>
        )}
      </div>
    </article>
  );
}
