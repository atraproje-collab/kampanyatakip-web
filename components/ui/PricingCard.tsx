"use client";

import Link from "next/link";
import { Check, Sliders } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PricingPackage = {
  name: string;
  tagline: string;
  price?: string;
  priceText?: string;
  priceSubtext?: string;
  currency?: string;
  period?: string;
  featured?: boolean;
  isCustom?: boolean;
  badge?: string | null;
  includesBadge?: string | null;
  features: string[];
  ctaText: string;
  ctaStyle: "primary" | "outline" | "custom";
  href?: string;
};

interface PricingCardProps {
  pkg: PricingPackage;
  onCustomClick?: () => void;
}

export function PricingCard({ pkg, onCustomClick }: PricingCardProps) {
  const {
    name,
    tagline,
    price,
    priceText,
    priceSubtext,
    currency,
    period,
    featured,
    isCustom,
    badge,
    includesBadge,
    features,
    ctaText,
    ctaStyle,
    href,
  } = pkg;

  return (
    <div
      className={cn(
        "relative h-full flex flex-col p-7 md:p-8 rounded-2xl transition-all duration-300",
        featured
          ? "bg-white border-2 border-secondary shadow-[0_20px_40px_rgba(0,103,127,0.14)] xl:scale-[1.03]"
          : isCustom
            ? "bg-gradient-to-br from-primary-container to-primary text-white border-2 border-primary-container shadow-[0_14px_30px_rgba(0,24,53,0.15)]"
            : "bg-surface border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)]",
      )}
    >
      {badge && (
        <span
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase whitespace-nowrap shadow-[0_4px_6px_rgba(0,103,127,0.25)]",
            featured
              ? "bg-secondary text-on-secondary"
              : isCustom
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-primary-container text-on-primary",
          )}
        >
          {badge}
        </span>
      )}

      <div className="mb-5">
        <h3
          className={cn(
            "text-[20px] md:text-[22px] font-semibold tracking-[-0.01em]",
            isCustom ? "text-white" : "text-primary-container",
          )}
        >
          {name}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-[13px] leading-[20px] min-h-[40px]",
            isCustom ? "text-white/75" : "text-on-surface-variant",
          )}
        >
          {tagline}
        </p>
      </div>

      <div
        className={cn(
          "mb-6 pb-6 border-b",
          isCustom ? "border-white/15" : "border-outline-variant",
        )}
      >
        {price ? (
          <div className="flex items-baseline flex-wrap gap-x-1.5">
            <span
              className={cn(
                "text-[34px] md:text-[38px] font-bold tracking-tight leading-none",
                isCustom ? "text-white" : "text-primary-container",
              )}
            >
              {price}
            </span>
            <span
              className={cn(
                "text-[16px] font-semibold",
                isCustom ? "text-white/85" : "text-on-surface-variant",
              )}
            >
              {currency}
            </span>
            {period && (
              <span
                className={cn(
                  "text-[14px]",
                  isCustom ? "text-white/75" : "text-on-surface-variant",
                )}
              >
                {period}
              </span>
            )}
          </div>
        ) : (
          <div>
            <div
              className={cn(
                "text-[26px] md:text-[30px] font-bold tracking-tight leading-tight",
                isCustom ? "text-white" : "text-primary-container",
              )}
            >
              {priceText}
            </div>
            {priceSubtext && (
              <div
                className={cn(
                  "mt-1 text-[12px] uppercase tracking-wider font-medium",
                  isCustom ? "text-white/70" : "text-on-surface-variant",
                )}
              >
                {priceSubtext}
              </div>
            )}
            {period && (
              <div
                className={cn(
                  "mt-2 text-[13px]",
                  isCustom ? "text-white/75" : "text-on-surface-variant",
                )}
              >
                {period}
              </div>
            )}
          </div>
        )}
      </div>

      {includesBadge && (
        <div className="mb-5 px-3 py-2 bg-secondary/10 border border-secondary/20 rounded-lg">
          <p className="text-[11.5px] font-bold text-secondary uppercase tracking-[0.12em] leading-[16px]">
            {includesBadge}
          </p>
        </div>
      )}

      <ul className="flex-1 space-y-2.5 mb-7">
        {features.map((feature) => (
          <li
            key={feature}
            className={cn(
              "flex items-start gap-2.5 text-[13.5px] leading-[20px]",
              isCustom ? "text-white/90" : "text-on-surface",
            )}
          >
            <span
              className={cn(
                "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                isCustom
                  ? "bg-secondary-container/25 text-secondary-container"
                  : "bg-secondary/10 text-secondary",
              )}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {ctaStyle === "custom" ? (
        <button
          type="button"
          onClick={onCustomClick}
          className="mt-auto inline-flex items-center justify-center gap-2 w-full rounded-lg px-6 py-3 text-[14px] font-semibold bg-gradient-to-r from-secondary to-secondary-fixed-dim text-on-secondary-fixed shadow-[0_4px_6px_rgba(0,103,127,0.25)] hover:shadow-[0_10px_20px_rgba(0,103,127,0.30)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250"
        >
          <Sliders size={16} strokeWidth={2.25} />
          {ctaText}
        </button>
      ) : href ? (
        <Link href={href} className="mt-auto">
          <Button
            variant={ctaStyle === "primary" ? "primary" : "outline-navy"}
            size="lg"
            className="w-full"
          >
            {ctaText}
          </Button>
        </Link>
      ) : (
        <Button
          variant={ctaStyle === "primary" ? "primary" : "outline-navy"}
          size="lg"
          className="w-full mt-auto"
        >
          {ctaText}
        </Button>
      )}
    </div>
  );
}
