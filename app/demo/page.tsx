import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Clock,
  Quote,
  ShieldCheck,
  Star,
  Video,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { DemoRequestForm } from "@/components/pages/DemoRequestForm";
import { faqItems } from "@/lib/faq-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ücretsiz Demo Talep Edin",
  description:
    "KAMPANYATAKİP'in tüm modüllerini görmek için ücretsiz demo talep edin. 30-45 dakikalık online sunum.",
};

const CHECKLIST = [
  "Canlı kampanya sayfası örneği (şeffaflık merkezi dahil)",
  "Anlık bağış takibi ve mesajlaşma entegrasyonu",
  "Kumbara ve stant yönetim sistemi",
  "Yönetim paneli arayüzü",
  "Raporlama ve istatistik örnekleri",
  "Size özel fiyat teklifi ve paket önerisi",
  "Sorularınızın tamamına yanıt",
];

type Info = { icon: LucideIcon; label: string; accent?: boolean };
const INFO_ITEMS: Info[] = [
  { icon: Clock, label: "Süre: 30-45 dakika" },
  { icon: Video, label: "Format: Online sunum" },
  { icon: Check, label: "Ücret: Ücretsiz", accent: true },
  { icon: XCircle, label: "Bağlayıcı değil" },
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

export default function DemoPage() {
  const teaserFaqs = faqItems.slice(0, 3);

  return (
    <>
      <PageHeader
        title="Ücretsiz Demo Talep Edin"
        description="Size özel bir demo hazırlayalım, tüm modülleri görün"
        badge="ERKEN ERİŞİM"
      />

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            {/* Left: What you'll see */}
            <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-24">
              <div>
                <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
                  Demo İçeriği
                </span>
                <h2 className="mt-3 text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
                  Demo&apos;da Neler Var?
                </h2>
                <p className="mt-2 text-[14px] text-on-surface-variant">
                  30-45 dakikalık özel sunumda:
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {CHECKLIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[14px] leading-[22px] text-on-surface"
                  >
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/10 text-secondary shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Info box */}
              <div className="rounded-2xl border-2 border-secondary/30 bg-surface-container p-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {INFO_ITEMS.map((i) => (
                    <div
                      key={i.label}
                      className={`flex items-center gap-2 text-[13px] font-medium ${
                        i.accent ? "text-secondary" : "text-primary-container"
                      }`}
                    >
                      <i.icon size={16} strokeWidth={2} />
                      {i.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-outline-variant">
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
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <DemoRequestForm />
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Öncü Kuruluşlar
            </span>
            <h2 className="mt-3 text-[26px] md:text-[32px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
              Erken Erişimin Sesleri
            </h2>
            <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP&apos;i erken erişim programında deneyen öncülerimizin
              yorumları.
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
              Demo&apos;dan önce merak ettikleriniz?
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
