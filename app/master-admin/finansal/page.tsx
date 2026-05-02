"use client";

import { CheckCircle2, Lock, TrendingDown, TrendingUp } from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  CAMPAIGN_COSTS,
  MANAGED_CAMPAIGNS,
  getCampaignCostTotal,
  type ManagedCampaign,
  type PackageTier,
} from "@/lib/master-admin-mock-data";
import { cn } from "@/lib/utils";

const PACKAGE_STYLE: Record<PackageTier, string> = {
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

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MasterAdminFinancialPage() {
  const billable = MANAGED_CAMPAIGNS.filter((c) => !c.isDemo);
  const totalRevenue = billable.reduce(
    (sum, c) =>
      sum +
      (c.lastPayment?.status === "paid"
        ? c.lastPayment.amount
        : c.monthlyFee),
    0,
  );
  const totalCost = billable.reduce(
    (sum, c) => sum + getCampaignCostTotal(c.slug),
    0,
  );
  const profit = totalRevenue - totalCost;
  const margin =
    totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  return (
    <MasterAdminLayout
      title="Finansal"
      subtitle="Gelir, maliyet ve kâr marjı (yalnızca master admin)"
    >
      <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-body-sm flex items-start gap-2">
        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Bu bilgiler gizlidir.</strong> Maliyet ve kâr marjı bilgileri
          müşteri panellerinde gösterilmez.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FinanceCard
          label="Bu Ay Gelir"
          value={formatTRY(totalRevenue)}
          icon={TrendingUp}
          tone="success"
        />
        <FinanceCard
          label="Bu Ay Maliyet"
          value={formatTRY(totalCost)}
          icon={TrendingDown}
          tone="danger"
        />
        <FinanceCard
          label="Bu Ay Kâr"
          value={formatTRY(profit)}
          icon={CheckCircle2}
          tone="primary"
        />
        <FinanceCard
          label="Kâr Marjı"
          value={`%${margin}`}
          icon={TrendingUp}
          tone="primary"
        />
      </div>

      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-h3 font-semibold text-on-surface">Gelir Tablosu</h2>
          <p className="text-body-sm text-on-surface-variant">
            Bu ayın faturalandırılan kampanyaları
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-container-low">
              <tr className="text-left text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Kampanya</th>
                <th className="px-4 py-3 font-semibold">Paket</th>
                <th className="px-4 py-3 font-semibold text-right">Ücret</th>
                <th className="px-4 py-3 font-semibold">Ödeme Tarihi</th>
                <th className="px-4 py-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {billable.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-on-surface-variant"
                  >
                    Bu ay faturalandırılan kampanya yok.
                  </td>
                </tr>
              )}
              {billable.map((c) => (
                <tr key={c.slug} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 font-semibold text-on-surface">
                    {c.name}
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
                  <td className="px-4 py-3 text-right text-on-surface font-medium">
                    {formatTRY(c.monthlyFee)}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">
                    {formatDate(c.lastPayment?.date ?? null)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge campaign={c} />
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
            Maliyet Tablosu
          </h2>
          <p className="text-body-sm text-on-surface-variant">
            İç kullanım — kampanya başına altyapı maliyetleri
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-container-low">
              <tr className="text-left text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="px-4 py-3 font-semibold">Kampanya</th>
                <th className="px-4 py-3 font-semibold text-right">VPS</th>
                <th className="px-4 py-3 font-semibold text-right">WhatsApp</th>
                <th className="px-4 py-3 font-semibold text-right">IVR</th>
                <th className="px-4 py-3 font-semibold text-right">Diğer</th>
                <th className="px-4 py-3 font-semibold text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {MANAGED_CAMPAIGNS.map((c) => {
                const costs = CAMPAIGN_COSTS[c.slug] ?? {
                  vps: 0,
                  whatsapp: 0,
                  ivr: 0,
                  other: 0,
                };
                const total = getCampaignCostTotal(c.slug);
                return (
                  <tr key={c.slug} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-on-surface">
                        {c.name}
                      </div>
                      <div className="text-label-sm text-on-surface-variant">
                        {c.isDemo ? "Demo (faturalanmaz)" : c.package}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">
                      {formatTRY(costs.vps)}
                    </td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">
                      {formatTRY(costs.whatsapp)}
                    </td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">
                      {formatTRY(costs.ivr)}
                    </td>
                    <td className="px-4 py-3 text-right text-on-surface-variant">
                      {formatTRY(costs.other)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-on-surface">
                      {formatTRY(total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-surface-container-low">
                <td className="px-4 py-3 font-semibold text-on-surface">
                  Toplam
                </td>
                <td colSpan={4}></td>
                <td className="px-4 py-3 text-right font-semibold text-on-surface">
                  {formatTRY(totalCost)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </MasterAdminLayout>
  );
}

function FinanceCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  tone: "success" | "danger" | "primary";
}) {
  const styles: Record<typeof tone, string> = {
    success: "bg-emerald-50 text-emerald-600",
    danger: "bg-rose-50 text-rose-600",
    primary: "bg-primary/10 text-primary",
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
            styles[tone],
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function PaymentStatusBadge({ campaign }: { campaign: ManagedCampaign }) {
  const status = campaign.lastPayment?.status;
  const cls =
    status === "paid"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "pending"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-gray-100 text-gray-600 border-gray-200";
  const label =
    status === "paid" ? "Ödendi" : status === "pending" ? "Bekliyor" : "—";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium",
        cls,
      )}
    >
      {status === "paid" && <CheckCircle2 className="w-3 h-3" />}
      {label}
    </span>
  );
}
