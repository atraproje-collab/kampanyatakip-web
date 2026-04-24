"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { PricingCard, type PricingPackage } from "@/components/ui/PricingCard";

const PACKAGES: PricingPackage[] = [
  {
    name: "Temel",
    tagline: "Yeni başlayan küçük kampanyalar için.",
    price: "9.900",
    currency: "₺",
    period: "/ay",
    features: [
      "Manuel Bağış Girişi",
      "Basit İstatistikler",
      "2 Gönüllü Kullanıcı",
    ],
    ctaText: "Seç",
    ctaStyle: "outline",
  },
  {
    name: "Standart",
    tagline: "Aktif büyüyen tüm kampanyalar için.",
    price: "17.900",
    currency: "₺",
    period: "/ay",
    featured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Banka Entegrasyonu",
      "QR Bağış Sistemi",
      "10 Gönüllü Kullanıcı",
      "Gider Takip Modülü",
    ],
    ctaText: "Hemen Başla",
    ctaStyle: "primary",
  },
  {
    name: "Premium",
    tagline: "Yüksek hacimli global kampanyalar.",
    price: "29.900",
    currency: "₺",
    period: "/ay",
    features: [
      "Mesajlaşma AI Asistan",
      "Çoklu Dil Desteği",
      "Sınırsız Kullanıcı",
    ],
    ctaText: "Seç",
    ctaStyle: "outline",
  },
  {
    name: "Özel",
    tagline: "Dernekler ve vakıflar için özel.",
    priceText: "Teklife Özel",
    features: [
      "Beyaz Etiket (Logo)",
      "API Erişimi",
      "Özel Destek Hattı",
    ],
    ctaText: "İletişime Geç",
    ctaStyle: "outline",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
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
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container mb-4 leading-tight">
            Size Uygun Paketi Seçin
          </h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant max-w-xl mx-auto">
            Her bütçeye ve kampanya büyüklüğüne uygun çözümler.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start"
        >
          {PACKAGES.map((pkg) => (
            <motion.div key={pkg.name} variants={item}>
              <PricingCard pkg={pkg} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
