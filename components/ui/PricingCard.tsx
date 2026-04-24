"use client";

import Link from "next/link";
import { Check, Sliders, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { PricingPackageData } from "@/lib/packages-data";

export type PricingPackage = PricingPackageData;

interface PricingCardProps {
  pkg: PricingPackageData;
  onCustomClick?: () => void;
}

export function PricingCard({ pkg, onCustomClick }: PricingCardProps) {
  const {
    name,
    tagline,
    featured,
    isCustom,
    badge,
    includesBadge,
    features,
    exclusions,
    ctaText,
    ctaStyle,
    href,
  } = pkg;
  // price / currency / period / priceText / priceSubtext intentionally
  // omitted — kept in data, hidden from UI.

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

      {/* Price block intentionally hidden — prices live in lib/packages-data.ts
          but are not rendered in the UI at the moment. Re-enable by restoring
          the previous <div className="mb-6 pb-6 border-b">…</div> block. */}

      {includesBadge && (
        <div className="mb-5 px-3 py-2 bg-secondary/10 border border-secondary/20 rounded-lg">
          <p className="text-[11.5px] font-bold text-secondary uppercase tracking-[0.12em] leading-[16px]">
            {includesBadge}
          </p>
        </div>
      )}

      <ul className="space-y-2.5 mb-5">
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

      {exclusions && exclusions.length > 0 && (
        <div
          className={cn(
            "mb-5 pt-4 border-t",
            isCustom ? "border-white/15" : "border-outline-variant",
          )}
        >
          <p
            className={cn(
              "mb-2 text-[10.5px] font-bold uppercase tracking-[0.14em]",
              isCustom ? "text-white/70" : "text-on-surface-variant",
            )}
          >
            Bu pakette bulunmaz
          </p>
          <ul className="space-y-2">
            {exclusions.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex items-start gap-2.5 text-[12.5px] leading-[18px]",
                  isCustom ? "text-white/60" : "text-on-surface-variant",
                )}
              >
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
                  <X size={11} strokeWidth={3} />
                </span>
                <span className="line-through decoration-on-surface-variant/40 decoration-1">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex-1" />


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
