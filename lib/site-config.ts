export const siteConfig = {
  company: {
    name: "KAMPANYATAKİP",
    legalName: "KAMPANYATAKİP",
    foundedYear: 2026,
    status: "Erken Erişim",
    tagline: "Bağışın Her Adımı, Şeffaf ve Güvende",
    description:
      "Türkiye'nin ilk valilik onaylı, yapay zeka destekli bağış şeffaflık platformu",
  },

  contact: {
    email: "bilgi@kampanyatakip.com.tr",
    supportEmail: "destek@kampanyatakip.com",
    phone: "0533 379 72 87",
    phoneLink: "tel:+905333797287",
    whatsapp: "+90 533 379 72 87",
    whatsappLink: "https://wa.me/905333797287",
    address: "İstanbul, Türkiye",
    workingHours: "Pazartesi - Cuma · 09:00 - 18:00",
  },

  social: {
    linkedin: "https://linkedin.com/company/kampanyatakip",
    twitter: "https://twitter.com/kampanyatakip",
    instagram: "https://instagram.com/kampanyatakip",
    facebook: null as string | null,
    youtube: null as string | null,
  },

  legal: {
    taxOffice: null as string | null,
    taxNumber: null as string | null,
    tradeRegistry: null as string | null,
    mersis: null as string | null,
  },

  stats: {
    activeCampaigns: "Lansman Aşamasında",
    totalDonations: "Pilot Aşamasında",
    donorCount: "Yakında",
    installationDays: "2-4 İş Günü",
  },

  urls: {
    home: "/",
    about: "/hakkimizda",
    howItWorks: "/nasil-calisir",
    faq: "/sss",
    contact: "/iletisim",
    campaignDemo: "/kampanya/demo",
    apply: "/basvuru",
    /** @deprecated use `apply` instead. Retained temporarily for call sites not yet migrated. */
    demo: "/basvuru",
    terms: "/kullanim-kosullari",
    privacy: "/gizlilik",
    kvkk: "/kvkk",
  },

  nav: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Nasıl Çalışır", href: "/nasil-calisir" },
    { label: "Modüller", href: "/moduller" },
    { label: "Fiyatlandırma", href: "/#pricing" },
    { label: "SSS", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
