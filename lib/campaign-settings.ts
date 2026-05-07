"use client";

import {
  demoCampaign,
  type CampaignData,
  type CurrencyCode,
} from "./mock-campaign-data";

// ── Types ────────────────────────────────────────────────────────────────────

export type CampaignSettings = {
  title: string;
  goalAmount: number;
  goalCurrency: CurrencyCode;
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  approvalDate: string;    // YYYY-MM-DD
  decisionNumber: string;
  authority: string;
};

/** API'den dönen ham satır (snake_case). */
type ApiSettingsRow = {
  id?: number | string;
  kampanya_slug?: string;
  kampanya_adi?: string;
  hedef_tutar?: number | string;
  para_birimi?: string;
  baslangic_tarihi?: string;
  bitis_tarihi?: string;
  onay_tarihi?: string;
  valilik_karar_no?: string;
  onay_veren_kurum?: string;
  guncellenme_tarihi?: string;
};

const DEFAULT_SLUG = "demo-defne";

// ── Defaults ─────────────────────────────────────────────────────────────────

export const defaultCampaignSettings: CampaignSettings = {
  title: demoCampaign.title,
  goalAmount: demoCampaign.goalUsd,
  goalCurrency: demoCampaign.currency,
  startDate: demoCampaign.createdAt,
  endDate: demoCampaign.endDate ?? "2026-08-01",
  approvalDate: demoCampaign.provinceApproval.approvalDate,
  decisionNumber: demoCampaign.provinceApproval.decisionNumber,
  authority: demoCampaign.provinceApproval.authority,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function trimDate(raw: unknown): string {
  if (!raw) return "";
  const s = String(raw).trim();
  // "2026-01-25" veya "2026-01-25T00:00:00.000Z" — ilk 10 karakter
  const match = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function parseCurrency(raw: unknown): CurrencyCode {
  const s = String(raw ?? "").toUpperCase().trim();
  if (s === "USD" || s === "EUR" || s === "TRY") return s;
  if (s === "TL") return "TRY";
  return defaultCampaignSettings.goalCurrency;
}

function unwrapRow(data: unknown): ApiSettingsRow | null {
  if (!data) return null;
  // Array-wrapped { [{...}] } veya { data: [{...}] } veya direct {...}
  if (Array.isArray(data)) return (data[0] as ApiSettingsRow) ?? null;
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return (obj.data[0] as ApiSettingsRow) ?? null;
    if (Array.isArray(obj.items)) return (obj.items[0] as ApiSettingsRow) ?? null;
    if (Array.isArray(obj.result)) return (obj.result[0] as ApiSettingsRow) ?? null;
    return obj as ApiSettingsRow;
  }
  return null;
}

/** API response → frontend CampaignSettings. Eksik alanlar default'a düşer. */
export function apiToSettings(raw: unknown): CampaignSettings {
  const row = unwrapRow(raw);
  if (!row) return defaultCampaignSettings;
  return {
    title:
      (row.kampanya_adi ?? "").toString().trim() ||
      defaultCampaignSettings.title,
    goalAmount:
      Number(row.hedef_tutar ?? defaultCampaignSettings.goalAmount) ||
      defaultCampaignSettings.goalAmount,
    goalCurrency: parseCurrency(row.para_birimi),
    startDate:
      trimDate(row.baslangic_tarihi) || defaultCampaignSettings.startDate,
    endDate: trimDate(row.bitis_tarihi) || defaultCampaignSettings.endDate,
    approvalDate:
      trimDate(row.onay_tarihi) || defaultCampaignSettings.approvalDate,
    decisionNumber:
      (row.valilik_karar_no ?? "").toString().trim() ||
      defaultCampaignSettings.decisionNumber,
    authority:
      (row.onay_veren_kurum ?? "").toString().trim() ||
      defaultCampaignSettings.authority,
  };
}

/** Frontend CampaignSettings → POST payload (snake_case). */
export function settingsToApiPayload(s: CampaignSettings) {
  return {
    kampanya_adi: s.title,
    hedef_tutar: s.goalAmount,
    para_birimi: s.goalCurrency,
    baslangic_tarihi: s.startDate,
    bitis_tarihi: s.endDate,
    onay_tarihi: s.approvalDate,
    valilik_karar_no: s.decisionNumber,
    onay_veren_kurum: s.authority,
  };
}

// ── API ──────────────────────────────────────────────────────────────────────

/**
 * Kampanya ayarlarını proxy üzerinden çeker.
 * Hata durumunda defaults döner — fail-soft.
 */
export async function fetchCampaignSettings(
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; settings: CampaignSettings; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/ayarlar`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return {
        ok: false,
        settings: defaultCampaignSettings,
        error: `HTTP ${res.status}`,
      };
    }
    const data: unknown = await res.json();
    return { ok: true, settings: apiToSettings(data) };
  } catch (e) {
    return {
      ok: false,
      settings: defaultCampaignSettings,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

/**
 * Ayarları proxy üzerinden günceller. Başarılıysa server'dan dönen
 * güncel kayıdı parse edip döner.
 */
export async function saveCampaignSettings(
  settings: CampaignSettings,
  slug: string = DEFAULT_SLUG,
): Promise<{ ok: boolean; settings: CampaignSettings; error?: string }> {
  try {
    const res = await fetch(`/api/kampanya/${slug}/ayarlar`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(settingsToApiPayload(settings)),
    });
    if (!res.ok) {
      return {
        ok: false,
        settings,
        error: `HTTP ${res.status}`,
      };
    }
    const data: unknown = await res.json().catch(() => null);
    // Sunucu { success: true, data: {...} } veya direkt updated row dönebilir.
    let returned = settings;
    if (data && typeof data === "object") {
      const obj = data as Record<string, unknown>;
      const payload = obj.data ?? obj.row ?? obj;
      const parsed = apiToSettings(payload);
      // En azından title parse edilmişse server'dan dönen veriyi kullan.
      if (parsed.title) returned = parsed;
    }
    return { ok: true, settings: returned };
  } catch (e) {
    return {
      ok: false,
      settings,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}

// ── Pure helpers (kalıcı) ────────────────────────────────────────────────────

export function computeDaysLeft(endDateIso: string): number {
  const end = new Date(`${endDateIso}T23:59:59`);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
}

export function formatRemaining(endDateIso: string): string {
  const days = computeDaysLeft(endDateIso);
  if (days < 0) return "Süresi doldu";
  if (days === 0) return "Bugün son gün";
  return `${days} gün kaldı`;
}

export function applyCampaignSettings(
  base: CampaignData,
  s: CampaignSettings,
): CampaignData {
  return {
    ...base,
    title: s.title,
    goalUsd: s.goalAmount,
    currency: s.goalCurrency,
    createdAt: s.startDate,
    endDate: s.endDate,
    daysLeft: Math.max(0, computeDaysLeft(s.endDate)),
    provinceApproval: {
      authority: s.authority,
      decisionNumber: s.decisionNumber,
      approvalDate: s.approvalDate,
    },
  };
}

export function formatTrDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Cross-tab event (admin save → public refresh) ─────────────────────────────

export const CAMPAIGN_SETTINGS_EVENT = "kampanyatakip:campaign-settings-changed";

export function notifyCampaignSettingsChanged(settings: CampaignSettings) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CampaignSettings>(CAMPAIGN_SETTINGS_EVENT, {
      detail: settings,
    }),
  );
}
