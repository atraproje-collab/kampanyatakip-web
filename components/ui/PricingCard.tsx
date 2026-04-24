import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type PricingPackage = {
  name: string;
  tagline: string;
  price?: string;
  priceText?: string;
  currency?: string;
  period?: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
  ctaStyle: "primary" | "outline";
};

interface PricingCardProps {
  pkg: PricingPackage;
}

export function PricingCard({ pkg }: PricingCardProps) {
  const {
    name,
    tagline,
    price,
    priceText,
    currency,
    period,
    featured,
    badge,
    features,
    ctaText,
    ctaStyle,
  } = pkg;

  return (
    <div
      className={cn(
        "relative p-8 rounded-2xl flex flex-col transition-all duration-300",
        featured
          ? "bg-white border-2 border-secondary shadow-[0_20px_40px_rgba(0,103,127,0.12)] lg:-mt-6 lg:mb-6"
          : "bg-surface border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)]",
      )}
    >
      {featured && badge && (
        <span className="absolute top-0 right-6 -translate-y-1/2 bg-secondary text-on-secondary px-4 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase shadow-[0_4px_6px_rgba(0,103,127,0.20)]">
          {badge}
        </span>
      )}

      <h3 className="text-[20px] font-semibold text-primary-container mb-1.5 tracking-[-0.01em]">
        {name}
      </h3>
      <p className="text-[13px] leading-[20px] text-on-surface-variant mb-6 min-h-[40px]">
        {tagline}
      </p>

      <div className="mb-6 pb-6 border-b border-outline-variant">
        {price ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[32px] md:text-[36px] font-bold text-primary-container tracking-tight leading-none">
              {price}
            </span>
            <span className="text-[16px] font-semibold text-on-surface-variant">
              {currency}
            </span>
            {period && (
              <span className="text-[14px] text-on-surface-variant ml-1">
                {period}
              </span>
            )}
          </div>
        ) : (
          <div className="text-[24px] md:text-[26px] font-bold text-primary-container tracking-tight leading-none">
            {priceText}
          </div>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[14px] leading-[20px] text-on-surface"
          >
            <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-secondary/10 text-secondary shrink-0">
              <Check size={12} strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={ctaStyle === "primary" ? "primary" : "outline-navy"}
        size="lg"
        className="w-full"
      >
        {ctaText}
      </Button>
    </div>
  );
}
