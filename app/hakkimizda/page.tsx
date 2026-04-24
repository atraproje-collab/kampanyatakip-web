import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  Database,
  Eye,
  FileEdit,
  Handshake,
  Heart,
  Lock,
  MessageSquare,
  Presentation,
  Rocket,
  Server,
  Settings,
  Shield,
  Sparkles,
  Target,
  Telescope,
  TrendingUp,
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
    "Türkiye'nin bağış kültürünü şeffaflık standardı ile dönüştürüyoruz. KAMPANYATAKİP'in misyonu, vizyonu ve hizmet detayları.",
};

const MISSION_VISION = [
  {
    icon: Target,
    label: "Misyonumuz",
    body: "Türkiye'deki valilik onaylı yardım kampanyalarını, teknoloji ve şeffaflık ile güçlendirerek bağış kültürünün güvenilir bir ekosisteme dönüşmesini sağlamak. Her kuruşun hesabını veren, her harcamayı belgeleyen, bağışçı güvenini kazanan kampanyalar inşa etmek.",
  },
  {
    icon: Telescope,
    label: "Vizyonumuz",
    body: "Türkiye'nin yardım kampanyaları için denetim standardı olmak. Valilikler, STK'lar, bağışçılar — yardım ekosisteminin tüm aktörleri için KAMPANYATAKİP'in aradıkları güvenilirliğin temel referansı haline gelmesini hedefliyoruz.",
  },
  {
    icon: Handshake,
    label: "Taahhüdümüz",
    body: "Şeffaflıktan asla taviz vermemek. Hiçbir müşteriye kayıt silme imkânı vermemek. Hiçbir bağışçıya yalan rakamlar göstermemek. Platformumuzda yayınlanan her kampanya, denetime açık bir kamu belgesi niteliğindedir.",
  },
];

const VALUES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Eye,
    title: "Radikal Şeffaflık",
    description:
      "Her hareket kayıtlı, her belge erişilebilir. Bağışçı güvenini sağlamanın tek yolu bilgiyi açık, anlaşılır ve doğrulanabilir kılmaktır. Platformumuzda hiçbir veri gizli değildir.",
  },
  {
    icon: Shield,
    title: "Değiştirilemezlik",
    description:
      "Sistemdeki hiçbir gelir veya gider kaydı silinemez, değiştirilemez. Hatalı giriş olursa düzeltme yeni kayıt olarak eklenir. Bu, denetim standardı olmanın olmazsa olmaz şartıdır.",
  },
  {
    icon: Lock,
    title: "Kurumsal Güvenlik",
    description:
      "Her kampanya izole sunucuda çalışır. Başka müşterilerle veri paylaşımı yoktur. Günlük yedekleme, kurumsal güvenlik katmanı ve KVKK uyumluluğu standart olarak sunulur.",
  },
  {
    icon: Heart,
    title: "İnsan Odaklılık",
    description:
      "Teknoloji amacımız değil, aracımız. Asıl hedefimiz; gönüllü bir teyzenin, bağış kabul eden bir başkanının, hasta çocuk için kampanya açan bir ailenin hayatını kolaylaştırmak.",
  },
];

const SERVICES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Server,
    title: "İzole Sunucu Altyapısı",
    description:
      "Her kampanya için özel, başka müşterilerle paylaşılmayan Linux tabanlı sunucu. Tam performans, tam güvenlik.",
  },
  {
    icon: Database,
    title: "Değiştirilemez Veri Tabanı",
    description:
      "Tüm bağış kayıtları silinemez yapıdadır. Her işlem kronolojik olarak kayıt altında tutulur, denetime hazırdır.",
  },
  {
    icon: MessageSquare,
    title: "Çok Kanallı İletişim",
    description:
      "Mesajlaşma, SMS, e-posta ve 0850 sesli hat — bağışçılarınıza ulaşmanın tüm yolları tek entegre sistemde.",
  },
  {
    icon: Sparkles,
    title: "Yapay Zeka Asistanı",
    description:
      "7/24 çalışan AI asistanınız bağışçı sorularını yanıtlar, bilgi sağlar, talepleri size iletir. Hiçbir mesaj cevapsız kalmaz.",
  },
  {
    icon: TrendingUp,
    title: "Gerçek Zamanlı Raporlama",
    description:
      "Günlük, haftalık, aylık otomatik raporlar ile kampanya performansını anında görürsünüz.",
  },
  {
    icon: CheckCircle,
    title: "Valilik Onayı Uyumu",
    description:
      "Sistemimiz, valilik onaylı yardım kampanyalarının hukuki ve mali denetim standartlarına tam uyumlu olarak tasarlandı.",
  },
];

const PROCESS_STEPS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: FileEdit,
    title: "Talep",
    description:
      "Demo sayfamızdan talep gönderin veya iletişime geçin. 1 iş günü içinde size özel sunum hazırlayalım.",
  },
  {
    icon: Presentation,
    title: "Sunum",
    description:
      "30-45 dakikalık online demo. Sorularınızı yanıtlayalım, ihtiyacınıza uygun paketi belirleyelim.",
  },
  {
    icon: Settings,
    title: "Kurulum",
    description:
      "Sözleşme sonrası 2-4 iş günü içinde izole sunucunuz hazır, alan adınız yapılandırılır, ekibinize eğitim verilir.",
  },
  {
    icon: Rocket,
    title: "Canlı",
    description:
      "Kampanyanız yayında. Her bağış anlık sisteme düşer, tüm modüller aktif. Biz destek olarak yanınızdayız.",
  },
];

const STAT_CARDS = [
  { value: siteConfig.stats.activeCampaigns, label: "Aktif Kampanya" },
  { value: "100M+ ₺", label: "Yıllık İşleme Kapasitesi" },
  { value: "5 Dil", label: "TR · EN · AR · DE · FR" },
  { value: siteConfig.stats.installationDays, label: "Kurulum Süresi" },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHeader
        title="Hakkımızda"
        description="Türkiye'nin bağış kültürünü şeffaflık standardı ile dönüştürüyoruz"
        badge="ERKEN ERİŞİM"
      />

      {/* Hikaye */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Hikayemiz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Neden KAMPANYATAKİP?
            </h2>
            <div className="mt-8 space-y-5 text-[15.5px] md:text-[16.5px] leading-[28px] text-on-surface-variant">
              <p>
                Türkiye&apos;de her yıl binlerce yardım kampanyası düzenleniyor.
                SMA, DMD, kanser tedavisi, afet yardımı, eğitim bursu —
                milyonlarca lira el değiştiriyor. Ancak bu süreçte kritik bir
                sorun var: bağışçılar, &ldquo;param gerçekten ihtiyaç sahibine
                ulaştı mı?&rdquo; sorusuna net bir cevap bulamıyor. Excel
                tabloları, paylaşılan dosyalar, mesaj ekran görüntüleri —
                bunların hiçbiri gerçek bir şeffaflık sağlamıyor.
              </p>
              <p>
                Bu belirsizlik, yardım etmek isteyen insanları caydırıyor.
                &ldquo;Ben 500 TL göndersem ne olacak ki&rdquo; hissiyatı
                yayılıyor. Gerçekten iyi niyetle kampanya yürüten dernekler de
                bu güvensizlikten zarar görüyor. Valilik onayı alınmış, hukuken
                temiz kampanyalar bile, dijital altyapı eksikliği yüzünden
                potansiyellerinin çok altında kalıyor.
              </p>
              <p>
                KAMPANYATAKİP işte tam bu soruna çözüm olarak doğdu. Teknoloji,
                finansal şeffaflık ve kurumsal güvenlik en yüksek standartlarda
                bir araya getirildi. Her bağışın anlık kayda alındığı, her
                harcamanın belgelendiği, hiçbir verinin değiştirilemeyeceği bir
                sistem kurduk. Bağışçılar artık telefonlarından, sayfa açıp
                gerçek zamanlı olarak paralarının nereye gittiğini görebilir.
                Dernekler artık &ldquo;şeffafız&rdquo; demek zorunda kalmadan,
                şeffaflıklarını göstererek anlatabilir.
              </p>
              <p className="text-on-surface font-medium">
                Amacımız basit ama iddialı: Türkiye&apos;de yardım etmeyi, korku
                verici bir belirsizlikten çıkarıp, güven verici bir kültüre
                dönüştürmek.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Misyon · Vizyon · Taahhüt */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {MISSION_VISION.map(({ icon: Icon, label, body }) => (
              <div
                key={label}
                className="rounded-2xl bg-white border border-outline-variant p-7 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em] mb-3">
                  {label}
                </h3>
                <p className="text-[14.5px] leading-[24px] text-on-surface-variant">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Değerler */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Değerlerimiz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Bizi Biz Yapan Değerler
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex gap-5 p-7 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white text-secondary flex items-center justify-center shadow-[0_1px_2px_rgba(0,24,53,0.06)] group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-primary-container tracking-[-0.01em] mb-2">
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

      {/* Hizmetlerimiz */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Hizmetlerimiz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Ne Sağlıyoruz?
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP kapsamında her müşterimize sunulan standart
              hizmetler — hepsi pakete dahil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {SERVICES.map(({ icon: Icon, title, description }) => (
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
                <p className="text-[13.5px] leading-[21px] text-on-surface-variant">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Süreç */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Süreç
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Nasıl Çalışıyoruz?
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div
              aria-hidden
              className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-[2px] bg-outline-variant z-0"
            />
            <ol className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10">
              {PROCESS_STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-2xl bg-white border border-outline-variant p-6 text-center md:text-left"
                >
                  <div className="relative mx-auto md:mx-0 mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-on-secondary shadow-[0_0_0_5px_var(--color-surface)]">
                    <step.icon size={20} strokeWidth={2} />
                    <span
                      aria-hidden
                      className="absolute -top-2 -right-2 text-[11px] font-bold bg-primary-container text-on-primary w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-primary-container mb-2 tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-[20px] text-on-surface-variant">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Sayılarla */}
      <section className="py-16 md:py-24 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
            <EarlyAccessBadge label="ERKEN ERİŞİM AŞAMASI" />
            <h2 className="mt-5 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Sayılarla KAMPANYATAKİP
            </h2>
            <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
              Bu metrikler gerçek müşteri verilerine dayalı olarak canlı
              güncellenecektir. Erken erişim programına katılmak için iletişime
              geçin.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {STAT_CARDS.map((stat) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl bg-white border border-outline-variant p-6 md:p-7"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-6 top-0 h-[3px] rounded-b-full bg-secondary"
                />
                <div className="text-[20px] md:text-[22px] font-bold text-primary-container tracking-[-0.01em] leading-tight mb-2">
                  {stat.value}
                </div>
                <p className="text-[12.5px] font-medium text-on-surface-variant uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Vizyon Quote */}
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
                Son Söz
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
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-[26px] md:text-[32px] font-bold tracking-[-0.02em] leading-tight">
                Kampanyanızı KAMPANYATAKİP ile Başlatın
              </h2>
              <p className="mt-4 text-[15px] md:text-[17px] leading-[26px] text-white/85">
                Türkiye&apos;nin en kapsamlı bağış yönetim ve şeffaflık
                platformu ile tanışın. Valilik onaylı kampanyanız için özel
                kurulum, 2-4 iş günü içinde faaliyete geçer.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={siteConfig.urls.demo}>
                  <Button variant="primary" size="xl" className="w-full sm:w-auto">
                    Ücretsiz Demo Al
                  </Button>
                </Link>
                <Link href={siteConfig.urls.contact}>
                  <Button variant="outline-white" size="xl" className="w-full sm:w-auto">
                    Detaylı Bilgi
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
