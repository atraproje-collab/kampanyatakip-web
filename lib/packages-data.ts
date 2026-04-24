// ────────────────────────────────────────────────────────────
// Single source of truth for KAMPANYATAKİP pricing & packaging.
// Read by components/sections/Pricing.tsx, components/ui/PricingCard.tsx
// and components/pricing/CustomPackageModal.tsx.
// ────────────────────────────────────────────────────────────

// Standart modüller — tüm paketlerde ek ücret olmaksızın bulunan özellikler.
// Pazarlama kart yüzünde bunları tek tek listelemiyoruz (kartı şişirir); kart
// her pakette o tier'a özel farklılıkları gösteriyor.
export const STANDARD_MODULES: string[] = [
  "Para takibi ve anlık bildirim (banka entegrasyonu)",
  "Kumbara takip sistemi (QR + fotoğraflı tutanak)",
  "Stant takip sistemi (günlük kapanış)",
  "Gönüllü yönetim sistemi",
  "Canlı yayın gelir takibi (OCR + banka eşleştirme)",
  "Gelir-gider şeffaflık modülü",
  "7/24 AI mesajlaşma asistanı (temel)",
  "5 dilde sesli bilgi hattı (0850)",
  "Kampanya sayfası + canlı sayaç + valilik belgesi",
  "Bağışçı gizlilik maskesi (KVKK uyumlu)",
  "Şeffaflık merkezi (değiştirilemez kayıt)",
  "Günlük otomatik yedek + kurumsal güvenlik",
  "İzole kampanya sunucusu",
  "Canva Pro hesabı (₺240/ay dahil)",
  "Kurumsal bağış vergi bilgilendirme",
  "Günlük/haftalık/aylık WhatsApp raporu",
  "Kritik olay bildirimleri",
  "2-4 iş günü kurulum",
];

export type PackageId = "temel" | "standart" | "premium" | "ozel";

export interface PricingPackageData {
  id: PackageId;
  name: string;
  tagline: string;
  price?: string;
  priceText?: string;
  priceSubtext?: string;
  currency?: string;
  period?: string;
  featured?: boolean;
  isCustom?: boolean;
  badge?: string | null;
  includesBadge?: string | null;
  features: string[];
  exclusions?: string[];
  ctaText: string;
  ctaStyle: "primary" | "outline" | "custom";
  href?: string;
}

export const PACKAGES: PricingPackageData[] = [
  {
    id: "temel",
    name: "Temel",
    tagline: "Tek sosyal medya platformuyla başlayan, bütçe bilincli kampanyalar için.",
    price: "9.900",
    currency: "₺",
    period: "/ay",
    features: [
      "Tüm standart modüller dahil",
      "2.000 mesaj/ay (1.000 gelen + 1.000 giden)",
      "Aşım: mesaj başına ₺0,16",
      "300 dakika sesli hat/ay · aşım dakikası ₺0,13",
      "1 sosyal medya platformu (Facebook, Instagram veya YouTube)",
      "Seçilen platformda post paylaşımı + mesaj/yorum otomatik yanıt",
      "Aylık 5 Türkçe video otomatik yayın",
      "Limit %80 uyarısı WhatsApp'a otomatik düşer",
    ],
    exclusions: [
      "Çok dilli video çeviri",
      "İkinci ve üçüncü sosyal medya platformu",
      "TikTok otomasyonu",
      "Influencer radar",
      "Hukuk danışmanlığı",
    ],
    ctaText: "Paketi Seç",
    ctaStyle: "outline",
    href: "/basvuru",
  },
  {
    id: "standart",
    name: "Standart",
    tagline: "Üç platformda aktif olmak isteyen, uluslararası bağışçı hedefleyen kampanyalar için.",
    price: "17.900",
    currency: "₺",
    period: "/ay",
    featured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    includesBadge: "TEMEL'DEKİ HER ŞEY + ŞUNLAR",
    features: [
      "5.000 mesaj/ay (2.500 gelen + 2.500 giden)",
      "1.000 dakika sesli hat/ay",
      "Facebook + Instagram + YouTube — 3 platform aktif",
      "Facebook Messenger, Instagram DM ve YouTube yorumları AI ile otomatik yanıt",
      "Aylık 5 video · TR + EN + AR (15 içerik parçası)",
      "Reels, Shorts ve Feed formatları otomatik boyutlandırma",
      "5 dilde bağışçı iletişimi — gelen mesaj dilinde yanıt",
      "Kurumsal bağış e-posta kanalı (vergi bilgilendirme + 3 gün sonra takip + makbuz PDF)",
    ],
    exclusions: [
      "TikTok otomasyonu",
      "Influencer radar",
      "Hukuk danışmanlığı",
    ],
    ctaText: "Hemen Başla",
    ctaStyle: "primary",
    href: "/basvuru",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Maksimum görünürlük, sınırsız iletişim isteyen büyük kampanyalar için.",
    price: "29.900",
    currency: "₺",
    period: "/ay",
    includesBadge: "STANDART'TAKİ HER ŞEY + ŞUNLAR",
    features: [
      "Sınırsız WhatsApp mesajı · 5 dilde otomatik yanıt",
      "Sınırsız sesli bilgi hattı · dakika sınırı yok",
      "Facebook + Instagram + YouTube + TikTok — 4 platform aktif",
      "Aylık 10 video · 5 dile çeviri (TR + EN + AR + DE + FR) · 50 içerik parçası",
      "Influencer radar (takipçi, etkileşim ve kategori bazlı sıralı rapor)",
      "2 saat/ay birebir hukuk danışmanlığı · valilik raporlama desteği",
      "Öncelikli teknik destek",
      "Kurumsal bağış tam sistem (LinkedIn şablon, aylık rapor, beyan dönemi hatırlatma)",
    ],
    ctaText: "Paketi Seç",
    ctaStyle: "outline",
    href: "/basvuru",
  },
  {
    id: "ozel",
    name: "Özel",
    tagline: "Standart paketlerin hiçbiri uymuyorsa — zorunlu modüller + istediğiniz eklentiler.",
    priceText: "4.900 ₺",
    priceSubtext: "tabandan başlayan",
    period: "+ modül seçimi (min. ₺9.900/ay)",
    isCustom: true,
    badge: "KENDİN OLUŞTUR",
    features: [
      "Zorunlu modüller sabit · taban fiyata dahil",
      "Para takibi, kumbara, stant, gönüllü, TikTok gelir takibi",
      "Gelir-gider şeffaflık + değişmez kayıt",
      "Kampanya sayfası + canlı sayaç",
      "Bağışçı gizlilik maskesi + KVKK uyumu",
      "İzole sunucu + Canva Pro + otomatik yedek",
      "Eklenebilir: WhatsApp, sesli hat, sosyal medya, çeviri, influencer, kurumsal bağış, X/Twitter, hukuk",
      "Minimum aylık toplam: ₺9.900",
    ],
    ctaText: "Paketini Oluştur",
    ctaStyle: "custom",
  },
];

// ─── Custom package configurator ────────────────────────────────
export const MINIMUM_CUSTOM_TOTAL = 9900;

export interface CustomBase {
  name: string;
  description: string;
  price: number;
  features: string[];
}

export type ModuleType = "checkbox" | "stepper";

export interface CustomModule {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ModuleType;
  min?: number;
  max?: number;
  unit?: string;
}

export const CUSTOM_BASE: CustomBase = {
  name: "Taban Altyapı",
  description: "Zorunlu · Tüm standart modüller dahil",
  price: 4900,
  features: [
    "İzole kampanya sunucusu + güvenlik katmanı",
    "Para takibi ve anlık WhatsApp bildirimi",
    "Kumbara, stant ve gönüllü yönetim sistemi",
    "Canlı yayın gelir takibi (OCR + banka eşleştirme)",
    "Gelir-gider şeffaflık modülü",
    "Kampanya sayfası + canlı sayaç + valilik belgesi",
    "Bağışçı gizlilik maskesi (KVKK)",
    "Şeffaflık merkezi (değiştirilemez kayıt)",
    "Canva Pro hesabı (₺240/ay dahil)",
    "Günlük otomatik yedek + kritik olay bildirimleri",
    "Kurumsal bağış vergi bilgilendirme",
    "2-4 iş günü kurulum",
  ],
};

export const CUSTOM_MODULES: CustomModule[] = [
  {
    id: "social-core",
    name: "Sosyal Medya Paketi (FB + IG + YT)",
    description:
      "Üç ana platformda post paylaşımı ve mesaj/yorum otomatik yanıtlama.",
    price: 3800,
    type: "checkbox",
  },
  {
    id: "tiktok-automation",
    name: "TikTok Sosyal Medya Otomasyonu",
    description:
      "TikTok post paylaşımı ve DM otomatik yanıt. Canlı yayın gelir takibi tabanda zaten dahildir.",
    price: 2200,
    type: "checkbox",
  },
  {
    id: "twitter",
    name: "X / Twitter Modülü",
    description:
      "Otomatik post, DM yanıtı ve hashtag izleme. X API maliyeti dahildir.",
    price: 4200,
    type: "checkbox",
  },
  {
    id: "video-translation",
    name: "Çok Dilli Video Çeviri (5 video/ay)",
    description:
      "AI destekli dublaj ile videolar 5 dile çevrilir; format otomasyonu ile Reels/Shorts/Feed ayrı ayrı üretilir.",
    price: 2500,
    type: "checkbox",
  },
  {
    id: "influencer",
    name: "Influencer Radar Sistemi",
    description:
      "Marka/kampanya ile uyumlu influencer eşleştirme, takipçi ve etkileşim sıralı rapor.",
    price: 3500,
    type: "checkbox",
  },
  {
    id: "corporate-donation",
    name: "Kurumsal Bağış Edinme Sistemi",
    description:
      "E-posta + WhatsApp vergi bilgilendirme, LinkedIn şablonu, aylık kurumsal bağışçı raporu, beyan dönemi hatırlatma.",
    price: 2000,
    type: "checkbox",
  },
  {
    id: "legal",
    name: "Hukuk Danışmanlığı (2 saat/ay)",
    description:
      "Valilik süreçleri, raporlama ve mevzuat uyumu için birebir uzman desteği.",
    price: 5000,
    type: "checkbox",
  },
  {
    id: "premium-sla",
    name: "Premium SLA · 7/24 Canlı Destek",
    description: "İş saatleri dışında da canlı teknik destek kanalı.",
    price: 2800,
    type: "checkbox",
  },
  {
    id: "dedicated-manager",
    name: "Dedicated Hesap Yöneticisi",
    description: "Size özel ayrılmış yönetici + aylık strateji toplantısı.",
    price: 4500,
    type: "checkbox",
  },
  {
    id: "messages-extra",
    name: "WhatsApp Mesaj Paketi",
    description: "Her paket +1.000 mesaj (gelen + giden).",
    price: 800,
    type: "stepper",
    min: 0,
    max: 10,
    unit: "paket",
  },
  {
    id: "ivr-extra",
    name: "Sesli Bilgi Hattı Dakikası",
    description: "Her paket +500 dakika.",
    price: 650,
    type: "stepper",
    min: 0,
    max: 10,
    unit: "paket",
  },
  {
    id: "extra-languages",
    name: "Ek Dil Desteği",
    description: "Ek dil başına (TR + EN dışı).",
    price: 1500,
    type: "stepper",
    min: 0,
    max: 4,
    unit: "dil",
  },
  {
    id: "custom-integration",
    name: "Özel API Entegrasyonu",
    description: "Kendi CRM / ERP sisteminize bağlantı.",
    price: 3200,
    type: "stepper",
    min: 0,
    max: 5,
    unit: "API",
  },
];

// ─── Add-on packages (her ana pakete eklenebilir) ──────────────
export interface AddonPackage {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  compatibility: string;
}

export const ADDON_PACKAGES: AddonPackage[] = [
  {
    id: "twitter",
    name: "X / Twitter Modülü",
    price: 4200,
    priceLabel: "+₺4.200/ay",
    description:
      "Otomatik post paylaşımı, DM yanıtı, kampanya hashtag izleme. X API erişim maliyeti ve yönetim bedeli dahildir.",
    compatibility: "Her ana pakete eklenebilir",
  },
  {
    id: "legal",
    name: "Hukuk Danışmanlığı",
    price: 5000,
    priceLabel: "+₺5.000/ay",
    description:
      "Yasal süreç takibi, mevzuat uyumluluğu, valilik raporlama hazırlığı. Aylık 2 saat birebir hukuki danışmanlık.",
    compatibility: "Temel ve Standart paketlere eklenir (Premium'da dahildir)",
  },
];

// ─── Selection helpers used by modal + confirmation page ──────
export type Selection = Record<string, number>;

export function calculateTotal(selections: Selection): number {
  const extras = CUSTOM_MODULES.reduce((sum, module) => {
    const count = selections[module.id] || 0;
    return sum + count * module.price;
  }, 0);
  return CUSTOM_BASE.price + extras;
}

export function getSelectedModules(selections: Selection) {
  return CUSTOM_MODULES.filter((m) => (selections[m.id] || 0) > 0).map((m) => ({
    ...m,
    quantity: selections[m.id],
  }));
}

export function isCustomMinimumMet(total: number): boolean {
  return total >= MINIMUM_CUSTOM_TOTAL;
}

export function missingToMinimum(total: number): number {
  return Math.max(0, MINIMUM_CUSTOM_TOTAL - total);
}
