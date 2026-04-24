import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  {
    heading: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "#" },
      { label: "İletişim", href: "#" },
    ],
  },
  {
    heading: "Yasal",
    links: [
      { label: "Kullanım Koşulları", href: "#" },
      { label: "KVKK Aydınlatma Metni", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant">
      <Container className="py-14 md:py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          <div className="max-w-sm flex flex-col gap-4">
            <Logo variant="horizontal" />
            <p className="text-[14px] leading-[22px] text-on-surface-variant">
              Şeffaf bağış yönetimi ve güvenilir kampanya takibi için profesyonel
              çözüm ortağınız.
            </p>
          </div>

          <div className="flex flex-wrap gap-10 md:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <span className="text-[13px] font-bold text-primary-container uppercase tracking-widest mb-1">
                  {col.heading}
                </span>
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-on-surface-variant hover:text-secondary transition-colors duration-250"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-outline-variant">
          <p className="text-[12px] text-on-surface-variant/80 tracking-wide">
            © 2026 KAMPANYATAKİP. Tüm Hakları Saklıdır.
          </p>
        </div>
      </Container>
    </footer>
  );
}
