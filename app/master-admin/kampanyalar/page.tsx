"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Calendar, Plus, Search, X } from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import { Button } from "@/components/ui/Button";
import {
  MANAGED_CAMPAIGNS,
  type ManagedCampaign,
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

const PACKAGES: PackageTier[] = ["Temel", "Standart", "Premium", "Özel"];

function formatTRY(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function MasterAdminCampaignsPage() {
  const [query, setQuery] = useState("");
  const [pkgFilter, setPkgFilter] = useState<"all" | PackageTier>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MANAGED_CAMPAIGNS.filter((c) => {
      if (pkgFilter !== "all" && c.package !== pkgFilter) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.patientOrOrg.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, pkgFilter]);

  return (
    <MasterAdminLayout
      title="Kampanyalar"
      subtitle="Yönetilen tüm kampanya hesapları"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4" />
          Yeni Kampanya
        </Button>
      }
    >
      {pendingNotice && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-body-sm flex items-center justify-between gap-3">
          <span>{pendingNotice}</span>
          <button
            onClick={() => setPendingNotice(null)}
            className="text-emerald-700/70 hover:text-emerald-900"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kampanya, müşteri veya slug ara…"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            active={pkgFilter === "all"}
            onClick={() => setPkgFilter("all")}
          >
            Tümü
          </FilterChip>
          {PACKAGES.map((p) => (
            <FilterChip
              key={p}
              active={pkgFilter === p}
              onClick={() => setPkgFilter(p)}
            >
              {p}
            </FilterChip>
          ))}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="sm:hidden"
        >
          <Plus className="w-4 h-4" />
          Yeni
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest py-16 text-center">
          <p className="text-body-md text-on-surface-variant">
            Eşleşen kampanya bulunamadı.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <article
              key={c.slug}
              className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col"
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-body-lg font-semibold text-on-surface truncate">
                      {c.name}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant truncate">
                      {c.patientOrOrg}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium shrink-0",
                      STATUS_STYLE[c.status],
                    )}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex px-2 py-0.5 rounded-md border text-label-sm font-medium",
                      PACKAGE_STYLE[c.package],
                    )}
                  >
                    {c.package}
                  </span>
                  <span className="text-label-sm text-on-surface-variant font-mono">
                    {c.slug}
                  </span>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low/40 grid grid-cols-2 gap-3 text-body-sm">
                <div>
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Kurulum
                  </p>
                  <p className="text-on-surface mt-0.5">{formatDate(c.startDate)}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">
                    Aylık Ücret
                  </p>
                  <p className="text-on-surface mt-0.5 font-semibold">
                    {c.isDemo ? "Demo (₺0)" : formatTRY(c.monthlyFee)}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-outline-variant flex items-center justify-between gap-2">
                <Link
                  href={c.publicUrl}
                  target={c.publicUrl !== "#" ? "_blank" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1 text-label-md transition",
                    c.publicUrl === "#"
                      ? "text-on-surface-variant/60 cursor-not-allowed pointer-events-none"
                      : "text-on-surface-variant hover:text-secondary",
                  )}
                >
                  Kamuya açık <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/master-admin/kampanyalar/${c.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary/90 transition"
                >
                  Yönet
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <NewCampaignModal
          onClose={() => setModalOpen(false)}
          onCreated={(name) => {
            setModalOpen(false);
            setPendingNotice(
              `"${name}" kampanyası oluşturma talebi alındı. Provizyonlama başlatıldı.`,
            );
          }}
        />
      )}
    </MasterAdminLayout>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-label-md font-medium border transition",
        active
          ? "bg-primary text-on-primary border-primary"
          : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:border-primary/50 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

function NewCampaignModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [patient, setPatient] = useState("");
  const [pkg, setPkg] = useState<PackageTier>("Standart");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [monthlyFee, setMonthlyFee] = useState<number>(17900);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreated(name);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-8"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,24,53,0.25)] border border-outline-variant w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-h3 font-semibold text-on-surface">
              Yeni Kampanya Ekle
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Yeni müşteri kampanyası provizyonla
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 -mr-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Kampanya Adı" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn. Minik Defne Kampanyası"
                required
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </Field>
            <Field label="Hasta / Kurum Adı" required>
              <input
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                placeholder="Örn. Defne (3 yaş, SMA Tip-1)"
                required
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </Field>
            <Field label="Paket" required>
              <select
                value={pkg}
                onChange={(e) => setPkg(e.target.value as PackageTier)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              >
                {PACKAGES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="Başlangıç Tarihi" required>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </Field>
            <Field label="Aylık Ücret (₺)" required>
              <input
                type="number"
                min={0}
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
              />
            </Field>
          </div>

          <div>
            <h3 className="text-label-md font-semibold text-on-surface mb-3">
              Sorumlu Kişi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Ad Soyad" required>
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
              </Field>
              <Field label="Telefon" required>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+90 5xx xxx xx xx"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
              </Field>
              <Field label="E-posta" required>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant -mx-6 px-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container transition"
            >
              İptal
            </button>
            <Button type="submit" variant="primary">
              Kampanyayı Oluştur
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-label-md text-on-surface mb-1.5">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
