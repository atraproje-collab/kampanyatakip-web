"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Database,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Languages,
  Lock,
  MessageCircle,
  Phone,
  QrCode,
  Radio,
  Shield,
  Smartphone,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";

type Module = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURED_PRIMARY: Module = {
  icon: CreditCard,
  title: "Para Takibi",
  description:
    "Gelen tüm bağışları banka entegrasyonu ile otomatik eşleştirin. Her havale anlık sisteme düşer, her kuruş kayıt altında.",
};

const FEATURED_SECONDARY: Module = {
  icon: MessageCircle,
  title: "Mesajlaşma AI Asistanı",
  description:
    "7/24 yapay zeka destekli bağışçı iletişimi. Soruları otomatik yanıtlar, talepleri size iletir.",
};

const MODULES: Module[] = [
  {
    icon: QrCode,
    title: "Kumbara Takip",
    description:
      "Saha kumbaralarını QR kod ile yönetin. Konum, sorumlu ve açılış tutanağı kayıt altında.",
  },
  {
    icon: Store,
    title: "Stant Takip Sistemi",
    description:
      "Bağış stantlarınızı dijital yönetin. Günlük kapanış, fotoğraf ve sorumlu kayıtları otomatik.",
  },
  {
    icon: Users,
    title: "Gönüllü Yönetimi",
    description:
      "Gönüllülerinizi, görevlerini ve bağlı oldukları noktaları tek panelden yönetin.",
  },
  {
    icon: Radio,
    title: "Canlı Yayın Gelir Takibi",
    description:
      "Canlı yayın gelirlerini OCR ile okuyup banka ile eşleştirir. Uyarı sistemiyle kayıp yok.",
  },
  {
    icon: FileText,
    title: "Gelir–Gider Şeffaflığı",
    description:
      "Belgesiz harcama işlenemez. Tüm gelir kaynakları ayrı kategoride, değiştirilemez kayıt.",
  },
  {
    icon: Phone,
    title: "5 Dilde Sesli Bilgi Hattı",
    description:
      "0850 hattı üzerinden 5 dilde kampanya bilgisi. Otomatik yanıt sistemi her zaman açık.",
  },
  {
    icon: Globe,
    title: "Kampanya Web Sayfası",
    description:
      "Profesyonel kampanya sayfası, canlı bağış sayacı ve gerçek zamanlı şeffaflık merkezi dahil.",
  },
  {
    icon: EyeOff,
    title: "Bağışçı Gizlilik Maskesi",
    description:
      "İsimler otomatik maskelenir (K***** Y*****). KVKK tam uyum, anonim bağış seçeneği.",
  },
  {
    icon: Shield,
    title: "Değiştirilemez Şeffaflık Merkezi",
    description:
      "Gelen ve giden tüm kalemler değiştirilemez kayıtta. Denetim standardı güvenliği.",
  },
  {
    icon: Lock,
    title: "Otomatik Yedekleme ve Güvenlik",
    description:
      "Kurumsal güvenlik katmanı, günlük otomatik yedek, izole sunucu altyapısı.",
  },
];

const EXTRA_FEATURES: Module[] = [
  {
    icon: Smartphone,
    title: "SMS Entegrasyonu",
    description:
      "Bağışçılarınıza toplu SMS ile bilgilendirme yapın, bağış onay kodları gönderin, kampanya güncellemelerini anında iletin.",
  },
  {
    icon: BarChart3,
    title: "Sosyal Medya Raporu",
    description:
      "Facebook, Instagram, YouTube ve kısa video performansınızı tek panelde görün. Etkileşim, erişim ve dönüşüm oranları otomatik raporlanır.",
  },
  {
    icon: QrCode,
    title: "QR Bağış Sistemi",
    description:
      "Her kumbara, stant ve materyal için özel QR kod üretin. Bağışçılar telefonlarını okutup saniyeler içinde bağış yapabilir.",
  },
  {
    icon: Languages,
    title: "Çoklu Dil Desteği",
    description:
      "Kampanya sayfanız 5 dilde yayında: Türkçe, İngilizce, Arapça, Almanca, Fransızca. Uluslararası bağışçılara ulaşın.",
  },
];

const containerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-24 bg-surface-container-low">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12 md:mb-16"
        >
          <div className="max-w-2xl">
            <span className="text-[13px] font-semibold text-secondary tracking-widest uppercase">
              Güçlü Altyapı
            </span>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              12 Modül, Tek Sistem
            </h2>
          </div>
          <p className="text-[15px] md:text-[16px] leading-[24px] text-on-surface-variant max-w-md">
            Kampanyanızın her aşamasını dijitalleştiren kapsamlı araç seti —
            kayıt, iletişim, şeffaflık ve güvenlik tek platformda.
          </p>
        </motion.div>

        {/* Featured row */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"
        >
          <FeaturedCard
            module={FEATURED_PRIMARY}
            accent="primary"
            decorative={Database}
          />
          <FeaturedCard
            module={FEATURED_SECONDARY}
            accent="secondary"
            decorative={Eye}
          />
        </motion.div>

        {/* 10 standard modules */}
        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5"
        >
          {MODULES.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariant}
              className="h-full p-5 rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
            >
              <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-3.5">
                <Icon size={20} strokeWidth={1.85} />
              </div>
              <h3 className="text-[14.5px] font-semibold text-primary-container mb-1.5 tracking-[-0.01em] leading-[20px]">
                {title}
              </h3>
              <p className="text-[12.5px] leading-[18px] text-on-surface-variant">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Extra features subsection */}
        <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-outline-variant">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
          >
            <span className="text-[12px] font-semibold text-secondary uppercase tracking-[0.18em]">
              Tüm Paketlerde Standart
            </span>
            <h3 className="mt-3 text-[22px] md:text-[26px] font-semibold tracking-[-0.01em] text-primary-container leading-tight">
              Ek Entegre Özellikler
            </h3>
            <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
              12 ana modüle ek olarak, kampanyanızı güçlendiren entegrasyonlar.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {EXTRA_FEATURES.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariant}
                className="h-full p-6 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-4">
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h4 className="text-[15.5px] font-semibold text-primary-container tracking-[-0.01em] mb-2">
                  {title}
                </h4>
                <p className="text-[13px] leading-[20px] text-on-surface-variant">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function FeaturedCard({
  module,
  accent,
  decorative: Decor,
}: {
  module: Module;
  accent: "primary" | "secondary";
  decorative: LucideIcon;
}) {
  const isPrimary = accent === "primary";
  return (
    <motion.div
      variants={itemVariant}
      className={`relative overflow-hidden rounded-2xl p-7 md:p-8 min-h-[220px] flex flex-col justify-between group ${
        isPrimary
          ? "bg-primary-container text-white"
          : "bg-secondary text-on-secondary"
      }`}
    >
      <div className="relative z-10 max-w-md">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
            isPrimary
              ? "bg-secondary-container/20 text-secondary-container"
              : "bg-white/20 text-white"
          }`}
        >
          <module.icon size={24} />
        </div>
        <h3 className="text-[22px] md:text-[24px] font-semibold tracking-[-0.01em] mb-2 leading-tight">
          {module.title}
        </h3>
        <p
          className={`text-[14px] leading-[22px] ${
            isPrimary ? "text-surface-variant/90" : "text-white/90"
          }`}
        >
          {module.description}
        </p>
      </div>
      <Decor
        size={170}
        strokeWidth={1.3}
        aria-hidden
        className={`absolute -right-6 -bottom-6 transition-transform duration-500 group-hover:scale-110 ${
          isPrimary ? "text-white/10" : "text-white/15"
        }`}
      />
    </motion.div>
  );
}
