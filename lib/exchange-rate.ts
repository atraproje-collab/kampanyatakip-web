// TODO: Günlük 15:30'da TCMB API'den çekilecek.
// TCMB URL: https://www.tcmb.gov.tr/kurlar/today.xml
// n8n workflow ile PostgreSQL'e kaydedilecek.
// Bu fonksiyon DB'den okuyacak.

export interface ExchangeRate {
  usd_try: number;
  eur_try: number;
  last_updated: string; // "2026-04-24 15:30"
  source: string; // "TCMB"
}

export const mockExchangeRate: ExchangeRate = {
  usd_try: 45.15,
  eur_try: 49.50,
  last_updated: "2026-05-02 15:30",
  source: "TCMB",
};

/** TL formatted as Turkish locale, e.g. "₺1.247.500". */
export function formatTRY(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** USD formatted as en-US locale, e.g. "1,247,500". */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** EUR formatted with Turkish locale (no currency symbol so callers prefix €). */
export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Convert any supported native amount into TRY using the given rate. */
export function toTRY(
  amount: number,
  currency: "TRY" | "USD" | "EUR",
  rate: ExchangeRate = mockExchangeRate,
): number {
  switch (currency) {
    case "TRY":
      return amount;
    case "USD":
      return amount * rate.usd_try;
    case "EUR":
      return amount * rate.eur_try;
  }
}

/** Convert any supported native amount into USD using the given rate. */
export function toUSD(
  amount: number,
  currency: "TRY" | "USD" | "EUR",
  rate: ExchangeRate = mockExchangeRate,
): number {
  switch (currency) {
    case "USD":
      return amount;
    case "TRY":
      return amount / rate.usd_try;
    case "EUR":
      return (amount * rate.eur_try) / rate.usd_try;
  }
}
