export type PackageTier = "Temel" | "Standart" | "Premium" | "Özel";

export type CampaignStatus = "active" | "paused" | "suspended";

export type ModuleKey =
  | "para-takibi"
  | "kumbara"
  | "stant"
  | "gonullu"
  | "canli-yayin"
  | "gelir-gider"
  | "whatsapp-ai"
  | "sesli-hat"
  | "kampanya-web"
  | "gizlilik-maskesi"
  | "seffaflik-merkezi"
  | "guvenlik-yedek"
  | "sosyal-medya"
  | "raporlama";

export type OnboardingKey =
  | "vps"
  | "domain"
  | "ssl"
  | "postgresql"
  | "n8n"
  | "whatsapp"
  | "banka"
  | "sosyal-medya"
  | "ivr";

export type ManagedCampaign = {
  slug: string;
  name: string;
  patientOrOrg: string;
  package: PackageTier;
  status: CampaignStatus;
  isDemo: boolean;
  startDate: string;
  monthlyFee: number;
  lastPayment: { date: string; amount: number; status: "paid" | "pending" } | null;
  nextPaymentDate: string | null;
  publicUrl: string;
  adminUrl: string;
  contact: { name: string; phone: string; email: string };
  whatsapp: { used: number; limit: number | null };
  ivr: { used: number; limit: number | null };
  video: { used: number; limit: number | null };
  socialMedia: { active: number; total: number };
  modules: Record<ModuleKey, boolean>;
  onboarding: Record<OnboardingKey, boolean>;
};

export type ModuleMeta = {
  key: ModuleKey;
  label: string;
  description: string;
};

export const MODULE_CATALOG: ModuleMeta[] = [
  { key: "para-takibi", label: "Para Takibi", description: "Bağış, kasa ve transfer kayıtları" },
  { key: "kumbara", label: "Kumbara Takip", description: "Saha kumbaraları ve toplama tarihçesi" },
  { key: "stant", label: "Stant Takip", description: "AVM/etkinlik standları ve tahsilatlar" },
  { key: "gonullu", label: "Gönüllü Yönetimi", description: "Gönüllü vardiya ve görev planlaması" },
  { key: "canli-yayin", label: "Canlı Yayın Takibi", description: "Canlı yayın bağış ve etkileşim raporu" },
  { key: "gelir-gider", label: "Gelir-Gider Şeffaflık", description: "Kamuya açık şeffaflık merkezi defteri" },
  { key: "whatsapp-ai", label: "WhatsApp AI Asistan", description: "Otomatik bağışçı yanıtları" },
  { key: "sesli-hat", label: "Sesli Hat 0850", description: "Hat üzerinden bağış ve çağrı yönlendirme" },
  { key: "kampanya-web", label: "Kampanya Web Sayfası", description: "Kamuya açık kampanya sayfası" },
  { key: "gizlilik-maskesi", label: "Gizlilik Maskesi", description: "Bağışçı isim ve iletişim maskeleme" },
  { key: "seffaflik-merkezi", label: "Şeffaflık Merkezi", description: "Belge ve makbuz görüntüleme" },
  { key: "guvenlik-yedek", label: "Güvenlik / Yedek", description: "Otomatik yedekleme ve rol yönetimi" },
  { key: "sosyal-medya", label: "Sosyal Medya", description: "Çoklu platform paylaşım ve mesajlar" },
  { key: "raporlama", label: "Raporlama", description: "Dönemsel rapor ve PDF dışa aktarma" },
];

export type OnboardingMeta = { key: OnboardingKey; label: string };

export const ONBOARDING_CATALOG: OnboardingMeta[] = [
  { key: "vps", label: "VPS kurulumu" },
  { key: "domain", label: "Domain bağlama" },
  { key: "ssl", label: "SSL sertifikası" },
  { key: "postgresql", label: "PostgreSQL kurulumu" },
  { key: "n8n", label: "Otomasyon motoru kurulumu" },
  { key: "whatsapp", label: "WhatsApp entegrasyonu" },
  { key: "banka", label: "Banka entegrasyonu" },
  { key: "sosyal-medya", label: "Sosyal medya bağlantısı" },
  { key: "ivr", label: "IVR kurulumu" },
];

export type ActivityEvent = {
  id: string;
  type: "donation" | "warning" | "system" | "info";
  campaignSlug?: string;
  campaignLabel?: string;
  message: string;
  timestamp: string;
};

export const MANAGED_CAMPAIGNS: ManagedCampaign[] = [
  {
    slug: "defne",
    name: "Minik Defne Kampanyası",
    patientOrOrg: "Defne (3 yaş, SMA Tip-1)",
    package: "Premium",
    status: "active",
    isDemo: true,
    startDate: "2026-01-15",
    monthlyFee: 0,
    lastPayment: null,
    nextPaymentDate: null,
    publicUrl: "/kampanya/demo",
    adminUrl: "/admin/defne",
    contact: {
      name: "Demo Sorumlu",
      phone: "+90 555 000 00 01",
      email: "demo@kampanyatakip.com",
    },
    whatsapp: { used: 1247, limit: null },
    ivr: { used: 0, limit: null },
    video: { used: 12, limit: 50 },
    socialMedia: { active: 4, total: 4 },
    modules: {
      "para-takibi": true,
      kumbara: true,
      stant: true,
      gonullu: true,
      "canli-yayin": true,
      "gelir-gider": true,
      "whatsapp-ai": true,
      "sesli-hat": false,
      "kampanya-web": true,
      "gizlilik-maskesi": true,
      "seffaflik-merkezi": true,
      "guvenlik-yedek": true,
      "sosyal-medya": true,
      raporlama: true,
    },
    onboarding: {
      vps: true,
      domain: true,
      ssl: true,
      postgresql: true,
      n8n: true,
      whatsapp: true,
      banka: false,
      "sosyal-medya": false,
      ivr: false,
    },
  },
  {
    slug: "kampanya-x",
    name: "Kampanya X",
    patientOrOrg: "Örnek Müşteri Derneği",
    package: "Standart",
    status: "active",
    isDemo: false,
    startDate: "2026-02-01",
    monthlyFee: 17900,
    lastPayment: { date: "2026-04-01", amount: 17900, status: "paid" },
    nextPaymentDate: "2026-05-01",
    publicUrl: "#",
    adminUrl: "#",
    contact: {
      name: "Ahmet Yılmaz",
      phone: "+90 555 123 45 67",
      email: "iletisim@kampanyax.org",
    },
    whatsapp: { used: 3240, limit: 5000 },
    ivr: { used: 654, limit: 1000 },
    video: { used: 8, limit: 20 },
    socialMedia: { active: 3, total: 4 },
    modules: {
      "para-takibi": true,
      kumbara: true,
      stant: true,
      gonullu: true,
      "canli-yayin": true,
      "gelir-gider": true,
      "whatsapp-ai": true,
      "sesli-hat": true,
      "kampanya-web": true,
      "gizlilik-maskesi": true,
      "seffaflik-merkezi": true,
      "guvenlik-yedek": true,
      "sosyal-medya": true,
      raporlama: true,
    },
    onboarding: {
      vps: true,
      domain: true,
      ssl: true,
      postgresql: true,
      n8n: true,
      whatsapp: true,
      banka: true,
      "sosyal-medya": true,
      ivr: true,
    },
  },
];

export const RECENT_ACTIVITY: ActivityEvent[] = [
  {
    id: "1",
    type: "donation",
    campaignSlug: "defne",
    campaignLabel: "Demo Defne",
    message: "Yeni bağış alındı: $500",
    timestamp: "2026-05-01T13:42:00Z",
  },
  {
    id: "2",
    type: "warning",
    campaignSlug: "kampanya-x",
    campaignLabel: "Kampanya X",
    message: "WhatsApp kullanımı %80'e ulaştı (3.240 / 5.000)",
    timestamp: "2026-05-01T11:15:00Z",
  },
  {
    id: "3",
    type: "system",
    campaignLabel: "Sistem",
    message: "Otomatik yedekleme tamamlandı",
    timestamp: "2026-05-01T03:00:00Z",
  },
  {
    id: "4",
    type: "donation",
    campaignSlug: "kampanya-x",
    campaignLabel: "Kampanya X",
    message: "Yeni bağış alındı: ₺250",
    timestamp: "2026-04-30T22:08:00Z",
  },
  {
    id: "5",
    type: "info",
    campaignSlug: "defne",
    campaignLabel: "Demo Defne",
    message: "Yeni kumbara eklendi: AVM Carrefour",
    timestamp: "2026-04-30T16:30:00Z",
  },
];

export function getMasterDashboardSummary() {
  const activeCampaigns = MANAGED_CAMPAIGNS.filter(
    (c) => c.status === "active",
  ).length;
  const monthlyRevenue = MANAGED_CAMPAIGNS.filter(
    (c) => !c.isDemo && c.lastPayment?.status === "paid",
  ).reduce((sum, c) => sum + (c.lastPayment?.amount ?? 0), 0);
  const pendingRevenue = MANAGED_CAMPAIGNS.filter(
    (c) => !c.isDemo && c.lastPayment?.status === "pending",
  ).reduce((sum, c) => sum + c.monthlyFee, 0);
  return {
    activeCampaigns,
    totalCustomers: MANAGED_CAMPAIGNS.length,
    monthlyRevenue: monthlyRevenue + pendingRevenue,
    systemStatus: "all-ok" as "all-ok" | "warning" | "error",
  };
}

export function getCampaignBySlug(slug: string): ManagedCampaign | undefined {
  return MANAGED_CAMPAIGNS.find((c) => c.slug === slug);
}

// ── Master users ──────────────────────────────────────────────

export type UserRole =
  | "super-admin"
  | "campaign-manager"
  | "accounting"
  | "tech";

export type MasterUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin: string | null;
  status: "active" | "disabled";
};

export const ROLE_LABEL: Record<UserRole, string> = {
  "super-admin": "Süper Admin",
  "campaign-manager": "Kampanya Yöneticisi",
  accounting: "Muhasebe",
  tech: "Teknik",
};

export const ROLE_DESCRIPTION: Record<UserRole, string> = {
  "super-admin": "Tam yetki — tüm panel ve kampanyalar",
  "campaign-manager": "Sadece atanan kampanyalar",
  accounting: "Sadece finansal sayfa erişimi",
  tech: "Sadece sistem sağlığı ve onboarding",
};

export const MASTER_USERS: MasterUser[] = [
  {
    id: "1",
    name: "Sistem Yöneticisi",
    email: "admin@kampanyatakip.com",
    role: "super-admin",
    lastLogin: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: "active",
  },
];

// ── Costs / financial ────────────────────────────────────────

export type CampaignCosts = {
  vps: number;
  whatsapp: number;
  ivr: number;
  other: number;
};

export const CAMPAIGN_COSTS: Record<string, CampaignCosts> = {
  defne: { vps: 0, whatsapp: 0, ivr: 0, other: 0 },
  "kampanya-x": { vps: 250, whatsapp: 500, ivr: 500, other: 639 },
};

export function getCampaignCostTotal(slug: string): number {
  const c = CAMPAIGN_COSTS[slug];
  if (!c) return 0;
  return c.vps + c.whatsapp + c.ivr + c.other;
}

// ── System health ────────────────────────────────────────────

export type HealthStatus = "ok" | "warning" | "error";

export type SystemHealthRow = {
  campaignSlug: string;
  campaignName: string;
  server: HealthStatus;
  database: HealthStatus;
  automation: HealthStatus;
  whatsapp: HealthStatus;
  lastBackup: string;
  note?: string;
};

export const SYSTEM_HEALTH: SystemHealthRow[] = [
  {
    campaignSlug: "defne",
    campaignName: "Minik Defne Kampanyası",
    server: "ok",
    database: "ok",
    automation: "ok",
    whatsapp: "ok",
    lastBackup: "2026-05-01T03:00:00Z",
  },
  {
    campaignSlug: "kampanya-x",
    campaignName: "Kampanya X",
    server: "ok",
    database: "ok",
    automation: "ok",
    whatsapp: "warning",
    lastBackup: "2026-05-01T03:00:00Z",
    note: "WhatsApp aylık limit %64 — yakın takip",
  },
];

export type SystemEvent = {
  id: string;
  level: "ok" | "warning" | "error";
  campaignLabel?: string;
  message: string;
  timestamp: string;
};

export const SYSTEM_EVENTS_24H: SystemEvent[] = [
  {
    id: "1",
    level: "ok",
    campaignLabel: "Demo Defne",
    message: "Otomatik yedekleme tamamlandı",
    timestamp: "2026-05-01T03:00:00Z",
  },
  {
    id: "2",
    level: "ok",
    campaignLabel: "Kampanya X",
    message: "Otomatik yedekleme tamamlandı",
    timestamp: "2026-05-01T03:05:00Z",
  },
  {
    id: "3",
    level: "ok",
    campaignLabel: "Kampanya X",
    message: "Otomasyon iş akışları çalışıyor",
    timestamp: "2026-05-01T08:00:00Z",
  },
  {
    id: "4",
    level: "warning",
    campaignLabel: "Kampanya X",
    message: "WhatsApp aylık limit %64'e ulaştı",
    timestamp: "2026-05-01T11:15:00Z",
  },
];
