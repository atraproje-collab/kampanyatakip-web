"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Lock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";

const TRUST_BADGES = [
  { icon: BadgeCheck, text: "VALİLİK ONAYLI SİSTEM" },
  { icon: Lock, text: "SSL GÜVENLİ ÖDEME" },
  { icon: ShieldCheck, text: "KVKK UYUMLU ALTYAPI" },
];

export function CTAClosing() {
  return (
    <section className="py-8 md:py-12 bg-surface">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center text-white hero-gradient max-w-5xl mx-auto"
        >
          {/* Decorative layers */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            aria-hidden
            style={{
              background:
                "radial-gradient(at 20% 20%, rgba(102,218,255,0.18) 0%, transparent 55%), radial-gradient(at 80% 80%, rgba(118,150,200,0.12) 0%, transparent 50%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.02em] mb-6 leading-[1.1]">
              Kampanyanızı Bugün Başlatın
            </h2>
            <p className="text-[16px] md:text-[18px] leading-[28px] text-white/80 mb-10 max-w-xl mx-auto">
              Zaman kaybetmeyin, şeffaf yönetim sistemiyle bağışçılarınıza güven verin
              ve hedefinize ulaşın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/basvuru">
                <Button variant="primary" size="xl" className="w-full sm:w-auto">
                  Başvurunuzu Gönderin
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button variant="outline-white" size="xl" className="w-full sm:w-auto">
                  Destek Ekibine Yaz
                </Button>
              </Link>
            </div>

            <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-4 border-t border-white/15 pt-10">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-white/70"
                >
                  <Icon size={22} strokeWidth={1.75} />
                  <span className="text-[12px] font-semibold tracking-widest uppercase">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
