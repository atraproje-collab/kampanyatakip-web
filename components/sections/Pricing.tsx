"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { PricingCard, type PricingPackage } from "@/components/ui/PricingCard";
import { CustomPackageModal } from "@/components/pricing/CustomPackageModal";

const PACKAGES: PricingPackage[] = [
  {
    name: "Temel",
    tagline: "Yeni başlayan küçük kampanyalar için ideal",
    price: "9.900",
    currency: "₺",
    period: "/ay",
    features: [
      "1 sosyal medya platformu (FB, IG veya YT)",
      "2.000 mesaj/ay (1.000 gelen + 1.000 giden)",
      "300 dakika sesli bilgi hattı/ay",
      "5 Türkçe video içerik/ay",
      "Canlı yayın gelir takibi (OCR + banka eşleştirme)",
      "Para takibi ve anlık bildirim",
      "Kumbara takip sistemi (QR kod)",
      "Stant takip sistemi",
      "Gönüllü yönetim sistemi (2 kullanıcı)",
      "Şeffaflık merkezi (değiştirilemez)",
      "Kampanya web sayfası + canlı sayaç",
      "Bağışçı gizlilik maskesi (KVKK uyumlu)",
      "7/24 yapay zeka mesajlaşma asistanı",
      "Günlük otomatik yedekleme",
      "İzole sunucu altyapısı + SSL",
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
    includesBadge: "TEMEL'DEKİ HER ŞEY + ŞUNLAR",
    features: [
      "Facebook + Instagram + YouTube entegrasyonu",
      "5.000 mesaj/ay (2.500 gelen + 2.500 giden)",
      "1.000 dakika sesli bilgi hattı/ay",
      "15 video içerik/ay (Türkçe + İngilizce + Arapça)",
      "3 dilde sesli bilgi hattı desteği",
      "Banka entegrasyonu (tüm büyük Türk bankaları)",
      "Otomatik bağış eşleştirme",
      "Kurumsal bağış e-posta sistemi",
      "Çok dilli kampanya sayfası (3 dil)",
      "Sosyal medya otomatik paylaşım",
      "Gelişmiş raporlama ve analitik",
      "10 gönüllü kullanıcı",
      "Öncelikli teknik destek (iş saatleri)",
    ],
    ctaText: "Hemen Başla",
    ctaStyle: "primary",
    href: "/demo",
  },
  {
    name: "Premium",
    tagline: "Yüksek hacimli global kampanyalar için",
    price: "29.900",
    currency: "₺",
    period: "/ay",
    includesBadge: "STANDART'TAKİ HER ŞEY + ŞUNLAR",
    features: [
      "4 sosyal platform aktif (kısa video dahil)",
      "Sınırsız mesaj hakkı",
      "Sınırsız sesli bilgi hattı",
      "50 video içerik/ay (5 dil: TR + EN + AR + DE + FR)",
      "5 dilde tam destek",
      "Influencer radar sistemi",
      "2 saat/ay hukuk danışmanlığı",
      "Kurumsal bağış full sistem",
      "Uluslararası ödeme altyapısı",
      "Öncelikli sunucu kaynakları",
      "VIP 7/24 canlı teknik destek",
      "Sınırsız gönüllü kullanıcı",
      "Dedicated hesap yöneticisi",
      "Gelişmiş AI asistan (çok dilli)",
      "Aylık strateji toplantısı",
    ],
    ctaText: "Paketi Seç",
    ctaStyle: "outline",
    href: "/demo",
  },
  {
    name: "Özel",
    tagline: "Dernekler ve vakıflar için özelleştirilebilir paket",
    priceText: "4.900 ₺",
    priceSubtext: "tabandan başlayan",
    period: "+ modül seçimi",
    isCustom: true,
    badge: "KENDİN OLUŞTUR",
    features: [
      "İhtiyaca göre modül seçimi",
      "Tam özelleştirilebilir fiyatlandırma",
      "Taban standart modüller dahil",
      "İsteğe bağlı ek modüller",
      "Beyaz etiket (kendi markanız)",
      "API erişimi opsiyonu",
      "Özel destek hattı seçeneği",
    ],
    ctaText: "Paketini Oluştur",
    ctaStyle: "custom",
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
  const [customOpen, setCustomOpen] = useState(false);

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
              <PricingCard
                pkg={pkg}
                onCustomClick={() => setCustomOpen(true)}
              />
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-[12.5px] text-on-surface-variant/85 max-w-2xl mx-auto">
          Fiyatlar KDV hariçtir. Aylık ödeme sistemiyle çalışıyoruz, minimum
          sözleşme süresi yoktur. Paket limitlerinizi aştığınızda aşım
          ücretleri şeffaf şekilde uygulanır.
        </p>
      </Container>

      <CustomPackageModal
        isOpen={customOpen}
        onClose={() => setCustomOpen(false)}
      />
    </section>
  );
}
