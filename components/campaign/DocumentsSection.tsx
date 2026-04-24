"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  FileText,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { DocumentViewerModal } from "@/components/campaign/DocumentViewerModal";
import { useCampaign } from "@/components/campaign/CampaignContext";
import type { OfficialDocument } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

type CategoryTheme = "navy" | "secondary" | "emerald";

const ICON_FOR: Record<OfficialDocument["kind"], LucideIcon> = {
  official: ShieldCheck,
  medical: Stethoscope,
  hospital: Building2,
};

function DocumentCard({
  doc,
  theme,
  onClick,
}: {
  doc: OfficialDocument;
  theme: CategoryTheme;
  onClick: () => void;
}) {
  const Icon = ICON_FOR[doc.kind];
  const tone =
    theme === "navy"
      ? "bg-primary-container/10 text-primary-container"
      : theme === "secondary"
        ? "bg-secondary/10 text-secondary"
        : "bg-emerald-500/10 text-emerald-700";

  const subtitle =
    doc.kind === "official"
      ? doc.issuer
      : doc.kind === "medical"
        ? `${doc.doctor ?? ""}${doc.hospital ? ` · ${doc.hospital}` : ""}`
        : doc.hospital;

  return (
    <article className="flex flex-col h-full rounded-2xl border border-outline-variant bg-white p-5 hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={cn(
            "w-11 h-11 rounded-lg flex items-center justify-center shrink-0",
            tone,
          )}
        >
          <Icon size={20} strokeWidth={1.9} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[14.5px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
            {doc.title}
          </h4>
          {subtitle && (
            <p className="mt-0.5 text-[12px] text-on-surface-variant truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3 text-[11.5px] text-on-surface-variant">
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} />
          {doc.date}
        </span>
        {doc.number && (
          <span className="inline-flex items-center">
            · {doc.number}
          </span>
        )}
        {doc.amount && (
          <span className="inline-flex items-center font-semibold text-primary-container">
            · {doc.amount}
          </span>
        )}
      </div>

      <p className="flex-1 text-[12.5px] leading-[19px] text-on-surface-variant line-clamp-3">
        {doc.description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:border-secondary hover:text-secondary text-[12.5px] font-semibold py-2 transition-all"
      >
        <FileText size={13} />
        Belgeyi Görüntüle
      </button>
    </article>
  );
}

export function DocumentsSection() {
  const { campaign } = useCampaign();
  const { documents } = campaign;
  const [active, setActive] = useState<OfficialDocument | null>(null);

  return (
    <>
      <section className="rounded-2xl border border-outline-variant bg-white p-5 md:p-7">
        <header className="mb-6">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-secondary" />
            <span className="text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
              Şeffaflık · Belgeler
            </span>
          </div>
          <h3 className="mt-1.5 text-[20px] md:text-[24px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
            Resmi Belgeler
          </h3>
          <p className="mt-2 text-[13.5px] leading-[21px] text-on-surface-variant max-w-2xl">
            Bu kampanyanın tüm resmi belgeleri aşağıdadır. Her belge{" "}
            <strong className="text-primary-container">KAMPANYATAKİP</strong>{" "}
            değişmez veritabanında kayıtlıdır; denetim için hazır tutulur.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Valilik */}
          <section className="flex flex-col">
            <CategoryHeader
              icon={ShieldCheck}
              title="Valilik İzni"
              theme="navy"
              count={1}
            />
            <div className="mt-3 flex-1">
              <DocumentCard
                doc={documents.valilik}
                theme="navy"
                onClick={() => setActive(documents.valilik)}
              />
            </div>
          </section>

          {/* Doktor Raporları */}
          <section className="flex flex-col">
            <CategoryHeader
              icon={Stethoscope}
              title="Doktor Raporları"
              theme="secondary"
              count={documents.doktorRaporlari.length}
            />
            <div className="mt-3 flex flex-col gap-3 flex-1">
              {documents.doktorRaporlari.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  theme="secondary"
                  onClick={() => setActive(doc)}
                />
              ))}
            </div>
          </section>

          {/* Hastane Belgeleri */}
          <section className="flex flex-col">
            <CategoryHeader
              icon={Building2}
              title="Hastane Belgeleri"
              theme="emerald"
              count={documents.hastaneBelgeleri.length}
            />
            <div className="mt-3 flex flex-col gap-3 flex-1">
              {documents.hastaneBelgeleri.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  theme="emerald"
                  onClick={() => setActive(doc)}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <DocumentViewerModal
        document={active}
        onClose={() => setActive(null)}
      />
    </>
  );
}

function CategoryHeader({
  icon: Icon,
  title,
  theme,
  count,
}: {
  icon: LucideIcon;
  title: string;
  theme: CategoryTheme;
  count: number;
}) {
  const tone =
    theme === "navy"
      ? "text-primary-container"
      : theme === "secondary"
        ? "text-secondary"
        : "text-emerald-700";
  const badgeTone =
    theme === "navy"
      ? "bg-primary-container/10 text-primary-container"
      : theme === "secondary"
        ? "bg-secondary/10 text-secondary"
        : "bg-emerald-500/10 text-emerald-700";

  return (
    <div className="flex items-center justify-between">
      <h4 className={cn("inline-flex items-center gap-2 font-semibold", tone)}>
        <Icon size={16} strokeWidth={2} />
        <span className="text-[13.5px] tracking-[-0.01em]">{title}</span>
      </h4>
      <span
        className={cn(
          "inline-flex items-center justify-center min-w-[22px] h-5 rounded-full text-[11px] font-bold px-1.5",
          badgeTone,
        )}
      >
        {count}
      </span>
    </div>
  );
}
