/**
 * lib/api.ts
 * API helpers for the demo-defne campaign (n8n → PostgreSQL webhooks).
 * Every function returns null on network / parse errors — callers fall back to mock data.
 */

import type { CurrencyCode, IncomeRow, ExpenseRow, RecentDonor } from "./mock-campaign-data";

// ── Constants ────────────────────────────────────────────────────────────────

const BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya/demo-defne";
/** Exchange rate used for TRY → USD conversion when the API returns TRY totals. */
export const USD_TRY = 45.15;

// ── Name masking ─────────────────────────────────────────────────────────────

/**
 * Privacy-safe donor name masking.
 *
 * Rules:
 * - "BASRİ KAHRAMAN" → "BA**** KA*****"
 * - "Ahmet Yılmaz"   → "AH*** YI*****"
 * - Single word      → "AH***"
 * - "Bilinmiyor"     → "İsimsiz Bağışçı"
 * - "İsimsiz Bağışçı"→ unchanged
 * - null / empty     → "İsimsiz Bağışçı"
 */
export function maskName(raw: string | null | undefined): string {
  if (!raw) return "İsimsiz Bağışçı";
  const trimmed = raw.trim();
  if (!trimmed) return "İsimsiz Bağışçı";

  const ANON_INPUTS = [
    "bilinmiyor", "unknown", "anonim", "anonymous", "isimsiz",
    "isimsiz bagisci", "isimsiz bağışçı",
  ];
  if (ANON_INPUTS.includes(trimmed.toLocaleLowerCase("tr"))) {
    return "İsimsiz Bağışçı";
  }

  const parts = trimmed.split(/\s+/);
  return parts
    .map((part) => {
      if (part.length <= 2) return part.toLocaleUpperCase("tr");
      return (
        part.slice(0, 2).toLocaleUpperCase("tr") +
        "*".repeat(part.length - 2)
      );
    })
    .join(" ");
}

// ── Relative time ─────────────────────────────────────────────────────────────

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "az önce";
  try {
    const diffMs = Date.now() - new Date(iso).getTime();
    if (diffMs < 0) return "az önce";
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return "az önce";
    if (minutes < 60) return `${minutes} dakika önce`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;
    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  } catch {
    return "az önce";
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CampaignStats {
  raisedUsd: number;
  donorCount: number;
  daysLeft?: number;
  goalUsd?: number;
}

// ── Generic fetch helper ──────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as T;
    return data;
  } catch {
    return null;
  }
}

// ── Currency helper ──────────────────────────────────────────────────────────

function parseCurrency(raw: unknown): CurrencyCode {
  const str = String(raw ?? "TRY").toUpperCase().trim();
  if (str === "USD" || str === "EUR" || str === "TRY") return str as CurrencyCode;
  return "TRY";
}

// ── Stats ─────────────────────────────────────────────────────────────────────

type RawStats = Record<string, unknown>;

/**
 * Parses API stats response.
 * Handles:
 *  - { raised_usd, donor_count }
 *  - { total_try, total_usd, donor_count }   — converts TRY to USD using USD_TRY
 *  - Array wrapping: [{ ... }]
 */
function parseStats(raw: unknown): CampaignStats | null {
  if (!raw) return null;
  const obj: RawStats = Array.isArray(raw)
    ? (raw[0] as RawStats)
    : (raw as RawStats);
  if (!obj || typeof obj !== "object") return null;

  // Direct USD total (preferred)
  const directUsd = Number(
    obj.raised_usd ?? obj.raisedUsd ?? obj.total_raised_usd ?? obj.total_usd ?? 0,
  );

  // TRY + optional extra USD components
  const totalTry = Number(
    obj.total_try ?? obj.raised_try ?? obj.total_amount_try ?? obj.toplam_tl ?? 0,
  );
  const extraUsd = Number(
    obj.usd_donations ?? obj.usd_amount ?? obj.total_usd_donations ?? 0,
  );

  let raisedUsd = directUsd;
  if (!raisedUsd && (totalTry > 0 || extraUsd > 0)) {
    raisedUsd = extraUsd + totalTry / USD_TRY;
  }
  if (!raisedUsd || raisedUsd <= 0) return null;

  const donorCount = Number(
    obj.donor_count ?? obj.donorCount ?? obj.total_donors ?? obj.bagisci_sayisi ?? obj.count ?? 0,
  );
  const daysLeft = Number(obj.days_left ?? obj.daysLeft ?? obj.kalan_gun ?? 0) || undefined;
  const goalUsd = Number(obj.goal_usd ?? obj.goalUsd ?? obj.hedef_usd ?? 0) || undefined;

  return { raisedUsd, donorCount, daysLeft, goalUsd };
}

export async function fetchStats(): Promise<CampaignStats | null> {
  const raw = await apiFetch<unknown>("/stats");
  if (!raw) return null;
  return parseStats(raw);
}

// ── Recent donors ─────────────────────────────────────────────────────────────

type RawDonor = Record<string, unknown>;

function parseDonor(raw: RawDonor, index: number): RecentDonor {
  const id = Number(raw.id ?? raw.bagis_id ?? raw.donation_id ?? index + 1_000_000);
  const rawName = String(
    raw.donor_name ?? raw.name ?? raw.isim ?? raw.bagisci ?? raw.bagisci_adi ?? "",
  );
  const name = maskName(rawName);
  const amount = Number(raw.amount ?? raw.tutar ?? raw.miktar ?? 0);
  const currency = parseCurrency(raw.currency ?? raw.doviz ?? raw.para_birimi ?? "TRY");
  const method = String(
    raw.method ?? raw.payment_method ?? raw.odeme_yontemi ?? raw.kaynak ?? "Banka Havalesi",
  );
  const isoTime = String(
    raw.created_at ?? raw.timestamp ?? raw.tarih ?? raw.olusturma_tarihi ?? "",
  );
  const time = formatRelativeTime(isoTime);

  return { id, name, amount, currency, method, time, isFresh: false };
}

export async function fetchRecentDonors(): Promise<RecentDonor[] | null> {
  const raw = await apiFetch<unknown>("/recent");
  if (!raw) return null;
  const arr = Array.isArray(raw) ? raw : [raw];
  if (arr.length === 0) return null;
  try {
    return (arr as RawDonor[]).map((r, i) => parseDonor(r, i));
  } catch {
    return null;
  }
}

// ── Income rows (Bağışlar) ────────────────────────────────────────────────────

type RawIncome = Record<string, unknown>;

function parseIncomeRow(raw: RawIncome): IncomeRow {
  const currency = parseCurrency(raw.currency ?? raw.doviz ?? raw.para_birimi ?? "TRY");
  return {
    date: String(raw.date ?? raw.tarih ?? ""),
    source: String(raw.source ?? raw.kaynak ?? raw.baslik ?? raw.aciklama_kisa ?? ""),
    amount: Number(raw.amount ?? raw.tutar ?? raw.miktar ?? 0),
    currency,
    details: String(raw.details ?? raw.detay ?? raw.aciklama ?? raw.notlar ?? ""),
  };
}

export async function fetchIncome(): Promise<IncomeRow[] | null> {
  const raw = await apiFetch<unknown>("/bagislar");
  if (!raw) return null;
  const arr = Array.isArray(raw) ? raw : [raw];
  if (arr.length === 0) return null;
  try {
    return (arr as RawIncome[]).map(parseIncomeRow).filter((r) => r.amount > 0);
  } catch {
    return null;
  }
}

// ── Expense rows (Giderler) ───────────────────────────────────────────────────

type RawExpense = Record<string, unknown>;

function parseExpenseRow(raw: RawExpense): ExpenseRow {
  return {
    date: String(raw.date ?? raw.tarih ?? ""),
    category: String(raw.category ?? raw.kategori ?? raw.tur ?? ""),
    amount: Number(raw.amount ?? raw.tutar ?? raw.miktar ?? 0),
    document: String(raw.document ?? raw.belge ?? raw.dosya ?? "#"),
    description: String(raw.description ?? raw.aciklama ?? raw.detay ?? ""),
    vendor: String(raw.vendor ?? raw.satici ?? raw.tedarikci ?? raw.kurum ?? ""),
  };
}

export async function fetchExpenses(): Promise<ExpenseRow[] | null> {
  const raw = await apiFetch<unknown>("/giderler");
  if (!raw) return null;
  const arr = Array.isArray(raw) ? raw : [raw];
  if (arr.length === 0) return null;
  try {
    return (arr as RawExpense[]).map(parseExpenseRow).filter((r) => r.amount > 0);
  } catch {
    return null;
  }
}
