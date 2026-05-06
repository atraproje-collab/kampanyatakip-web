/**
 * Bağışçı adını maskeler: "ONUR GÜZEL" → "O*** G****"
 * Her kelimenin ilk harfi korunur, kalan harfler yıldıza dönüşür.
 */
export function maskDonorName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 1) return word;
      const first = word.charAt(0);
      const stars = "*".repeat(word.length - 1);
      return first + stars;
    })
    .join(" ");
}

/** Source label "Kumbara …" veya "Stant …" ile başlıyorsa kayıt anonim sayılır. */
export function isAnonymousSource(source: string): boolean {
  return source.startsWith("Kumbara") || source.startsWith("Stant");
}

/**
 * Maskeleme kuralları:
 *  - İsim boşsa → "İsimsiz Bağışçı" (maskelenmez).
 *  - Kaynak Kumbara/Stant ise → isim olduğu gibi (zaten anonim kayıt).
 *  - Diğer durumlarda → maskelenir.
 */
export function formatDonorName(rawName: string, source: string): string {
  const trimmed = rawName.trim();
  if (!trimmed) return "İsimsiz Bağışçı";
  if (isAnonymousSource(source)) return trimmed;
  return maskDonorName(trimmed);
}

/** Bir tarih string'ini ("YYYY-MM-DD HH:mm" veya "YYYY-MM-DD") Date'e çevirir. */
export function parseDonationDate(date: string): Date | null {
  if (!date) return null;
  // "YYYY-MM-DD HH:mm" → "YYYY-MM-DDTHH:mm" (ISO uyumlu)
  const iso = date.includes("T") ? date : date.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "X dakika önce", "X saat önce", "X gün önce" — Türkçe relative time. */
export function formatRelativeTime(date: string, now: Date = new Date()): string {
  const d = parseDonationDate(date);
  if (!d) return date;
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "az önce";
  if (diffMin < 60) return `${diffMin} dakika önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;
  return date.slice(0, 10);
}
