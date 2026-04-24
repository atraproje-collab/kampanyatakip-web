import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { AccordionFAQ } from "@/components/pages/AccordionFAQ";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "KAMPANYATAKİP hakkında merak edilen tüm soruların cevapları.",
};

export default function SSSPage() {
  return (
    <>
      <PageHeader
        title="Sıkça Sorulan Sorular"
        description="KAMPANYATAKİP hakkında merak edilen tüm soruların cevapları"
      />

      <section className="py-14 md:py-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            <AccordionFAQ />
          </div>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="max-w-3xl mx-auto rounded-2xl bg-surface-container border border-outline-variant p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-5">
              <MessageCircleQuestion size={26} />
            </div>
            <h2 className="text-[22px] md:text-[26px] font-semibold text-primary-container tracking-[-0.01em]">
              Aradığınız cevabı bulamadınız mı?
            </h2>
            <p className="mt-2 text-[15px] leading-[24px] text-on-surface-variant">
              Sorunuzu bize iletin, 1 iş günü içinde dönüş yapalım.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href={siteConfig.urls.contact}>
                <Button variant="primary" size="lg" className="group/btn">
                  İletişime Geç
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-250 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
