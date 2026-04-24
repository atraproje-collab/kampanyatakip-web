import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { siteConfig } from "@/lib/site-config";

const CORPORATE_LINKS = [
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" },
  { label: "SSS", href: "/sss" },
];

const SERVICE_LINKS = [
  { label: "Modüller", href: "/#features" },
  { label: "Fiyatlandırma", href: "/#pricing" },
  { label: "Demo Al", href: "/demo" },
];

const LEGAL_LINKS = [
  { label: "Kullanım Koşulları", href: "#" },
  { label: "KVKK Aydınlatma Metni", href: "#" },
  { label: "Gizlilik Politikası", href: "#" },
];

type SocialKey = "linkedin" | "twitter" | "instagram" | "facebook" | "youtube";

export function Footer() {
  const socialEntries = (
    Object.entries(siteConfig.social) as Array<[SocialKey, string | null]>
  ).filter(([, url]) => Boolean(url));

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant">
      <Container className="py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 flex flex-col gap-4">
            <Logo variant="horizontal" />
            <p className="text-[14px] font-medium text-primary-container">
              {siteConfig.company.tagline}
            </p>
            <p className="text-[13px] leading-[20px] text-on-surface-variant max-w-xs">
              Şeffaf bağış yönetimi ve güvenilir kampanya takibi için profesyonel
              çözüm ortağınız.
            </p>
          </div>

          {/* Corporate */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-1">
              Kurumsal
            </span>
            {CORPORATE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Services */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-1">
              Hizmetler
            </span>
            {SERVICE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-1">
              Yasal
            </span>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <span className="text-[12px] font-bold text-primary-container uppercase tracking-widest mb-1">
              İletişim
            </span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 text-[13px] text-on-surface-variant hover:text-secondary transition-colors"
            >
              <Mail size={14} />
              <span className="truncate">{siteConfig.contact.email}</span>
            </a>
            <a
              href={siteConfig.contact.phoneLink}
              className="flex items-center gap-2 text-[13px] text-on-surface-variant hover:text-secondary transition-colors"
            >
              <Phone size={14} />
              {siteConfig.contact.phone}
            </a>
            {socialEntries.length > 0 && (
              <div className="flex gap-2 mt-2">
                {socialEntries.map(([key, url]) => (
                  <a
                    key={key}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-white transition-colors"
                  >
                    <SocialIcon platform={key} size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-[12px] text-on-surface-variant/80 tracking-wide">
            © {new Date().getFullYear()} {siteConfig.company.name}. Tüm Hakları
            Saklıdır.
          </p>
          <p className="text-[12px] text-on-surface-variant/70">
            {siteConfig.company.status} · {siteConfig.contact.address}
          </p>
        </div>
      </Container>
    </footer>
  );
}
