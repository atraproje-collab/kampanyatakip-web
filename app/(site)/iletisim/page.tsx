import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { ContactForm } from "@/components/pages/ContactForm";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/lib/site-config";
import { faqItems } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "KAMPANYATAKİP ekibiyle iletişime geçin. Sorularınıza 1 iş günü içinde dönüş yapıyoruz.",
};

type ContactCard = {
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
  external?: boolean;
  note?: string;
  accent?: boolean;
};

const CONTACT_CARDS: ContactCard[] = [
  {
    icon: Mail,
    title: "E-posta",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: Phone,
    title: "Telefon",
    value: siteConfig.contact.phone,
    href: siteConfig.contact.phoneLink,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: siteConfig.contact.whatsapp,
    href: siteConfig.contact.whatsappLink,
    external: true,
    note: "En hızlı dönüş",
    accent: true,
  },
  {
    icon: MapPin,
    title: "Ofis",
    value: siteConfig.contact.address,
  },
  {
    icon: Clock,
    title: "Çalışma Saatleri",
    value: siteConfig.contact.workingHours,
  },
];

type SocialKey = "linkedin" | "twitter" | "instagram" | "facebook" | "youtube";

export default function IletisimPage() {
  const socials = (
    Object.entries(siteConfig.social) as Array<[SocialKey, string | null]>
  ).filter(([, url]) => Boolean(url));

  const teaserFaqs = faqItems.slice(0, 3);

  return (
    <>
      <PageHeader
        title="İletişime Geçin"
        description="Sorularınızı yanıtlayalım, size özel çözüm sunalım"
      />

      <section className="py-6 md:py-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Left column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h2 className="text-[20px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] mb-2">
                İletişim Bilgilerimiz
              </h2>

              <div className="flex flex-col gap-3">
                {CONTACT_CARDS.map((card) => {
                  const Inner = (
                    <div
                      className={`group flex items-start gap-4 rounded-2xl border p-5 transition-all duration-250 ${
                        card.accent
                          ? "bg-secondary/5 border-secondary/30 hover:border-secondary"
                          : "bg-white border-outline-variant hover:border-secondary"
                      } ${card.href ? "hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,24,53,0.06)]" : ""}`}
                    >
                      <div
                        className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                          card.accent
                            ? "bg-secondary text-on-secondary"
                            : "bg-surface-container-high text-primary-container group-hover:bg-secondary group-hover:text-on-secondary transition-colors"
                        }`}
                      >
                        <card.icon size={20} strokeWidth={1.85} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                          {card.title}
                        </div>
                        <div className="text-[15px] font-semibold text-primary-container break-words">
                          {card.value}
                        </div>
                        {card.note && (
                          <div className="text-[12px] text-secondary font-medium mt-1">
                            {card.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return card.href ? (
                    <a
                      key={card.title}
                      href={card.href}
                      {...(card.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : {})}
                    >
                      {Inner}
                    </a>
                  ) : (
                    <div key={card.title}>{Inner}</div>
                  );
                })}
              </div>

              {socials.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-3">
                    Sosyal Medya
                  </h3>
                  <div className="flex gap-2">
                    {socials.map(([key, url]) => (
                      <a
                        key={key}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={key}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-secondary hover:text-secondary hover:-translate-y-0.5 transition-all"
                      >
                        <SocialIcon platform={key} size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ teaser */}
      <section className="py-8 md:py-10 bg-surface-container-lowest border-t border-outline-variant">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em]">
              Hızlı Cevaplar
            </h2>
            <p className="mt-2 text-[15px] text-on-surface-variant">
              Belki aradığınız cevap burada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {teaserFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-outline-variant bg-white p-6 hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
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
                Tüm Soruları Gör
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
