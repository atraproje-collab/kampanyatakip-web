"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { MODULES } from "@/lib/modules-data";

const containerVariant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function Features() {
  return (
    <section id="features" className="py-8 md:py-12 bg-surface-container-low">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-6 md:mb-16"
        >
          <div className="max-w-2xl">
            <span className="text-[13px] font-semibold text-secondary tracking-widest uppercase">
              Güçlü Altyapı
            </span>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              17 Modül, Tek Sistem
            </h2>
            <p className="mt-3 text-[15px] md:text-[16px] leading-[24px] text-on-surface-variant">
              Her paketi oluşturan standart modüller — kayıt, iletişim,
              şeffaflık ve güvenlik tek platformda.
            </p>
          </div>
          <Link href="/moduller">
            <Button variant="outline-navy" size="md">
              Tüm Modülleri Gör
              <ArrowRight size={14} />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <motion.article
                key={module.slug}
                variants={itemVariant}
                className="flex flex-col h-full rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250 p-4 md:p-5"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                  <h3 className="text-[14.5px] md:text-[15px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
                    {module.title}
                  </h3>
                </div>
                <p className="flex-1 text-[13px] leading-[20px] text-on-surface-variant line-clamp-3">
                  {module.description}
                </p>
                <Link
                  href={`/moduller/${module.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-on-secondary-container group/link"
                >
                  Detaylı İncele
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover/link:translate-x-0.5"
                  />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
