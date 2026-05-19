"use client";

// ── Types ────────────────────────────────────────────────────────────────────

export type Paket = "Temel" | "Standart" | "Premium" | "Özel";
export type Durum = "aktif" | "pasif";

export type MasterCampaign = {
  slug: string;
  name: string;
  musteri: string;
  paket: Paket;
  aylikUcret: number;
  durum: Durum;
};

/**
 * Backend module shape — all booleans + 3 number limits.
 * "ai_sohbet" boolean toggles the feature, "ai_mesaj_limit" sets the cap.
 */
export type ModuleKey =
  | "bagis_takibi"
  | "kumbara"
  | "stant"
  | "gonullu"
  | "tiktok_gelir"
  | "gelir_gider"
  | "galeri"
  | "raporlama"
  | "canva"
  | "reklam_performansi"
  | "ai_sohbet"
  | "fb_ig_dm"
  | "youtube_yorum"
  | "video"
  | "whatsapp"
  | "ivr_0850"
  | "influencer_radar"
  | "kurumsal_bagis"
  | "hukuk"
  | "twitter";

export type LimitKey = "ai_mesaj_limit" | "whatsapp_mesaj_limit" | "ivr_dakika_limit" | "video_adet_limit";

export type ModuleConfig = Record<ModuleKey, boolean> & Record<LimitKey, number>;

// ── Module catalog (label + grouping) ────────────────────────────────────────

export const MODULE_LABELS: Record<ModuleKey, string> = {
  bagis_takibi: "Bağış Takibi",
  kumbara: "Kumbara Takibi",
  stant: "Stant Takibi",
  gonullu: "Gönüllü Yönetimi",
  tiktok_gelir: "TikTok Canlı Yayın Geliri",
  gelir_gider: "Gelir-Gider Şeffaflık",
  galeri: "Galeri",
  raporlama: "Otomatik Raporlama",
  canva: "Canva Pro Tasarım Aracı",
  reklam_performansi: "Reklam Performansı (Meta Ads)",
  ai_sohbet: "AI Sohbet Botu",
  fb_ig_dm: "Facebook + Instagram DM Otomasyonu",
  youtube_yorum: "YouTube Yorum Otomasyonu",
  video: "Video Üretim",
  whatsapp: "WhatsApp Mesaj",
  ivr_0850: "Sesli Bilgi Hattı (0850)",
  influencer_radar: "Influencer Radar",
  kurumsal_bagis: "Kurumsal Bağış Sistemi",
  hukuk: "Hukuk Danışmanlığı",
  twitter: "Twitter (X) Otomasyonu",
};

export const LIMIT_LABELS: Record<LimitKey, string> = {
  ai_mesaj_limit: "AI mesaj limiti (aylık)",
  whatsapp_mesaj_limit: "WhatsApp mesaj limiti (aylık)",
  ivr_dakika_limit: "IVR dakika limiti (aylık)",
  video_adet_limit: "Video adet limiti (aylık)",
};

/** Hangi modül hangi limit input'unu açar. */
export const MODULE_LIMIT_LINKS: Partial<Record<ModuleKey, LimitKey>> = {
  ai_sohbet: "ai_mesaj_limit",
  whatsapp: "whatsapp_mesaj_limit",
  ivr_0850: "ivr_dakika_limit",
  video: "video_adet_limit",
};

export const ALL_MODULE_KEYS: ModuleKey[] = Object.keys(
  MODULE_LABELS,
) as ModuleKey[];

// ── Paket presets ────────────────────────────────────────────────────────────

const ZERO_LIMITS: Record<LimitKey, number> = {
  ai_mesaj_limit: 0,
  whatsapp_mesaj_limit: 0,
  ivr_dakika_limit: 0,
  video_adet_limit: 0,
};

function buildPreset(
  enabled: ModuleKey[],
  limits: Partial<Record<LimitKey, number>>,
): ModuleConfig {
  const cfg = {} as ModuleConfig;
  for (const k of ALL_MODULE_KEYS) cfg[k] = enabled.includes(k);
  cfg.ai_mesaj_limit = limits.ai_mesaj_limit ?? 0;
  cfg.whatsapp_mesaj_limit = limits.whatsapp_mesaj_limit ?? 0;
  cfg.ivr_dakika_limit = limits.ivr_dakika_limit ?? 0;
  cfg.video_adet_limit = limits.video_adet_limit ?? 0;
  return cfg;
}

const TEMEL_MODULES: ModuleKey[] = [
  "bagis_takibi",
  "kumbara",
  "stant",
  "gonullu",
  "tiktok_gelir",
  "gelir_gider",
  "galeri",
  "raporlama",
  "canva",
  "reklam_performansi",
  "ai_sohbet",
];

const STANDART_MODULES: ModuleKey[] = [
  ...TEMEL_MODULES,
  "fb_ig_dm",
  "youtube_yorum",
  "video",
];

const PREMIUM_MODULES: ModuleKey[] = [
  ...STANDART_MODULES,
  "whatsapp",
  "ivr_0850",
  "influencer_radar",
  "kurumsal_bagis",
  "hukuk",
  "twitter",
];

export const PAKET_PRESETS: Record<Paket, ModuleConfig> = {
  Temel: buildPreset(TEMEL_MODULES, { ai_mesaj_limit: 1000 }),
  Standart: buildPreset(STANDART_MODULES, {
    ai_mesaj_limit: 3000,
    video_adet_limit: 5,
  }),
  Premium: buildPreset(PREMIUM_MODULES, {
    ai_mesaj_limit: 5000,
    video_adet_limit: 15,
  }),
  Özel: buildPreset([], {}),
};

export const PAKET_BADGE_STYLE: Record<Paket, string> = {
  Temel: "bg-sky-50 text-sky-700 border-sky-200",
  Standart: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Premium: "bg-violet-50 text-violet-700 border-violet-200",
  Özel: "bg-orange-50 text-orange-700 border-orange-200",
};

export const DEFAULT_MODULE_CONFIG: ModuleConfig = {
  ...ZERO_LIMITS,
  ...(Object.fromEntries(ALL_MODULE_KEYS.map((k) => [k, false])) as Record<
    ModuleKey,
    boolean
  >),
};

// ── Parsing ──────────────────────────────────────────────────────────────────

type Row = Record<string, unknown>;

function unwrapList(data: unknown): Row[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as Row[];
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Row[];
    if (Array.isArray(obj.items)) return obj.items as Row[];
    if (Array.isArray(obj.result)) return obj.result as Row[];
    if (Array.isArray(obj.kampanyalar)) return obj.kampanyalar as Row[];
  }
  return [];
}

function unwrapSingle(data: unknown): Row | null {
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] as Row) ?? null;
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return (obj.data[0] as Row) ?? null;
    if (obj.data && typeof obj.data === "object") return obj.data as Row;
    if (Array.isArray(obj.items)) return (obj.items[0] as Row) ?? null;
    if (Array.isArray(obj.result)) return (obj.result[0] as Row) ?? null;
    return obj as Row;
  }
  return null;
}

function pickString(row: Row, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function pickNumber(row: Row, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function pickBool(row: Row, key: string): boolean {
  const v = row[key];
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLocaleLowerCase("tr-TR");
    return s === "true" || s === "1" || s === "evet" || s === "açık";
  }
  return false;
}

function parsePaket(raw: unknown): Paket {
  const s = String(raw ?? "").trim();
  if (s === "Temel" || s === "Standart" || s === "Premium" || s === "Özel")
    return s;
  // tr-TR case-insensitive fallback
  const low = s.toLocaleLowerCase("tr-TR");
  if (low === "temel") return "Temel";
  if (low === "standart") return "Standart";
  if (low === "premium") return "Premium";
  if (low === "özel" || low === "ozel") return "Özel";
  return "Özel";
}

function parseDurum(raw: unknown): Durum {
  // Boolean `aktif` field (backend's primary signal)
  if (typeof raw === "boolean") return raw ? "aktif" : "pasif";
  if (typeof raw === "number") return raw !== 0 ? "aktif" : "pasif";
  const s = String(raw ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
  if (s === "pasif" || s === "passive" || s === "inactive" || s === "false") {
    return "pasif";
  }
  return "aktif";
}

function parseCampaign(raw: unknown): MasterCampaign | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Row;
  const slug = pickString(row, "slug", "kampanya_slug");
  if (!slug) return null;
  // durum öncelikle `aktif` boolean field'ından, yoksa `durum` string'inden gelir.
  const durumRaw = row.aktif ?? row.durum ?? row.status;
  return {
    slug,
    name: pickString(row, "kampanya_adi", "name", "ad") || slug,
    musteri: pickString(row, "musteri_adi", "musteri", "customer", "musteri_ad"),
    paket: parsePaket(row.paket ?? row.package),
    aylikUcret: pickNumber(row, "aylik_ucret", "monthly_fee", "aylik"),
    durum: parseDurum(durumRaw),
  };
}

/**
 * Modül durumlarını hem `modul_stant: true` hem `stant: true` alan adlarından
 * okuyabilen esnek parser. Öncelik: modul_ prefix → direkt key → failsafe true.
 * Strict `=== true` karşılaştırma — loose coercion yok.
 */
export function parseModuleConfig(raw: unknown): ModuleConfig {
  const row = unwrapSingle(raw);
  if (!row) return { ...DEFAULT_MODULE_CONFIG };

  const getBool = (key: string): boolean => {
    // Önce modul_ prefix ile ara
    if (`modul_${key}` in row) return row[`modul_${key}`] === true;
    // Sonra direkt key ile ara
    if (key in row) return row[key] === true;
    // Bulunamazsa true (failsafe)
    return true;
  };

  return {
    bagis_takibi: getBool("bagis_takibi"),
    kumbara: getBool("kumbara"),
    stant: getBool("stant"),
    gonullu: getBool("gonullu"),
    tiktok_gelir: getBool("tiktok_gelir"),
    gelir_gider: getBool("gelir_gider"),
    galeri: getBool("galeri"),
    raporlama: getBool("raporlama"),
    canva: getBool("canva"),
    reklam_performansi: getBool("reklam_performansi"),
    ai_sohbet: getBool("ai_sohbet"),
    fb_ig_dm: getBool("fb_ig_dm"),
    youtube_yorum: getBool("youtube_yorum"),
    video: getBool("video"),
    whatsapp: getBool("whatsapp"),
    ivr_0850: getBool("ivr_0850"),
    influencer_radar: getBool("influencer_radar"),
    kurumsal_bagis: getBool("kurumsal_bagis"),
    hukuk: getBool("hukuk"),
    twitter: getBool("twitter"),
    ai_mesaj_limit: Number(row.ai_mesaj_limit) || 0,
    whatsapp_mesaj_limit: Number(row.whatsapp_mesaj_limit) || 0,
    ivr_dakika_limit: Number(row.ivr_dakika_limit) || 0,
    video_adet_limit: Number(row.video_adet_limit) || 0,
  } as ModuleConfig;
}

// ── API ──────────────────────────────────────────────────────────────────────

export async function fetchMasterCampaigns(): Promise<{
  ok: boolean;
  items: MasterCampaign[];
  error?: string;
}> {
  try {
    const res = await fetch(`/api/master/kampanyalar?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    if (!res.ok) return { ok: false, items: [], error: `HTTP ${res.status}` };
    const data: unknown = await res.json();
    const rows = unwrapList(data);
    const items = rows
      .map(parseCampaign)
      .filter((c): c is MasterCampaign => c !== null);
    return { ok: true, items };
  } catch (e) {
    return {
      ok: false,
      items: [],
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

export async function fetchModuleConfig(slug: string): Promise<{
  ok: boolean;
  config: ModuleConfig;
  paket?: Paket;
  error?: string;
}> {
  try {
    const res = await fetch(
      `/api/master/moduller?slug=${encodeURIComponent(slug)}&t=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      },
    );
    if (!res.ok) {
      return {
        ok: false,
        config: { ...DEFAULT_MODULE_CONFIG },
        error: `HTTP ${res.status}`,
      };
    }
    const data: unknown = await res.json();
    const row = unwrapSingle(data);
    const config = parseModuleConfig(data);
    const paket = row ? parsePaket(row.paket ?? row.package) : undefined;
    return { ok: true, config, paket };
  } catch (e) {
    return {
      ok: false,
      config: { ...DEFAULT_MODULE_CONFIG },
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

export async function saveModuleConfig(
  slug: string,
  config: ModuleConfig,
): Promise<{ ok: boolean; error?: string }> {
  // Modüller ve limitler ayrı objeler olarak gönder
  const moduller: Record<string, boolean> = {};
  for (const k of ALL_MODULE_KEYS) {
    moduller[k] = config[k];
  }
  const limitler: Record<string, number> = {
    ai_mesaj_limit: config.ai_mesaj_limit,
    whatsapp_mesaj_limit: config.whatsapp_mesaj_limit,
    ivr_dakika_limit: config.ivr_dakika_limit,
    video_adet_limit: config.video_adet_limit,
  };

  const payload = {
    kampanya_slug: slug,
    moduller,
    limitler,
  };

  // eslint-disable-next-line no-console
  console.log("Kaydet body:", JSON.stringify(payload));

  try {
    const res = await fetch(
      `/api/master/moduller-guncelle?t=${Date.now()}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errText ? ` — ${errText.slice(0, 160)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "network error" };
  }
}

/**
 * Kampanya aktif/pasif. POST body: { kampanya_slug, aktif: boolean }
 * → /webhook/master/kampanya-durum
 */
export async function saveCampaignDurum(
  slug: string,
  durum: Durum,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/master/kampanya-durum?t=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        kampanya_slug: slug,
        aktif: durum === "aktif",
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errText ? ` — ${errText.slice(0, 160)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

/**
 * Tek bir modülü aç/kapa. POST body: { kampanya_slug, modul_adi, aktif }
 * → /webhook/master/modul-durum
 * Granüler güncellemeler için (yan etkisiz tek modül toggle).
 */
export async function saveModuleStatus(
  slug: string,
  modulAdi: ModuleKey,
  aktif: boolean,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/master/modul-durum?t=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        kampanya_slug: slug,
        modul_adi: modulAdi,
        aktif,
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return {
        ok: false,
        error: `HTTP ${res.status}${errText ? ` — ${errText.slice(0, 160)}` : ""}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

// ── Format helpers ───────────────────────────────────────────────────────────

export function formatTRY(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Unique customer count from campaign list. */
export function countUniqueCustomers(items: MasterCampaign[]): number {
  const set = new Set<string>();
  for (const c of items) {
    const key = c.musteri.trim().toLocaleLowerCase("tr-TR") || c.slug;
    set.add(key);
  }
  return set.size;
}
