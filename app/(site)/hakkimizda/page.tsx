import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Mail,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "KAMPANYATAKİP — Türkiye'de valilik onaylı yardım kampanyaları için yapay zeka destekli bağış yönetim ve şeffaflık platformu.",
};

const MISSION = [
  {
    icon: ShieldCheck,
    title: "Şeffaflık",
    body: "Her kuruş kayıt altında, değiştirilemez. Bağışçı, denetçi ve kamu her hareketi anlık görür.",
    accent: "from-emerald-500/15 to-emerald-400/5",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Wallet,
    title: "Güven",
    body: "Yalnızca valilik onaylı kampanyalara hizmet veriyoruz. KVKK uyumlu altyapı, izole sunucu ve denetlenebilir kayıt.",
    accent: "from-blue-500/15 to-indigo-400/5",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    icon: Cpu,
    title: "Teknoloji",
    body: "17 modüllü tam otomasyon, 7/24 yapay zeka asistanı, çoklu dil ve sosyal medya entegrasyonu — tek panelden yönetim.",
    accent: "from-purple-500/15 to-fuchsia-400/5",
    iconBg: "bg-purple-100 text-purple-700",
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        title="Bağışın Her Adımı, Şeffaf ve Güvende"
        description="Türkiye'de valilik onaylı yardım kampanyaları için yapay zeka destekli bağış yönetim ve şeffaflık platformu."
      />

      {/* Intro */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-[12px] font-bold uppercase tracking-[0.14em]">
              <Sparkles size={13} /> KAMPANYATAKİP nedir?
            </span>
            <h2 className="mt-4 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
              Türkiye&apos;de valilik onaylı yardım kampanyaları için yapay zeka
              destekli bağış yönetim platformu
            </h2>
            <p className="mt-4 text-[15px] md:text-[16px] leading-[26px] text-on-surface-variant">
              SMA, DMD ve diğer nadir hastalık kampanyaları başta olmak üzere
              onaylı her tür yardım kampanyasını şeffaf, takip edilebilir ve
              denetlenebilir hale getiriyoruz. Bağışçı güvenle bağış yapar,
              kampanya sahibi tek panelden yönetir, kamu her hareketi anlık
              görür.
            </p>
          </div>
        </Container>
      </section>

      {/* Misyon kartları */}
      <section className="py-6 md:py-10 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
            <h2 className="text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em]">
              Üç temel değer üzerinde duruyoruz
            </h2>
            <p className="mt-2 text-[14px] leading-[22px] text-on-surface-variant">
              Şeffaflık · Güven · Teknoloji — yardım toplama sürecinin her
              katmanına işliyor.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {MISSION.map(({ icon: Icon, title, body, accent, iconBg }) => (
              <article
                key={title}
                className="relative rounded-2xl border border-outline-variant bg-white p-6 md:p-7 hover:shadow-[0_8px_24px_rgba(0,24,53,0.06)] transition-shadow overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`}
                  aria-hidden
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} mb-4`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-[24px] text-on-surface-variant">
                    {body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* İş modeli */}
      <section className="py-6 md:py-10">
        <Container>
          <div className="max-w-4xl mx-auto rounded-2xl border-l-4 border-secondary bg-secondary/[0.06] p-6 md:p-8">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="w-12 h-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <Wallet size={22} />
              </div>
              <div className="flex-1 min-w-[240px]">
                <h2 className="text-[20px] md:text-[24px] font-semibold text-primary-container tracking-[-0.01em]">
                  İş modelimiz: Para sistemimize hiç girmez
                </h2>
                <p className="mt-3 text-[14.5px] md:text-[15.5px] leading-[26px] text-on-surface">
                  <strong className="text-primary-container">
                    Bağışçılar doğrudan kampanya sahibinin banka hesabına
                    transfer yapar.
                  </strong>{" "}
                  KAMPANYATAKİP komisyon almaz, ödeme aracısı değildir, para
                  sisteme girmez. Bizim işimiz sadece{" "}
                  <strong className="text-secondary">şeffaflık ve takip</strong>{" "}
                  sağlamak — gelen her bağışı, harcanan her kuruşu kayıt altına
                  alır, bağışçıya ve kamuya açık şekilde gösteririz.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* İletişim CTA */}
      <section className="py-6 md:py-10 pb-12 md:pb-16">
        <Container>
          <div className="max-w-3xl mx-auto rounded-2xl bg-surface-container border border-outline-variant p-8 md:p-10 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/10 text-secondary mb-5">
              <Mail size={26} />
            </div>
            <h2 className="text-[22px] md:text-[26px] font-semibold text-primary-container tracking-[-0.01em]">
              Sizin için doğru çözüm mü? Konuşalım.
            </h2>
            <p className="mt-2 text-[15px] leading-[24px] text-on-surface-variant">
              Sorularınız ve teklif talepleriniz için:
            </p>
            <p className="mt-3 text-[15.5px] font-semibold text-primary-container">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-secondary transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </p>
            <div className="mt-6 flex justify-center">
              <Link href={siteConfig.urls.contact}>
                <Button variant="primary" size="lg" className="group/btn">
                  İletişim Sayfasına Git
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-250 group-hover/btn:translate-x-1"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
