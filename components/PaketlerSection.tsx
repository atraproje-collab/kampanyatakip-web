"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  EK_MODULLER,
  formatTl,
  PAKET_FIYATLARI,
  SHOW_PRICES,
  TEKLIF_URL,
  type PaketKey,
} from "@/lib/pricing-config";
import { cn } from "@/lib/utils";

// ── Tipler ──────────────────────────────────────────────────────────────────

type Feature = { text: string; comingSoon?: boolean };

type Paket = {
  key: PaketKey;
  ad: string;
  aciklama: string;
  vurgular: Feature[];
  detaylar: Feature[];
  gradient: string;
  vurgulanan?: boolean; // ÖZEL paket için ekstra border / rozet
  altCta?: string; // ek not (örn. "Size özel teklif için")
};

// ── Veri ────────────────────────────────────────────────────────────────────

const PAKETLER: Paket[] = [
  {
    key: "temel",
    ad: "Temel",
    aciklama:
      "Tek dilli web sohbet botu ve şeffaf bağış takibiyle başlayan küçük & orta ölçek kampanyalar için",
    vurgular: [
      { text: "Web Sitesi + Yönetim Paneli" },
      { text: "Şeffaflık Merkezi + Bağışçı Gizlilik Maskesi" },
      { text: "TikTok Canlı Yayın Gelir Takibi" },
      { text: "Web AI Sohbet Botu — Türkçe (1.000 msg/ay)" },
      { text: "Reklam Performansı (Meta Ads)" },
      { text: "Kumbara · Stant · Gönüllü Takibi" },
      { text: "Tüm 14 standart modül dahil" },
    ],
    detaylar: [
      { text: "İzole Kampanya Sunucusu + Günlük Yedek" },
      { text: "Galeri & İçerik Yönetimi" },
      { text: "Tasarım Aracı (Canva Pro)" },
      { text: "Otomatik Raporlama (Haftalık/Aylık)" },
      { text: "Özel Raporlama (talebe göre)" },
      { text: "Kurumsal bağış vergi bilgisi" },
    ],
    gradient: "from-slate-600 to-slate-800",
  },
  {
    key: "standart",
    ad: "Standart",
    aciklama:
      "5 dilli AI sohbet, sosyal medya DM otomasyonu ve uluslararası bağışçıyı hedefleyen kampanyalar için",
    vurgular: [
      { text: "Temel'in tüm özellikleri" },
      { text: "Web AI Sohbet Botu — 5 Dil (3.000 msg/ay)" },
      { text: "Facebook + Instagram DM Otomasyonu" },
      { text: "Video Üretim — 5 adet (TR + EN)" },
      { text: "WhatsApp Mesaj", comingSoon: true },
      { text: "WhatsApp Sesli Arama", comingSoon: true },
      { text: "Sesli Bilgi Hattı 0850 — TR + EN", comingSoon: true },
    ],
    detaylar: [
      { text: "Çok dilli içerik & video çeviri akışı" },
      { text: "Sosyal medya analitik raporları" },
      { text: "Yorum/DM havuzu — tek panelden cevap" },
    ],
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    key: "premium",
    ad: "Premium",
    aciklama:
      "Maksimum erişim, tüm platform DM otomasyonu ve influencer/kurumsal bağış programlarıyla büyük kampanyalar için",
    vurgular: [
      { text: "Standart'ın tüm özellikleri" },
      { text: "7/24 Öncelikli AI Asistan (yüksek limit)" },
      { text: "YouTube Yorum Otomasyonu" },
      { text: "TikTok İçerik + Trend Takibi" },
      { text: "Video Üretim — 15 adet (5 dil)" },
      { text: "Influencer Radar" },
      { text: "Kurumsal Bağış Sistemi + Vergi Avantajı" },
      { text: "Hukuk Danışmanlığı (2 saat / ay)" },
    ],
    detaylar: [
      { text: "WhatsApp Mesaj", comingSoon: true },
      { text: "WhatsApp Sesli Arama", comingSoon: true },
      { text: "Sesli Bilgi Hattı 0850 — 5 Dil", comingSoon: true },
      { text: "Sosyal medya kriz yönetimi" },
      { text: "Premium AI asistan eğitimi" },
      { text: "Özel teknik hesap yöneticisi" },
    ],
    gradient: "from-purple-600 to-indigo-800",
  },
  {
    key: "ozel",
    ad: "Özel",
    aciklama:
      "Hazır paketlerin hiçbiri uymuyorsa Temel altyapıya ihtiyacınız olan modülleri ekleyerek kendi paketinizi oluşturun",
    vurgular: [
      { text: "Temel paket altyapısı zorunlu" },
      { text: "İhtiyaca göre modül seçimi" },
      { text: "Web AI Sohbet Botu (TR veya 5 dil)" },
      { text: "DM Otomasyonu (FB / IG / YouTube)" },
      { text: "Video paketi (5 / 15 adet)" },
      { text: "Influencer Radar (opsiyonel)" },
      { text: "Hukuk Danışmanlığı (opsiyonel)" },
    ],
    detaylar: [
      { text: "X / Twitter Otomasyonu (ek modül)" },
      { text: "Kurumsal Bağış Sistemi (opsiyonel)" },
      { text: "WhatsApp Mesaj", comingSoon: true },
      { text: "Sesli Bilgi Hattı 0850", comingSoon: true },
    ],
    gradient: "from-emerald-600 to-teal-700",
    vurgulanan: true,
    altCta: "Size özel teklif için iletişime geçin",
  },
];

// 14 standart modül — tüm paketlerde
const STANDART_MODULLER = [
  { ad: "Web Sitesi + Yönetim Paneli", emoji: "🌐" },
  { ad: "İzole Kampanya Sunucusu", emoji: "🖥️" },
  { ad: "Güvenlik + Günlük Yedek", emoji: "🛡️" },
  { ad: "Şeffaflık Merkezi", emoji: "🔒" },
  { ad: "Bağışçı Gizlilik Maskesi", emoji: "🕶️" },
  { ad: "TikTok Canlı Yayın Gelir Takibi", emoji: "📹" },
  { ad: "Tasarım Aracı (Canva Pro)", emoji: "🎨" },
  { ad: "Kumbara Takibi", emoji: "🏺" },
  { ad: "Stant Takibi", emoji: "🎪" },
  { ad: "Gönüllü ve Görevli Takibi", emoji: "🤝" },
  { ad: "Galeri", emoji: "🖼️" },
  { ad: "Otomatik Raporlama", emoji: "📈" },
  { ad: "Reklam Performansı (Meta Ads)", emoji: "🎯" },
  { ad: "Özel Raporlama", emoji: "📊" },
];

// Karşılaştırma tablosu
type KarsRow = {
  ozellik: string;
  temel: string | boolean;
  standart: string | boolean;
  premium: string | boolean;
  ozel: string | boolean;
};

const KARSILASTIRMA: KarsRow[] = [
  { ozellik: "Web AI Sohbet Botu", temel: "TR · 1.000 msg", standart: "5 dil · 3.000 msg", premium: "5 dil · yüksek limit", ozel: "Seçilebilir" },
  { ozellik: "Facebook + Instagram DM", temel: false, standart: true, premium: true, ozel: "Seçilebilir" },
  { ozellik: "YouTube Yorum Otomasyonu", temel: false, standart: false, premium: true, ozel: "Seçilebilir" },
  { ozellik: "TikTok İçerik + Trend Takibi", temel: false, standart: false, premium: true, ozel: "Seçilebilir" },
  { ozellik: "Video Üretim", temel: false, standart: "5 adet · TR+EN", premium: "15 adet · 5 dil", ozel: "Seçilebilir" },
  { ozellik: "WhatsApp Mesaj / Arama", temel: false, standart: "Yakında", premium: "Yakında", ozel: "Yakında" },
  { ozellik: "Sesli Bilgi Hattı 0850", temel: false, standart: "Yakında · TR+EN", premium: "Yakında · 5 dil", ozel: "Seçilebilir" },
  { ozellik: "Influencer Radar", temel: false, standart: false, premium: true, ozel: "Seçilebilir" },
  { ozellik: "Kurumsal Bağış Sistemi", temel: false, standart: false, premium: true, ozel: "Seçilebilir" },
  { ozellik: "Hukuk Danışmanlığı", temel: false, standart: false, premium: "2 saat/ay", ozel: "Seçilebilir" },
  { ozellik: "Şeffaflık Merkezi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Kumbara · Stant · Gönüllü Takibi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Reklam Performansı (Meta Ads)", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Otomatik + Özel Raporlama", temel: true, standart: true, premium: true, ozel: true },
];

function renderCellValue(value: string | boolean) {
  if (value === true)
    return <Check className="text-green-600 mx-auto" size={20} />;
  if (value === false)
    return <X className="text-slate-300 mx-auto" size={20} />;
  if (typeof value === "string" && value.toLowerCase().includes("yakında"))
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
        <Clock size={11} /> {value}
      </span>
    );
  return <span className="text-sm font-semibold text-slate-700">{value}</span>;
}

// ── Paket kartı ─────────────────────────────────────────────────────────────

function PaketKart({ paket, idx }: { paket: Paket; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const fiyat = PAKET_FIYATLARI[paket.key];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08 }}
      className={cn(
        "relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-fit",
        paket.vurgulanan
          ? "border-2 border-emerald-400 ring-1 ring-emerald-100"
          : "border border-slate-200",
      )}
    >
      {/* "ÖZEL" rozeti */}
      {paket.vurgulanan && (
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
          <Star size={11} fill="currentColor" />
          Esnek
        </div>
      )}

      {/* Üst gradient bant */}
      <div className={`bg-gradient-to-br ${paket.gradient} p-6 text-white`}>
        <h3 className="text-2xl font-bold mb-1">{paket.ad}</h3>
        <p className="text-sm opacity-90 min-h-[60px]">{paket.aciklama}</p>
      </div>

      {/* Fiyat alanı — SHOW_PRICES'a göre değişir */}
      <div className="p-6 border-b border-slate-100">
        {SHOW_PRICES && fiyat !== null ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-slate-900">
                {formatTl(fiyat)}
              </span>
              <span className="text-sm text-slate-500">/ay</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">KDV dahil</p>
          </>
        ) : SHOW_PRICES && fiyat === null ? (
          <div className="flex items-center gap-2 py-1">
            <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
              <Sparkles size={14} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">
                Modüllerinize göre
              </p>
              <p className="text-xs text-slate-500">
                Temel altyapı + seçtiğiniz modüller
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <div className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">
              <Lock size={14} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">
                Fiyat için iletişime geçin
              </p>
              <p className="text-xs text-slate-500">
                {paket.altCta ?? "Şeffaf, aylık ödeme — gizli ücret yok"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vurgu özellikler */}
      <ul className="p-6 space-y-3 flex-1">
        {paket.vurgular.map((f) => (
          <FeatureRow key={f.text} feature={f} />
        ))}
      </ul>

      {/* Detay özellikler (genişleyebilir) */}
      <AnimatePresence initial={false}>
        {expanded && paket.detaylar.length > 0 && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-2 space-y-3 overflow-hidden border-t border-slate-100 pt-4"
          >
            {paket.detaylar.map((f) => (
              <FeatureRow key={f.text} feature={f} muted />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Daha fazla butonu */}
      {paket.detaylar.length > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="px-6 py-3 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 border-t border-slate-100"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              <span>Daha az göster</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>+{paket.detaylar.length} özellik daha</span>
            </>
          )}
        </button>
      )}

      {/* CTA */}
      <div className="p-6 pt-0 space-y-2">
        <Link
          href={TEKLIF_URL}
          className={`group/btn flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-gradient-to-br ${paket.gradient} text-white font-semibold hover:opacity-90 hover:shadow-md transition-all text-center`}
        >
          Teklif Al
          <ArrowRight
            size={16}
            className="transition-transform group-hover/btn:translate-x-0.5"
          />
        </Link>
        <Link
          href="/kampanya/demo"
          className="block w-full py-2 rounded-lg text-center text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          Demo İncele →
        </Link>
      </div>
    </motion.div>
  );
}

function FeatureRow({
  feature,
  muted = false,
}: {
  feature: Feature;
  muted?: boolean;
}) {
  if (feature.comingSoon) {
    return (
      <li className="flex items-start gap-2 text-sm opacity-50">
        <Clock
          className="text-amber-500 flex-shrink-0 mt-0.5"
          size={16}
          aria-hidden
        />
        <span className="text-slate-600">
          {feature.text}{" "}
          <span className="text-[11px] font-semibold text-amber-700 ml-1">
            Yakında
          </span>
        </span>
      </li>
    );
  }
  return (
    <li
      className={cn(
        "flex items-start gap-2 text-sm",
        muted ? "text-slate-600" : "text-slate-700",
      )}
    >
      <Check
        className={cn(
          "flex-shrink-0 mt-0.5",
          muted ? "text-green-500" : "text-green-600",
        )}
        size={16}
      />
      <span>{feature.text}</span>
    </li>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────

export default function PaketlerSection() {
  return (
    <section
      className="py-8 bg-gradient-to-b from-slate-50 to-white"
      id="paketler"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Size Uygun Paketi Seçin
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Her bütçeye ve kampanya büyüklüğüne uygun, gizli ücreti olmayan
            şeffaf çözümler. Fiyatlandırma için iletişime geçin.
          </p>
        </motion.div>

        {/* KATMAN 1 — Paket Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PAKETLER.map((paket, idx) => (
            <PaketKart key={paket.key} paket={paket} idx={idx} />
          ))}
        </div>

        {/* KATMAN 2 — Tüm Paketlerde Bulunan Özellikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-3">
              <Sparkles size={16} />
              <span>Tüm Paketlerde Standart</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              {STANDART_MODULLER.length} Modül, Her Pakette Dahil
            </h3>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Hangi paketi seçerseniz seçin, aşağıdaki tüm modüller standart
              olarak sunulur
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {STANDART_MODULLER.map((m, idx) => (
              <motion.div
                key={m.ad}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-sm text-slate-700 font-medium">
                  {m.ad}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* KATMAN 3 — Karşılaştırma Tablosu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
              Detaylı Karşılaştırma
            </h3>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              Paketler arasındaki farkları tek bakışta görün
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl shadow-lg border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-sm">
                    Özellik
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-sm">
                    Temel
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-sm">
                    Standart
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-sm">
                    Premium
                  </th>
                  <th className="text-center px-4 py-4 font-semibold text-sm">
                    Özel
                  </th>
                </tr>
              </thead>
              <tbody>
                {KARSILASTIRMA.map((row, idx) => (
                  <tr
                    key={row.ozellik}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-6 py-3 text-sm text-slate-700 font-medium">
                      {row.ozellik}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCellValue(row.temel)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCellValue(row.standart)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCellValue(row.premium)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {renderCellValue(row.ozel)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ek modüller */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">𝕏</span>
                <h4 className="font-semibold text-slate-900">
                  X / Twitter Otomasyonu
                </h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Tüm paketlere eklenebilir ek modül
              </p>
              {SHOW_PRICES ? (
                <p className="text-lg font-bold text-orange-600">
                  {formatTl(EK_MODULLER.twitter)} / ay
                </p>
              ) : (
                <p className="text-sm text-orange-700 font-semibold flex items-center gap-1.5">
                  <Lock size={12} />
                  Fiyat için iletişime geçin
                </p>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚖️</span>
                <h4 className="font-semibold text-slate-900">
                  Hukuk Danışmanlığı
                </h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Premium pakete dahil, diğerlerine eklenebilir
              </p>
              {SHOW_PRICES ? (
                <p className="text-lg font-bold text-purple-600">
                  {formatTl(EK_MODULLER.hukuk)} / ay
                </p>
              ) : (
                <p className="text-sm text-purple-700 font-semibold flex items-center gap-1.5">
                  <Lock size={12} />
                  Fiyat için iletişime geçin
                </p>
              )}
            </div>
          </div>

          {/* Bilgi notu */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-5">
            <p className="text-sm text-slate-700">
              <strong className="text-blue-900">Şeffaf Fiyatlandırma:</strong>{" "}
              {SHOW_PRICES ? (
                <>
                  Tüm fiyatlar KDV dahildir. Aylık ödeme sistemiyle
                  çalışıyoruz, minimum sözleşme süresi yoktur.{" "}
                  <strong className="text-blue-900">
                    Kurulum süresi: 2-4 iş günü.
                  </strong>
                </>
              ) : (
                <>
                  Paket fiyatları yakında kamuya açılacaktır. Şu an için{" "}
                  <Link
                    href={TEKLIF_URL}
                    className="text-blue-700 font-semibold underline underline-offset-2 hover:text-blue-900"
                  >
                    iletişim formu
                  </Link>{" "}
                  üzerinden teklif alabilirsiniz. Şeffaf, aylık ödeme — gizli
                  ücret yok.{" "}
                  <strong className="text-blue-900">
                    Kurulum süresi: 2-4 iş günü.
                  </strong>
                </>
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

