/**
 * lib/pricing-config.ts
 * Paket fiyatlandırması — tek noktadan yönetilir.
 *
 * Fiyatları kamuya açmak için: SHOW_PRICES = true yapın.
 * Tüm paket kartları, ek modüller ve bilgilendirme metinleri otomatik açılır.
 */

export const SHOW_PRICES = false;

export type PaketKey = "temel" | "standart" | "premium" | "ozel";

/** Aylık paket fiyatları (TL, KDV dahil). */
export const PAKET_FIYATLARI: Record<PaketKey, number | null> = {
  temel: 10000,
  standart: 16500,
  premium: 30000,
  ozel: null, // Özel paket — Temel + ek modüller, sabit fiyat yok
};

/** Tüm paketlere eklenebilir ek modül fiyatları (TL, KDV dahil, aylık). */
export const EK_MODULLER = {
  twitter: 4200, // X / Twitter Otomasyonu
  hukuk: 5000, // Hukuk Danışmanlığı
} as const;

/** TL formatlayıcı: 10000 → "10.000 ₺". */
export function formatTl(amount: number | null): string {
  if (amount === null || amount === undefined) return "—";
  return `${amount.toLocaleString("tr-TR")} ₺`;
}

/** Site genelinde ortak iletişim sayfası yolu — "Teklif Al" CTA buraya gider. */
export const TEKLIF_URL = "/iletisim";
