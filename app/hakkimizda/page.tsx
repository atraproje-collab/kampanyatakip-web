import type { Metadata } from "next";
import Link from "next/link";
import {
  Database,
  Eye,
  Heart,
  Lock,
  MessageCircle,
  Phone,
  Server,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { EarlyAccessBadge } from "@/components/pages/EarlyAccessBadge";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Türkiye'nin ilk valilik onaylı bağış şeffaflık platformu. Misyonumuz ve vizyonumuz hakkında bilgi alın.",
};

type Value = { icon: LucideIcon; title: string; description: string };

const VALUES: Value[] = [
  {
    icon: Eye,
    title: "Şeffaflık",
    description:
      "Her hareket kayıtlı, her belge erişilebilir. Bağışçı güvenini sağlamanın tek yolu radikal şeffaflık.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenlik",
    description:
      "İzole sistemler, değiştirilemez kayıtlar, kurumsal güvenlik katmanı. Verilerinizi kendi verimiz gibi koruruz.",
  },
  {
    icon: Zap,
    title: "Kolaylık",
    description:
      "2-4 iş günü içinde kurulum, yapay zeka destekli yönetim. Teknik detaylarla değil, insanlara odaklanın.",
  },
  {
    icon: Heart,
    title: "Dürüstlük",
    description:
      "Gerçekçi vaatler, şeffaf fiyatlandırma, gizli madde yok. Bağış dünyasını değiştirmeye başlıyoruz.",
  },
];

const TECH_ITEMS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Server,
    title: "İzole Bulut Sunucu",
    description:
      "Her kampanyaya özel, başka müşterilerle paylaşılmayan altyapı.",
  },
  {
    icon: Database,
    title: "Değiştirilemez Veritabanı",
    description:
      "Silinemez, değiştirilemez kayıtlarla denetim standardı.",
  },
  {
    icon: MessageCircle,
    title: "Kurumsal İletişim Altyapısı",
    description:
      "Mesajlaşma, SMS ve e-posta üzerinden anlık bildirim.",
  },
  {
    icon: Sparkles,
    title: "Yapay Zeka Asistan Sistemi",
    description:
      "7/24 otomatik bağışçı iletişimi ve soru yanıtlama.",
  },
  {
    icon: Phone,
    title: "Çok Dilli Sesli Hat Altyapısı",
    description: "5 dilde 0850 sesli bilgi hattı desteği.",
  },
  {
    icon: Lock,
    title: "Kurumsal Güvenlik Katmanı",
    description: "DDoS koruması, SSL, günlük otomatik yedekleme.",
  },
];

const STAT_CARDS: Array<{ value: string; label: string }> = [
  { value: siteConfig.stats.activeCampaigns, label: "Aktif Kampanya" },
  { value: siteConfig.stats.totalDonations, label: "Toplam İşlenen" },
  { value: siteConfig.stats.donorCount, label: "Bağışçı Sayısı" },
  { value: siteConfig.stats.installationDays, label: "Kurulum Süresi" },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        title="Hakkımızda"
        description="Türkiye'nin ilk valilik onaylı bağış şeffaflık platformu"
        badge="ERKEN ERİŞİM"
      />

      {/* Misyon */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Misyonumuz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Neden KAMPANYATAKİP?
            </h2>
            <div className="mt-8 space-y-6 text-[16px] md:text-[17px] leading-[28px] text-on-surface-variant">
              <p>
                Türkiye&apos;de her yıl binlerce yardım kampanyası düzenleniyor.
                SMA, DMD gibi pahalı tedaviler için milyonlarca lira toplanıyor.
                Ancak bağışçılar &ldquo;param nereye gitti?&rdquo; sorusuyla çoğu
                zaman tek başına kalıyor. Bu belirsizlik, yardım kültürümüzü
                zehirliyor.
              </p>
              <p>
                KAMPANYATAKİP, bu sorunu kökten çözmek için doğdu. Her bağışın
                anlık kayda alındığı, her harcamanın belgelendiği, hiçbir verinin
                silinemeyeceği bir sistem kurduk. Valilik onaylı kampanyalara özel
                olarak tasarlanan bu platform, şeffaflığı bir standart haline
                getiriyor.
              </p>
              <p className="text-on-surface font-medium">
                Misyonumuz basit: Türkiye&apos;de yardım etmeyi korku verici
                olmaktan çıkarıp, güven veren bir kültüre dönüştürmek.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Değerler */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Değerlerimiz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Yolumuzu Belirleyen İlkeler
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-5 p-7 rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em] mb-2">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[22px] text-on-surface-variant">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Sayılarla */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto">
            <EarlyAccessBadge label="ERKEN ERİŞİM AŞAMASI" />
            <h2 className="mt-5 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Sayılarla KAMPANYATAKİP
            </h2>
            <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
              Bu metrikler ilk müşterilerimizle birlikte canlı güncellenecek.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant p-6 md:p-7"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-secondary"
                />
                <div className="text-[20px] md:text-[22px] font-bold text-primary-container tracking-[-0.01em] leading-tight mb-2">
                  {stat.value}
                </div>
                <p className="text-[13px] font-medium text-on-surface-variant uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Teknoloji Altyapımız */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Altyapı
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Teknoloji Altyapımız
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              Kurumsal seviyede güvenilirlik için kendi iç çözümlerimizle
              kurulmuş, kampanyanıza özel bir altyapı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH_ITEMS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary-container flex items-center justify-center mb-4">
                  <Icon size={20} strokeWidth={1.85} />
                </div>
                <h3 className="text-[16px] font-semibold text-primary-container mb-1.5 tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-[13px] leading-[20px] text-on-surface-variant">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Vizyon */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="relative mx-auto max-w-4xl rounded-3xl bg-surface-container p-10 md:p-16 overflow-hidden">
            <div
              aria-hidden
              className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-secondary/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -left-10 -bottom-10 w-56 h-56 rounded-full bg-primary-container/10 blur-3xl"
            />
            <div className="relative">
              <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
                Vizyonumuz
              </span>
              <blockquote className="mt-5 text-[22px] md:text-[28px] lg:text-[32px] font-semibold tracking-[-0.02em] leading-[1.35] text-primary-container">
                &ldquo;Türkiye&apos;nin bağış kültürünü şeffaflık standartlarıyla
                güçlendirmek, her valilik onaylı kampanyayı güvenilir bir
                deneyime dönüştürmek.&rdquo;
              </blockquote>
              <p className="mt-6 text-[13px] font-semibold text-on-surface-variant uppercase tracking-widest">
                — KAMPANYATAKİP Vizyonu
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 hero-gradient text-white text-center">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(at 20% 20%, rgba(102,218,255,0.18) 0%, transparent 55%), radial-gradient(at 80% 80%, rgba(118,150,200,0.12) 0%, transparent 50%)",
              }}
            />
            <div className="relative">
              <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em] leading-tight">
                Kampanyanızı KAMPANYATAKİP ile başlatın
              </h2>
              <p className="mt-3 text-[15px] md:text-[17px] text-white/80">
                2-4 iş günü içinde faaliyete geçin.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={siteConfig.urls.demo}>
                  <Button variant="primary" size="xl" className="w-full sm:w-auto">
                    Demo Al
                  </Button>
                </Link>
                <Link href={siteConfig.urls.contact}>
                  <Button variant="outline-white" size="xl" className="w-full sm:w-auto">
                    İletişime Geç
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
