import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/lib/site-config";

type SocialKey = "linkedin" | "twitter" | "instagram" | "facebook" | "youtube";

const CORPORATE_LINKS = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "SSS", href: "/sss" },
];

const SERVICE_LINKS: Array<{ label: string; href: string; newTab?: boolean }> =
  [
    { label: "Modüller", href: "/moduller" },
    { label: "Fiyatlandırma", href: "/#pricing" },
    { label: "Demo İncele", href: "/kampanya/demo", newTab: true },
    { label: "Başvuru", href: "/basvuru" },
  ];

const LEGAL_LINKS = [
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
  { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
  { label: "Gizlilik Politikası", href: "/gizlilik" },
];

export function Footer() {
  const socialEntries = (
    Object.entries(siteConfig.social) as Array<[SocialKey, string | null]>
  ).filter(([, url]) => Boolean(url));

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant">
      <Container className="py-14 md:py-16">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand — spans 2 cols */}
          <div className="lg:col-span-2 max-w-sm">
            <Logo variant="horizontal" />
            <p className="mt-5 text-[14px] font-semibold text-primary-container">
              {siteConfig.company.tagline}
            </p>
            <p className="mt-2 text-[13.5px] leading-[22px] text-on-surface-variant">
              Şeffaf bağış yönetimi ve güvenilir kampanya takibi için
              profesyonel çözüm ortağınız.
            </p>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-4">
              Kurumsal
            </h4>
            <ul className="space-y-2.5">
              {CORPORATE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-4">
              Hizmetler
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    {...(link.newTab && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Yasal */}
          <div>
            <h4 className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-4">
              Yasal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-[13.5px] text-on-surface-variant">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Mail size={15} />
              {siteConfig.contact.email}
            </a>
            <a
              href={siteConfig.contact.phoneLink}
              className="inline-flex items-center gap-2 hover:text-secondary transition-colors"
            >
              <Phone size={15} />
              {siteConfig.contact.phone}
            </a>
          </div>

          {socialEntries.length > 0 && (
            <div className="flex gap-2">
              {socialEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:border-secondary hover:text-secondary hover:-translate-y-0.5 transition-all"
                >
                  <SocialIcon platform={key} size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[12px] text-on-surface-variant/85">
            © {new Date().getFullYear()} {siteConfig.company.name}. Tüm
            Hakları Saklıdır.
            {" "}
            <Link
              href="/master-admin/login"
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Yönetim
            </Link>
          </p>
          <p className="text-[12px] text-on-surface-variant/75">
            {siteConfig.company.status} · {siteConfig.contact.address}
          </p>
        </div>
      </Container>
    </footer>
  );
}
