import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  FileCheck,
  FileEdit,
  Presentation,
  Quote,
  Rocket,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { DemoRequestForm } from "@/components/pages/DemoRequestForm";
import { faqItems } from "@/lib/faq-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kampanya Başvuru",
  description:
    "Kampanyanızı KAMPANYATAKİP altyapısında başlatmak için başvurunuzu gönderin. 1 iş günü içinde dönüş yapılır; 2-4 iş günü içinde kampanyanız yayında.",
};

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
  duration?: string;
};

const NEXT_STEPS: Step[] = [
  {
    icon: FileEdit,
    title: "Başvurunuzu alırız",
    description:
      "Ekibimiz, paylaştığınız bilgileri 1 iş günü içinde inceler ve size dönüş yapar.",
    duration: "1 iş günü",
  },
  {
    icon: Presentation,
    title: "Özel sunum planlarız",
    description:
      "30-45 dakikalık çevrimiçi bir demo ile KAMPANYATAKİP altyapısını canlı gösteririz.",
    duration: "30-45 dk",
  },
  {
    icon: FileCheck,
    title: "Sözleşme ve paket seçimi",
    description:
      "İhtiyacınıza uygun paketi birlikte belirler, kampanyanızın sözleşmesini hazırlarız.",
    duration: "Aynı hafta",
  },
  {
    icon: Rocket,
    title: "Kampanyanız yayında",
    description:
      "İzole sunucunuz hazırlanır, alan adınız yapılandırılır, ekibinize eğitim verilir.",
    duration: "2-4 iş günü",
  },
];

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "Valilik Onaylı Platform" },
  { icon: ShieldCheck, label: "KVKK Uyumlu" },
  { icon: Star, label: "Türkiye'nin İlk Denetim Standardı" },
];

const TESTIMONIALS = [
  {
    quote:
      "Platformun ilk kullanıcılarından biri olmaktan memnunuz. Şeffaflık konusundaki yaklaşım, alanında bir devrim niteliğinde.",
    source: "Sağlık Alanında Faaliyet Gösteren Bir Dernek",
  },
  {
    quote:
      "Kurulum hızı ve teknik ekip desteği beklentimizin üzerindeydi. Bağışçılarımızdan gelen olumlu geri bildirimler çok değerli.",
    source: "SMA Tedavisi İçin Kampanya Yürüten Bir Komisyon",
  },
  {
    quote:
      "Platformun potansiyelini gördük ve erken erişim avantajlarından faydalandık. Türkiye'de bu alanda bir ihtiyacı karşılıyor.",
    source: "Eğitim Bağışları Alanında Aktif Bir Vakıf",
  },
];

export default function BasvuruPage() {
  const teaserFaqs = faqItems.slice(0, 3);

  return (
    <>
      <PageHeader
        title="Kampanya Başvurusu"
        description="Demo'muzu incelediniz. Şimdi kendi kampanyanızı başlatalım."
        badge="ERKEN ERİŞİM"
      />

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            {/* Left: Next steps */}
            <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-24">
              <div>
                <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
                  Süreç
                </span>
                <h2 className="mt-3 text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
                  Başvurunuzu aldıktan sonra
                </h2>
                <p className="mt-2 text-[14px] leading-[22px] text-on-surface-variant">
                  Basit ve net bir süreç — her adımda ne olacağını önceden
                  biliyorsunuz.
                </p>
              </div>

              <ol className="relative border-l-2 border-outline-variant pl-6 space-y-6">
                {NEXT_STEPS.map(({ icon: Icon, title, description, duration }, i) => (
                  <li key={title} className="relative">
                    <span className="absolute -left-[34px] top-0 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_0_4px_var(--color-surface)] text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <div className="flex items-start gap-2.5">
                      <Icon
                        size={16}
                        className="mt-0.5 text-secondary shrink-0"
                        strokeWidth={2}
                      />
                      <div className="min-w-0">
                        <h3 className="text-[14.5px] font-semibold text-primary-container tracking-[-0.01em]">
                          {title}
                        </h3>
                        {duration && (
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-secondary uppercase tracking-wider">
                            <CalendarClock size={11} />
                            {duration}
                          </p>
                        )}
                        <p className="mt-1 text-[13px] leading-[20px] text-on-surface-variant">
                          {description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Trust badges */}
              <div className="pt-5 border-t border-outline-variant">
                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  {TRUST_BADGES.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider"
                    >
                      <Icon size={14} className="text-secondary" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[12.5px] leading-[19px] text-on-surface-variant bg-surface-container-low border border-outline-variant rounded-xl p-4">
                <strong className="text-primary-container">
                  Henüz karar vermediniz mi?
                </strong>{" "}
                Önce{" "}
                <Link
                  href={siteConfig.urls.campaignDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline"
                >
                  canlı demo kampanyayı
                </Link>{" "}
                inceleyebilir, sistemin nasıl çalıştığını görebilirsiniz.
              </p>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <DemoRequestForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Öncü Kuruluşlar
            </span>
            <h2 className="mt-3 text-[26px] md:text-[32px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
              Erken Erişimin Sesleri
            </h2>
            <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP&apos;i erken erişim programında deneyen
              öncülerimizin yorumları.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.source}
                className="relative rounded-2xl bg-white border border-outline-variant p-7 hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <Quote
                  size={32}
                  className="text-secondary/25 mb-4"
                  strokeWidth={2.25}
                />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="text-secondary fill-secondary"
                    />
                  ))}
                </div>
                <p className="text-[14px] leading-[22px] text-on-surface mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  — {t.source}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ teaser */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em]">
              Başvuru öncesi merak ettikleriniz?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {teaserFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-outline-variant bg-surface-container-low p-6"
              >
                <h3 className="text-[15px] font-semibold text-primary-container tracking-[-0.01em] mb-3 leading-[22px]">
                  {faq.question}
                </h3>
                <p className="text-[13px] leading-[20px] text-on-surface-variant line-clamp-4">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href={siteConfig.urls.faq}>
              <Button variant="outline-navy" size="md">
                Tüm SSS&apos;i Gör
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
