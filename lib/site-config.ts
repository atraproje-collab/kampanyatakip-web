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
    email: "info@kampanyatakip.com",
    supportEmail: "destek@kampanyatakip.com",
    phone: "0850 XXX XX XX",
    phoneLink: "tel:+908500000000",
    whatsapp: "+90 5XX XXX XX XX",
    whatsappLink: "https://wa.me/905000000000",
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
    faq: "/sss",
    contact: "/iletisim",
    demo: "/demo",
    terms: "#",
    privacy: "#",
    kvkk: "#",
  },

  nav: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Modüller", href: "/#features" },
    { label: "Fiyatlandırma", href: "/#pricing" },
    { label: "SSS", href: "/sss" },
    { label: "İletişim", href: "/iletisim" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
