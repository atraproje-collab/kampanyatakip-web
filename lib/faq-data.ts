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
  // ── Fiyatlandırma ─────────────────────────────────────────────────────────
  {
    category: "fiyatlandirma",
    question: "Ücretler nedir?",
    answer:
      "Fiyat bilgisi için iletişime geçin: bilgi@kampanyatakip.com.tr — size kampanyanıza özel teklif sunalım.",
  },
  {
    category: "fiyatlandirma",
    question: "Komisyon alıyor musunuz?",
    answer:
      "Hayır. KAMPANYATAKİP bir yazılım/platform kiralama hizmetidir. Bağışlardan komisyon almaz, ödeme aracısı değildir. Aylık paket ücreti dışında ek bir tahsilat yapmıyoruz.",
  },
  {
    category: "fiyatlandirma",
    question: "Gizli ücret var mı?",
    answer:
      "Hayır. Paket fiyatına kurulum, izole sunucu, alan adı, SSL, yedekleme, destek ve tüm modüller dahildir. Paket limitlerini aştığınızda (mesaj veya dakika) ek ücret şeffaf şekilde uygulanır.",
  },
  {
    category: "fiyatlandirma",
    question: "Sözleşme süresi nedir?",
    answer:
      "Aylık ödeme sistemiyle çalışıyoruz. Minimum sözleşme süresi yoktur, istediğiniz ay iptal edebilirsiniz.",
  },

  // ── Güvenlik & Şeffaflık ──────────────────────────────────────────────────
  {
    category: "guvenlik",
    question: "Para güvende mi?",
    answer:
      "Bağışçılar doğrudan sizin banka hesabınıza transfer yapar. Para KAMPANYATAKİP sistemine hiç girmez — biz sadece takip ve raporlama sağlarız. Kampanya sahibinin banka hesabı tek tahsilat noktasıdır.",
  },
  {
    category: "guvenlik",
    question: "Verilerim güvende mi?",
    answer:
      "Evet. Her kampanya tamamen izole sunucuda çalışır (başka müşteriyle veri paylaşımı yoktur). KVKK uyumlu altyapı, bağışçı gizlilik maskesi ve değiştirilemez kayıt sistemi ile verileriniz güvende.",
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
      "Hayır. Tüm gelir ve gider kayıtları değiştirilemez (immutable) yapıda tutulur. Hatalı giriş yapılırsa düzeltme yeni bir kayıt olarak eklenir; orijinal kayıt tarih ve imzasıyla korunur.",
  },

  // ── Kurulum ───────────────────────────────────────────────────────────────
  {
    category: "kurulum",
    question: "Kurulum ne kadar sürer?",
    answer:
      "2-4 iş günü içinde tüm altyapınız hazır olur. Bu süreçte izole sunucunuz hazırlanır, alan adınız yapılandırılır, tüm modüller kurulur ve eğitim verilir.",
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

  // ── Genel ─────────────────────────────────────────────────────────────────
  {
    category: "genel",
    question: "Hangi kampanyalar için uygundur?",
    answer:
      "Valilik onaylı tüm yardım kampanyaları için uygundur. SMA, DMD ve diğer nadir hastalık kampanyaları başta olmak üzere tüm onaylı kampanyalar sisteme dahil edilebilir.",
  },
  {
    category: "genel",
    question: "KAMPANYATAKİP nedir?",
    answer:
      "Türkiye'deki valilik onaylı yardım kampanyaları için geliştirilmiş, yapay zeka destekli bir bağış yönetim ve şeffaflık platformudur. Her kampanya için özel, izole bir sistem kurar ve tüm bağış/harcama süreçlerini otomatikleştirir.",
  },
  {
    category: "genel",
    question: "Valilik onayı olmadan kullanılabilir mi?",
    answer:
      "Hayır. KAMPANYATAKİP yalnızca valilik onaylı kampanyalara hizmet verir. Bu, platformumuzun güvenilirlik ve hukuki uygunluk standartlarının temel şartıdır.",
  },
  {
    category: "genel",
    question: "Demo görebilir miyim?",
    answer:
      "Evet! /kampanya/demo adresinden canlı demo kampanyamızı (Minik Defne) inceleyebilir — gerçek veri akışıyla şeffaflık merkezini, bağış sürecini ve admin panelini görebilirsiniz.",
  },
  {
    category: "genel",
    question: "İletişim için?",
    answer:
      "bilgi@kampanyatakip.com.tr adresine yazabilir veya iletişim sayfamızdan formu doldurabilirsiniz. 1 iş günü içinde dönüş yaparız.",
  },

  // ── Teknik ────────────────────────────────────────────────────────────────
  {
    category: "teknik",
    question: "Mobil uygulama var mı?",
    answer:
      "Kampanyalarınız tam responsive web sayfası olarak çalışır — tüm mobil tarayıcılarda mükemmel görünür. Kampanya yöneticileri için ayrı bir uygulama kurmaya gerek yoktur.",
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
