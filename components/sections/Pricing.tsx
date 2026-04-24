"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Package = {
  name: string;
  tagline: string;
  price?: string;
  priceText?: string;
  currency?: string;
  period?: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
  ctaStyle: "primary" | "outline";
  href: string;
};

const PACKAGES: Package[] = [
  {
    name: "Temel",
    tagline: "Yeni başlayan küçük kampanyalar için ideal",
    price: "9.900",
    currency: "₺",
    period: "/ay",
    features: [
      "1 sosyal medya platformu (FB, IG veya YT)",
      "2.000 mesaj/ay",
      "300 dk sesli bilgi hattı/ay",
      "5 Türkçe video içerik/ay",
      "Para takibi ve anlık bildirim",
      "Kumbara takip sistemi (QR kod)",
      "Stant takip sistemi",
      "Gönüllü yönetim sistemi",
      "Şeffaflık merkezi (değiştirilemez)",
      "Kampanya sayfası + canlı sayaç",
      "Bağışçı gizlilik maskesi",
      "7/24 yapay zeka asistanı",
      "Günlük otomatik yedekleme",
      "İzole sunucu altyapısı",
      "SSL sertifikası + güvenlik",
      "Günlük/haftalık rapor bildirimi",
      "2-4 iş günü kurulum",
    ],
    ctaText: "Paketi Seç",
    ctaStyle: "outline",
    href: "/demo",
  },
  {
    name: "Standart",
    tagline: "Aktif büyüyen kampanyalar için en popüler seçim",
    price: "17.900",
    currency: "₺",
    period: "/ay",
    featured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Facebook + Instagram + YouTube entegrasyonu",
      "5.000 mesaj/ay",
      "1.000 dk sesli bilgi hattı/ay",
      "15 video içerik/ay (TR + EN + AR)",
      "5 dilde sesli bilgi hattı desteği",
      "Kurumsal bağış e-posta sistemi",
      "Tüm Temel paket özellikleri",
      "Banka entegrasyonu (tüm büyük bankalar)",
      "Otomatik bağış eşleştirme",
      "Çok dilli kampanya sayfası",
      "Sosyal medya otomatik paylaşım",
      "Gelişmiş raporlama ve analitik",
      "Öncelikli teknik destek",
      "Kurumsal bağış vergi bilgilendirme",
      "Canlı yayın gelir takibi",
      "İleri düzey şeffaflık merkezi",
      "Çoklu gönüllü yetkilendirme",
    ],
    ctaText: "Hemen Başla",
    ctaStyle: "primary",
    href: "/demo",
  },
  {
    name: "Premium",
    tagline: "Yüksek hacimli global kampanyalar için sınırsız güç",
    price: "29.900",
    currency: "₺",
    period: "/ay",
    features: [
      "Facebook + Instagram + YouTube + kısa video",
      "Sınırsız mesaj",
      "Sınırsız sesli bilgi hattı",
      "50 video içerik/ay (5 dil: TR+EN+AR+DE+FR)",
      "Influencer radar sistemi",
      "2 saat/ay hukuk danışmanlığı",
      "Kurumsal bağış full sistem",
      "Tüm Standart paket özellikleri",
      "Öncelikli sunucu kaynakları",
      "VIP 7/24 canlı destek hattı",
      "Uluslararası ödeme altyapısı",
      "Gelişmiş AI asistan (çok dilli)",
      "Özel raporlama ve dashboard",
      "Dedicated hesap yöneticisi",
      "Sosyal medya içerik üretim desteği",
      "Gelişmiş güvenlik ve anti-DDoS",
      "Aylık strateji toplantısı",
    ],
    ctaText: "Paketi Seç",
    ctaStyle: "outline",
    href: "/demo",
  },
  {
    name: "Özel",
    tagline: "Dernekler ve vakıflar için tam özelleştirilebilir paket",
    priceText: "4.900 ₺ tabandan",
    period: "+ modül seçimi",
    features: [
      "İhtiyacınıza göre modül seçimi",
      "Beyaz etiket (kendi markanız ile)",
      "Tam API erişimi",
      "Özel destek hattı",
      "Tam sunucu izolasyonu",
      "Özel alan adı ve SSL",
      "Para takibi ve bildirim",
      "Kumbara / stant / gönüllü sistemi",
      "Şeffaflık merkezi",
      "Ek sosyal modül (+4.200 ₺/ay)",
      "Hukuk danışmanı modülü (+5.000 ₺/ay)",
      "Özelleştirilebilir raporlama",
      "Çoklu kampanya yönetimi",
      "Kurumsal SLA garantisi",
      "Eğitim ve onboarding desteği",
      "Özel entegrasyonlar",
    ],
    ctaText: "İletişime Geç",
    ctaStyle: "outline",
    href: "/iletisim",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 md:py-24 bg-surface-container-lowest"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-14 md:mb-16 max-w-2xl mx-auto"
        >
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container mb-4 leading-tight">
            Size Uygun Paketi Seçin
          </h2>
          <p className="text-[16px] md:text-[17px] leading-[26px] text-on-surface-variant">
            Her bütçeye ve kampanya büyüklüğüne uygun, gizli ücreti olmayan
            şeffaf çözümler.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch"
        >
          {PACKAGES.map((pkg) => (
            <motion.div key={pkg.name} variants={item} className="h-full">
              <PackageCard pkg={pkg} />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[12px] text-on-surface-variant/80 max-w-2xl mx-auto">
          Fiyatlar KDV hariçtir. Aylık ödeme sistemiyle çalışıyoruz, sözleşme
          süresi yoktur. Paket limitlerinizin üstüne çıktığınızda aşım ücretleri
          şeffaf şekilde uygulanır.
        </p>
      </Container>
    </section>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const {
    name,
    tagline,
    price,
    priceText,
    currency,
    period,
    featured,
    badge,
    features,
    ctaText,
    ctaStyle,
    href,
  } = pkg;

  return (
    <div
      className={cn(
        "relative h-full flex flex-col p-7 md:p-8 rounded-2xl transition-all duration-300",
        featured
          ? "bg-white border-2 border-secondary shadow-[0_20px_40px_rgba(0,103,127,0.14)] xl:scale-[1.03]"
          : "bg-surface border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)]",
      )}
    >
      {featured && badge && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-[0_4px_6px_rgba(0,103,127,0.25)] whitespace-nowrap">
          {badge}
        </span>
      )}

      <div className="mb-5">
        <h3 className="text-[20px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em]">
          {name}
        </h3>
        <p className="mt-1.5 text-[13px] leading-[20px] text-on-surface-variant min-h-[40px]">
          {tagline}
        </p>
      </div>

      <div className="mb-6 pb-6 border-b border-outline-variant">
        {price ? (
          <div className="flex items-baseline flex-wrap gap-x-1.5">
            <span className="text-[34px] md:text-[38px] font-bold text-primary-container tracking-tight leading-none">
              {price}
            </span>
            <span className="text-[16px] font-semibold text-on-surface-variant">
              {currency}
            </span>
            {period && (
              <span className="text-[14px] text-on-surface-variant">
                {period}
              </span>
            )}
          </div>
        ) : (
          <div>
            <div className="text-[22px] md:text-[24px] font-bold text-primary-container tracking-tight leading-tight">
              {priceText}
            </div>
            {period && (
              <div className="mt-1 text-[13px] text-on-surface-variant">
                {period}
              </div>
            )}
          </div>
        )}
      </div>

      <ul className="flex-1 space-y-2.5 mb-7">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[13.5px] leading-[20px] text-on-surface"
          >
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link href={href} className="mt-auto">
        <Button
          variant={ctaStyle === "primary" ? "primary" : "outline-navy"}
          size="lg"
          className="w-full"
        >
          {ctaText}
        </Button>
      </Link>
    </div>
  );
}
