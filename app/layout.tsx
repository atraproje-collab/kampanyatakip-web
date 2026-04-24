import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kampanyatakip.com"),
  title: {
    default: "KAMPANYATAKİP — Şeffaf Bağış Takip Sistemi",
    template: "%s | KAMPANYATAKİP",
  },
  description:
    "SMA, DMD ve tüm yardım kampanyaları için yapay zeka destekli, valilik onaylı şeffaf bağış yönetim platformu. Bağışın her kuruşu gerçek zamanlı takipte.",
  keywords: [
    "bağış takip",
    "kampanya yönetimi",
    "SMA kampanyası",
    "DMD kampanyası",
    "şeffaflık platformu",
    "yardım kampanyası",
    "valilik onaylı",
    "bağış şeffaflık",
    "dernek yönetim sistemi",
  ],
  authors: [{ name: "KAMPANYATAKİP" }],
  creator: "KAMPANYATAKİP",
  publisher: "KAMPANYATAKİP",
  openGraph: {
    title: "KAMPANYATAKİP — Şeffaf Bağış Takip Sistemi",
    description: "Bağışın Her Kuruşu, Gerçek Zamanlı Şeffaflıkla",
    locale: "tr_TR",
    type: "website",
    siteName: "KAMPANYATAKİP",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "KAMPANYATAKİP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KAMPANYATAKİP",
    description: "Bağışın Her Kuruşu, Gerçek Zamanlı Şeffaflıkla",
    images: ["/og-image.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo-square.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/logo-square.jpeg" }],
  },
  alternates: {
    canonical: "https://kampanyatakip.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#001835",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-sans">
        {children}
      </body>
    </html>
  );
}
