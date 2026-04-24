"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/Container";
import { EarlyAccessBadge } from "@/components/pages/EarlyAccessBadge";

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumb?: string;
  badge?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  badge,
}: PageHeaderProps) {
  const crumbLabel = breadcrumb ?? title;

  return (
    <header className="relative overflow-hidden">
      <div
        className="relative min-h-[220px] md:min-h-[300px] pt-28 md:pt-32 pb-20 md:pb-28"
        style={{
          background:
            "linear-gradient(135deg, #001835 0%, #012d59 60%, #00677f 140%)",
        }}
      >
        {/* Geometric pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Accent glows */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(at 15% 20%, rgba(102,218,255,0.15) 0%, transparent 55%), radial-gradient(at 85% 80%, rgba(118,150,200,0.12) 0%, transparent 50%)",
          }}
        />

        <Container className="relative z-10">
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[12px] md:text-[13px] font-medium text-white/70 mb-5"
          >
            <Link
              href="/"
              className="hover:text-secondary-container transition-colors"
            >
              Ana Sayfa
            </Link>
            <ChevronRight size={14} className="text-white/40" />
            <span className="text-white/90">{crumbLabel}</span>
          </motion.nav>

          {badge && (
            <div className="mb-5">
              <EarlyAccessBadge variant="dark" label={badge} />
            </div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
            className="text-[32px] md:text-[40px] lg:text-[44px] font-bold text-white tracking-[-0.02em] leading-[1.1] max-w-3xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            className="mt-4 max-w-2xl text-[16px] md:text-[18px] leading-[28px] text-white/85"
          >
            {description}
          </motion.p>
        </Container>
      </div>

      {/* Wave divider */}
      <svg
        aria-hidden
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block w-full h-[44px] md:h-[64px] -mt-px"
      >
        <path
          d="M0,48 C240,72 480,0 720,24 C960,48 1200,72 1440,32 L1440,72 L0,72 Z"
          fill="var(--color-surface)"
        />
      </svg>
    </header>
  );
}
