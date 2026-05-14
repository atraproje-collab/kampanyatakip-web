"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock,
  Eye,
  Languages,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  Power,
  Sparkles,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  StatCard,
  inputClass,
} from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

// ── API ─────────────────────────────────────────────────────────────────────

const API_BASE =
  "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya/demo-defne";

const NO_CACHE = {
  Accept: "application/json",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
} as const;

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}?t=${Date.now()}`, {
    cache: "no-store",
    headers: NO_CACHE,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    cache: "no-store",
    headers: { ...NO_CACHE, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

// ── Tipler ──────────────────────────────────────────────────────────────────

interface SikSoru {
  soru_orjinal: string;
  kullanim_sayisi: number;
}

interface SonKonusma {
  session_id: string;
  soru: string;
  olusturma_tarihi: string;
  kanal: string;
  source: string;
}

interface AsistanStats {
  stats: {
    bugun_yanitlanan: number;
    ortalama_yanit_sn: number;
    basari_orani: number;
    aktif_diller: number;
  };
  sik_sorular: SikSoru[];
  son_konusmalar: SonKonusma[];
}

interface AsistanAyarlari {
  diller: string[]; // ["tr","en",...]
  ton: string; // "samimi" | "resmi" | "kisa"
  otomatik_yanit: boolean;
  debounce_saniye: number;
  aktif: boolean;
}

interface YanitSablonu {
  id: number | string;
  tetikleyici: string;
  cevap: string;
  aktif: boolean;
  kullanim_sayisi: number;
}

// ── Sabitler ────────────────────────────────────────────────────────────────

type LangCode = "tr" | "en" | "ar" | "de" | "fr";
const LANGS: { code: LangCode; label: string; flag: string; display: string }[] = [
  { code: "tr", label: "Türkçe", flag: "🇹🇷", display: "TR" },
  { code: "en", label: "English", flag: "🇬🇧", display: "EN" },
  { code: "ar", label: "العربية", flag: "🇸🇦", display: "AR" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", display: "DE" },
  { code: "fr", label: "Français", flag: "🇫🇷", display: "FR" },
];

const TONES: { value: string; label: string }[] = [
  { value: "resmi", label: "Resmi" },
  { value: "samimi", label: "Samimi" },
  { value: "kisa", label: "Kısa" },
];

const AUTO_SOURCES = new Set(["havuz", "openai", "sablon"]);

// ── Helper'lar ──────────────────────────────────────────────────────────────

function unwrapStats(raw: unknown): AsistanStats | null {
  const obj = Array.isArray(raw) ? raw[0] : raw;
  if (!obj || typeof obj !== "object") return null;
  const r = obj as Record<string, unknown>;
  if (!r.success && r.success !== undefined && r.success !== null && r.success !== true)
    return null;
  return {
    stats: {
      bugun_yanitlanan: Number((r.stats as Record<string, unknown>)?.bugun_yanitlanan ?? 0) || 0,
      ortalama_yanit_sn: Number((r.stats as Record<string, unknown>)?.ortalama_yanit_sn ?? 0) || 0,
      basari_orani: Number((r.stats as Record<string, unknown>)?.basari_orani ?? 0) || 0,
      aktif_diller: Number((r.stats as Record<string, unknown>)?.aktif_diller ?? 0) || 0,
    },
    sik_sorular: Array.isArray(r.sik_sorular) ? (r.sik_sorular as SikSoru[]) : [],
    son_konusmalar: Array.isArray(r.son_konusmalar)
      ? (r.son_konusmalar as SonKonusma[])
      : [],
  };
}

function unwrapAyarlar(raw: unknown): AsistanAyarlari | null {
  const obj = Array.isArray(raw) ? raw[0] : raw;
  if (!obj || typeof obj !== "object") return null;
  const r = obj as Record<string, unknown>;
  const data = (r.data ?? r) as Record<string, unknown>;
  if (!data) return null;
  const dillerRaw = data.diller;
  const diller = Array.isArray(dillerRaw)
    ? dillerRaw.map((d) => String(d).toLowerCase())
    : [];
  return {
    diller,
    ton: String(data.ton ?? "samimi").toLowerCase(),
    otomatik_yanit: Boolean(data.otomatik_yanit),
    debounce_saniye: Number(data.debounce_saniye ?? 5) || 5,
    aktif: Boolean(data.aktif),
  };
}

function unwrapSablonlar(raw: unknown): YanitSablonu[] {
  const obj = Array.isArray(raw) ? raw[0] : raw;
  if (!obj || typeof obj !== "object") return [];
  const r = obj as Record<string, unknown>;
  const list = Array.isArray(r.data) ? r.data : Array.isArray(r) ? r : [];
  return (list as Record<string, unknown>[]).map((s) => ({
    id: (s.id as number | string) ?? "",
    tetikleyici: String(s.tetikleyici ?? "").trim(),
    cevap: String(s.cevap ?? "").trim(),
    aktif: Boolean(s.aktif ?? true),
    kullanim_sayisi: Number(s.kullanim_sayisi ?? 0) || 0,
  }));
}

function relativeTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (diffSec < 60) return "az önce";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} dakika önce`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} saat önce`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} gün önce`;
}

function trim60(s: string): string {
  if (s.length <= 60) return s;
  return `${s.slice(0, 60)}…`;
}

function formatTrigger(t: string): string {
  // virgülle ayrılmış olanları / ile göster
  return t
    .split(/\s*,\s*/)
    .filter(Boolean)
    .join(" / ")
    .trim() || t;
}

function kanalChip(kanal: string): string {
  const k = (kanal || "").toLowerCase();
  if (k.includes("youtube")) return "bg-red-50 text-red-700 border-red-200";
  if (k.includes("instagram")) return "bg-pink-50 text-pink-700 border-pink-200";
  if (k.includes("facebook")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (k.includes("tiktok")) return "bg-slate-100 text-slate-800 border-slate-300";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

// ── Page ────────────────────────────────────────────────────────────────────

type ToastTone = "success" | "error" | "info";
type Toast = { tone: ToastTone; text: string } | null;

export default function AIAssistantPage() {
  const [statsData, setStatsData] = useState<AsistanStats | null>(null);
  const [sablonlar, setSablonlar] = useState<YanitSablonu[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);

  // Form state — ayarlardan türetilir
  const [diller, setDiller] = useState<Set<string>>(new Set());
  const [ton, setTon] = useState<string>("samimi");
  const [otomatikYanit, setOtomatikYanit] = useState(true);
  const [debounceSn, setDebounceSn] = useState(5);
  const [aktif, setAktif] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [togglingActive, setTogglingActive] = useState(false);

  // Şablon modal
  const [openTpl, setOpenTpl] = useState<YanitSablonu | "new" | null>(null);
  const [tplTrigger, setTplTrigger] = useState("");
  const [tplResponse, setTplResponse] = useState("");
  const [tplActive, setTplActive] = useState(true);
  const [savingTpl, setSavingTpl] = useState(false);

  // Konuşma modal
  const [openConv, setOpenConv] = useState<SonKonusma | null>(null);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (tone: ToastTone, text: string) => {
    setToast({ tone, text });
    window.setTimeout(() => setToast(null), 3000);
  };

  // ── Initial load + parallel fetch ─────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const [statsRaw, ayarlarRaw, sablonlarRaw] = await Promise.all([
          apiGet<unknown>("/ai-asistan-stats").catch(() => null),
          apiGet<unknown>("/ai-asistan-ayarlar").catch(() => null),
          apiGet<unknown>("/ai-sablonlar").catch(() => null),
        ]);
        if (!mounted) return;

        const stats = unwrapStats(statsRaw);
        const ayar = unwrapAyarlar(ayarlarRaw);
        const tpls = unwrapSablonlar(sablonlarRaw);

        setStatsData(stats);
        if (ayar) {
          setDiller(new Set(ayar.diller));
          setTon(ayar.ton);
          setOtomatikYanit(ayar.otomatik_yanit);
          setDebounceSn(ayar.debounce_saniye);
          setAktif(ayar.aktif);
        }
        setSablonlar(tpls);

        if (!stats && !ayar && tpls.length === 0) {
          setApiError("Hiçbir endpoint cevap vermedi.");
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
        setApiError(msg);
        console.error("AI asistan API hatası:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  // ── Şablon listesi tek başına yenile (CRUD sonrası) ───────────────────────
  const reloadTemplates = async () => {
    try {
      const raw = await apiGet<unknown>("/ai-sablonlar");
      setSablonlar(unwrapSablonlar(raw));
    } catch (err) {
      console.error("Şablon yükleme hatası:", err);
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  const toggleLang = (code: string) => {
    setDiller((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const handleSaveSettings = async () => {
    if (diller.size === 0) {
      showToast("error", "En az bir dil seçilmelidir.");
      return;
    }
    setSavingSettings(true);
    try {
      await apiPost("/ai-asistan-ayarlar-guncelle", {
        diller: Array.from(diller),
        ton,
        otomatik_yanit: otomatikYanit,
        debounce_saniye: Number(debounceSn) || 5,
      });
      showToast("success", "Ayarlar kaydedildi");
    } catch (err) {
      console.error(err);
      showToast("error", "Ayarlar kaydedilemedi");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleToggleActive = async () => {
    setTogglingActive(true);
    try {
      const res = await apiPost<{ success?: boolean; aktif?: boolean }>(
        "/ai-asistan-toggle",
        {},
      );
      const next = typeof res?.aktif === "boolean" ? res.aktif : !aktif;
      setAktif(next);
      showToast("success", next ? "Asistan aktif" : "Asistan pasif");
    } catch (err) {
      console.error(err);
      showToast("error", "Asistan durumu değiştirilemedi");
    } finally {
      setTogglingActive(false);
    }
  };

  // ── Şablon CRUD ───────────────────────────────────────────────────────────
  const openNewTemplate = () => {
    setTplTrigger("");
    setTplResponse("");
    setTplActive(true);
    setOpenTpl("new");
  };

  const openEditTemplate = (t: YanitSablonu) => {
    setTplTrigger(t.tetikleyici);
    setTplResponse(t.cevap);
    setTplActive(t.aktif);
    setOpenTpl(t);
  };

  const handleSaveTemplate = async () => {
    if (!tplTrigger.trim() || !tplResponse.trim()) return;
    setSavingTpl(true);
    try {
      if (openTpl === "new") {
        await apiPost("/ai-sablon-ekle", {
          tetikleyici: tplTrigger.trim(),
          cevap: tplResponse.trim(),
          aktif: tplActive,
        });
        showToast("success", "Şablon eklendi");
      } else if (openTpl) {
        await apiPost("/ai-sablon-guncelle", {
          id: openTpl.id,
          tetikleyici: tplTrigger.trim(),
          cevap: tplResponse.trim(),
          aktif: tplActive,
        });
        showToast("success", "Şablon güncellendi");
      }
      setOpenTpl(null);
      await reloadTemplates();
    } catch (err) {
      console.error(err);
      showToast("error", "Şablon kaydedilemedi");
    } finally {
      setSavingTpl(false);
    }
  };

  const handleDeleteTemplate = async (id: number | string) => {
    if (!window.confirm("Şablon silinsin mi?")) return;
    try {
      await apiPost("/ai-sablon-sil", { id });
      // Optimistic update + tam yeniden yükleme
      setSablonlar((prev) => prev.filter((t) => t.id !== id));
      showToast("success", "Şablon silindi");
      await reloadTemplates();
    } catch (err) {
      console.error(err);
      showToast("error", "Şablon silinemedi");
    }
  };

  // ── Türetilmiş ────────────────────────────────────────────────────────────
  const sikSorular = useMemo(
    () => statsData?.sik_sorular ?? [],
    [statsData],
  );
  const maxFaq = useMemo(
    () => Math.max(1, ...sikSorular.map((f) => f.kullanim_sayisi)),
    [sikSorular],
  );
  const sonKonusmalar = useMemo(
    () => (statsData?.son_konusmalar ?? []).slice(0, 5),
    [statsData],
  );
  const isAuto = (source: string) => AUTO_SOURCES.has((source || "").toLowerCase());

  return (
    <AdminLayout
      title="AI Asistan"
      subtitle="Otomatik yanıt motoru — gelen mesajlara hazır yanıtlar verir, manuel ekibi sadece özel durumlara odaklar"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={handleSaveSettings}
          disabled={savingSettings || loading}
        >
          {savingSettings ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Ayarları Kaydet
        </Button>
      }
    >
      {/* API hata banner'ı */}
      {apiError && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 flex items-start gap-2 text-body-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">API&apos;ye ulaşılamadı.</p>
            <p className="text-amber-800/85 break-all">{apiError}</p>
          </div>
        </div>
      )}

      {/* Status hero */}
      <div
        className={cn(
          "rounded-xl p-5 mb-6 border bg-gradient-to-br text-white shadow-[0_10px_30px_rgba(0,24,53,0.15)]",
          aktif
            ? "from-secondary to-on-secondary-container border-secondary/40"
            : "from-rose-500 to-rose-700 border-rose-500/40",
        )}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-h3 font-bold">Asistan Durumu</h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-semibold",
                    aktif ? "bg-emerald-500 text-white" : "bg-white/30 text-white",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      aktif ? "bg-white animate-pulse" : "bg-white/60",
                    )}
                  />
                  {aktif ? "AKTİF" : "PASİF"}
                </span>
              </div>
              <p className="text-body-sm text-white/85 mt-0.5">
                {aktif
                  ? "Gelen mesajlara saniyeler içinde yanıt veriyor."
                  : "Asistan şu an cevap vermiyor — mesajlar manuel ekibe düşüyor."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={togglingActive || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur text-label-md font-semibold transition border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {togglingActive ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {aktif ? "Asistanı Durdur" : "Asistanı Başlat"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Bugün Yanıtlanan"
          value={(statsData?.stats.bugun_yanitlanan ?? 0).toLocaleString("tr-TR")}
          hint="Mesaj sayısı"
          icon={<MessageCircle className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Ortalama Yanıt"
          value={`${statsData?.stats.ortalama_yanit_sn ?? 0} sn`}
          hint="Mesaj alımından sonra"
          icon={<Timer className="w-5 h-5" />}
          accent="secondary"
        />
        <StatCard
          label="Başarı Oranı"
          value={`%${statsData?.stats.basari_orani ?? 0}`}
          hint="Otomatik çözülen sorular"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Aktif Diller"
          value={statsData?.stats.aktif_diller ?? diller.size}
          hint={Array.from(diller).map((d) => d.toUpperCase()).join(" · ") || "—"}
          icon={<Languages className="w-5 h-5" />}
          accent="warning"
        />
      </div>

      {/* Settings + FAQ */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Asistan Ayarları"
          description="Dil, ton ve davranış"
          className="lg:col-span-2"
        >
          <div className="px-5 py-4 space-y-5">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">
                Asistan Dili (çoklu seçim)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {LANGS.map((l) => {
                  const checked = diller.has(l.code);
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => toggleLang(l.code)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-3 py-3 rounded-lg border text-label-md font-medium transition",
                        checked
                          ? "border-secondary bg-secondary-container/40 text-on-secondary-container"
                          : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                      )}
                    >
                      <span className="text-xl leading-none">{l.flag}</span>
                      <span className="text-label-sm">{l.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">
                Yanıt Tonu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTon(t.value)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg border text-label-md font-medium transition",
                      ton === t.value
                        ? "border-secondary bg-secondary-container/40 text-on-secondary-container"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low">
                <div>
                  <p className="text-label-md font-semibold text-on-surface">
                    Otomatik Yanıt
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    Mesaj geldiğinde otomatik cevap ver.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOtomatikYanit((v) => !v)}
                  role="switch"
                  aria-checked={otomatikYanit}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    otomatikYanit ? "bg-secondary" : "bg-surface-container-high",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                      otomatikYanit && "translate-x-5",
                    )}
                  />
                </button>
              </div>
              <FormField
                label="Debounce Süresi"
                hint="Mesaj geldikten sonra yanıt vermeden önce beklenen süre."
              >
                <input
                  type="number"
                  min={0}
                  max={300}
                  className={cn(inputClass, "tabular-nums")}
                  value={debounceSn}
                  onChange={(e) => setDebounceSn(Number(e.target.value) || 0)}
                />
              </FormField>
            </div>
          </div>
        </PanelCard>

        <PanelCard
          title="Sık Sorulan Sorular"
          description={
            sikSorular.length > 0
              ? `En çok sorulan ${Math.min(5, sikSorular.length)} soru`
              : "Henüz veri yok"
          }
        >
          {loading ? (
            <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
              <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
              Yükleniyor…
            </div>
          ) : sikSorular.length === 0 ? (
            <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
              Henüz sık sorulan soru bulunmuyor.
            </div>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {sikSorular.slice(0, 5).map((f, i) => {
                const pct = (f.kullanim_sayisi / maxFaq) * 100;
                return (
                  <li key={i} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <p className="text-label-md font-medium text-on-surface truncate">
                        {trim60(f.soru_orjinal)}
                      </p>
                      <span className="text-label-md font-bold text-on-surface tabular-nums shrink-0">
                        {f.kullanim_sayisi}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-secondary-container"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </PanelCard>
      </div>

      {/* Recent conversations */}
      <PanelCard
        title="Son Konuşmalar"
        description={`Son ${sonKonusmalar.length} otomatik/manuel yanıt`}
        className="mt-6"
      >
        {loading ? (
          <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
            <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
            Yükleniyor…
          </div>
        ) : sonKonusmalar.length === 0 ? (
          <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
            Henüz konuşma bulunmuyor.
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {sonKonusmalar.map((c) => {
              const auto = isAuto(c.source);
              return (
                <li
                  key={c.session_id}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-surface-container-low transition"
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      auto
                        ? "bg-secondary-container/40 text-secondary"
                        : "bg-primary-fixed text-primary",
                    )}
                  >
                    {auto ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-label-md font-semibold text-on-surface truncate">
                        {trim60(c.soru)}
                      </p>
                      <span className="text-label-sm text-on-surface-variant shrink-0 tabular-nums">
                        {relativeTime(c.olusturma_tarihi)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-md text-label-sm font-medium border",
                            kanalChip(c.kanal),
                          )}
                        >
                          {c.kanal || "Web"}
                        </span>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-medium border",
                            auto
                              ? "bg-secondary-container/40 text-on-secondary-container border-secondary/30"
                              : "bg-primary-fixed text-primary border-primary-fixed-dim/40",
                          )}
                        >
                          {auto ? (
                            <>
                              <Sparkles className="w-3 h-3" /> Otomatik
                            </>
                          ) : (
                            <>Manuel</>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOpenConv(c)}
                        className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Detay
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PanelCard>

      {/* Templates */}
      <PanelCard
        title="Yanıt Şablonları"
        description={
          loading
            ? "Yükleniyor…"
            : `${sablonlar.length} şablon — asistanın kullanacağı hazır cevaplar`
        }
        actions={
          <Button variant="primary" size="sm" onClick={openNewTemplate}>
            <Plus className="w-3.5 h-3.5" />
            Yeni Şablon
          </Button>
        }
        className="mt-6"
      >
        {loading ? (
          <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
            <Loader2 className="w-4 h-4 animate-spin inline-block mr-2 align-middle" />
            Şablonlar yükleniyor…
          </div>
        ) : sablonlar.length === 0 ? (
          <div className="px-5 py-8 text-center text-on-surface-variant text-body-sm">
            Henüz şablon eklenmemiş.
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {sablonlar.map((t) => (
              <li key={t.id} className="px-5 py-3 flex items-start gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    t.aktif
                      ? "bg-secondary-container/40 text-secondary"
                      : "bg-surface-container text-on-surface-variant",
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-label-md font-semibold text-on-surface flex items-center gap-2 flex-wrap">
                    Tetikleyici:{" "}
                    <span className="text-on-surface-variant font-mono text-label-sm">
                      {formatTrigger(t.tetikleyici)}
                    </span>
                    {!t.aktif && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-label-sm font-medium bg-surface-container text-on-surface-variant border border-outline-variant">
                        Pasif
                      </span>
                    )}
                    {t.kullanim_sayisi > 0 && (
                      <span className="text-label-sm text-on-surface-variant tabular-nums">
                        · {t.kullanim_sayisi.toLocaleString("tr-TR")} kullanım
                      </span>
                    )}
                  </p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                    → {t.cevap}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditTemplate(t)}
                    className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    aria-label="Düzenle"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(t.id)}
                    className="p-1.5 rounded-md text-on-surface-variant hover:bg-error-container hover:text-error"
                    aria-label="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>

      {/* Template modal */}
      <Modal
        open={openTpl !== null}
        onClose={() => (savingTpl ? null : setOpenTpl(null))}
        title={openTpl === "new" ? "Yeni Şablon" : "Şablonu Düzenle"}
        description="Tetikleyici kelimeleri eşleştiğinde asistan bu yanıtı kullanır."
        size="lg"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenTpl(null)}
              disabled={savingTpl}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveTemplate}
              disabled={
                savingTpl || !tplTrigger.trim() || !tplResponse.trim()
              }
            >
              {savingTpl && <Loader2 className="w-4 h-4 animate-spin" />}
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Tetikleyici Anahtar Kelimeler"
            required
            hint="Slash veya virgülle ayırarak yazın. Örn: 'IBAN / hesap / havale'"
          >
            <input
              className={inputClass}
              value={tplTrigger}
              onChange={(e) => setTplTrigger(e.target.value)}
              placeholder="kelime1 / kelime2 / kelime3"
            />
          </FormField>
          <FormField label="Yanıt Metni" required>
            <textarea
              rows={6}
              className={inputClass}
              value={tplResponse}
              onChange={(e) => setTplResponse(e.target.value)}
              placeholder="Bu kelimeler geçtiğinde asistanın vereceği yanıt…"
            />
          </FormField>
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low">
            <div>
              <p className="text-label-md font-semibold text-on-surface">Aktif</p>
              <p className="text-label-sm text-on-surface-variant">
                Pasif şablonlar tetikleyici eşleşse bile kullanılmaz.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setTplActive((v) => !v)}
              role="switch"
              aria-checked={tplActive}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors shrink-0",
                tplActive ? "bg-secondary" : "bg-surface-container-high",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  tplActive && "translate-x-5",
                )}
              />
            </button>
          </div>
        </div>
      </Modal>

      {/* Conversation detail */}
      <Modal
        open={openConv !== null}
        onClose={() => setOpenConv(null)}
        title={openConv ? `${openConv.kanal || "Web"} • #${openConv.session_id.slice(0, 14)}…` : ""}
        description={openConv ? relativeTime(openConv.olusturma_tarihi) : ""}
        size="lg"
      >
        {openConv && (
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-container-low border border-outline-variant p-4 space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 text-label-sm font-bold">
                  ?
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm px-3 py-2 text-body-sm text-on-surface whitespace-pre-line">
                  {openConv.soru}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-label-sm flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md font-medium border",
                    kanalChip(openConv.kanal),
                  )}
                >
                  {openConv.kanal || "Web"}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border",
                    isAuto(openConv.source)
                      ? "bg-secondary-container/40 text-on-secondary-container border-secondary/30"
                      : "bg-primary-fixed text-primary border-primary-fixed-dim/40",
                  )}
                >
                  {isAuto(openConv.source) ? (
                    <>
                      <Sparkles className="w-3 h-3" />{" "}
                      Otomatik · {openConv.source}
                    </>
                  ) : (
                    <>Manuel · {openConv.source || "—"}</>
                  )}
                </span>
              </div>
              <span className="text-on-surface-variant inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />{" "}
                {relativeTime(openConv.olusturma_tarihi)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] inline-flex items-center gap-2 rounded-xl px-4 py-3 text-label-md font-semibold shadow-[0_8px_24px_rgba(0,24,53,0.25)] border",
            toast.tone === "success" &&
              "bg-emerald-600 text-white border-emerald-700",
            toast.tone === "error" && "bg-rose-600 text-white border-rose-700",
            toast.tone === "info" && "bg-primary text-on-primary border-primary",
          )}
        >
          {toast.tone === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : toast.tone === "error" ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {toast.text}
        </div>
      )}

    </AdminLayout>
  );
}
