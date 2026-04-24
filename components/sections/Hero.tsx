"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Slide = {
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter?: string;
  description: string;
  primaryCta: string;
  accent: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "SMA & DMD KAMPANYA YÖNETİMİ",
    titleBefore: "Bağışın Her Kuruşu,",
    titleAccent: "Gerçek Zamanlı",
    titleAfter: "Şeffaflıkla",
    description:
      "Profesyonel yönetim paneli ile her bağışı anlık takip edin, destekçilerinize tam güven verin ve hedefinize daha hızlı ulaşın.",
    primaryCta: "Kampanyanı Kur",
    accent:
      "radial-gradient(at 75% 25%, rgba(102,218,255,0.18) 0%, transparent 55%), radial-gradient(at 15% 80%, rgba(4,161,196,0.20) 0%, transparent 50%)",
  },
  {
    eyebrow: "YAPAY ZEKA DESTEKLİ",
    titleBefore: "7/24 Aktif",
    titleAccent: "Mesajlaşma AI",
    titleAfter: "Asistan",
    description:
      "Destekçilerinizin tüm sorularını saniyeler içinde yanıtlayan, kampanya verilerini paylaşan yapay zeka altyapısı.",
    primaryCta: "Modülleri İncele",
    accent:
      "radial-gradient(at 25% 30%, rgba(95,213,249,0.22) 0%, transparent 55%), radial-gradient(at 85% 75%, rgba(0,103,127,0.30) 0%, transparent 50%)",
  },
  {
    eyebrow: "OTOMATİK TAKİP",
    titleBefore: "Banka Hesaplarıyla",
    titleAccent: "Tam Entegrasyon",
    description:
      "Banka hareketlerinizi sistemle senkronize edin, gelen bağışları manuel işleme zahmetinden kurtulun.",
    primaryCta: "Hemen Başla",
    accent:
      "radial-gradient(at 50% 20%, rgba(118,150,200,0.25) 0%, transparent 55%), radial-gradient(at 50% 90%, rgba(102,218,255,0.15) 0%, transparent 50%)",
  },
];

const TRUST_BADGES = [
  { icon: BadgeCheck, label: "VALİLİK ONAYLI" },
  { icon: ShieldCheck, label: "KVKK UYUMLU" },
];

const AUTO_PLAY_INTERVAL = 5500;

export function Hero() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const id = window.setInterval(next, AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(id);
  }, [next]);

  const slide = SLIDES[index];

  return (
    <section
      id="hero"
      className="relative overflow-hidden hero-gradient"
      aria-label="Öne çıkan kampanya tanıtım slaytları"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: slide.accent }}
        aria-hidden
      />

      {/* Decorative transparent wordmarks */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none select-none"
        aria-hidden
      >
        <span className="absolute top-[18%] right-[4%] text-[120px] md:text-[200px] font-extrabold text-white/[0.035] tracking-tighter leading-none">
          ŞEFFAFLIK
        </span>
        <span className="absolute bottom-[10%] left-[2%] text-[90px] md:text-[160px] font-extrabold text-white/[0.03] tracking-tighter leading-none">
          GÜVEN
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 min-h-[85vh] md:min-h-[640px] flex items-center py-24 md:py-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl text-white"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary text-on-secondary text-[11px] md:text-[12px] font-bold rounded-full mb-6 tracking-widest uppercase">
              {slide.eyebrow}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
              {slide.titleBefore}
              <br />
              <span className="text-secondary-container">{slide.titleAccent}</span>
              {slide.titleAfter ? ` ${slide.titleAfter}` : ""}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 font-medium max-w-2xl">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/demo">
                <Button variant="primary" size="xl" className="group/btn w-full sm:w-auto">
                  {slide.primaryCta}
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-250 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline-white" size="xl" className="w-full sm:w-auto">
                  Demo İzle
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 md:gap-8">
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-white/80"
                >
                  <Icon size={20} className="text-secondary-container" />
                  <span className="text-[12px] font-semibold tracking-widest uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Önceki slayt"
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Sonraki slayt"
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white hover:bg-secondary hover:border-secondary transition-all active:scale-95"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${i + 1}. slayta git`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index ? "w-12 bg-white" : "w-8 bg-white/30 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}

