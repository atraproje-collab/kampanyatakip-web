/**
 * lib/mask-name.ts
 * İsim maskeleme yardımcıları (gizlilik kuralı).
 *
 *  - "MEHMET TUNA"      → "M***** T****"
 *  - "Ayşe Karaoğlan"   → "A**** K********"
 *  - "Kumbara K-02"     → "Kumbara K-02"   (zaten anonim)
 *  - "Stant S-01"       → "Stant S-01"     (zaten anonim)
 *  - boş / undefined    → "İsimsiz"
 *
 * Tek noktada `maskDonorName` üzerine ince bir sarmalayıcı; yeni kod
 * doğrudan bunu çağırmalı. (donation-format.ts içindeki orijinal
 * uygulamayla aynı çıktıyı verir.)
 */
import { maskDonorName } from "./donation-format";

export { maskDonorName };

const ANONYMOUS_PREFIXES = ["kumbara", "stant", "kumbara ", "stant "];

/**
 * Genel isim maskeleyici. Etiket "Kumbara"/"Stant" gibi anonim bir
 * kaynaksa veya isim boşsa, isim olduğu gibi geri döner.
 */
export function maskName(name: string | null | undefined, fallback = "İsimsiz"): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return fallback;
  const lower = trimmed.toLocaleLowerCase("tr-TR");
  if (ANONYMOUS_PREFIXES.some((p) => lower.startsWith(p))) return trimmed;
  return maskDonorName(trimmed);
}
