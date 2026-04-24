"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Database,
  FileText,
  Megaphone,
  MessageCircle,
  QrCode,
  Receipt,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";

type SmallModule = { icon: LucideIcon; label: string };

const SMALL_MODULES: SmallModule[] = [
  { icon: Users, label: "Gönüllü Yönetimi" },
  { icon: FileText, label: "Resmi Evraklar" },
  { icon: Megaphone, label: "Duyuru Paneli" },
  { icon: Receipt, label: "Gider Takibi" },
];

const TAGS = [
  "SMS Entegrasyonu",
  "Sosyal Medya Raporu",
  "QR Bağış Sistemi",
  "Çoklu Dil Desteği",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-24 bg-surface-container-low"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-12 md:mb-16"
        >
          <div>
            <span className="text-[13px] font-semibold text-secondary tracking-widest uppercase">
              Güçlü Altyapı
            </span>
            <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container mt-2 leading-tight">
              12 Modül, Tek Sistem
            </h2>
          </div>
          <p className="text-[16px] leading-[24px] text-on-surface-variant max-w-md">
            Kampanyanızın her aşamasını dijitalleştiren kapsamlı araç seti.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5"
        >
          {/* Big — Para Takibi */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 md:col-span-2 md:row-span-2 bg-primary-container text-white p-8 rounded-2xl flex flex-col justify-between overflow-hidden relative group min-h-[260px] md:min-h-[280px]"
          >
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary-container/20 text-secondary-container mb-5">
                <CreditCard size={26} />
              </div>
              <h3 className="text-[22px] md:text-[24px] font-semibold tracking-[-0.01em] mb-2">
                Para Takibi
              </h3>
              <p className="text-[14px] leading-[22px] text-surface-variant/90">
                Gelen tüm bağışları banka entegrasyonu ile otomatik eşleştirin.
              </p>
            </div>
            <Database
              size={160}
              className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform duration-500"
              strokeWidth={1.5}
              aria-hidden
            />
          </motion.div>

          {/* Wide — Kumbara Takip */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 bg-white p-6 rounded-2xl border border-outline-variant flex items-center gap-4 hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
          >
            <div className="bg-surface-container-high w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <QrCode size={22} className="text-primary-container" />
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-primary-container mb-0.5">
                Kumbara Takip
              </h4>
              <p className="text-[12px] leading-[16px] text-on-surface-variant">
                Saha kumbaralarını QR kod ile yönetin.
              </p>
            </div>
          </motion.div>

          {/* Wide — Mesajlaşma AI */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 bg-secondary text-on-secondary p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,103,127,0.25)] transition-all duration-250"
          >
            <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle size={22} />
            </div>
            <div>
              <h4 className="text-[14px] font-semibold mb-0.5">Mesajlaşma AI</h4>
              <p className="text-[12px] leading-[16px] text-white/85">
                Destekçilere otomatik bilgilendirme.
              </p>
            </div>
          </motion.div>

          {/* Small modules (4x) */}
          {SMALL_MODULES.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-white p-4 rounded-2xl border border-outline-variant text-center hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
            >
              <Icon
                size={24}
                className="text-primary-container mx-auto mb-2"
              />
              <p className="text-[12px] font-semibold text-primary-container">
                {label}
              </p>
            </motion.div>
          ))}

          {/* Tags strip */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 md:col-span-4 lg:col-span-6 bg-surface-container p-5 md:p-6 rounded-2xl flex flex-wrap justify-center gap-x-8 gap-y-3"
          >
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-2 text-[13px] font-semibold text-primary-container"
              >
                <CheckCircle2 size={16} className="text-secondary" />
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
