"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  Camera,
  Clock,
  Eye,
  Globe,
  Hash,
  Inbox,
  Loader2,
  MessageSquare,
  Music2,
  PlayCircle,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { ModuleActiveGate } from "@/components/master-admin/ModuleActiveGate";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FormField, Modal, PanelCard, StatCard, inputClass } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

// ── Tipler ──────────────────────────────────────────────────────────────────

interface SosyalMesaj {
  id: number;
  session_id: string;
  yorum: string;
  cevap: string;
  kanal: string;
  kanal_icon: string;
  yazar: string;
  tarih: string;
  cevap_tarihi: string;
  status: string;
  tokens: number;
  model: string;
}

interface SosyalStats {
  toplam_gelen: number;
  otomatik_yanit: number;
  manuel_bekleyen: number;
  otomasyon_orani: number;
  kanal_dagilimi: Record<string, number>;
}

type PlatformKey = "facebook" | "instagram" | "youtube" | "tiktok" | "twitter";

const API_URL = "/api/kampanya/demo-defne/sosyal-yorumlar";

// ── Platform map ────────────────────────────────────────────────────────────

const PLATFORM_ICON: Record<PlatformKey, typeof Globe> = {
  facebook: Globe,
  instagram: Camera,
  youtube: PlayCircle,
  tiktok: Music2,
  twitter: Hash,
};

const PLATFORM_TINT: Record<PlatformKey, string> = {
  facebook: "from-blue-500 to-blue-600",
  instagram: "from-pink-500 to-rose-500",
  youtube: "from-red-500 to-red-600",
  tiktok: "from-slate-800 to-slate-900",
  twitter: "from-sky-500 to-sky-600",
};

const PLATFORM_LABELS: Record<PlatformKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
};

function kanalKey(kanal: string): PlatformKey {
  const k = (kanal || "").toLowerCase().trim();
  if (k.includes("facebook")) return "facebook";
  if (k.includes("instagram")) return "instagram";
  if (k.includes("youtube") || k.startsWith("yt")) return "youtube";
  if (k.includes("tiktok")) return "tiktok";
  if (k.includes("twitter") || k === "x") return "twitter";
  // bilinmeyen → varsayılan facebook ikon/renk
  return "facebook";
}

// ── Status filter seçenekleri ───────────────────────────────────────────────

const STATUS_OPTIONS = [
  "Otomatik Yanıtlandı",
  "Manuel Bekleniyor",
  "Yanıtlandı",
] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

// ── Tarih helper ────────────────────────────────────────────────────────────

function parseIso(date: string): Date | null {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(date: string): string {
  const d = parseIso(date);
  if (!d) return "—";
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date: string): string {
  const d = parseIso(date);
  if (!d) return "";
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function isoYmd(date: string): string {
  const d = parseIso(date);
  if (!d) return "";
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  return (
    <ModuleActiveGate slug="demo-defne" moduleKey="fb_ig_dm">
      <MessagesPageInner />
    </ModuleActiveGate>
  );
}

function MessagesPageInner() {
  const [mesajlar, setMesajlar] = useState<SosyalMesaj[]>([]);
  const [stats, setStats] = useState<SosyalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [platformFilter, setPlatformFilter] = useState<PlatformKey | "all">("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter | "all">("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [open, setOpen] = useState<SosyalMesaj | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}?t=${Date.now()}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: unknown = await res.json();
        // Response array veya obje olabilir
        const responseData = Array.isArray(json)
          ? (json[0] as Record<string, unknown> | undefined)
          : (json as Record<string, unknown> | null);

        const success = Boolean(responseData?.success);
        const data = responseData?.data;
        const apiStats = responseData?.stats;

        if (!mounted) return;

        if (success && Array.isArray(data)) {
          setMesajlar(data as SosyalMesaj[]);
          setStats((apiStats as SosyalStats) ?? null);
          setApiError(null);
        } else {
          throw new Error("Geçersiz API yanıtı");
        }
      } catch (err) {
        if (!mounted) return;
        const msg = err instanceof Error ? err.message : "API bağlantı hatası";
        console.error("Sosyal medya API hatası:", err);
        setApiError(msg);
        // Mock fallback yok — boş liste + banner gösterilecek.
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return mesajlar.filter((m) => {
      if (platformFilter !== "all" && kanalKey(m.kanal) !== platformFilter)
        return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      const ymd = isoYmd(m.tarih);
      if (start && ymd && ymd < start) return false;
      if (end && ymd && ymd > end) return false;
      return true;
    });
  }, [mesajlar, platformFilter, statusFilter, start, end]);

  const manuelBekleyen = useMemo(
    () => mesajlar.filter((m) => m.status === "Manuel Bekleniyor").length,
    [mesajlar],
  );

  return (
    <AdminLayout
      title="Mesajlar"
      subtitle={`${filtered.length} mesaj görüntüleniyor • ${manuelBekleyen} manuel yanıt bekliyor`}
    >
      {/* API hata banner'ı */}
      {apiError && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 px-4 py-3 flex items-start gap-2 text-body-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">API&apos;ye ulaşılamadı — veri yüklenemedi.</p>
            <p className="text-amber-800/85 break-all">{apiError}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Toplam Gelen"
          value={(stats?.toplam_gelen ?? 0).toLocaleString("tr-TR")}
          hint="Bu ay tüm platformlardan"
          icon={<Inbox className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Otomatik Yanıt"
          value={(stats?.otomatik_yanit ?? 0).toLocaleString("tr-TR")}
          hint={`%${stats?.otomasyon_orani ?? 0} otomasyon oranı`}
          icon={<Sparkles className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Manuel Bekleyen"
          value={String(stats?.manuel_bekleyen ?? 0)}
          hint="Saha ekibi yanıt bekliyor"
          icon={<MessageSquare className="w-5 h-5" />}
          accent="warning"
        />
        <StatCard
          label="Ortalama Yanıt"
          value="< 1 dk"
          hint="AI anında cevap veriyor"
          icon={<Clock className="w-5 h-5" />}
          accent="secondary"
        />
      </div>

      {/* Filters */}
      <PanelCard title="Filtreler" className="mt-6 mb-4">
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormField label="Platform">
            <select
              className={inputClass}
              value={platformFilter}
              onChange={(e) =>
                setPlatformFilter(e.target.value as PlatformKey | "all")
              }
            >
              <option value="all">Tümü</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">X / Twitter</option>
            </select>
          </FormField>
          <FormField label="Durum">
            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilter | "all")
              }
            >
              <option value="all">Tümü</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Başlangıç">
            <input
              type="date"
              className={inputClass}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </FormField>
          <FormField label="Bitiş">
            <input
              type="date"
              className={inputClass}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </FormField>
        </div>
      </PanelCard>

      {/* List */}
      <PanelCard
        title={`Mesaj Listesi (${filtered.length})`}
        description="Platformdan bağımsız tek noktadan yönetim"
      >
        {loading ? (
          <div className="px-5 py-12 text-center text-on-surface-variant text-body-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Mesajlar yükleniyor…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-on-surface-variant text-body-sm">
            {mesajlar.length === 0
              ? "Henüz mesaj bulunmuyor."
              : "Bu filtrelere uyan mesaj bulunamadı."}
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {filtered.map((m) => {
              const key = kanalKey(m.kanal);
              const Icon = PLATFORM_ICON[key];
              return (
                <li
                  key={m.id}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-surface-container-low transition cursor-pointer"
                  onClick={() => setOpen(m)}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br text-white shrink-0",
                      PLATFORM_TINT[key],
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-label-md font-semibold text-on-surface truncate">
                        {m.yazar || "İsimsiz"}
                      </p>
                      <span className="text-label-sm text-on-surface-variant tabular-nums shrink-0">
                        {formatDate(m.tarih)} · {formatTime(m.tarih)}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate mt-0.5">
                      {m.yorum.slice(0, 60)}
                      {m.yorum.length > 60 ? "…" : ""}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-label-sm text-on-surface-variant">
                          {m.kanal || PLATFORM_LABELS[key]}
                        </span>
                        <MessageStatusPill status={m.status} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(m);
                        }}
                        className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Görüntüle
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PanelCard>

      {/* Detail modal */}
      <Modal
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open ? `${open.yazar || "İsimsiz"} • ${open.kanal}` : ""}
        description={
          open
            ? `#${open.id} • ${formatDate(open.tarih)} ${formatTime(open.tarih)}`
            : ""
        }
        size="lg"
      >
        {open && (
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3 space-y-3 max-h-96 overflow-y-auto">
              {/* Bağışçı / kullanıcı yorumu (sol) */}
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary text-label-sm font-bold flex items-center justify-center shrink-0">
                  <UserIcon className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm px-3 py-2 text-body-sm bg-surface-container-lowest border border-outline-variant text-on-surface">
                  <div className="flex items-center gap-1.5 mb-0.5 text-label-sm font-semibold opacity-80">
                    {open.yazar || "Bağışçı"}
                    <span className="opacity-60 font-normal ml-1">
                      {formatTime(open.tarih)}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{open.yorum}</p>
                </div>
              </div>

              {/* AI Asistan cevabı (sağ) */}
              {open.cevap && (
                <div className="flex gap-2 justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-sm px-3 py-2 text-body-sm bg-secondary-container/40 border border-secondary/20 text-on-secondary-container">
                    <div className="flex items-center gap-1.5 mb-0.5 text-label-sm font-semibold opacity-80">
                      <Bot className="w-3 h-3" /> AI Asistan
                      <span className="opacity-60 font-normal ml-1">
                        {formatTime(open.cevap_tarihi)}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{open.cevap}</p>
                    {(open.tokens > 0 || open.model) && (
                      <p className="mt-1.5 text-[10.5px] text-on-secondary-container/70 tabular-nums">
                        {open.model ? `${open.model}` : ""}
                        {open.tokens > 0
                          ? `${open.model ? " · " : ""}${open.tokens.toLocaleString("tr-TR")} token`
                          : ""}
                      </p>
                    )}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary text-label-sm font-bold flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <MessageStatusPill status={open.status} />
              <span className="text-label-sm text-on-surface-variant">
                Yanıt AI tarafından otomatik üretildi.
              </span>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

// ── Status pill ─────────────────────────────────────────────────────────────

function MessageStatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; dot: string }> = {
    "Otomatik Yanıtlandı": {
      cls: "bg-secondary-container/40 text-on-secondary-container border-secondary/30",
      dot: "bg-secondary",
    },
    "Manuel Bekleniyor": {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
    },
    Yanıtlandı: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
  };
  const m =
    map[status] ?? {
      cls: "bg-slate-50 text-slate-700 border-slate-200",
      dot: "bg-slate-400",
    };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium",
        m.cls,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {status}
    </span>
  );
}
