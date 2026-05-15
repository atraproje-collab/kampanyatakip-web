"use client";

import {
  Clock,
  Eye,
  MousePointerClick,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PanelCard, StatCard } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";

// ── Dummy data (mockup, gerçek API yok) ─────────────────────────────────────

type DailyPoint = { gun: string; harcama: number; erisim: number };

const DAILY: DailyPoint[] = [
  { gun: "Pzt", harcama: 320, erisim: 5200 },
  { gun: "Sal", harcama: 410, erisim: 6800 },
  { gun: "Çar", harcama: 380, erisim: 6100 },
  { gun: "Per", harcama: 460, erisim: 8400 },
  { gun: "Cum", harcama: 520, erisim: 9300 },
  { gun: "Cmt", harcama: 410, erisim: 7100 },
  { gun: "Paz", harcama: 340, erisim: 5300 },
];

const PIE = [
  { ad: "Facebook", deger: 60, color: "#1877F2" },
  { ad: "Instagram", deger: 40, color: "#E1306C" },
];

type Kampanya = {
  ad: string;
  platform: "Facebook" | "Instagram";
  harcama: number;
  erisim: number;
  ctr: number;
  durum: "Aktif" | "Duraklatıldı" | "Tamamlandı";
};

const KAMPANYALAR: Kampanya[] = [
  { ad: "Defne'ye Umut Ol — Reels", platform: "Instagram", harcama: 980, erisim: 18400, ctr: 3.2, durum: "Aktif" },
  { ad: "Bağış Çağrısı Video", platform: "Facebook", harcama: 720, erisim: 14200, ctr: 2.8, durum: "Aktif" },
  { ad: "Şeffaflık Hikayesi — Stories", platform: "Instagram", harcama: 540, erisim: 9100, ctr: 4.1, durum: "Duraklatıldı" },
  { ad: "Kurumsal Bağış Tanıtımı", platform: "Facebook", harcama: 600, erisim: 6500, ctr: 1.9, durum: "Tamamlandı" },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function ReklamPerformansiPage() {
  return (
    <AdminLayout
      title="Reklam Performansı"
      subtitle="Facebook & Instagram reklam kampanyalarının özeti — harcama, erişim, dönüşüm"
      actions={
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-md font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5" />
          Yakında
        </span>
      }
    >
      {/* "Yakında" banner */}
      <div className="mb-6 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-label-lg font-semibold text-amber-900">
            Bu modül yakında aktif olacak
          </p>
          <p className="text-body-sm text-amber-800/85 mt-0.5">
            Aşağıdaki veriler yalnızca önizleme amaçlı — gerçek reklam hesabı
            entegrasyonu (Meta Ads Manager) tamamlandığında canlı veri
            görünecek.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Toplam Harcama"
          value="₺2.840"
          hint="Son 7 gün"
          icon={<Wallet className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Toplam Erişim"
          value={(48200).toLocaleString("tr-TR")}
          hint="Tekil görüntüleme"
          icon={<Eye className="w-5 h-5" />}
          accent="secondary"
        />
        <StatCard
          label="Tıklama"
          value={(1247).toLocaleString("tr-TR")}
          hint="CTR ortalama %2.6"
          icon={<MousePointerClick className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Dönüşüm"
          value="89"
          hint="Bağış tamamlama"
          icon={<Target className="w-5 h-5" />}
          accent="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Son 7 Gün — Harcama vs Erişim"
          description="Günlük reklam harcaması (₺) ve erişim (kişi) eğrisi"
          className="lg:col-span-2"
        >
          <div className="px-5 py-5">
            <LineChart data={DAILY} />
            <ChartLegend
              items={[
                { label: "Harcama (₺)", color: "#0ea5e9" },
                { label: "Erişim (kişi)", color: "#10b981" },
              ]}
            />
          </div>
        </PanelCard>

        <PanelCard
          title="Platform Dağılımı"
          description="Reklam harcamasının platforma göre yüzdesi"
        >
          <div className="px-5 py-5 flex flex-col items-center">
            <PieChart segments={PIE} />
            <ul className="mt-4 w-full space-y-2">
              {PIE.map((p) => (
                <li
                  key={p.ad}
                  className="flex items-center justify-between gap-3 text-body-sm"
                >
                  <span className="flex items-center gap-2 text-on-surface">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{ background: p.color }}
                    />
                    {p.ad}
                  </span>
                  <span className="font-semibold text-on-surface tabular-nums">
                    %{p.deger}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </PanelCard>
      </div>

      {/* Table */}
      <PanelCard
        title="Aktif & Tamamlanan Kampanyalar"
        description="Mockup veri — gerçek entegrasyon yakında"
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">
                  Kampanya Adı
                </th>
                <th className="text-left px-5 py-3 font-semibold">Platform</th>
                <th className="text-right px-5 py-3 font-semibold">Harcama</th>
                <th className="text-right px-5 py-3 font-semibold">Erişim</th>
                <th className="text-right px-5 py-3 font-semibold">CTR</th>
                <th className="text-center px-5 py-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody>
              {KAMPANYALAR.map((k, i) => (
                <tr
                  key={k.ad}
                  className={cn(
                    "border-t border-outline-variant hover:bg-surface-container-low transition",
                    i % 2 === 1 && "bg-surface-container-low/40",
                  )}
                >
                  <td className="px-5 py-3 text-on-surface font-medium">
                    {k.ad}
                  </td>
                  <td className="px-5 py-3">
                    <PlatformChip platform={k.platform} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface font-semibold">
                    ₺{k.harcama.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                    {k.erisim.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-on-surface-variant">
                    %{k.ctr.toFixed(1)}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <DurumPill durum={k.durum} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>
    </AdminLayout>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function PlatformChip({ platform }: { platform: Kampanya["platform"] }) {
  const cls =
    platform === "Facebook"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-pink-50 text-pink-700 border-pink-200";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-label-sm font-medium border",
        cls,
      )}
    >
      {platform}
    </span>
  );
}

function DurumPill({ durum }: { durum: Kampanya["durum"] }) {
  const map = {
    Aktif: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500 animate-pulse" },
    Duraklatıldı: { cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    Tamamlandı: { cls: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-400" },
  } as const;
  const m = map[durum];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium",
        m.cls,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {durum}
    </span>
  );
}

function ChartLegend({
  items,
}: {
  items: { label: string; color: string }[];
}) {
  return (
    <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
      {items.map((it) => (
        <span
          key={it.label}
          className="inline-flex items-center gap-2 text-label-sm text-on-surface-variant"
        >
          <span
            className="inline-block w-3 h-1.5 rounded-sm"
            style={{ background: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

// ── SVG Line Chart ──────────────────────────────────────────────────────────

function LineChart({ data }: { data: DailyPoint[] }) {
  // Çizim alanı (viewBox koordinatları). responsive svg ile ölçeklenir.
  const W = 520;
  const H = 220;
  const padL = 44; // sol y label payı
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const maxHarcama = Math.max(...data.map((d) => d.harcama)) * 1.15;
  const maxErisim = Math.max(...data.map((d) => d.erisim)) * 1.15;

  const xStep = innerW / (data.length - 1);
  const xAt = (i: number) => padL + i * xStep;
  const yHarcama = (v: number) => padT + innerH - (v / maxHarcama) * innerH;
  const yErisim = (v: number) => padT + innerH - (v / maxErisim) * innerH;

  const pathHarcama = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yHarcama(d.harcama).toFixed(1)}`)
    .join(" ");
  const pathErisim = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xAt(i).toFixed(1)} ${yErisim(d.erisim).toFixed(1)}`)
    .join(" ");

  // 4 yatay grid çizgisi
  const gridLines = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Son 7 gün harcama ve erişim eğrisi"
      className="w-full h-auto"
    >
      {/* Grid */}
      {gridLines.map((g) => {
        const y = padT + innerH * (1 - g);
        const tlHarcama = Math.round(maxHarcama * g);
        return (
          <g key={g}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeDasharray="3 4"
            />
            <text
              x={padL - 6}
              y={y + 3}
              textAnchor="end"
              fontSize={10}
              fill="#64748b"
            >
              ₺{tlHarcama}
            </text>
          </g>
        );
      })}

      {/* X axis labels */}
      {data.map((d, i) => (
        <text
          key={d.gun}
          x={xAt(i)}
          y={H - 10}
          textAnchor="middle"
          fontSize={11}
          fill="#475569"
        >
          {d.gun}
        </text>
      ))}

      {/* Erişim line (yeşil) */}
      <path
        d={pathErisim}
        fill="none"
        stroke="#10b981"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => (
        <circle
          key={`er-${i}`}
          cx={xAt(i)}
          cy={yErisim(d.erisim)}
          r={3}
          fill="#10b981"
        />
      ))}

      {/* Harcama line (mavi) */}
      <path
        d={pathHarcama}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => (
        <circle
          key={`h-${i}`}
          cx={xAt(i)}
          cy={yHarcama(d.harcama)}
          r={3.5}
          fill="#0ea5e9"
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}
    </svg>
  );
}

// ── SVG Pie Chart ───────────────────────────────────────────────────────────

function PieChart({
  segments,
  size = 180,
  inner = 60,
}: {
  segments: { ad: string; deger: number; color: string }[];
  size?: number;
  inner?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const total = segments.reduce((s, x) => s + x.deger, 0) || 1;

  let cumulative = 0;
  const arcs = segments.map((seg) => {
    const startAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    cumulative += seg.deger;
    const endAngle = (cumulative / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    const xi1 = cx + inner * Math.cos(startAngle);
    const yi1 = cy + inner * Math.sin(startAngle);
    const xi2 = cx + inner * Math.cos(endAngle);
    const yi2 = cy + inner * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const d = [
      `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L ${xi2.toFixed(2)} ${yi2.toFixed(2)}`,
      `A ${inner} ${inner} 0 ${largeArc} 0 ${xi1.toFixed(2)} ${yi1.toFixed(2)}`,
      "Z",
    ].join(" ");

    return { d, color: seg.color, ad: seg.ad, deger: seg.deger };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Platform dağılımı pasta grafiği"
    >
      {arcs.map((a) => (
        <path
          key={a.ad}
          d={a.d}
          fill={a.color}
          stroke="#fff"
          strokeWidth={1.5}
        />
      ))}
      {/* Merkez metin */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fontSize={11}
        fill="#64748b"
        fontWeight={500}
      >
        Toplam
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fontSize={16}
        fontWeight={700}
        fill="#0f172a"
      >
        ₺2.840
      </text>
    </svg>
  );
}
