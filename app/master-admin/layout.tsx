import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Master Admin — KAMPANYATAKİP",
  robots: { index: false, follow: false },
};

export default function MasterAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-surface">{children}</div>;
}
