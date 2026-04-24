"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/Container";
import { PricingCard } from "@/components/ui/PricingCard";
import { CustomPackageModal } from "@/components/pricing/CustomPackageModal";
import { ADDON_PACKAGES, PACKAGES } from "@/lib/packages-data";

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
            <motion.div key={pkg.id} variants={item} className="h-full">
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

        {/* Ek paketler */}
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-secondary uppercase tracking-[0.14em]">
              <Plus size={14} />
              Ek Paketler
            </span>
            <h3 className="mt-2 text-[22px] md:text-[26px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
              İhtiyacınıza göre her ana pakete ekleyin
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {ADDON_PACKAGES.map((addon) => (
              <div
                key={addon.id}
                className="rounded-2xl border border-outline-variant bg-white p-6 hover:border-secondary hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h4 className="text-[16px] font-semibold text-primary-container tracking-[-0.01em]">
                    {addon.name}
                  </h4>
                  <span className="shrink-0 inline-flex items-center rounded-full bg-secondary/10 text-secondary px-3 py-1 text-[12px] font-bold tabular-nums whitespace-nowrap">
                    {addon.priceLabel}
                  </span>
                </div>
                <p className="text-[13px] leading-[21px] text-on-surface-variant">
                  {addon.description}
                </p>
                <p className="mt-3 text-[11.5px] font-semibold text-on-surface-variant/85 uppercase tracking-wider">
                  {addon.compatibility}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <CustomPackageModal
        isOpen={customOpen}
        onClose={() => setCustomOpen(false)}
      />
    </section>
  );
}
