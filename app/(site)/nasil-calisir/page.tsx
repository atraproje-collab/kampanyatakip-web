import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Eye,
  Mail,
  Play,
  Rocket,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Nasıl Çalışır?",
  description:
    "Başvurudan canlıya: KAMPANYATAKİP kurulum sürecinin 4 adımı, iş modeli ve valilik onayı süreci.",
};

const ADIMLAR = [
  {
    no: "01",
    icon: ClipboardList,
    title: "Başvur",
    body: "Formu doldur, kampanyan hakkında bilgi ver. Ekibimiz 1 iş günü içinde dönüş yapar ve teklif sunar.",
    href: "/basvuru",
    ctaLabel: "Başvuru Formu",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    no: "02",
    icon: Wrench,
    title: "Kurulum",
    body: "2-4 iş günü içinde izole altyapın hazır: kendi sunucu, kendi alan adı, SSL, tüm modüller, AI asistan eğitilmiş.",
    gradient: "from-indigo-600 to-purple-700",
  },
  {
    no: "03",
    icon: Rocket,
    title: "Kampanyayı Başlat",
    body: "Bağış sayfan yayında, AI asistan aktif, sosyal medya entegrasyonu kurulu — takip başlıyor.",
    gradient: "from-purple-600 to-fuchsia-700",
  },
  {
    no: "04",
    icon: Eye,
    title: "Takip Et",
    body: "Admin panelden tüm gelir-gider-raporları anlık izle. Bağışçı şeffaflık merkezini görür, sen yönetirsin.",
    href: "/kampanya/demo",
    ctaLabel: "Demo İncele",
    gradient: "from-emerald-600 to-teal-700",
  },
];

export default function NasilCalisirPage() {
  return (
    <>
      <PageHeader
        title="Nasıl Çalışır?"
        description="Başvurudan canlıya — 4 adımda kampanyanızı şeffaflıkla yönetin."
      />

      {/* 4 adımlı süreç */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {ADIMLAR.map((adim) => {
              const Icon = adim.icon;
              return (
                <article
                  key={adim.no}
                  className="relative rounded-2xl border border-outline-variant bg-white p-6 md:p-7 hover:shadow-[0_8px_24px_rgba(0,24,53,0.08)] transition-shadow flex flex-col"
                >
                  {/* Büyük numara */}
                  <div
                    className={`absolute top-4 right-4 text-[44px] md:text-[52px] font-extrabold leading-none tracking-tighter bg-gradient-to-br ${adim.gradient} bg-clip-text text-transparent opacity-25`}
                    aria-hidden
                  >
                    {adim.no}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${adim.gradient} text-white flex items-center justify-center mb-4 shadow-md`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em]">
                    {adim.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[22px] text-on-surface-variant flex-1">
                    {adim.body}
                  </p>
                  {adim.href && adim.ctaLabel && (
                    <Link
                      href={adim.href}
                      className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-secondary hover:text-on-secondary-container group/link"
                    >
                      {adim.ctaLabel}
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* İş modeli akış kutusu */}
      <section className="py-6 md:py-10 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-[12px] font-bold uppercase tracking-[0.14em]">
                Para akışı
              </span>
              <h2 className="mt-3 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em]">
                Para sistemimize hiç girmez
              </h2>
              <p className="mt-2 text-[14px] leading-[22px] text-on-surface-variant">
                Bağışçılar doğrudan kampanya sahibinin banka hesabına transfer
                yapar — biz sadece takip ederiz.
              </p>
            </div>

            {/* Akış adımları */}
            <div className="rounded-2xl border border-outline-variant bg-white p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-2 items-center">
                <FlowStep label="Bağışçı" />
                <FlowArrow />
                <FlowStep label="Kendi Banka Uygulaması" />
                <FlowArrow />
                <FlowStep label="FAST · QR · IBAN" />
              </ol>
              <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant">
                <ArrowRight
                  size={18}
                  className="rotate-90 text-secondary animate-bounce"
                  aria-hidden
                />
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div /> {/* spacer */}
                <FlowStep
                  label="Kampanya Sahibinin Hesabı"
                  highlight
                />
                <div /> {/* spacer */}
              </ol>
              <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant">
                <ArrowRight
                  size={18}
                  className="rotate-90 text-secondary animate-bounce"
                  aria-hidden
                />
              </div>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div />
                <FlowStep
                  label="KAMPANYATAKİP takip eder · şeffaflık merkezi günceller"
                  variant="track"
                />
                <div />
              </ol>
            </div>

            <p className="mt-4 text-center text-[12.5px] text-on-surface-variant/85">
              KAMPANYATAKİP <strong>ödeme aracısı değildir</strong> —
              bağışlardan komisyon almaz, parayı hiç teslim almaz.
            </p>
          </div>
        </Container>
      </section>

      {/* Valilik onayı notu */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 md:p-8 flex items-start gap-4 flex-wrap">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BadgeCheck size={22} />
            </div>
            <div className="flex-1 min-w-[240px]">
              <h3 className="text-[18px] md:text-[20px] font-semibold text-emerald-900 tracking-[-0.01em]">
                Yalnızca valilik onaylı kampanyalar
              </h3>
              <p className="mt-2 text-[14px] leading-[22px] text-emerald-900/85">
                Sistemimiz <strong>valilik onaylı kampanyalar</strong> için
                tasarlanmıştır. 5072 Sayılı Yardım Toplama Kanunu uyarınca
                onaylanmış kampanyalar için tam denetlenebilir altyapı sağlıyoruz.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Demo CTA */}
      <section className="py-6 md:py-10 pb-12 md:pb-16">
        <Container>
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#012d59] text-white p-8 md:p-10 text-center shadow-[0_20px_40px_rgba(0,24,53,0.2)]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 mb-5">
              <Play size={26} />
            </div>
            <h2 className="text-[22px] md:text-[28px] font-semibold tracking-[-0.01em]">
              Önce canlı demo görmek ister misiniz?
            </h2>
            <p className="mt-2 text-[15px] leading-[24px] text-white/85 max-w-xl mx-auto">
              Minik Defne demo kampanyamızda gerçek veri akışını, şeffaflık
              merkezini ve admin panelini inceleyebilirsiniz.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/kampanya/demo">
                <Button variant="primary" size="lg" className="group/btn">
                  Demo İncele
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-250 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
              <Link
                href={siteConfig.urls.contact}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 px-5 py-3 text-[14px] font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                <Mail size={15} />
                {siteConfig.contact.email}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function FlowStep({
  label,
  highlight = false,
  variant = "default",
}: {
  label: string;
  highlight?: boolean;
  variant?: "default" | "track";
}) {
  const cls =
    variant === "track"
      ? "bg-emerald-500 text-white border-emerald-600"
      : highlight
        ? "bg-secondary text-on-secondary border-secondary"
        : "bg-surface-container-low text-primary-container border-outline-variant";
  return (
    <li
      className={`rounded-xl border px-4 py-3 text-center text-[13px] font-semibold ${cls}`}
    >
      {label}
    </li>
  );
}

function FlowArrow() {
  return (
    <li
      className="text-center text-secondary hidden md:flex items-center justify-center"
      aria-hidden
    >
      <ArrowRight size={20} />
    </li>
  );
}
