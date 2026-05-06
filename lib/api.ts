/**
 * lib/api.ts
 * Public campaign page API helpers.
 * All requests go through the same-origin proxy /api/kampanya/[slug]/*
 * which forwards to the n8n webhook server-side (avoids CORS).
 */

import type { CurrencyCode, ExpenseRow, RecentDonor } from "./mock-campaign-data";
import { formatDonorName, parseDonationDate, formatRelativeTime } from "./donation-format";

// Default exchange rate fallback. The real rate comes from lib/exchange-rate.ts
// (mockExchangeRate). When the TCMB sync workflow lands this becomes dynamic.
export const USD_TRY = 45.15;

const PROXY_BASE = "/api/kampanya/demo-defne";

// ── Generic fetch helper ──────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${PROXY_BASE}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function unwrapArray(data: unknown): unknown[] {
  let arr: unknown = data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) arr = obj.data;
    else if (Array.isArray(obj.items)) arr = obj.items;
    else if (Array.isArray(obj.result)) arr = obj.result;
    else if (Array.isArray(obj.rows)) arr = obj.rows;
    else if (Array.isArray(obj.bagislar)) arr = obj.bagislar;
    else if (Array.isArray(obj.kumbaralar)) arr = obj.kumbaralar;
    else if (Array.isArray(obj.stantlar)) arr = obj.stantlar;
    else if (Array.isArray(obj.giderler)) arr = obj.giderler;
  }
  if (!Array.isArray(arr)) arr = [arr];
  return arr as unknown[];
}

function parseCurrency(raw: unknown): CurrencyCode {
  const str = String(raw ?? "TRY").toUpperCase().trim();
  if (str === "USD" || str === "EUR" || str === "TRY") return str as CurrencyCode;
  if (str === "TL") return "TRY";
  return "TRY";
}

// ── Source label (admin panel ile aynı mantık) ───────────────────────────────

function buildSourceLabel(raw: Record<string, unknown>): string {
  const kaynakRaw = String(raw.kaynak ?? raw.source ?? raw.tip ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR");
  const kumbaraNo = String(raw.kumbara_no ?? raw.kumbaraNo ?? "").trim();
  const stantNo = String(raw.stant_no ?? raw.stantNo ?? "").trim();
  if (kaynakRaw === "kumbara") return kumbaraNo ? `Kumbara ${kumbaraNo}` : "Kumbara";
  if (kaynakRaw === "stant") return stantNo ? `Stant ${stantNo}` : "Stant";
  if (kaynakRaw === "havale" || kaynakRaw === "banka" || kaynakRaw === "banka_havalesi") {
    return "Banka Havalesi";
  }
  if (
    kaynakRaw === "kart" ||
    kaynakRaw === "kredi_karti" ||
    kaynakRaw === "kredi kartı"
  ) {
    return "Kredi Kartı";
  }
  const fallback = String(raw.source ?? raw.kaynak ?? "").trim();
  if (fallback) return fallback.charAt(0).toLocaleUpperCase("tr-TR") + fallback.slice(1);
  return "Diğer";
}

// ── Donations ────────────────────────────────────────────────────────────────

export type Donation = {
  id: string;
  /** "YYYY-MM-DD HH:mm" or "YYYY-MM-DD" */
  date: string;
  donorName: string;
  source: string;
  amount: number;
  currency: CurrencyCode;
};

function parseDonation(raw: Record<string, unknown>): Donation | null {
  const id = String(raw.id ?? raw.bagis_id ?? raw.bagisId ?? raw.no ?? "").trim();
  const dateRaw = String(
    raw.tarih ?? raw.date ?? raw.created_at ?? raw.createdAt ?? raw.olusturma ?? "",
  ).trim();
  if (!id || !dateRaw) return null;

  let date = dateRaw;
  const isoMatch = dateRaw.match(/^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/);
  if (isoMatch) date = isoMatch[2] ? `${isoMatch[1]} ${isoMatch[2]}` : isoMatch[1];

  const rawName = String(
    raw.bagisci_ad ??
      raw.bagisciAd ??
      raw.bagisci ??
      raw.bagisci_adi ??
      raw.bagisciAdi ??
      raw.donor_name ??
      raw.donorName ??
      raw.isim ??
      "",
  ).trim();

  const amount = Number(raw.tutar ?? raw.amount ?? 0) || 0;
  const currency = parseCurrency(raw.para_birimi ?? raw.currency);
  const source = buildSourceLabel(raw);
  const donorName = formatDonorName(rawName, source);

  return { id, date, donorName, source, amount, currency };
}

export async function fetchDonations(): Promise<Donation[] | null> {
  const raw = await apiFetch<unknown>("/bagislar");
  if (raw === null) return null;
  const arr = unwrapArray(raw) as Record<string, unknown>[];
  return arr.map(parseDonation).filter((d): d is Donation => d !== null);
}

/**
 * Convert a Donation to a RecentDonor for legacy components.
 * `idx` is used as a stable numeric id derived from the original string id.
 */
export function donationToRecentDonor(d: Donation, idx: number): RecentDonor {
  const ts = parseDonationDate(d.date)?.getTime();
  return {
    id: hashStringToInt(d.id) || idx + 1,
    name: d.donorName,
    amount: d.amount,
    currency: d.currency,
    method: d.source,
    time: formatRelativeTime(d.date),
    timestamp: ts,
    isFresh: false,
  };
}

function hashStringToInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Kumbara ──────────────────────────────────────────────────────────────────

export type KumbaraRow = {
  id: string;
  location: string;
  responsible: string;
  total: number;
  lastOpened: string;
  status: "aktif" | "kapatildi";
};

function parseKumbara(raw: Record<string, unknown>): KumbaraRow | null {
  const id = String(raw.kumbara_no ?? raw.id ?? raw.no ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? raw.lokasyon ?? "").trim();
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "").trim();
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const lastOpened = String(
    raw.son_acilis ?? raw.lastOpened ?? raw.son_acilis_tarihi ?? "—",
  );
  const statusStr = String(raw.durum ?? raw.status ?? "aktif")
    .toLocaleLowerCase("tr-TR")
    .trim();
  const status: KumbaraRow["status"] =
    statusStr === "kapatildi" || statusStr === "kapatıldı" || statusStr === "closed"
      ? "kapatildi"
      : "aktif";
  return { id, location, responsible, total, lastOpened, status };
}

export async function fetchKumbaralar(): Promise<KumbaraRow[] | null> {
  const raw = await apiFetch<unknown>("/kumbaralar");
  if (raw === null) return null;
  const arr = unwrapArray(raw) as Record<string, unknown>[];
  return arr.map(parseKumbara).filter((k): k is KumbaraRow => k !== null);
}

// ── Stant ────────────────────────────────────────────────────────────────────

export type StantRow = {
  id: string;
  location: string;
  responsible: string;
  total: number;
  lastClose: string;
  status: "aktif" | "kapatildi";
};

function parseStant(raw: Record<string, unknown>): StantRow | null {
  const id = String(raw.stant_no ?? raw.id ?? raw.no ?? "").trim();
  if (!id) return null;
  const location = String(raw.konum ?? raw.location ?? raw.lokasyon ?? "").trim();
  const responsible = String(raw.sorumlu ?? raw.responsible ?? "").trim();
  const total = Number(raw.toplam ?? raw.total ?? 0) || 0;
  const lastClose = String(
    raw.son_kapanis ?? raw.lastClose ?? raw.son_kapanis_tarihi ?? "—",
  );
  const statusStr = String(raw.durum ?? raw.status ?? "aktif")
    .toLocaleLowerCase("tr-TR")
    .trim();
  const status: StantRow["status"] =
    statusStr === "kapatildi" || statusStr === "kapatıldı" || statusStr === "closed"
      ? "kapatildi"
      : "aktif";
  return { id, location, responsible, total, lastClose, status };
}

export async function fetchStantlar(): Promise<StantRow[] | null> {
  const raw = await apiFetch<unknown>("/stantlar");
  if (raw === null) return null;
  const arr = unwrapArray(raw) as Record<string, unknown>[];
  return arr.map(parseStant).filter((s): s is StantRow => s !== null);
}

// ── Expenses ─────────────────────────────────────────────────────────────────

function parseExpense(raw: Record<string, unknown>): ExpenseRow {
  return {
    date: String(raw.date ?? raw.tarih ?? "").slice(0, 10),
    category: String(raw.category ?? raw.kategori ?? raw.tur ?? ""),
    amount: Number(raw.amount ?? raw.tutar ?? raw.miktar ?? 0) || 0,
    document: String(raw.document ?? raw.belge ?? raw.dosya ?? "#"),
    description: String(raw.description ?? raw.aciklama ?? raw.detay ?? ""),
    vendor: String(raw.vendor ?? raw.satici ?? raw.tedarikci ?? raw.kurum ?? ""),
  };
}

export async function fetchExpenses(): Promise<ExpenseRow[] | null> {
  const raw = await apiFetch<unknown>("/giderler-listesi");
  if (raw === null) return null;
  const arr = unwrapArray(raw) as Record<string, unknown>[];
  return arr.map(parseExpense).filter((e) => e.amount > 0);
}

// Re-exports for any legacy imports
export { formatRelativeTime } from "./donation-format";
