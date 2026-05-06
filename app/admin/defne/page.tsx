"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  DollarSign,
  PiggyBank,
  PlusCircle,
  Receipt,
  Store,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PanelCard, StatCard, formatCurrency } from "@/components/admin/AdminUI";
import { systemModules } from "@/lib/admin-mock-data";
import { mockExchangeRate, toTRY, toUSD } from "@/lib/exchange-rate";
import { formatDonorName, formatRelativeTime } from "@/lib/donation-format";
import { cn } from "@/lib/utils";

// ── Sabitler ───────────────────────────────────────────────────────────────

const PROXY_BASE = "/api/kampanya/demo-defne";
const RECENT_LIMIT = 10;
const CHART_DAYS = 7;
const WEEKDAY_LABELS = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

// Sistem Durumu — UI'da gösterilecek modüller. Diğerleri (Bildirim Sistemi,
// Banka Mutabakatı) gerçek entegrasyon hazır olunca aktif edilecek.
const VISIBLE_SYSTEM_MODULES = [
  "Bağış Toplama",
  "Kumbara Yönetimi",
  "Stant Yönetimi",
  "Belge Arşivi",
];

// ── Tipler ─────────────────────────────────────────────────────────────────

type Currency = "TRY" | "USD" | "EUR";

type Donation = {
  id: string;
  date: string; // "YYYY-MM-DD" veya "YYYY-MM-DD HH:mm"
  donorName: string;
  source: string;
  amount: number;
  currency: Currency;
};

type DashboardData = {
  todayTry: number;
  totalTry: number;
  totalUsd: number;
  donorCount: number;
  activeKumbara: number;
  activeStant: number;
  recent: Donation[];
  chart: { date: string; label: string; amountTry: number }[];
};

// ── Yardımcılar ────────────────────────────────────────────────────────────

const ymd = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function parseCurrency(raw: unknown): Currency {
  if (typeof raw === "string") {
    const s = raw.trim().toUpperCase();
    if (s === "USD" || s === "EUR" || s === "TRY") return s;
    if (s === "TL") return "TRY";
  }
  return "TRY";
}

function buildSourceLabel(raw: Record<string, unknown>): string {
  const kaynakRaw = String(raw.kaynak ?? raw.source ?? raw.tip ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
  const kumbaraNo = String(raw.kumbara_no ?? raw.kumbaraNo ?? "").trim();
  const stantNo = String(raw.stant_no ?? raw.stantNo ?? "").trim();
  if (kaynakRaw === "kumbara") return kumbaraNo ? `Kumbara ${kumbaraNo}` : "Kumbara";
  if (kaynakRaw === "stant") return stantNo ? `Stant ${stantNo}` : "Stant";
  if (kaynakRaw === "havale" || kaynakRaw === "banka" || kaynakRaw === "banka_havalesi") {
    return "Banka Havalesi";
  }
  if (kaynakRaw === "kart" || kaynakRaw === "kredi_karti" || kaynakRaw === "kredi kartı") {
    return "Kredi Kartı";
  }
  const fallback = String(raw.source ?? raw.kaynak ?? "").trim();
  if (fallback) return fallback.charAt(0).toLocaleUpperCase("tr-TR") + fallback.slice(1);
  return "Diğer";
}

function parseDonation(raw: Record<string, unknown>): Donation | null {
  const id = String(raw.id ?? raw.bagis_id ?? raw.bagisId ?? raw.no ?? "").trim();
  const dateRaw = String(
    raw.tarih ?? raw.date ?? raw.created_at ?? raw.createdAt ?? raw.olusturma ?? "",
  ).trim();
  if (!id || !dateRaw) return null;

  let date = dateRaw;
  const isoMatch = dateRaw.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/);
  if (isoMatch) date = isoMatch[2] ? `${isoMatch[1]} ${isoMatch[2]}` : isoMatch[1];

  const rawName = String(
    raw.bagisci_ad ??
      raw.bagisciAd ??
      raw.bagisci ??
      raw.bagisci_adi ??
      raw.bagisciAdi ??
      raw.donor_name ??
      raw.donorName ??
      raw.isim ??
      "",
  ).trim();

  const amount = Number(raw.tutar ?? raw.amount ?? 0) || 0;
  const currency = parseCurrency(raw.para_birimi ?? raw.currency);
  const source = buildSourceLabel(raw);
  const donorName = formatDonorName(rawName, source);

  return { id, date, donorName, source, amount, currency };
}

function unwrapArray(data: unknown): unknown[] {
  let arr: unknown = data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) arr = obj.data;
    else if (Array.isArray(obj.items)) arr = obj.items;
    else if (Array.isArray(obj.result)) arr = obj.result;
    else if (Array.isArray(obj.rows)) arr = obj.rows;
    else if (Array.isArray(obj.bagislar)) arr = obj.bagislar;
    else if (Array.isArray(obj.kumbaralar)) arr = obj.kumbaralar;
    else if (Array.isArray(obj.stantlar)) arr = obj.stantlar;
  }
  if (!Array.isArray(arr)) arr = [arr];
  return arr as unknown[];
}

async function fetchJson(path: string): Promise<unknown[]> {
  const res = await fetch(`${PROXY_BASE}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${path}`);
  const data = await res.json();
  return unwrapArray(data);
}

function isActive(raw: Record<string, unknown>): boolean {
  const v = String(raw.durum ?? raw.status ?? "aktif").toLocaleLowerCase("tr-TR").trim();
  return !(v === "kapatildi" || v === "kapatıldı" || v === "closed" || v === "pasif");
}

function buildChart(donations: Donation[], today: Date) {
  // Son 7 gün, bugün dahil — eski → yeni
  const days: { date: string; label: string; amountTry: number }[] = [];
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      date: ymd(d),
      label: WEEKDAY_LABELS[d.getDay()],
      amountTry: 0,
    });
  }
  const map = new Map(days.map((d) => [d.date, d]));
  for (const don of donations) {
    const day = don.date.slice(0, 10);
    const bucket = map.get(day);
    if (!bucket) continue;
    bucket.amountTry += toTRY(don.amount, don.currency, mockExchangeRate);
  }
  return days;
}

function buildDashboard(
  donations: Donation[],
  kumbaralar: Record<string, unknown>[],
  stantlar: Record<string, unknown>[],
  now: Date,
): DashboardData {
  const today = ymd(now);
  let todayTry = 0;
  let totalTry = 0;
  for (const d of donations) {
    const tryAmount = toTRY(d.amount, d.currency, mockExchangeRate);
    totalTry += tryAmount;
    if (d.date.slice(0, 10) === today) todayTry += tryAmount;
  }
  const totalUsd = toUSD(totalTry, "TRY", mockExchangeRate);

  const recent = [...donations]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, RECENT_LIMIT);

  const activeKumbara = kumbaralar.filter(isActive).length;
  const activeStant = stantlar.filter(isActive).length;

  const chart = buildChart(donations, now);

  return {
    todayTry,
    totalTry,
    totalUsd,
    donorCount: donations.length,
    activeKumbara,
    activeStant,
    recent,
    chart,
  };
}

// ── Sayfa ──────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [bagislarRaw, kumbaralarRaw, stantlarRaw] = await Promise.all([
          fetchJson("/bagislar"),
          fetchJson("/kumbaralar"),
          fetchJson("/stantlar"),
        ]);
        if (!mounted) return;
        const donations = (bagislarRaw as Record<string, unknown>[])
          .map(parseDonation)
          .filter((d): d is Donation => d !== null);
        const dashboard = buildDashboard(
          donations,
          kumbaralarRaw as Record<string, unknown>[],
          stantlarRaw as Record<string, unknown>[],
          new Date(),
        );
        setData(dashboard);
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Veriler yüklenemedi");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const visibleModules = useMemo(
    () => systemModules.filter((m) => VISIBLE_SYSTEM_MODULES.includes(m.name)),
    [],
  );

  const quickActions = [
    { href: "/admin/defne/kumbaralar", label: "Kumbara Ekle", icon: PiggyBank },
    { href: "/admin/defne/giderler", label: "Gider Ekle", icon: Receipt },
    { href: "/admin/defne/gonulluler", label: "Gönüllü Ekle", icon: PlusCircle },
    { href: "/admin/defne/raporlar", label: "Rapor Oluştur", icon: TrendingUp },
  ];

  return (
    <AdminLayout
      title="Genel Bakış"
      subtitle={loading ? "Yükleniyor…" : "Kampanyanın anlık durumu ve son hareketler"}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <span className="font-bold shrink-0">⚠</span>
          <div className="min-w-0">
            <p className="font-semibold">Veriler yüklenemedi</p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {error}. n8n endpoint'lerini ve CORS ayarlarını kontrol edin.
            </p>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {loading || !data ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Bugünkü Bağış"
              value={`₺${formatNumber(data.todayTry)}`}
              hint="Bugüne ait toplam"
              icon={<TrendingUp className="w-5 h-5" />}
              accent="success"
            />
            <StatCard
              label="Toplam Bağış"
              value={`₺${formatNumber(data.totalTry)}`}
              hint={`≈ $${formatNumber(data.totalUsd)} • ${data.donorCount.toLocaleString("tr-TR")} bağış`}
              icon={<DollarSign className="w-5 h-5" />}
              accent="secondary"
            />
            <StatCard
              label="Aktif Kumbara"
              value={data.activeKumbara}
              hint="Sahada toplama yapıyor"
              icon={<PiggyBank className="w-5 h-5" />}
              accent="primary"
            />
            <StatCard
              label="Aktif Stant"
              value={data.activeStant}
              hint="Tüm AVM lokasyonları"
              icon={<Store className="w-5 h-5" />}
              accent="warning"
            />
          </>
        )}
      </div>

      {/* Middle: chart + recent */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Son 7 Gün — Günlük Bağış"
          description="TL cinsinden günlük toplam"
          className="lg:col-span-2"
        >
          {loading || !data ? (
            <ChartSkeleton />
          ) : (
            <ChartView chart={data.chart} />
          )}
        </PanelCard>

        <PanelCard
          title="Son Bağışlar"
          description="En güncel 10 bağış"
          actions={
            <Link
              href="/admin/defne/bagislar"
              className="text-label-md text-secondary hover:text-on-secondary-container inline-flex items-center gap-0.5"
            >
              Tümü <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          {loading || !data ? (
            <RecentSkeleton />
          ) : data.recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-on-surface-variant text-body-sm">
              Henüz bağış kaydı yok.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant max-h-[360px] overflow-y-auto">
              {data.recent.map((d) => (
                <li
                  key={d.id}
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-surface-container-low transition"
                >
                  <div className="min-w-0">
                    <p className="text-label-md font-medium text-on-surface truncate">
                      {d.donorName}
                    </p>
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {d.source} • {formatRelativeTime(d.date)}
                    </p>
                  </div>
                  <span className="text-label-md font-semibold text-on-surface tabular-nums shrink-0">
                    {formatCurrency(d.amount, d.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>

      {/* TODO: Twilio + Claude API entegrasyonu hazır olunca aktif et */}
      {false && (
        <div className="mt-6">{/* AI Mesajlaşma Asistanı kartı */}</div>
      )}

      {/* Bottom row: system status + quick actions */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        {/* TODO: Bekleyen işlemler sistemi gerçek veri ile entegre olunca aktif et */}
        {false && (
          <PanelCard title="Bekleyen İşlemler" description="">
            <div />
          </PanelCard>
        )}

        <PanelCard title="Sistem Durumu" description="Aktif modüller">
          <ul className="divide-y divide-outline-variant">
            {visibleModules.map((m) => (
              <li
                key={m.name}
                className="px-5 py-2.5 flex items-center justify-between"
              >
                <span className="text-label-md text-on-surface">{m.name}</span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-label-sm font-medium",
                    m.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-surface-container text-on-surface-variant",
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      m.status === "active"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-on-surface-variant",
                    )}
                  />
                  {m.status === "active" ? "Aktif" : "Pasif"}
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Hızlı Eylemler" description="Sık kullanılan işlemler">
          <div className="p-5 grid grid-cols-2 gap-2.5">
            {quickActions.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-outline-variant bg-surface-container-low hover:border-secondary hover:bg-secondary-container/30 transition group"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary text-on-secondary flex items-center justify-center group-hover:scale-110 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-label-sm font-medium text-on-surface text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

// ── Alt bileşenler ─────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
    Math.round(n),
  );
}

function ChartView({
  chart,
}: {
  chart: { date: string; label: string; amountTry: number }[];
}) {
  const max = Math.max(1, ...chart.map((d) => d.amountTry));
  const total = chart.reduce((s, d) => s + d.amountTry, 0);
  return (
    <div className="px-5 pt-10 pb-6">
      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {chart.map((d) => {
          // Veri varsa max'a göre yüzde, veri yoksa 2px (min-h) ile küçük çizgi.
          const hasValue = d.amountTry > 0;
          const heightPct = hasValue ? (d.amountTry / max) * 100 : 0;
          return (
            <div key={d.date} className="flex flex-col items-center group">
              <div className="relative w-full h-44 flex items-end justify-center">
                <div
                  className={cn(
                    "w-full max-w-[42px] rounded-t-md transition-colors relative",
                    hasValue
                      ? "bg-secondary group-hover:bg-on-secondary-container min-h-[6px]"
                      : "bg-outline-variant min-h-[2px]",
                  )}
                  style={{ height: hasValue ? `${heightPct}%` : "2px" }}
                >
                  {hasValue && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-label-sm font-semibold text-on-surface tabular-nums whitespace-nowrap">
                      ₺{formatNumber(d.amountTry)}
                    </span>
                  )}
                </div>
              </div>
              <span className="mt-2 text-label-sm text-on-surface-variant">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-outline-variant flex items-center justify-between text-label-sm">
        <span className="text-on-surface-variant">7 gün toplamı</span>
        <span className="font-semibold text-on-surface tabular-nums">
          ₺{formatNumber(total)}
        </span>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-surface-container" />
      <div className="mt-3 h-7 w-32 rounded bg-surface-container" />
      <div className="mt-2 h-3 w-28 rounded bg-surface-container" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="px-5 py-6">
      <div className="flex items-end justify-between gap-2 md:gap-3 h-44">
        {Array.from({ length: CHART_DAYS }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full max-w-[42px] rounded-t-md bg-surface-container animate-pulse"
              style={{ height: `${30 + ((i * 13) % 60)}%` }}
            />
            <div className="h-3 w-6 rounded bg-surface-container animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentSkeleton() {
  return (
    <ul className="divide-y divide-outline-variant">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="px-5 py-3 flex items-center justify-between gap-3 animate-pulse"
        >
          <div className="min-w-0 flex-1">
            <div className="h-3.5 w-32 rounded bg-surface-container" />
            <div className="mt-1.5 h-3 w-40 rounded bg-surface-container" />
          </div>
          <div className="h-4 w-16 rounded bg-surface-container" />
        </li>
      ))}
    </ul>
  );
}
