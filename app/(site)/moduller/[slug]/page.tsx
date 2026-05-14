import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Cog,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import {
  MODULES,
  getModule,
  getRelatedModules,
} from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return MODULES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const module = getModule(slug);
  if (!module) return { title: "Modül Bulunamadı" };
  return {
    title: module.title,
    description: module.description,
  };
}

export default async function ModuleDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const module = getModule(slug);
  if (!module) notFound();

  const related = getRelatedModules(slug);
  const Icon = module.icon;

  return (
    <>
      <PageHeader
        title={module.title}
        description={module.description}
        breadcrumb={`Modüller · ${module.shortTitle}`}
        badge="TÜM PAKETLERDE STANDART"
      />

      {/* Hero */}
      <section className="py-6 md:py-10">
        <Container>
          <Link
            href="/moduller"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-on-surface-variant hover:text-secondary transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Tüm Modüller
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            <div className="lg:col-span-3">
              <p className="text-[16px] md:text-[17px] leading-[28px] text-on-surface-variant">
                {module.heroText}
              </p>
            </div>
            <aside className="lg:col-span-2">
              <div className="rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white p-7 md:p-8 shadow-[0_14px_30px_rgba(0,24,53,0.15)]">
                <div className="w-14 h-14 rounded-xl bg-secondary-container/25 text-secondary-container flex items-center justify-center mb-5">
                  <Icon size={26} strokeWidth={1.85} />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-secondary-container uppercase tracking-[0.14em]">
                  <BadgeCheck size={13} />
                  Pakete Dahil
                </span>
                <h3 className="mt-2 text-[20px] md:text-[22px] font-semibold tracking-[-0.01em] leading-tight">
                  {module.shortTitle}
                </h3>
                <p className="mt-2 text-[13px] leading-[20px] text-white/80">
                  Bu modül Temel, Standart, Premium ve Özel paketlerin
                  tamamında ek ücret olmaksızın bulunur.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-6 md:py-10 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
              <Layers size={13} />
              Ne Yapar?
            </span>
            <h2 className="mt-2 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
              Özellikler
            </h2>
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
              {module.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-xl bg-white border border-outline-variant p-4"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10 text-secondary shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className="text-[14px] leading-[22px] text-on-surface">
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
              <Cog size={13} />
              Nasıl Çalışır?
            </span>
            <h2 className="mt-2 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
              Adım Adım Akış
            </h2>
            <ol className="mt-8 relative border-l-2 border-outline-variant pl-7 space-y-6 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-6 md:space-y-0 md:border-l-0 md:pl-0">
              {module.howItWorks.map((step, i) => (
                <li key={step.title} className="relative md:pl-12">
                  <span className="absolute -left-[38px] md:left-0 top-0 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_0_4px_var(--color-surface)] text-[13px] font-bold">
                    {i + 1}
                  </span>
                  <h4 className="text-[15px] font-semibold text-primary-container tracking-[-0.01em]">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-[13.5px] leading-[21px] text-on-surface-variant">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-6 md:py-10 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
              <Zap size={13} />
              Faydaları
            </span>
            <h2 className="mt-2 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
              Kampanya Sahibine Sağladığı
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.benefits.map((b) => (
                <div
                  key={b}
                  className="rounded-2xl bg-white border border-outline-variant p-5 flex items-start gap-3"
                >
                  <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Sparkles size={16} strokeWidth={2} />
                  </span>
                  <p className="text-[14px] leading-[22px] text-on-surface">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Technical details */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl bg-primary-container text-white p-7 md:p-9 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(at 15% 20%, rgba(102,218,255,0.18) 0%, transparent 55%)",
              }}
            />
            <div className="relative">
              <span className="text-[11px] font-bold text-secondary-container uppercase tracking-[0.14em]">
                Teknik Derinlik
              </span>
              <h2 className="mt-2 text-[20px] md:text-[24px] font-semibold tracking-[-0.01em] leading-tight">
                Altyapı Detayları
              </h2>
              <ul className="mt-5 space-y-2.5">
                {module.technicalDetails.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-3 text-[14px] leading-[22px] text-white/85"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary-container/25 text-secondary-container shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Related modules */}
      {related.length > 0 && (
        <section className="py-6 md:py-10 bg-surface-container-lowest border-y border-outline-variant">
          <Container>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
              <div>
                <span className="text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
                  İlgili Modüller
                </span>
                <h2 className="mt-1 text-[22px] md:text-[26px] font-semibold text-primary-container tracking-[-0.01em]">
                  Birlikte Daha Güçlü
                </h2>
              </div>
              <Link
                href="/moduller"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-on-secondary-container"
              >
                Tüm Modüller
                <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <Link
                    key={rel.slug}
                    href={`/moduller/${rel.slug}`}
                    className="group flex flex-col h-full rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250 p-4 md:p-5"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                        <RelIcon size={17} strokeWidth={1.9} />
                      </span>
                      <h3 className="text-[14px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
                        {rel.title}
                      </h3>
                    </div>
                    <p className="flex-1 text-[12.5px] leading-[19px] text-on-surface-variant line-clamp-3">
                      {rel.description}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-secondary">
                      Detaylı İncele
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 hero-gradient text-white text-center">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(at 20% 20%, rgba(102,218,255,0.18) 0%, transparent 55%), radial-gradient(at 80% 80%, rgba(118,150,200,0.12) 0%, transparent 50%)",
              }}
            />
            <div className="relative max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-secondary-container uppercase tracking-[0.14em]">
                <BadgeCheck size={13} />
                Tüm Paketlerde Standart
              </span>
              <h2 className="mt-3 text-[24px] md:text-[30px] font-bold tracking-[-0.02em] leading-tight">
                Bu modül tüm paketlerde standart olarak gelir
              </h2>
              <p className="mt-4 text-[15px] md:text-[16px] leading-[26px] text-white/85">
                Canlı demo'yu inceleyerek {module.shortTitle} modülünün
                işleyişini görebilir, kendi kampanyanız için başvurunuzu
                gönderebilirsiniz.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={siteConfig.urls.campaignDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full sm:w-auto"
                  >
                    Demo İncele
                  </Button>
                </Link>
                <Link href={siteConfig.urls.apply}>
                  <Button
                    variant="outline-white"
                    size="xl"
                    className="w-full sm:w-auto"
                  >
                    Başvurunuzu Gönderin
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
