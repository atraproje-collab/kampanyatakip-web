import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

export function SystemAttribution() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-start md:items-center gap-4">
          <Logo variant="horizontal" />
          <div className="hidden md:block h-10 w-px bg-outline-variant" />
          <p className="text-[13px] leading-[20px] text-on-surface-variant max-w-md">
            Bu kampanya{" "}
            <strong className="text-primary-container font-semibold">
              KAMPANYATAKİP
            </strong>{" "}
            altyapısı ile yönetilmekte ve denetlenmektedir. Her bağış anlık
            kayıt altında, her harcama belgelidir.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-1.5 pr-4 border-r border-outline-variant text-[12px] font-semibold text-secondary">
            <ShieldCheck size={14} />
            Denetim Açık
          </div>
          <Link
            href="/demo"
            className="group/btn inline-flex items-center gap-2 rounded-lg bg-primary-container text-on-primary px-5 py-2.5 text-[13.5px] font-semibold hover:bg-primary transition-colors"
          >
            Kampanyanızı Kurun
            <ArrowRight
              size={14}
              className="transition-transform group-hover/btn:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
      <div className="border-t border-outline-variant py-3 text-center">
        <p className="text-[11.5px] text-on-surface-variant/85">
          © {new Date().getFullYear()} KAMPANYATAKİP · Demo kampanya sayfası
        </p>
      </div>
    </footer>
  );
}
