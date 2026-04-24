"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Nasıl Çalışır?", href: "#hero" },
  { label: "Modüller", href: "#features" },
  { label: "Fiyatlandırma", href: "#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-semibold text-on-surface-variant hover:text-primary-container transition-colors duration-250"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button variant="secondary" size="md">
            Demo Al
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg text-primary-container hover:bg-surface-container transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menüyü aç/kapat"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface">
          <Container className="py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-[15px] font-semibold text-on-surface-variant hover:bg-surface-container hover:text-primary-container transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button variant="secondary" size="lg" className="mt-2 w-full">
              Demo Al
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
