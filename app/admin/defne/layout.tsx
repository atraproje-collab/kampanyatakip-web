import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Defne Kampanyası — Yönetim Paneli",
  robots: { index: false, follow: false },
};

export default function DefneAdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-surface">{children}</div>;
}
