"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  CircleDashed,
  CreditCard,
  ExternalLink,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import {
  MODULE_CATALOG,
  ONBOARDING_CATALOG,
  getCampaignBySlug,
  type ManagedCampaign,
  type ModuleKey,
  type OnboardingKey,
  type PackageTier,
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

function formatUsage(used: number, limit: number | null) {
  if (limit === null) return `${used.toLocaleString("tr-TR")} / Sınırsız`;
  return `${used.toLocaleString("tr-TR")} / ${limit.toLocaleString("tr-TR")}`;
}

function usagePercent(used: number, limit: number | null) {
  if (limit === null || limit === 0) return null;
  return Math.min(100, Math.round((used / limit) * 100));
}

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const initial = slug ? getCampaignBySlug(slug) : undefined;

  const [campaign, setCampaign] = useState<ManagedCampaign | undefined>(initial);

  if (!campaign) {
    if (typeof window !== "undefined") notFound();
    return null;
  }

  const toggleModule = (key: ModuleKey) => {
    const willTurnOff = campaign.modules[key];
    if (willTurnOff) {
      const meta = MODULE_CATALOG.find((m) => m.key === key);
      const ok = window.confirm(
        `"${meta?.label ?? key}" modülünü kapatmak istediğinize emin misiniz?\n\nMüşteri panelinde bu özellik gizlenecek.`,
      );
      if (!ok) return;
    }
    setCampaign({
      ...campaign,
      modules: { ...campaign.modules, [key]: !willTurnOff },
    });
  };

  const toggleOnboarding = (key: OnboardingKey) => {
    setCampaign({
      ...campaign,
      onboarding: { ...campaign.onboarding, [key]: !campaign.onboarding[key] },
    });
  };

  const onboardingDone = ONBOARDING_CATALOG.filter(
    (o) => campaign.onboarding[o.key],
  ).length;
  const onboardingTotal = ONBOARDING_CATALOG.length;

  return (
    <MasterAdminLayout
      title={campaign.name}
      subtitle={campaign.patientOrOrg}
      actions={
        <Link
          href="/master-admin/kampanyalar"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition"
        >
          ← Listeye dön
        </Link>
      }
    >
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex px-2.5 py-1 rounded-md border text-label-md font-medium",
                PACKAGE_STYLE[campaign.package],
              )}
            >
              {campaign.package} Paket
            </span>
            <span
              className={cn(
                "inline-flex px-2.5 py-1 rounded-md border text-label-md font-medium",
                STATUS_STYLE[campaign.status],
              )}
            >
              {STATUS_LABEL[campaign.status]}
            </span>
            <span className="text-label-sm text-on-surface-variant font-mono px-2 py-1 rounded-md bg-surface-container">
              {campaign.slug}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={campaign.publicUrl}
              target={campaign.publicUrl !== "#" ? "_blank" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-label-md transition",
                campaign.publicUrl === "#"
                  ? "text-on-surface-variant/60 pointer-events-none"
                  : "text-on-surface hover:bg-surface-container",
              )}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Kampanya Sayfası
            </Link>
            <Link
              href={campaign.adminUrl}
              target={campaign.adminUrl !== "#" ? "_blank" : undefined}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-label-md transition",
                campaign.adminUrl === "#"
                  ? "opacity-60 pointer-events-none"
                  : "hover:bg-primary/90",
              )}
            >
              <ExternalLink className="w-3.5 h-3.5" /> Müşteri Admin Paneli
            </Link>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-outline-variant grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryItem
            icon={Calendar}
            label="Kurulum Tarihi"
            value={formatDate(campaign.startDate)}
          />
          <SummaryItem
            icon={CreditCard}
            label="Aylık Ücret"
            value={
              campaign.isDemo ? "Demo (₺0)" : formatTRY(campaign.monthlyFee)
            }
          />
          <SummaryItem
            icon={User}
            label="Sorumlu"
            value={campaign.contact.name}
          />
          <SummaryItem
            icon={Building2}
            label="İletişim"
            value={
              <span className="flex flex-col text-body-sm">
                <a
                  href={`mailto:${campaign.contact.email}`}
                  className="hover:text-secondary inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> {campaign.contact.email}
                </a>
                <a
                  href={`tel:${campaign.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-secondary inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> {campaign.contact.phone}
                </a>
              </span>
            }
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant">
            <h2 className="text-h3 font-semibold text-on-surface">
              Modül Yönetimi
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Müşteri panelinde hangi modüllerin görüneceğini kontrol et
            </p>
          </div>
          <ul className="divide-y divide-outline-variant">
            {MODULE_CATALOG.map((m) => {
              const enabled = campaign.modules[m.key];
              return (
                <li
                  key={m.key}
                  className="px-5 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-body-md font-medium text-on-surface truncate">
                      {m.label}
                    </p>
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {m.description}
                    </p>
                  </div>
                  <Toggle
                    checked={enabled}
                    onChange={() => toggleModule(m.key)}
                    label={`${m.label} modülünü ${enabled ? "kapat" : "aç"}`}
                  />
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h2 className="text-h3 font-semibold text-on-surface">
                Kullanım Sayaçları
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Bu ayın hizmet kullanım istatistikleri
              </p>
            </div>
            <div className="px-5 py-4 space-y-4">
              <UsageBar
                label="WhatsApp Mesajları"
                used={campaign.whatsapp.used}
                limit={campaign.whatsapp.limit}
              />
              <UsageBar
                label="IVR Dakika"
                used={campaign.ivr.used}
                limit={campaign.ivr.limit}
              />
              <UsageBar
                label="Video"
                used={campaign.video.used}
                limit={campaign.video.limit}
              />
              <UsageBar
                label="Sosyal Medya Platformu"
                used={campaign.socialMedia.active}
                limit={campaign.socialMedia.total}
                unit="aktif"
                goodWhenFull
              />
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
            <div className="px-5 py-4 border-b border-outline-variant">
              <h2 className="text-h3 font-semibold text-on-surface">
                Ödeme Bilgisi
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Paket ücreti ve ödeme tarihçesi
              </p>
            </div>
            <dl className="px-5 py-4 space-y-3">
              <Row
                label="Paket Ücreti"
                value={
                  campaign.isDemo ? "Demo (₺0)" : formatTRY(campaign.monthlyFee)
                }
              />
              <Row
                label="Son Ödeme"
                value={
                  campaign.lastPayment
                    ? `${formatTRY(campaign.lastPayment.amount)} · ${formatDate(campaign.lastPayment.date)}`
                    : "—"
                }
              />
              <Row
                label="Sonraki Ödeme"
                value={formatDate(campaign.nextPaymentDate)}
              />
              <Row
                label="Ödeme Durumu"
                value={
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                      campaign.isDemo
                        ? "bg-gray-100 text-gray-700 border-gray-200"
                        : campaign.lastPayment?.status === "paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200",
                    )}
                  >
                    {campaign.isDemo
                      ? "Demo"
                      : campaign.lastPayment?.status === "paid"
                        ? "Ödendi"
                        : "Bekliyor"}
                  </span>
                }
              />
            </dl>
          </section>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-h3 font-semibold text-on-surface">
              Onboarding Durumu
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Kurulum ve entegrasyon kontrol listesi
            </p>
          </div>
          <div className="text-label-md text-on-surface">
            <span className="font-semibold">{onboardingDone}</span>
            <span className="text-on-surface-variant">/{onboardingTotal} tamam</span>
          </div>
        </div>
        <ul className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {ONBOARDING_CATALOG.map((o) => {
            const done = campaign.onboarding[o.key];
            const Icon = done ? CheckCircle2 : CircleDashed;
            return (
              <li key={o.key}>
                <button
                  type="button"
                  onClick={() => toggleOnboarding(o.key)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border transition text-left",
                    done
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-50"
                      : "border-outline-variant bg-surface-container-low/30 text-on-surface-variant hover:bg-surface-container",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      done ? "text-emerald-600" : "text-on-surface-variant",
                    )}
                  />
                  <span className="text-body-sm">{o.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </MasterAdminLayout>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
        <Icon className="w-3.5 h-3.5" /> {label}
      </p>
      <div className="mt-1 text-on-surface text-body-md font-medium">
        {value}
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        checked ? "bg-secondary" : "bg-gray-300",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function UsageBar({
  label,
  used,
  limit,
  unit,
  goodWhenFull,
}: {
  label: string;
  used: number;
  limit: number | null;
  unit?: string;
  goodWhenFull?: boolean;
}) {
  const pct = usagePercent(used, limit);
  const barColor =
    pct === null || goodWhenFull
      ? "bg-emerald-500"
      : pct >= 80
        ? "bg-rose-500"
        : pct >= 60
          ? "bg-amber-500"
          : "bg-emerald-500";

  return (
    <div>
      <div className="flex items-center justify-between text-body-sm mb-1.5">
        <span className="text-on-surface">{label}</span>
        <span className="text-on-surface-variant">
          {formatUsage(used, limit)} {unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className={cn("h-full transition-all", barColor)}
          style={{ width: `${pct === null ? 100 : pct}%` }}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-body-sm">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className="text-on-surface text-right font-medium">{value}</dd>
    </div>
  );
}
