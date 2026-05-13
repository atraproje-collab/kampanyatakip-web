import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  CheckCircle,
  CheckCircle2,
  Church,
  Database,
  Eye,
  FileEdit,
  FileX,
  GraduationCap,
  HandHeart,
  Handshake,
  HardDrive,
  Heart,
  Lock,
  MessageSquare,
  Presentation,
  Rocket,
  Server,
  Settings,
  Shield,
  ShieldOff,
  Sparkles,
  Target,
  Telescope,
  TrendingUp,
  XCircle,
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
    "Türkiye'nin bağış kültürünü şeffaflık standardı ile dönüştüren KAMPANYATAKİP hakkında — misyon, vizyon, çözdüğü problemler ve teknoloji altyapısı.",
};

type Icon = LucideIcon;

const PROBLEMS: Array<{
  icon: Icon;
  stat: string;
  statLabel: string;
  title: string;
  body: string;
}> = [
  {
    icon: AlertCircle,
    stat: "%73",
    statLabel: "Bağışçı güvensizliği",
    title: "Bağışçı Güvensizliği",
    body:
      "Türkiye'de kampanyalara bağış yapan her on kişiden yedisi, bir süre sonra \"paramın nereye gittiğini bilmiyorum\" diye düşünüyor. Bu güvensizlik zamanla tüm yardım kültürünü zehirler: sadece yeni bağışları değil, mevcut bağışçıların sadakatini de etkiler. \"Şeffafız\" demekle bu soru cevaplanamaz — şeffaflık gösterilmelidir.",
  },
  {
    icon: FileX,
    stat: "12+",
    statLabel: "Farklı sistem / kampanya",
    title: "Manuel İş Yükü",
    body:
      "Tipik bir kampanyada gönüllüler aynı anda Excel tabloları, mesajlaşma grupları, paylaşılan dosyalar, banka ekstreleri, kumbara not defterleri ve stant kayıtlarıyla çalışıyor. Bilgi dağınık, tekrarlı giriş kaçınılmaz, hata oranı yüksek. Kampanyanın gerçek verisini görmek için saatlerce veri birleştirilmesi gerekiyor.",
  },
  {
    icon: ShieldOff,
    stat: "0",
    statLabel: "Kurumsal denetim standardı",
    title: "Denetim Eksikliği",
    body:
      "Valilik onaylı kampanyalar yıl sonunda raporlama yükümlülüğü altındadır. Ancak çoğu dernek, denetime uygun belge düzenini yıl içinde değil raporlama vaktinde oluşturmak zorunda kalır. Belgesiz harcamalar, silinmiş kayıtlar, bulunamayan dekontlar — her biri ciddi hukuki risk yaratır.",
  },
];

const COMPARISON: Array<{ old: string; new: string }> = [
  { old: "Excel tabloları ve paylaşılan dosyalar", new: "Anlık otomatik kayıt ve merkezi veri" },
  { old: "Mesajlaşma gruplarından bağış takibi", new: "7/24 yapay zeka asistan ve otomasyon" },
  { old: "Belgesiz harcama mümkün", new: "Belgesiz harcama sistem tarafından engellenir" },
  { old: "Yıl sonunda manuel rapor hazırlığı", new: "Günlük / haftalık otomatik rapor bildirimi" },
  { old: "Kayıtlar silinebilir veya değiştirilebilir", new: "Değiştirilemez (append-only) veritabanı" },
  { old: "Bağışçı listesi herkese açık veya korumasız", new: "KVKK uyumlu otomatik gizlilik maskesi" },
  { old: "Tek dilde kampanya sayfası", new: "5 dilde uluslararası bağışçı erişimi" },
  { old: "Ortak sunucuda çalışan paylaşımlı altyapı", new: "Her kampanyaya özel izole sunucu" },
  { old: "Bağışçıya sonuç raporu yok", new: "Bağışçı şeffaflık merkezine anlık erişim" },
  { old: "Canlı yayın gelirleri manuel eşleştirilir", new: "OCR ile banka otomatik eşleştirme" },
];

const TECHNICAL_ITEMS: Array<{
  icon: Icon;
  title: string;
  description: string;
}> = [
  {
    icon: Server,
    title: "İzole VPS",
    description:
      "Her kampanyaya ayrı sanal sunucu. Başka müşterilerle paylaşılan hiçbir kaynak yoktur.",
  },
  {
    icon: Database,
    title: "Değiştirilemez DB",
    description:
      "Append-only yapı — hatalı giriş yeni kayıt olarak düzeltilir, orijinal silinmez.",
  },
  {
    icon: HardDrive,
    title: "Günlük Yedek",
    description:
      "Otomatik veritabanı yedekleri her gün alınır, kurumsal soğuk depolamada saklanır.",
  },
  {
    icon: Shield,
    title: "Kurumsal Güvenlik",
    description:
      "DDoS koruması, SSL sertifikası, otomatik güncelleme ve KVKK uyumlu veri işleme katmanı.",
  },
];

const AUDIENCES: Array<{
  icon: Icon;
  title: string;
  description: string;
}> = [
  {
    icon: Heart,
    title: "Valilik Onaylı Sağlık Kampanyaları",
    description:
      "SMA, DMD, kanser ve nadir hastalık tedavisi için yürütülen yüksek bütçeli kampanyalara uçtan uca şeffaflık altyapısı sağlar.",
  },
  {
    icon: Shield,
    title: "Afet Yardım Kampanyaları",
    description:
      "Deprem, sel ve benzeri acil durumlarda hızlı kurulum (2-4 gün) ile kampanyanın güvenilir biçimde başlatılmasını sağlar.",
  },
  {
    icon: GraduationCap,
    title: "Eğitim Bağışı Kampanyaları",
    description:
      "Öğrenci burs programları, okul yapım ve eğitim materyal destekleri için düzenli bağış akışını ve raporlamasını yönetir.",
  },
  {
    icon: Church,
    title: "Dini / Hayır Dernekleri",
    description:
      "Zekât, fitre, ramazan ve kurban organizasyonları için dönemsel yoğun bağış hareketini kategorize eder ve raporlar.",
  },
  {
    icon: Building2,
    title: "Vakıflar ve Kurumsal Kampanyalar",
    description:
      "Büyük ölçekli, çoklu kampanya yürüten vakıf ve kurumlar için API erişimi ve beyaz etiket seçenekleri sunar.",
  },
];

const MISSION_VISION = [
  {
    icon: Target,
    label: "Misyonumuz",
    body:
      "KAMPANYATAKİP, Türkiye'deki valilik onaylı yardım kampanyalarını teknoloji ve şeffaflık ile güçlendirmek için kurulmuştur. Her kuruşun hesabını veren, her harcamayı belgeleyen, bağışçı güvenini kazanan kampanyalar inşa etmek temel hedeftir. Misyon, sadece bir yazılım sağlamakla sınırlı değildir — bağış ekosisteminin hukuki, mali ve etik standartlarını birlikte yükselterek yardım etmenin Türkiye'de güven veren bir eyleme dönüşmesini sağlamaktır.",
  },
  {
    icon: Telescope,
    label: "Vizyonumuz",
    body:
      "KAMPANYATAKİP, Türkiye'nin yardım kampanyaları için denetim standardı olmayı hedefler. Valilikler için denetim kolaylığı, STK'lar için kurumsallaşma ve bağışçılar için güven arayışının ortak referansı haline gelmek vizyonun özüdür. Beş yıl içinde, bir kampanyanın \"KAMPANYATAKİP üzerinden yürütülüyor\" ibaresi, o kampanyanın şeffaflığının ve hukuki uygunluğunun ön kabulü olarak tanınmalıdır.",
  },
  {
    icon: Handshake,
    label: "Taahhüdümüz",
    body:
      "KAMPANYATAKİP, şeffaflıktan ticari kaygılarla asla taviz vermez. Hiçbir müşteriye kayıt silme, tutar değiştirme veya geçmiş işlemleri geri alma imkânı tanınmaz. Hiçbir bağışçıya yalan rakamlar ya da manipüle edilmiş istatistikler gösterilmez. Platform üzerinde yayınlanan her kampanya, istenildiğinde denetime açık bir kamu belgesi niteliğinde tutulur. Taahhüt kişiye veya sözleşmeye değil, sistem mimarisine gömülüdür.",
  },
];

const VALUES: Array<{ icon: Icon; title: string; description: string }> = [
  {
    icon: Eye,
    title: "Radikal Şeffaflık",
    description:
      "Her hareket kayıtlı, her belge erişilebilir. Bağışçı güvenini sağlamanın tek yolu bilgiyi açık, anlaşılır ve doğrulanabilir kılmaktır. Platformda hiçbir veri gizli değildir.",
  },
  {
    icon: Shield,
    title: "Değiştirilemezlik",
    description:
      "Sistemdeki hiçbir gelir veya gider kaydı silinemez, değiştirilemez. Hatalı giriş olursa düzeltme yeni kayıt olarak eklenir. Denetim standardı olmanın olmazsa olmaz şartıdır.",
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
      "Teknoloji amaç değil araçtır. Asıl hedef; gönüllü bir teyzenin, bağış kabul eden bir başkanının, hasta çocuk için kampanya açan bir ailenin hayatını kolaylaştırmaktır.",
  },
];

const SERVICES: Array<{ icon: Icon; title: string; description: string }> = [
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
      "Mesajlaşma, SMS, e-posta ve 0850 sesli hat — bağışçılara ulaşmanın tüm yolları tek entegre sistemde.",
  },
  {
    icon: Sparkles,
    title: "Yapay Zeka Asistanı",
    description:
      "7/24 çalışan AI asistan bağışçı sorularını yanıtlar, bilgi sağlar, talepleri ekibe iletir. Hiçbir mesaj cevapsız kalmaz.",
  },
  {
    icon: TrendingUp,
    title: "Gerçek Zamanlı Raporlama",
    description:
      "Günlük, haftalık, aylık otomatik raporlar ile kampanya performansı anında görünür hale gelir.",
  },
  {
    icon: CheckCircle,
    title: "Valilik Onayı Uyumu",
    description:
      "Sistem, valilik onaylı yardım kampanyalarının hukuki ve mali denetim standartlarına tam uyumlu olarak tasarlanmıştır.",
  },
];

const PROCESS_STEPS: Array<{ icon: Icon; title: string; description: string }> = [
  {
    icon: FileEdit,
    title: "Talep",
    description:
      "Demo sayfasından talep gönderin veya iletişime geçin. 1 iş günü içinde size özel sunum hazırlanır.",
  },
  {
    icon: Presentation,
    title: "Sunum",
    description:
      "30-45 dakikalık online demo. Sorularınız yanıtlanır, ihtiyacınıza uygun paket birlikte belirlenir.",
  },
  {
    icon: Settings,
    title: "Kurulum",
    description:
      "Sözleşme sonrası 2-4 iş günü içinde izole sunucu hazır, alan adı yapılandırılır, ekibinize eğitim verilir.",
  },
  {
    icon: Rocket,
    title: "Canlı",
    description:
      "Kampanya yayında. Her bağış anlık sisteme düşer, tüm modüller aktif. Destek ekibi yanınızdadır.",
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
        description="Türkiye'nin bağış kültürünü şeffaflık standardı ile dönüştüren bir platform"
        badge="ERKEN ERİŞİM"
      />

      {/* Hikaye */}
      <section className="py-16 md:py-20">
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
                Belirli bir örnekle anlatmak gerekirse: Büyük bir SMA
                kampanyasında haftada binlerce küçük bağış, onlarca banka
                havalesi, yüzlerce kumbara açılışı ve sosyal medya canlı yayın
                geliri aynı anda akabilir. Dört farklı gönüllü ekibi, iki ayrı
                Excel dosyasında aynı bağışı iki kez yazmış olabilir; stant
                sorumlusu not defterini kaybetmiş olabilir; kumbara teslimatı
                günlerce yazılmadan kalabilir. Ay sonunda bütün bu verinin
                toplanıp raporlanması saatler sürer — ve çoğu zaman tutmaz.
              </p>
              <p>
                Bu belirsizlik, yardım etmek isteyen insanları caydırıyor.
                &ldquo;Ben 500 TL göndersem ne olacak ki&rdquo; hissiyatı
                yayılıyor. Gerçekten iyi niyetle kampanya yürüten dernekler de
                bu güvensizlikten zarar görüyor. Valilik onayı alınmış, hukuken
                temiz kampanyalar bile, dijital altyapı eksikliği yüzünden
                potansiyellerinin çok altında kalıyor. Bir bağışçının &ldquo;SMA
                kampanyaları güvensiz&rdquo; genellemesiyle cebindeki parayı
                çekmesi, aslında hiç ilgisi olmayan onlarca dürüst kampanyayı
                vuruyor.
              </p>
              <p>
                İkinci bir sorun katmanı ise operasyoneldir. Kampanya
                yöneticileri günlerini — bağışçılarla konuşmak, tedavi süreçini
                takip etmek, hekimlerle görüşmek gibi — asıl işleriyle değil,
                sistem arası veri taşımakla geçirmek zorunda kalıyor. Bir
                kampanya ne kadar büyürse, manuel iş yükü katlanarak büyüyor.
                Bu yük, sadece verimlilik kaybı değil, tükenmişlik ve sahaya ayak
                uyduramayan bir yönetim de doğuruyor.
              </p>
              <p>
                KAMPANYATAKİP işte tam bu soruna çözüm olarak doğdu. Teknoloji,
                finansal şeffaflık ve kurumsal güvenlik en yüksek standartlarda
                bir araya getirildi. Her bağışın anlık kayda alındığı, her
                harcamanın belgelendiği, hiçbir verinin değiştirilemeyeceği bir
                sistem kurulduğunda — bağışçılar artık telefonlarından,
                kampanya sayfasını açıp paralarının nereye gittiğini gerçek
                zamanlı görebiliyor. Dernekler artık &ldquo;şeffafız&rdquo;
                demek zorunda kalmadan, şeffaflıklarını göstererek anlatıyor.
              </p>
              <p className="text-on-surface font-medium">
                Amaç basit ama iddialı: Türkiye&apos;de yardım etmeyi, korku
                verici bir belirsizlikten çıkarıp, güven verici bir kültüre
                dönüştürmek. Bağışçı ile ihtiyaç sahibi arasındaki köprünün, her
                iki taraf için de sağlam olduğundan emin olmak.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Çözdüğümüz Problemler */}
      <section className="py-16 md:py-20 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Problem Analizi
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Çözdüğümüz Problemler
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP, bağış dünyasındaki üç temel yapısal sorunu
              birlikte çözer.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {PROBLEMS.map(({ icon: Icon, stat, statLabel, title, body }) => (
              <div
                key={title}
                className="flex flex-col h-full rounded-2xl bg-white border border-outline-variant p-7 md:p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-error/10 text-error">
                    <Icon size={24} strokeWidth={1.9} />
                  </div>
                  <div className="text-right">
                    <div className="text-[28px] md:text-[32px] font-bold text-error tracking-tight leading-none">
                      {stat}
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.12em]">
                      {statLabel}
                    </div>
                  </div>
                </div>
                <h3 className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em] mb-3">
                  {title}
                </h3>
                <p className="text-[14px] leading-[23px] text-on-surface-variant">
                  {body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[12px] text-on-surface-variant/80 max-w-2xl mx-auto">
            Yukarıdaki oranlar sektör gözlemlerine dayalı nitel değerlendirmelerdir.
          </p>
        </Container>
      </section>

      {/* Nasıl Farkındayız (karşılaştırma) */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Karşılaştırma
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Nasıl Farkındayız?
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              Geleneksel kampanya yürütme yöntemleri ile KAMPANYATAKİP
              arasındaki temel farklar.
            </p>
          </div>

          <div className="max-w-5xl mx-auto rounded-2xl border border-outline-variant overflow-hidden bg-white">
            <div className="grid grid-cols-2 bg-surface-container text-[11px] md:text-[12px] font-bold uppercase tracking-[0.12em]">
              <div className="px-5 md:px-7 py-4 text-error/90 flex items-center gap-2 border-r border-outline-variant">
                <XCircle size={14} strokeWidth={2.5} />
                Geleneksel Yöntem
              </div>
              <div className="px-5 md:px-7 py-4 text-secondary flex items-center gap-2">
                <CheckCircle2 size={14} strokeWidth={2.5} />
                KAMPANYATAKİP
              </div>
            </div>
            <ul className="divide-y divide-outline-variant">
              {COMPARISON.map((row, i) => (
                <li
                  key={i}
                  className="grid grid-cols-2 text-[13.5px] md:text-[14.5px]"
                >
                  <div className="px-5 md:px-7 py-4 flex items-start gap-3 text-on-surface-variant border-r border-outline-variant">
                    <XCircle
                      size={16}
                      className="mt-0.5 text-error/70 shrink-0"
                      strokeWidth={2}
                    />
                    <span className="leading-[22px]">{row.old}</span>
                  </div>
                  <div className="px-5 md:px-7 py-4 flex items-start gap-3 text-on-surface bg-secondary/[0.04]">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 text-secondary shrink-0"
                      strokeWidth={2}
                    />
                    <span className="leading-[22px] font-medium">
                      {row.new}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Misyon · Vizyon · Taahhüt */}
      <section className="py-16 md:py-20 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Durduğumuz Yer
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Misyon, Vizyon, Taahhüt
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {MISSION_VISION.map(({ icon: Icon, label, body }) => (
              <div
                key={label}
                className="rounded-2xl bg-white border border-outline-variant p-7 md:p-8 flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em] mb-3">
                  {label}
                </h3>
                <p className="text-[14px] md:text-[14.5px] leading-[24px] text-on-surface-variant">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Değerler */}
      <section className="py-16 md:py-20">
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

      {/* Teknik Derinlik */}
      <section className="py-16 md:py-20 bg-primary-container text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(at 15% 20%, rgba(102,218,255,0.16) 0%, transparent 55%), radial-gradient(at 85% 80%, rgba(0,103,127,0.18) 0%, transparent 55%)",
          }}
        />
        <Container className="relative">
          <div className="max-w-3xl mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary-container uppercase tracking-widest">
              Teknik Derinlik
            </span>
            <h2 className="mt-3 text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] leading-tight">
              Sadece bir yazılım değil, bir altyapı felsefesi
            </h2>
            <p className="mt-5 text-[15px] md:text-[16.5px] leading-[28px] text-white/85">
              KAMPANYATAKİP, her müşteri için tamamen izole bir altyapı kurar.
              Başka müşterilerle paylaşılan hiçbir veri, hiçbir sunucu yoktur.
              Her kampanyanın kendi sanal sunucusu, kendi veritabanı, kendi
              güvenlik katmanı vardır. Bu, bankacılık sektöründe
              &ldquo;multi-tenant&rdquo; değil &ldquo;single-tenant&rdquo;
              mimarisi olarak bilinir ve kurumsal yazılımın ulaşabileceği en
              yüksek güvenlik standardıdır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TECHNICAL_ITEMS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-sm p-6 hover:bg-white/[0.09] hover:border-white/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary-container/20 text-secondary-container flex items-center justify-center mb-4">
                  <Icon size={20} strokeWidth={1.85} />
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2 tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-[13px] leading-[20px] text-white/75">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Hizmetlerimiz */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Hizmetlerimiz
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Ne Sağlıyoruz?
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP kapsamında her müşteriye sunulan standart
              hizmetler — hepsi pakete dahil.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {SERVICES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="w-11 h-11 rounded-lg bg-white text-primary-container flex items-center justify-center mb-4 shadow-[0_1px_2px_rgba(0,24,53,0.04)]">
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

      {/* Kime Hizmet Veriyoruz */}
      <section className="py-16 md:py-20 bg-surface-container-lowest border-y border-outline-variant">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="text-[13px] font-semibold text-secondary uppercase tracking-widest">
              Hedef Kitle
            </span>
            <h2 className="mt-3 text-[28px] md:text-[32px] font-semibold tracking-[-0.02em] text-primary-container leading-tight">
              Kime Hizmet Veriyoruz?
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-on-surface-variant">
              KAMPANYATAKİP, valilik onaylı yardım kampanyalarının farklı
              türlerinin her biri için özelleştirilmiş iş akışları sunar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {AUDIENCES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 p-6 rounded-2xl bg-white border border-outline-variant hover:border-secondary hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,24,53,0.08)] transition-all duration-250"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-primary-container tracking-[-0.01em] mb-2 leading-tight">
                    {title}
                  </h3>
                  <p className="text-[13.5px] leading-[21px] text-on-surface-variant">
                    {description}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex flex-col justify-center gap-3 p-6 rounded-2xl bg-secondary/5 border border-dashed border-secondary/40">
              <HandHeart size={24} className="text-secondary" />
              <h3 className="text-[15.5px] font-semibold text-primary-container tracking-[-0.01em]">
                Kitleniz listede yok mu?
              </h3>
              <p className="text-[13px] leading-[20px] text-on-surface-variant">
                KAMPANYATAKİP özel paket ile farklı kampanya türlerine de
                uyarlanabilir. İhtiyacınızı paylaşın.
              </p>
              <Link
                href={siteConfig.urls.contact}
                className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-on-secondary-container"
              >
                İletişime Geç →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Süreç */}
      <section className="py-16 md:py-20">
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
                  className="relative rounded-2xl bg-surface-container-low border border-outline-variant p-6 text-center md:text-left"
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
      <section className="py-16 md:py-20 bg-surface-container-lowest border-y border-outline-variant">
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
      <section className="py-16 md:py-20">
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
                &ldquo;Türkiye&apos;nin bağış kültürünü şeffaflık
                standartlarıyla güçlendirmek, her valilik onaylı kampanyayı
                güvenilir bir deneyime dönüştürmek.&rdquo;
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
                <Link href={siteConfig.urls.apply}>
                  <Button variant="primary" size="xl" className="w-full sm:w-auto">
                    Kampanyanızı Başlatın
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
