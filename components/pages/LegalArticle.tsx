import type { ReactNode } from "react";
import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/Container";

export interface LegalArticleProps {
  intro: ReactNode;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalArticle({
  intro,
  lastUpdated,
  children,
}: LegalArticleProps) {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-low p-5 flex items-start gap-4">
            <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <CalendarCheck size={18} />
            </div>
            <div className="min-w-0 text-[13.5px] leading-[22px] text-on-surface">
              <p className="font-semibold text-primary-container">
                Son güncelleme:{" "}
                <span className="text-secondary font-bold">{lastUpdated}</span>
              </p>
              <p className="mt-1 text-on-surface-variant">{intro}</p>
            </div>
          </div>

          <article className="space-y-10 text-[14.5px] leading-[24px] text-on-surface">
            {children}
          </article>
        </div>
      </Container>
    </section>
  );
}

interface LegalSectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section id={`bolum-${number}`}>
      <header className="mb-4">
        <span className="text-[11px] font-bold text-secondary uppercase tracking-[0.16em]">
          Bölüm {number}
        </span>
        <h2 className="mt-1 text-[20px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] leading-tight">
          {title}
        </h2>
      </header>
      <div className="space-y-3 text-on-surface">{children}</div>
    </section>
  );
}
