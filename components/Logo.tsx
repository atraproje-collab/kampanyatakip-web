import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "square";
  className?: string;
  priority?: boolean;
  /** Set true when placed on a dark background so the logo blends via 'screen' instead of 'multiply'. */
  onDark?: boolean;
}

export function Logo({
  variant = "horizontal",
  className,
  priority = false,
  onDark = false,
}: LogoProps) {
  const isHorizontal = variant === "horizontal";

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="KAMPANYATAKİP ana sayfa"
    >
      <Image
        src={isHorizontal ? "/logo.png" : "/logo-square.jpeg"}
        alt="KAMPANYATAKİP — Şeffaf Bağış Takip Sistemi"
        width={isHorizontal ? 240 : 48}
        height={isHorizontal ? 48 : 48}
        priority={priority}
        className={cn(
          "object-contain",
          isHorizontal ? "h-8 md:h-10 w-auto" : "h-12 w-12",
        )}
        style={{
          mixBlendMode: onDark ? "screen" : "multiply",
        }}
      />
    </Link>
  );
}
