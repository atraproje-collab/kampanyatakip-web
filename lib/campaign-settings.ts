"use client";

import {
  demoCampaign,
  type CampaignData,
  type CurrencyCode,
} from "./mock-campaign-data";

export type CampaignSettings = {
  title: string;
  goalAmount: number;
  goalCurrency: CurrencyCode;
  startDate: string;
  endDate: string;
  approvalDate: string;
  decisionNumber: string;
  authority: string;
};

const STORAGE_KEY = "kampanyatakip:campaign-settings:v1";

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

export function loadCampaignSettings(): CampaignSettings {
  if (typeof window === "undefined") return defaultCampaignSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCampaignSettings;
    const parsed = JSON.parse(raw) as Partial<CampaignSettings>;
    return { ...defaultCampaignSettings, ...parsed };
  } catch {
    return defaultCampaignSettings;
  }
}

export function saveCampaignSettings(settings: CampaignSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  // n8n'e bağlanınca burada fetch çağrısı yapılacak (yarın).
  // eslint-disable-next-line no-console
  console.log("[ayarlar] Kampanya ayarları kaydedildi (mock):", settings);
}

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

export const CAMPAIGN_SETTINGS_EVENT = "kampanyatakip:campaign-settings-changed";

export function notifyCampaignSettingsChanged(settings: CampaignSettings) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<CampaignSettings>(CAMPAIGN_SETTINGS_EVENT, {
      detail: settings,
    }),
  );
}
