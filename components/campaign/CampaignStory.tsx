"use client";

import {
  AlertCircle,
  Banknote,
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
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

const DOCTOR_QUOTE = {
  text:
    "SMA Tip 1'de her hafta kritik. Tedavi ne kadar erken uygulanırsa, motor nöronlardaki geri dönüşsüz hasar o kadar sınırlı kalıyor. Zolgensma tek doz uygulanan gen tedavisi olarak bu hasarı durdurma potansiyeline sahip.",
  author: "Dr. Ayşe Demir",
  role: "Pediatrik Nöroloji Uzmanı",
};

export function CampaignStory() {
  const { campaign } = useCampaign();
  const paragraphs = campaign.story.split("\n\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <article className="lg:col-span-2 space-y-5">
        <h2 className="text-[24px] md:text-[28px] font-semibold text-primary-container tracking-[-0.02em] leading-tight">
          Kampanyanın Hikayesi
        </h2>
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-[15px] md:text-[15.5px] leading-[26px] text-on-surface-variant"
          >
            {p}
          </p>
        ))}

        {/* Doctor quote */}
        <figure className="mt-8 relative rounded-2xl bg-surface-container-low border border-outline-variant p-6 md:p-7">
          <Quote
            size={28}
            className="absolute top-5 right-5 text-secondary/30"
            strokeWidth={2}
            aria-hidden
          />
          <blockquote className="text-[15px] md:text-[16.5px] leading-[26px] text-on-surface font-medium italic">
            &ldquo;{DOCTOR_QUOTE.text}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-[12.5px]">
            <strong className="text-primary-container">
              {DOCTOR_QUOTE.author}
            </strong>
            <span className="text-on-surface-variant"> · {DOCTOR_QUOTE.role}</span>
          </figcaption>
        </figure>

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
              gün kaldı — kampanya hedefine bu süre içinde ulaşmak, tedavinin
              başarı ihtimalini en üst seviyeye çıkaracak.
            </p>
          </div>
        </div>
      </article>

      {/* Timeline */}
      <aside>
        <div className="sticky top-28">
          <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em] mb-5">
            Tedavi Süreci
          </h3>
          <ol className="relative border-l-2 border-outline-variant pl-6 space-y-6">
            {TIMELINE.map(({ icon: Icon, title, date, text }, i) => (
              <li key={title} className="relative">
                <span className="absolute -left-[34px] top-0 w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_0_4px_var(--color-surface)]">
                  <Icon size={13} strokeWidth={2.25} />
                </span>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={12} className="text-on-surface-variant" />
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
                {i === TIMELINE.length - 1 && null}
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}
