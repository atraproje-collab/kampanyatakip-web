export type FaqCategoryId =
  | "genel"
  | "kurulum"
  | "guvenlik"
  | "fiyatlandirma"
  | "teknik";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
};

export type FaqItem = {
  category: FaqCategoryId;
  question: string;
  answer: string;
};

export const faqCategories: FaqCategory[] = [
  { id: "genel", label: "Genel" },
  { id: "kurulum", label: "Kurulum" },
  { id: "guvenlik", label: "Güvenlik & Şeffaflık" },
  { id: "fiyatlandirma", label: "Fiyatlandırma" },
  { id: "teknik", label: "Teknik" },
];

export const faqItems: FaqItem[] = [
  {
    category: "genel",
    question: "KAMPANYATAKİP nedir?",
    answer:
      "KAMPANYATAKİP, Türkiye'deki valilik onaylı yardım kampanyaları için geliştirilmiş, yapay zeka destekli bir bağış yönetim ve şeffaflık platformudur. Her kampanya için özel, izole bir sistem kurar ve tüm bağış/harcama süreçlerini otomatikleştirir.",
  },
  {
    category: "genel",
    question: "Kimler kullanabilir?",
    answer:
      "Valilik onaylı yardım kampanyası düzenleyen tüm kuruluşlar (dernekler, vakıflar, kampanya komisyonları) KAMPANYATAKİP'i kullanabilir. SMA, DMD, kanser, afet yardımı, eğitim bağışı gibi her tür kampanya desteklenir.",
  },
  {
    category: "genel",
    question: "Valilik onayı olmadan kullanılabilir mi?",
    answer:
      "Hayır. KAMPANYATAKİP, yalnızca valilik onaylı kampanyalara hizmet verir. Bu, platformumuzun güvenilirlik ve hukuki uygunluk standartlarının temel şartıdır.",
  },
  {
    category: "kurulum",
    question: "Kurulum ne kadar sürer?",
    answer:
      "Seçtiğiniz pakete bağlı olarak 2-4 iş günü içinde kampanyanız tamamen faaliyete geçer. Bu süreçte izole sunucunuz hazırlanır, alan adınız yapılandırılır, tüm modüller kurulur ve eğitim verilir.",
  },
  {
    category: "kurulum",
    question: "Kendi alan adımı kullanabilir miyim?",
    answer:
      "Evet. Mevcut alan adınızı sisteme bağlayabilir veya size özel bir alan adı alabiliriz. SSL sertifikası otomatik olarak kurulur ve yenilenir.",
  },
  {
    category: "kurulum",
    question: "Mevcut bağış verilerimi sisteme aktarabilir miyim?",
    answer:
      "Evet. Excel, CSV veya banka ekstresi formatındaki mevcut verileriniz kurulum sırasında sisteme aktarılır. Geçmiş bağışlar da şeffaflık merkezinde görüntülenir.",
  },
  {
    category: "guvenlik",
    question: "Verilerim güvende mi?",
    answer:
      "Evet. Her kampanya için izole bir sunucu kurulur (başka müşterilerle veri paylaşımı yoktur). Tüm bağış kayıtları değiştirilemez veritabanında tutulur, günlük otomatik yedekleme yapılır ve kurumsal güvenlik katmanı ile korunur.",
  },
  {
    category: "guvenlik",
    question: "Bağışçı bilgileri nasıl korunur?",
    answer:
      "Bağışçı isimleri ve iletişim bilgileri KVKK uyumlu olarak saklanır. Şeffaflık merkezinde bağışçı isimleri maskelenerek gösterilir (örnek: K***** Y*****). İsteyen bağışçılar tamamen anonim kalabilir.",
  },
  {
    category: "guvenlik",
    question: "Harcamalar nasıl şeffaflaştırılıyor?",
    answer:
      "Her harcama için belge (fatura, makbuz, sözleşme) yüklenmesi zorunludur. Belgesiz hiçbir harcama sisteme işlenemez. Tüm harcamalar kategorize edilir ve şeffaflık merkezinde halka açık olarak listelenir.",
  },
  {
    category: "guvenlik",
    question: "Kayıtlar silinebilir mi?",
    answer:
      "Hayır. Sistemdeki tüm gelir ve gider kayıtları değiştirilemez (immutable) yapıda tutulur. Hatalı giriş yapılırsa, düzeltme ayrı bir kayıt olarak eklenir; orijinal kayıt silinmez. Bu, KAMPANYATAKİP'in denetim standardı olma özelliğinin temelidir.",
  },
  {
    category: "fiyatlandirma",
    question: "Hangi paketler mevcut?",
    answer:
      "Dört paket sunuyoruz: Temel (9.900 TL/ay), Standart (17.900 TL/ay), Premium (29.900 TL/ay) ve Özel (teklife özel). Detaylı karşılaştırma için fiyatlandırma bölümümüze göz atabilirsiniz.",
  },
  {
    category: "fiyatlandirma",
    question: "Sözleşme süresi nedir?",
    answer:
      "Aylık ödeme sistemiyle çalışıyoruz. Minimum sözleşme süresi yoktur. İstediğiniz ay iptal edebilirsiniz.",
  },
  {
    category: "fiyatlandirma",
    question: "İptal edersem verilerim ne olur?",
    answer:
      "İptal sonrası 30 gün boyunca verileriniz saklanır ve indirme hakkınız vardır. 30 gün sonunda tüm veriler kalıcı olarak silinir.",
  },
  {
    category: "fiyatlandirma",
    question: "Gizli ücret var mı?",
    answer:
      "Hayır. Paket fiyatına kurulum, sunucu, alan adı, SSL, yedekleme, destek ve tüm modüller dahildir. Aşım ücretleri (mesaj veya sesli hat dakika aşımı) paket limitlerinizi aştığınızda şeffaf şekilde uygulanır.",
  },
  {
    category: "teknik",
    question: "Mobil uygulama var mı?",
    answer:
      "Kampanyalarınız tam responsive web sayfası olarak çalışır — tüm mobil tarayıcılarda mükemmel görünür. Ayrıca kampanya yöneticileri için mesajlaşma üzerinden tüm bildirimleri alırlar, ayrı uygulama kurmaya gerek yoktur.",
  },
  {
    category: "teknik",
    question: "Hangi bankalarla entegrasyon var?",
    answer:
      "Standart ve üstü paketlerde tüm büyük Türk bankalarıyla (Ziraat, Vakıfbank, İş Bankası, Garanti, Akbank, Yapı Kredi, vb.) otomatik entegrasyon sağlanır. Gelen bağışlar banka bildirimi ile anlık sisteme düşer.",
  },
  {
    category: "teknik",
    question: "Yurtdışından bağış kabul edebilir miyim?",
    answer:
      "Evet. Premium paket çoklu dil desteği ve uluslararası ödeme altyapısı içerir. Bağışçılar Türk Lirası veya yabancı para birimi cinsinden bağış yapabilir.",
  },
  {
    category: "teknik",
    question: "Teknik destek nasıl alırım?",
    answer:
      "7/24 yapay zeka asistan desteği tüm paketlerde mevcuttur. Standart ve üstü paketlerde iş saatlerinde canlı teknik destek, Premium pakette öncelikli destek sağlanır.",
  },
];
