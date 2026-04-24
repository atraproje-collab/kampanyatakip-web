"use client";

import { motion } from "framer-motion";
import { Eye, ShieldCheck, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { Container } from "@/components/Container";

type ValueProp = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const ITEMS: ValueProp[] = [
  {
    icon: ShieldCheck,
    title: "GÜVENLİ",
    description:
      "En üst düzey şifreleme ile verileriniz ve bağışlarınız her an güvende.",
  },
  {
    icon: Eye,
    title: "ŞEFFAF",
    description:
      "Her bağışı anında listeleyebilir ve destekçilerinize raporlayabilirsiniz.",
  },
  {
    icon: TrendingUp,
    title: "ANLIK TAKİP",
    description:
      "Mobil uygulama üzerinden 7/24 tüm kampanya sürecini izleyin.",
  },
  {
    icon: Users,
    title: "DAHA FAZLA DESTEK",
    description:
      "Profesyonel görünüm ve şeffaflıkla güven tazeleyin, desteği artırın.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export function ValueProps() {
  return (
    <section id="value-props" className="py-20 md:py-24 bg-surface-container-lowest">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-14 md:mb-16"
        >
          <h2 className="text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container mb-4 leading-tight">
            Neden KAMPANYATAKİP?
          </h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="group bg-surface-container-low p-8 rounded-xl border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
            >
              <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mb-6 shadow-[0_1px_2px_rgba(0,24,53,0.04)] group-hover:bg-secondary transition-colors duration-250">
                <Icon
                  size={22}
                  className="text-primary-container group-hover:text-on-secondary transition-colors duration-250"
                />
              </div>
              <h3 className="text-[13px] font-semibold text-primary-container mb-3 uppercase tracking-widest">
                {title}
              </h3>
              <p className="text-[14px] leading-[22px] text-on-surface-variant">
                {description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
