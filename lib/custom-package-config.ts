export type ModuleType = "checkbox" | "stepper";

export interface ModuleOption {
  id: string;
  name: string;
  description: string;
  price: number;
  type: ModuleType;
  min?: number;
  max?: number;
  unit?: string;
}

export interface BaseConfig {
  name: string;
  description: string;
  price: number;
  features: string[];
}

export const customPackageConfig: {
  base: BaseConfig;
  modules: ModuleOption[];
} = {
  base: {
    name: "Taban Altyapı",
    description: "Zorunlu · Tüm standart modüller dahil",
    price: 4900,
    features: [
      "İzole sunucu altyapısı",
      "Para takibi + anlık bildirim",
      "Kumbara takip sistemi",
      "Stant takip sistemi",
      "Gönüllü yönetim (2 kullanıcı)",
      "Canlı yayın gelir takibi",
      "Şeffaflık merkezi",
      "Kampanya web sayfası",
      "Bağışçı gizlilik maskesi",
      "7/24 AI mesajlaşma asistanı",
      "Günlük otomatik yedek",
      "2-4 iş günü kurulum",
    ],
  },
  modules: [
    {
      id: "twitter",
      name: "X / Kısa Mesaj Platformu Entegrasyonu",
      description:
        "API maliyeti dahil · Otomatik paylaşım ve DM takibi",
      price: 4200,
      type: "checkbox",
    },
    {
      id: "short-video",
      name: "Kısa Video Canlı Yayın Modülü",
      description:
        "Kısa video platformu canlı yayın gelir takibi (banka eşleşmesiyle)",
      price: 2200,
      type: "checkbox",
    },
    {
      id: "legal",
      name: "Hukuk Danışmanlığı (2 saat/ay)",
      description:
        "Kampanya hukuk uyumu, sözleşme inceleme desteği",
      price: 5000,
      type: "checkbox",
    },
    {
      id: "influencer",
      name: "Influencer Radar Sistemi",
      description:
        "Marka ve kampanya ile uyumlu influencer eşleştirme",
      price: 3500,
      type: "checkbox",
    },
    {
      id: "video-translation",
      name: "Çok Dilli Video Çeviri (5 video/ay)",
      description:
        "Profesyonel video çeviri sistemi (AI destekli dublaj)",
      price: 2500,
      type: "checkbox",
    },
    {
      id: "premium-sla",
      name: "Premium SLA · 7/24 Canlı Destek",
      description:
        "İş saatleri dışında da canlı teknik destek",
      price: 2800,
      type: "checkbox",
    },
    {
      id: "dedicated-manager",
      name: "Dedicated Hesap Yöneticisi",
      description:
        "Size özel ayrılmış hesap yöneticisi, aylık strateji toplantısı",
      price: 4500,
      type: "checkbox",
    },
    {
      id: "custom-reports",
      name: "Özel Raporlama ve Dashboard",
      description:
        "Size özel KPI'lar, otomatik raporlar, Excel export",
      price: 1800,
      type: "checkbox",
    },
    {
      id: "extra-languages",
      name: "Ek Dil Desteği",
      description: "Ek dil başına (TR + EN dışı)",
      price: 1500,
      type: "stepper",
      min: 0,
      max: 4,
      unit: "dil",
    },
    {
      id: "messages-extra",
      name: "Ek Mesajlaşma Paketi",
      description: "Her paket +1.000 mesaj (gelen + giden)",
      price: 800,
      type: "stepper",
      min: 0,
      max: 10,
      unit: "paket",
    },
    {
      id: "ivr-extra",
      name: "Ek Sesli Hat Dakikası",
      description: "Her paket +500 dakika",
      price: 650,
      type: "stepper",
      min: 0,
      max: 10,
      unit: "paket",
    },
    {
      id: "custom-integration",
      name: "Özel API Entegrasyonu",
      description: "Kendi CRM / ERP sisteminize bağlantı",
      price: 3200,
      type: "stepper",
      min: 0,
      max: 5,
      unit: "API",
    },
  ],
};

export type Selection = Record<string, number>;

export function calculateTotal(selections: Selection): number {
  const extras = customPackageConfig.modules.reduce((sum, module) => {
    const count = selections[module.id] || 0;
    return sum + count * module.price;
  }, 0);
  return customPackageConfig.base.price + extras;
}

export function getSelectedModules(selections: Selection) {
  return customPackageConfig.modules
    .filter((m) => (selections[m.id] || 0) > 0)
    .map((m) => ({ ...m, quantity: selections[m.id] }));
}
