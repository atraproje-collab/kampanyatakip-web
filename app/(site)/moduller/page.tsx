import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { MODULES } from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tüm Modüller",
  description:
    "KAMPANYATAKİP platformunda her pakette standart olarak gelen 17 modülün tamamı — kayıt, iletişim, şeffaflık ve güvenlik.",
};

export default function ModullerIndexPage() {
  return (
    <>
      <PageHeader
        title="Tüm Modüller"
        description="Her pakette standart olarak gelen 17 modülün tamamı"
        badge="17 MODÜL"
      />

      <section className="py-6 md:py-10">
        <Container>
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <p className="text-[15px] leading-[24px] text-on-surface-variant max-w-2xl">
              KAMPANYATAKİP, bağış yönetiminin her aşamasını dijitalleştirmek
              için 17 modülü tek bir platformda birleştirir. Aşağıdaki
              modüllerin tamamı <strong className="text-primary-container">
                her pakete
              </strong>{" "}
              standart olarak dahildir.
            </p>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-secondary uppercase tracking-[0.14em] whitespace-nowrap">
              <Sparkles size={13} />
              Tümü pakete dahil
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.slug}
                  href={`/moduller/${module.slug}`}
                  className="group flex flex-col h-full rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250 p-4 md:p-5"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                      <Icon size={18} strokeWidth={1.85} />
                    </span>
                    <h2 className="text-[15px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
                      {module.title}
                    </h2>
                  </div>
                  <p className="flex-1 text-[13px] leading-[20px] text-on-surface-variant line-clamp-3">
                    {module.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary group-hover:text-on-secondary-container">
                    Detaylı İncele
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

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
              <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em] leading-tight">
                17 modül, tek izole sunucu, 2-4 iş günü kurulum
              </h2>
              <p className="mt-4 text-[15px] md:text-[17px] leading-[26px] text-white/85">
                Kampanyanız için tüm modüller KAMPANYATAKİP altyapısında
                birlikte çalışır. Canlı demo'yu inceleyin veya doğrudan
                başvurunuzu iletin.
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
                    Canlı Demo&apos;yu İncele
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
