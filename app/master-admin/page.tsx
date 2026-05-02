"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  DollarSign,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  MANAGED_CAMPAIGNS,
  RECENT_ACTIVITY,
  getMasterDashboardSummary,
  type ManagedCampaign,
} from "@/lib/master-admin-mock-data";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<ManagedCampaign["status"], string> = {
  active: "Aktif",
  paused: "Duraklatıldı",
  suspended: "Askıda",
};

const STATUS_STYLE: Record<ManagedCampaign["status"], string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paused: "bg-amber-50 text-amber-700 border-amber-200",
  suspended: "bg-rose-50 text-rose-700 border-rose-200",
};

const PACKAGE_STYLE: Record<ManagedCampaign["package"], string> = {
  Temel: "bg-gray-100 text-gray-700 border-gray-200",
  Standart: "bg-sky-50 text-sky-700 border-sky-200",
  Premium: "bg-violet-50 text-violet-700 border-violet-200",
  Özel: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

function formatTRY(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatUsage(used: number, limit: number | null) {
  if (limit === null) return `${used.toLocaleString("tr-TR")} / Sınırsız`;
  return `${used.toLocaleString("tr-TR")} / ${limit.toLocaleString("tr-TR")}`;
}

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.round(hours / 24);
  return `${days} gün önce`;
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  accent: "primary" | "secondary" | "success" | "info";
}) {
  const styles: Record<typeof accent, string> = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary-container/40 text-secondary",
    success: "bg-emerald-50 text-emerald-600",
    info: "bg-sky-50 text-sky-600",
  };
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">
            {label}
          </p>
          <p className="mt-2 text-h2 font-semibold text-on-surface">{value}</p>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
            styles[accent],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function MasterAdminDashboardPage() {
  const summary = getMasterDashboardSummary();

  return (
    <MasterAdminLayout
      title="Dashboard"
      subtitle="Tüm kampanyaların özet görünümü"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Aktif Kampanya"
          value={summary.activeCampaigns.toString()}
          icon={Megaphone}
          accent="primary"
        />
        <StatCard
          label="Bu Ay Gelir"
          value={formatTRY(summary.monthlyRevenue)}
          icon={DollarSign}
          accent="success"
        />
        <StatCard
          label="Toplam Müşteri"
          value={summary.totalCustomers.toString()}
          icon={Users}
          accent="info"
        />
        <StatCard
          label="Sistem Durumu"
          value="Tümü Aktif"
          icon={ShieldCheck}
          accent="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between gap-3">
            <div>
              <h2 className="text-h3 font-semibold text-on-surface">
                Kampanya Özeti
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Aktif kampanyaların durum ve kullanım bilgileri
              </p>
            </div>
            <Link
              href="/master-admin/kampanyalar"
              className="hidden sm:inline-flex items-center gap-1 text-label-md text-primary hover:text-primary/80"
            >
              Tümü <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-body-sm">
              <thead className="bg-surface-container-low">
                <tr className="text-left text-label-sm text-on-surface-variant uppercase tracking-wide">
                  <th className="px-4 py-3 font-semibold">Kampanya</th>
                  <th className="px-4 py-3 font-semibold">Paket</th>
                  <th className="px-4 py-3 font-semibold">Durum</th>
                  <th className="px-4 py-3 font-semibold">WA Kullanım</th>
                  <th className="px-4 py-3 font-semibold">IVR Kullanım</th>
                  <th className="px-4 py-3 font-semibold">Bu Ay Ödeme</th>
                  <th className="px-4 py-3 font-semibold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {MANAGED_CAMPAIGNS.map((c) => (
                  <tr key={c.slug} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-on-surface">
                        {c.name}
                      </div>
                      <div className="text-label-sm text-on-surface-variant">
                        {c.patientOrOrg}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                          PACKAGE_STYLE[c.package],
                        )}
                      >
                        {c.package}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                          STATUS_STYLE[c.status],
                        )}
                      >
                        {STATUS_LABEL[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {formatUsage(c.whatsapp.used, c.whatsapp.limit)}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {formatUsage(c.ivr.used, c.ivr.limit)}
                    </td>
                    <td className="px-4 py-3">
                      {c.isDemo ? (
                        <span className="text-on-surface-variant">Demo</span>
                      ) : c.lastPayment?.status === "paid" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          {formatTRY(c.lastPayment.amount)}
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-amber-600">Bekliyor</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/master-admin/kampanyalar/${c.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-on-primary text-label-sm hover:bg-primary/90 transition"
                      >
                        Yönet
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant">
            <h2 className="text-h3 font-semibold text-on-surface">
              Son Olaylar
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Aktiviteler ve sistem mesajları
            </p>
          </div>
          <ul className="divide-y divide-outline-variant">
            {RECENT_ACTIVITY.map((event) => {
              const cfg = activityConfig(event.type);
              const Icon = cfg.icon;
              return (
                <li key={event.id} className="px-5 py-3 flex items-start gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      cfg.bg,
                    )}
                  >
                    <Icon className={cn("w-4 h-4", cfg.fg)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm text-on-surface">
                      {event.campaignLabel && (
                        <span className="font-semibold">
                          {event.campaignLabel}:{" "}
                        </span>
                      )}
                      {event.message}
                    </p>
                    <p className="text-label-sm text-on-surface-variant mt-0.5">
                      {formatRelative(event.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </MasterAdminLayout>
  );
}

function activityConfig(type: "donation" | "warning" | "system" | "info") {
  switch (type) {
    case "donation":
      return {
        icon: HeartHandshake,
        bg: "bg-emerald-50",
        fg: "text-emerald-600",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        bg: "bg-amber-50",
        fg: "text-amber-600",
      };
    case "system":
      return {
        icon: ShieldCheck,
        bg: "bg-sky-50",
        fg: "text-sky-600",
      };
    case "info":
    default:
      return {
        icon: CircleDot,
        bg: "bg-gray-100",
        fg: "text-gray-600",
      };
  }
}
