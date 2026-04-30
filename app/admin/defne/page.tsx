"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Bot,
  Coins,
  DollarSign,
  PiggyBank,
  PlusCircle,
  Receipt,
  Sparkles,
  Store,
  Timer,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PanelCard, StatCard, formatCurrency } from "@/components/admin/AdminUI";
import {
  assistantStatus,
  dailyDonationChart,
  getCampaignSummary,
  pendingTasks,
  systemModules,
} from "@/lib/admin-mock-data";
import { demoCampaign } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const summary = getCampaignSummary();
  const recent = demoCampaign.recentDonors.slice(0, 10);

  const maxAmount = Math.max(...dailyDonationChart.map((d) => d.amountUsd));

  const quickActions = [
    { href: "/admin/defne/kumbaralar", label: "Kumbara Ekle", icon: PiggyBank },
    { href: "/admin/defne/giderler", label: "Gider Ekle", icon: Receipt },
    { href: "/admin/defne/gonulluler", label: "Gönüllü Ekle", icon: PlusCircle },
    { href: "/admin/defne/raporlar", label: "Rapor Oluştur", icon: TrendingUp },
  ];

  return (
    <AdminLayout
      title="Genel Bakış"
      subtitle="Kampanyanın anlık durumu ve son hareketler"
    >
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Toplam Bağış"
          value={`$${(summary.raisedUsd / 1000).toFixed(1)}K`}
          hint={`≈ ₺${(summary.raisedTryApprox / 1_000_000).toFixed(1)}M • ${summary.donorCount.toLocaleString("tr-TR")} bağışçı`}
          icon={<DollarSign className="w-5 h-5" />}
          accent="secondary"
        />
        <StatCard
          label="Bugünkü Bağış"
          value={`$${summary.todayUsd.toLocaleString("en-US")}`}
          hint="Son 24 saatte"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Aktif Kumbara"
          value={summary.activeKumbara}
          hint="Sahada toplama yapıyor"
          icon={<PiggyBank className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Aktif Stant"
          value={summary.activeStant}
          hint="Tüm AVM lokasyonları"
          icon={<Store className="w-5 h-5" />}
          accent="warning"
        />
      </div>

      {/* Middle row: chart + recent donations */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Son 7 Gün — Günlük Bağış"
          description="USD cinsinden günlük toplam"
          className="lg:col-span-2"
        >
          <div className="px-5 py-6">
            <div className="flex items-end justify-between gap-2 md:gap-3 h-44">
              {dailyDonationChart.map((d) => {
                const heightPct = (d.amountUsd / maxAmount) * 100;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center h-full">
                      <div
                        className="w-full max-w-[42px] rounded-t-md bg-gradient-to-t from-secondary to-secondary-container transition-all group-hover:from-on-secondary-container relative"
                        style={{ height: `${heightPct}%` }}
                      >
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-label-sm font-semibold text-on-surface tabular-nums opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          ${d.amountUsd.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">{d.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 pt-4 border-t border-outline-variant flex items-center justify-between text-label-sm">
              <span className="text-on-surface-variant">7 gün toplamı</span>
              <span className="font-semibold text-on-surface tabular-nums">
                ${dailyDonationChart.reduce((s, d) => s + d.amountUsd, 0).toLocaleString("en-US")}
              </span>
            </div>
          </div>
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
          <ul className="divide-y divide-outline-variant max-h-[360px] overflow-y-auto">
            {recent.map((d) => (
              <li key={d.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-surface-container-low transition">
                <div className="min-w-0">
                  <p className="text-label-md font-medium text-on-surface truncate">{d.name}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">
                    {d.method} • {d.time}
                  </p>
                </div>
                <span className="text-label-md font-semibold text-on-surface tabular-nums shrink-0">
                  {formatCurrency(d.amount, d.currency)}
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>

      {/* AI Assistant widget */}
      <Link
        href="/admin/defne/ai-asistan"
        className={cn(
          "mt-6 group block rounded-xl border overflow-hidden hover:shadow-[0_10px_30px_rgba(0,103,127,0.25)] transition-all bg-gradient-to-r text-white",
          assistantStatus.active
            ? "from-secondary via-on-secondary-container to-primary border-secondary/30"
            : "from-slate-500 to-slate-700 border-slate-500/30",
        )}
      >
        <div className="flex flex-col md:flex-row items-stretch">
          <div className="flex-1 px-5 py-4 md:px-6 md:py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-body-lg font-bold">AI Mesajlaşma Asistanı</h3>
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-semibold",
                  assistantStatus.active ? "bg-emerald-500 text-white" : "bg-white/30 text-white",
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", assistantStatus.active ? "bg-white animate-pulse" : "bg-white/60")} />
                  {assistantStatus.active ? "AKTİF" : "PASİF"}
                </span>
              </div>
              <p className="text-body-sm text-white/85 mt-0.5">
                Sosyal medya mesajlarına saniyeler içinde yanıt veriyor — saha ekibinize zaman kazandırır.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-white/10 md:bg-transparent md:gap-0 md:border-l border-white/10">
            <WidgetMetric
              icon={<Sparkles className="w-3.5 h-3.5" />}
              label="Bugün yanıtlanan"
              value={assistantStatus.repliedToday.toLocaleString("tr-TR")}
            />
            <WidgetMetric
              icon={<Timer className="w-3.5 h-3.5" />}
              label="Ort. yanıt"
              value={`${assistantStatus.averageReplySeconds} sn`}
            />
            <WidgetMetric
              icon={<TrendingUp className="w-3.5 h-3.5" />}
              label="Başarı"
              value={`%${assistantStatus.successRate}`}
            />
          </div>
          <div className="px-5 py-3 md:py-0 md:px-6 flex items-center justify-end gap-1.5 text-label-md font-semibold border-t md:border-t-0 md:border-l border-white/10 group-hover:bg-white/10 transition">
            Detay Gör
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Bottom row: pending tasks + system status + quick actions */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard
          title="Bekleyen İşlemler"
          description={`${pendingTasks.length} öğe dikkat bekliyor`}
        >
          <ul className="divide-y divide-outline-variant">
            {pendingTasks.map((t) => (
              <li key={t.id} className="px-5 py-3 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-label-md font-medium text-on-surface">{t.title}</p>
                  <p className="text-label-sm text-on-surface-variant mt-0.5">{t.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Sistem Durumu" description="Tüm modüller">
          <ul className="divide-y divide-outline-variant">
            {systemModules.map((m) => (
              <li key={m.name} className="px-5 py-2.5 flex items-center justify-between">
                <span className="text-label-md text-on-surface">{m.name}</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-label-sm font-medium",
                  m.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-surface-container text-on-surface-variant",
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    m.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-on-surface-variant",
                  )} />
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
                <span className="text-label-sm font-medium text-on-surface text-center">{label}</span>
              </Link>
            ))}
          </div>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

function WidgetMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="px-3 py-3 md:px-5 md:py-4 bg-white/5 md:bg-transparent">
      <div className="flex items-center gap-1 text-label-sm text-white/70">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="text-body-md md:text-body-lg font-bold text-white tabular-nums mt-0.5">
        {value}
      </p>
    </div>
  );
}
