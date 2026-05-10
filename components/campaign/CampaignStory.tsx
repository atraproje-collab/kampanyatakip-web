"use client";

import {
  AlertCircle,
  Banknote,
  CalendarDays,
  Camera,
  ClipboardCheck,
  HeartPulse,
  Image as ImageIcon,
  Images,
  Plane,
  Quote,
  Stethoscope,
} from "lucide-react";
import { useCampaign } from "@/components/campaign/CampaignContext";

const TIMELINE = [
  {
    icon: HeartPulse,
    title: "Tanı",
    date: "Şubat 2026",
    text: "SMA Tip 1 genetik testi pozitif sonuçlandı. Aile ve ekip tedavi planlamasına başladı.",
  },
  {
    icon: ClipboardCheck,
    title: "Valilik Onayı",
    date: "25 Ocak 2026",
    text: "İstanbul Valiliği 2026/4521 sayılı kararla kampanyayı onayladı.",
  },
  {
    icon: Banknote,
    title: "Kampanya Başlangıcı",
    date: "27 Ocak 2026",
    text: "Banka hesapları açıldı, KAMPANYATAKİP üzerinden şeffaf takip başladı.",
  },
  {
    icon: Stethoscope,
    title: "Ön Ödeme Yapıldı",
    date: "22 Nisan 2026",
    text: "₺5.000.000 tedavi rezervasyon ücreti ilaç firmasına transfer edildi.",
  },
  {
    icon: Plane,
    title: "Tedavi Hedefi",
    date: "Temmuz 2026",
    text: "Ailenin ABD'ye transferi ve Zolgensma tedavisinin uygulanması planlanıyor.",
  },
];

export function CampaignStory() {
  const { campaign, icerik, galeri } = useCampaign();

  const storyText = icerik.hikayeMetni.trim();
  const paragraphs = storyText
    ? storyText.split("\n\n").map((p) => p.trim()).filter(Boolean)
    : [];

  const hasDoctor = icerik.doktorAlintisi.trim().length > 0;
  const galleryTeaser = galeri.slice(0, 3);
  const coverUrl = icerik.coverUrl;

  return (
    <div className="space-y-10 md:space-y-12">
      {/* 2-col: story + sticky photo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* Photo — first on mobile, second on desktop */}
        <div className="order-first lg:order-last">
          <div className="lg:sticky lg:top-28 space-y-4">
            <figure className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-outline-variant shadow-[0_10px_20px_rgba(0,24,53,0.08)] group bg-surface-container-low">
              {coverUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt={
                      icerik.heroBaslik
                        ? `${icerik.heroBaslik} — kampanya kapak fotoğrafı`
                        : "Kampanya kapak fotoğrafı"
                    }
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 text-[11.5px] font-semibold">
                    <Camera size={12} strokeWidth={2.25} />
                    Kampanya kapak fotoğrafı
                  </span>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant gap-2 px-4 text-center">
                  <ImageIcon size={32} className="opacity-50" />
                  <p className="text-[12.5px]">Kapak fotoğrafı henüz eklenmemiş</p>
                </div>
              )}
            </figure>

            {/* Gallery teaser — gerçek galeri foto'larından ilk 3 */}
            {galleryTeaser.length > 0 && (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-3 md:p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-[12px] font-bold text-primary-container uppercase tracking-[0.12em]">
                    Daha fazla fotoğraf
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                    <Images size={12} />
                    Galeri sekmesi
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {galleryTeaser.map((g) => (
                    <div
                      key={g.id}
                      className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant bg-surface-container"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.fotoUrl}
                        alt={g.baslik || `Galeri fotoğrafı #${g.id}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-[11.5px] leading-[16px] text-on-surface-variant">
                  + Toplam {galeri.length.toLocaleString("tr-TR")} fotoğraf için{" "}
                  <strong>Galeri</strong> sekmesini inceleyin.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Story article */}
        <article className="space-y-5 min-w-0">
          <h2 className="text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
            Kampanyanın Hikayesi
          </h2>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[15px] md:text-[15.5px] leading-[26px] text-on-surface-variant whitespace-pre-line"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-[14px] leading-[22px] text-on-surface-variant italic">
              Kampanya hikayesi henüz eklenmemiş.
            </p>
          )}

          {/* Doctor quote — sadece içerikte alıntı varsa */}
          {hasDoctor && (
            <figure className="mt-8 relative rounded-2xl bg-surface-container-low border border-outline-variant p-6 md:p-7">
              <Quote
                size={28}
                className="absolute top-5 right-5 text-secondary/30"
                strokeWidth={2}
                aria-hidden
              />
              <blockquote className="text-[15px] md:text-[16.5px] leading-[26px] text-on-surface font-medium italic">
                &ldquo;{icerik.doktorAlintisi}&rdquo;
              </blockquote>
              {(icerik.doktorAdi || icerik.doktorUnvan) && (
                <figcaption className="mt-4 text-[12.5px]">
                  {icerik.doktorAdi && (
                    <strong className="text-primary-container">
                      {icerik.doktorAdi}
                    </strong>
                  )}
                  {icerik.doktorAdi && icerik.doktorUnvan && (
                    <span className="text-on-surface-variant"> · </span>
                  )}
                  {icerik.doktorUnvan && (
                    <span className="text-on-surface-variant">
                      {icerik.doktorUnvan}
                    </span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

          {/* Urgency box */}
          <div className="rounded-2xl bg-error/[0.06] border border-error/25 p-5 md:p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-error/10 text-error flex items-center justify-center shrink-0">
              <AlertCircle size={22} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-error tracking-[-0.01em]">
                Neden acele gerekli?
              </h3>
              <p className="mt-1.5 text-[14px] leading-[22px] text-on-surface">
                Zolgensma tedavisi 2 yaş öncesinde en yüksek etkiyi gösteriyor.
                Defne&apos;nin 2 yaşına girmesine yaklaşık {campaign.daysLeft}{" "}
                gün kaldı — kampanya hedefine bu süre içinde ulaşmak,
                tedavinin başarı ihtimalini en üst seviyeye çıkaracak.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Timeline — full width below */}
      <section className="rounded-2xl border border-outline-variant bg-white p-6 md:p-8">
        <h3 className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em] mb-6">
          Tedavi Süreci
        </h3>
        <ol className="relative border-l-2 border-outline-variant pl-6 space-y-6 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-6 md:space-y-0 md:border-l-0 md:pl-0">
          {TIMELINE.map(({ icon: Icon, title, date, text }) => (
            <li key={title} className="relative md:pl-10">
              <span className="absolute -left-[34px] md:left-0 top-0 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_0_4px_var(--color-surface)]">
                <Icon size={13} strokeWidth={2.25} />
              </span>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays
                  size={12}
                  className="text-on-surface-variant"
                />
                <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {date}
                </span>
              </div>
              <h4 className="text-[14.5px] font-semibold text-primary-container">
                {title}
              </h4>
              <p className="mt-1 text-[12.5px] leading-[19px] text-on-surface-variant">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
