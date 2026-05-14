"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, ChevronDown, ChevronUp, Lock } from "lucide-react";

// Fiyatları açmak istediğinizde bunu true yapın
const SHOW_PRICES = false;

type Paket = {
  ad: string;
  fiyat: string;
  fiyatAlt?: string;
  aciklama: string;
  ozelliklerVurgu: string[];
  ozelliklerDetay: string[];
  cta: string;
  ctaLink: string;
  gradient: string;
};

const PAKETLER: Paket[] = [
  {
    ad: "Temel",
    fiyat: "9.900 ₺",
    fiyatAlt: "/ay",
    aciklama:
      "Tek sosyal medya platformuyla başlayan, küçük bütçeli kampanyalar için",
    ozelliklerVurgu: [
      "1 Sosyal medya platformu",
      "2.000 WhatsApp mesajı/ay",
      "300 dk IVR/ay",
      "5 Türkçe video/ay",
      "7/24 yapay zeka asistanı",
      "Bağışçı gizlilik maskesi",
      "Şeffaflık merkezi",
    ],
    ozelliklerDetay: [
      "Para takibi + anlık bildirim",
      "Kumbara/stant takip sistemi",
      "Gönüllü yönetim sistemi",
      "Canlı yayın gelir takibi",
      "Otomatik haftalık/aylık rapor",
      "Önemli olay bildirimleri",
      "Güvenlik + otomatik yedek",
      "İzole kampanya sunucusu",
      "Tasarım aracı hesabı",
      "Kurumsal bağış vergi bilgisi",
    ],
    cta: "Demo İncele",
    ctaLink: "/kampanya/demo",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    ad: "Standart",
    fiyat: "17.900 ₺",
    fiyatAlt: "/ay",
    aciklama:
      "Üç platformda aktif olmak isteyen, uluslararası bağışçıyı hedefleyen kampanyalar için",
    ozelliklerVurgu: [
      "Facebook + Instagram + YouTube",
      "5.000 WhatsApp mesajı/ay",
      "1.000 dk IVR/ay",
      "15 Video (5 video × 3 dil)",
      "Çok dilli destek (5 dil)",
      "Kurumsal bağış e-posta sistemi",
      "Temel'in tüm özellikleri",
    ],
    ozelliklerDetay: [
      "Çoklu platform yorum/DM otomasyonu",
      "Reels/Shorts otomatik formatlama",
      "Çok dilli video çeviri sistemi",
      "Sosyal medya analitik raporları",
      "5 dilde IVR (TR/EN/AR/DE/RU)",
      "Vergi avantajı bilgilendirme (KVK Md.10)",
      "Tasarım aracı genişletilmiş hesap",
      "Para takibi + anlık bildirim",
      "Kumbara/stant/gönüllü takip",
      "Canlı yayın gelir takibi",
      "Otomatik raporlama (haftalık/aylık)",
      "Bağışçı gizlilik maskesi",
      "Şeffaflık merkezi",
    ],
    cta: "Demo İncele",
    ctaLink: "/kampanya/demo",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    ad: "Premium",
    fiyat: "29.900 ₺",
    fiyatAlt: "/ay",
    aciklama:
      "Maksimum görünürlük, sınırsız iletişim isteyen büyük kampanyalar için",
    ozelliklerVurgu: [
      "FB + Instagram + YouTube + TikTok",
      "Sınırsız WhatsApp + IVR",
      "50 Video (10 video × 5 dil)",
      "Influencer radar",
      "2 saat hukuk danışmanlığı",
      "Öncelikli teknik destek",
      "Standart'ın tüm özellikleri",
    ],
    ozelliklerDetay: [
      "TikTok canlı yayın takibi",
      "Influencer mesajlaşma sistemi",
      "Sosyal medya kriz yönetimi",
      "Premium AI asistan eğitimi",
      "Özel raporlama paketi",
      "Tüm platform DM otomasyonu",
      "Sınırsız Reels/Shorts üretimi",
      "5 dil tam destek (içerik + IVR)",
      "Tasarım aracı Premium hesap",
      "Kurumsal bağış sistemi gelişmiş",
      "Vergi avantajı bilgilendirme detaylı",
      "Tüm standart modüller dahil",
      "7/24 öncelikli AI asistan",
      "Şeffaflık merkezi gelişmiş",
      "Bağışçı gizlilik maskesi",
      "Güvenlik + günlük yedek",
      "İzole Premium sunucu",
      "Özel teknik hesap yöneticisi",
    ],
    cta: "Demo İncele",
    ctaLink: "/kampanya/demo",
    gradient: "from-purple-600 to-indigo-800",
  },
  {
    ad: "Özel",
    fiyat: "4.900 ₺",
    fiyatAlt: "+ modül",
    aciklama:
      "Standart paketlerin hiçbiri uymuyorsa, ihtiyacınıza özel paket oluşturun",
    ozelliklerVurgu: [
      "Zorunlu modüller sabit",
      "Para takibi + anlık bildirim",
      "Kumbara/stant takip",
      "Kampanya sayfası + canlı sayaç",
      "Bağışçı gizlilik maskesi",
      "Şeffaflık merkezi",
      "İstediğiniz modülleri ekleyin",
    ],
    ozelliklerDetay: [
      "Sosyal medya platformları (her biri 1.500-3.500 ₺)",
      "WhatsApp paketi (1.000/3.000/sınırsız)",
      "IVR paketi (300/1.000/sınırsız dk)",
      "Video üretim (5/15/30/50 adet)",
      "Çok dilli destek (3 veya 5 dil)",
      "Hukuk danışmanlığı (5.000 ₺/ay)",
      "X/Twitter modülü (4.200 ₺/ay)",
      "Influencer radar",
      "Otomatik raporlama",
      "Gönüllü yönetim sistemi",
      "Canlı yayın gelir takibi",
      "Kurumsal bağış e-posta",
      "Minimum paket tutarı: 9.900 ₺",
    ],
    cta: "Demo İncele",
    ctaLink: "/kampanya/demo",
    gradient: "from-emerald-600 to-teal-700",
  },
];

const STANDART_MODULLER = [
  { ad: "Para Takibi ve Anlık Bildirim", emoji: "💰" },
  { ad: "Kumbara Takip Sistemi", emoji: "🏺" },
  { ad: "Stant Takip Sistemi", emoji: "🎪" },
  { ad: "Gönüllü Yönetim Sistemi", emoji: "🤝" },
  { ad: "Canlı Yayın Gelir Takibi", emoji: "📹" },
  { ad: "Gelir-Gider Şeffaflık", emoji: "📊" },
  { ad: "WhatsApp Asistanı 7/24", emoji: "💬" },
  { ad: "Sesli Bilgi Hattı (5 dil)", emoji: "📞" },
  { ad: "Kampanya Sayfası + Canlı Sayaç", emoji: "🌐" },
  { ad: "Bağışçı Gizlilik Maskesi", emoji: "🔒" },
  { ad: "Şeffaflık Merkezi", emoji: "🛡️" },
  { ad: "Güvenlik + Otomatik Yedek", emoji: "💾" },
  { ad: "İzole Kampanya Sunucusu", emoji: "🖥️" },
  { ad: "Tasarım Aracı Hesabı", emoji: "🎨" },
  { ad: "Kurumsal Bağış Vergi Bilgisi", emoji: "📑" },
  { ad: "Otomatik Raporlama", emoji: "📈" },
  { ad: "Önemli Olay Bildirimleri", emoji: "🔔" },
];

type KarsRow = {
  ozellik: string;
  temel: string | boolean;
  standart: string | boolean;
  premium: string | boolean;
  ozel: string | boolean;
};

const KARSILASTIRMA: KarsRow[] = [
  { ozellik: "Sosyal Medya Platformu", temel: "1", standart: "3", premium: "4", ozel: "Seçilebilir" },
  { ozellik: "WhatsApp Mesajı/ay", temel: "2.000", standart: "5.000", premium: "Sınırsız", ozel: "Seçilebilir" },
  { ozellik: "IVR Dakika/ay", temel: "300", standart: "1.000", premium: "Sınırsız", ozel: "Seçilebilir" },
  { ozellik: "Video/ay", temel: "5 (TR)", standart: "15 (3 dil)", premium: "50 (5 dil)", ozel: "Seçilebilir" },
  { ozellik: "Çok Dilli Destek", temel: false, standart: "5 dil", premium: "5 dil", ozel: "Seçilebilir" },
  { ozellik: "Kurumsal Bağış E-posta", temel: false, standart: true, premium: true, ozel: "Seçilebilir" },
  { ozellik: "Influencer Radar", temel: false, standart: false, premium: true, ozel: "Seçilebilir" },
  { ozellik: "Hukuk Danışmanlığı", temel: false, standart: false, premium: "2 saat", ozel: "Seçilebilir" },
  { ozellik: "Para Takibi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Kumbara/Stant Takip", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Gönüllü Yönetimi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Bağışçı Gizlilik Maskesi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Şeffaflık Merkezi", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "AI Asistan 7/24", temel: true, standart: true, premium: true, ozel: true },
  { ozellik: "Otomatik Raporlama", temel: true, standart: true, premium: true, ozel: true },
];

function renderCellValue(value: string | boolean) {
  if (value === true) return <Check className="text-green-600 mx-auto" size={20} />;
  if (value === false) return <X className="text-slate-300 mx-auto" size={20} />;
  return <span className="text-sm font-semibold text-slate-700">{value}</span>;
}

function PaketKart({ paket, idx }: { paket: Paket; idx: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 flex flex-col h-fit"
    >
      {/* Üst gradient bant */}
      <div className={`bg-gradient-to-br ${paket.gradient} p-6 text-white`}>
        <h3 className="text-2xl font-bold mb-1">{paket.ad}</h3>
        <p className="text-sm opacity-90 min-h-[40px]">{paket.aciklama}</p>
      </div>

      {/* Fiyat alanı — SHOW_PRICES'a göre değişir */}
      <div className="p-6 border-b border-slate-100">
        {SHOW_PRICES ? (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">{paket.fiyat}</span>
              {paket.fiyatAlt && (
                <span className="text-sm text-slate-500">{paket.fiyatAlt}</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">KDV hariç</p>
          </>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <div className="bg-amber-100 text-amber-700 p-1.5 rounded-lg">
              <Lock size={14} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-800">Yakında Açıklanacak</p>
              <p className="text-xs text-slate-500">Fiyatlandırma çok yakında</p>
            </div>
          </div>
        )}
      </div>

      {/* Vurgu özellikler */}
      <ul className="p-6 space-y-3 flex-1">
        {paket.ozelliklerVurgu.map((o) => (
          <li key={o} className="flex items-start gap-2 text-sm text-slate-700">
            <Check className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
            <span>{o}</span>
          </li>
        ))}
      </ul>

      {/* Detay özellikler (genişleyebilir) */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-2 space-y-3 overflow-hidden border-t border-slate-100 pt-4"
          >
            {paket.ozelliklerDetay.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                <span>{o}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Daha fazla butonu */}
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
            <span>+{paket.ozelliklerDetay.length} özellik daha</span>
          </>
        )}
      </button>

      {/* CTA */}
      <div className="p-6 pt-0">
        <Link
          href={paket.ctaLink}
          className={`block w-full py-3 rounded-xl bg-gradient-to-br ${paket.gradient} text-white font-semibold hover:opacity-90 transition-opacity text-center`}
        >
          {paket.cta}
        </Link>
      </div>
    </motion.div>
  );
}

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
            şeffaf çözümler
          </p>
        </motion.div>

        {/* KATMAN 1 — Paket Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {PAKETLER.map((paket, idx) => (
            <PaketKart key={paket.ad} paket={paket} idx={idx} />
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
              17 Modül, Her Pakette Dahil
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

          {/* Ek paketler bilgi kartı */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">𝕏</span>
                <h4 className="font-semibold text-slate-900">
                  X / Twitter Modülü
                </h4>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                Tüm paketlere eklenebilir ek modül
              </p>
              {SHOW_PRICES ? (
                <p className="text-lg font-bold text-orange-600">4.200 ₺/ay</p>
              ) : (
                <p className="text-sm text-orange-700 font-medium flex items-center gap-1">
                  <Lock size={12} />
                  <span>Fiyat yakında</span>
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
              <p className="text-sm text-slate-600 mb-2">
                Standart ve Özel paketlere eklenebilir
              </p>
              {SHOW_PRICES ? (
                <p className="text-lg font-bold text-purple-600">5.000 ₺/ay</p>
              ) : (
                <p className="text-sm text-purple-700 font-medium flex items-center gap-1">
                  <Lock size={12} />
                  <span>Fiyat yakında</span>
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
                  Fiyatlar KDV hariçtir. Aylık ödeme sistemiyle çalışıyoruz,
                  minimum sözleşme süresi yoktur. Paket limitlerini aştığınızda
                  ek ücret şeffaf şekilde uygulanır.{" "}
                  <strong className="text-blue-900">
                    Kurulum süresi: 2-4 iş günü.
                  </strong>
                </>
              ) : (
                <>
                  Paket fiyatları çok yakında açıklanacaktır. Şeffaf, aylık
                  ödeme sistemiyle, gizli ücret olmadan çalışıyoruz.{" "}
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
