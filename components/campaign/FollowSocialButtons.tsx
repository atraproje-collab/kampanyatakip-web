import { SocialIcon } from "@/components/ui/SocialIcon";
import { FACEBOOK_URL } from "@/lib/social-links";
import { cn } from "@/lib/utils";

interface FollowSocialButtonsProps {
  className?: string;
  variant?: "light" | "dark";
}

export function FollowSocialButtons({
  className,
  variant = "light",
}: FollowSocialButtonsProps) {
  const baseBtn =
    "inline-flex items-center justify-center h-10 w-10 rounded-lg border transition-all";
  const labelClass =
    variant === "dark"
      ? "text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80"
      : "text-[12px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant";
  const disabledClass =
    variant === "dark"
      ? "border-white/20 bg-white/5 text-white/40 opacity-50 cursor-not-allowed"
      : "border-outline-variant bg-surface-container-low text-on-surface-variant/50 opacity-50 cursor-not-allowed";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <span className={labelClass}>Bizi Takip Edin</span>
      <div className="flex items-center justify-center gap-2.5">
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook'ta takip et — Kampanya Takip"
          title="Kampanya Takip · Facebook"
          className={cn(
            baseBtn,
            "border-[#1877F2] bg-[#1877F2] text-white hover:bg-[#0e63d6] hover:border-[#0e63d6] hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <SocialIcon platform="facebook" size={18} />
        </a>
        <span
          aria-disabled="true"
          title="Yakında"
          className={cn(baseBtn, disabledClass)}
        >
          <SocialIcon platform="instagram" size={18} />
        </span>
        <span
          aria-disabled="true"
          title="Yakında"
          className={cn(baseBtn, disabledClass)}
        >
          <SocialIcon platform="youtube" size={18} />
        </span>
      </div>
    </div>
  );
}
