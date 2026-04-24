"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-250 border-b",
        scrolled
          ? "bg-surface/95 backdrop-blur-md border-outline-variant shadow-[0_1px_2px_rgba(0,24,53,0.04)]"
          : "bg-surface/80 backdrop-blur-sm border-transparent",
      )}
    >
      <Container className="flex h-16 md:h-[72px] items-center justify-between">
        <Logo variant="horizontal" priority />

        <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
          {siteConfig.nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[14px] font-semibold transition-colors duration-250",
                isActive(link.href)
                  ? "text-secondary"
                  : "text-on-surface-variant hover:text-primary-container",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href={siteConfig.urls.demo}>
            <Button variant="secondary" size="md">
              Demo Al
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-container hover:bg-surface-container transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant bg-surface">
          <Container className="py-4 flex flex-col gap-1">
            {siteConfig.nav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-[15px] font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-secondary/10 text-secondary"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-primary-container",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href={siteConfig.urls.demo} className="mt-2">
              <Button variant="secondary" size="lg" className="w-full">
                Demo Al
              </Button>
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
