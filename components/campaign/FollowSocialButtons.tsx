import { Music2 } from "lucide-react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { SOCIAL_MEDIA, SOCIAL_MEDIA_HANDLES } from "@/lib/social-media";
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
    "inline-flex items-center justify-center h-11 w-11 rounded-xl border transition-all";
  const labelClass =
    variant === "dark"
      ? "text-[12px] font-semibold uppercase tracking-[0.14em] text-white/80"
      : "text-[12px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant";
  const disabledClass =
    variant === "dark"
      ? "border-white/15 bg-white/5 text-white/40 opacity-50 cursor-not-allowed"
      : "border-outline-variant bg-surface-container-low text-on-surface-variant/60 opacity-50 cursor-not-allowed";

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <span className={labelClass}>Bizi Takip Edin</span>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <a
          href={SOCIAL_MEDIA.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Facebook'ta takip et — ${SOCIAL_MEDIA_HANDLES.facebook}`}
          title={`${SOCIAL_MEDIA_HANDLES.facebook} · Facebook`}
          className={cn(
            baseBtn,
            "border-[#1877F2] bg-[#1877F2] text-white hover:bg-[#0e63d6] hover:border-[#0e63d6] hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <SocialIcon platform="facebook" size={20} />
        </a>
        <a
          href={SOCIAL_MEDIA.instagram!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram'da takip et — ${SOCIAL_MEDIA_HANDLES.instagram}`}
          title={`${SOCIAL_MEDIA_HANDLES.instagram} · Instagram`}
          className={cn(
            baseBtn,
            "border-transparent text-white bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] to-[#962fbf] hover:-translate-y-0.5 hover:shadow-md hover:brightness-105",
          )}
        >
          <SocialIcon platform="instagram" size={20} />
        </a>
        <a
          href={SOCIAL_MEDIA.youtube!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`YouTube'da abone ol — ${SOCIAL_MEDIA_HANDLES.youtube}`}
          title={`${SOCIAL_MEDIA_HANDLES.youtube} · YouTube`}
          className={cn(
            baseBtn,
            "border-[#FF0000] bg-[#FF0000] text-white hover:bg-[#d90000] hover:border-[#d90000] hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <SocialIcon platform="youtube" size={20} />
        </a>
        <a
          href={SOCIAL_MEDIA.tiktok!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`TikTok'ta takip et — ${SOCIAL_MEDIA_HANDLES.tiktok}`}
          title={`${SOCIAL_MEDIA_HANDLES.tiktok} · TikTok`}
          className={cn(
            baseBtn,
            "border-black bg-black text-white hover:bg-neutral-800 hover:border-neutral-800 hover:-translate-y-0.5 hover:shadow-md",
          )}
        >
          <Music2 size={18} />
        </a>
        <span
          aria-disabled="true"
          title="Yakında"
          role="button"
          className={cn(baseBtn, disabledClass)}
        >
          <SocialIcon platform="twitter" size={18} />
        </span>
      </div>
    </div>
  );
}
