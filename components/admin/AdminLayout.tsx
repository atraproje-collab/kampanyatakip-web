"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bot,
  Briefcase,
  Coins,
  FileBarChart,
  FileText,
  Images,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  PiggyBank,
  Radar,
  Radio,
  Receipt,
  Settings,
  Store,
  Target,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAdminSession, isAdminAuthenticated, logoutAdmin } from "@/lib/admin-auth";

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof BarChart3;
  children?: NavItem[];
};

const NAV: NavItem[] = [
  { href: "/admin/defne", label: "Genel Bakış", shortLabel: "Bakış", icon: BarChart3 },
  { href: "/admin/defne/bagislar", label: "Bağışlar", shortLabel: "Bağış", icon: Coins },
  { href: "/admin/defne/kumbaralar", label: "Kumbaralar", shortLabel: "Kumbara", icon: PiggyBank },
  { href: "/admin/defne/stantlar", label: "Stantlar", shortLabel: "Stant", icon: Store },
  { href: "/admin/defne/gonulluler", label: "Gönüllüler", shortLabel: "Gönüllü", icon: Users },
  { href: "/admin/defne/giderler", label: "Giderler", shortLabel: "Gider", icon: Receipt },
  {
    href: "/admin/defne/sosyal-medya",
    label: "Sosyal Medya",
    shortLabel: "Sosyal",
    icon: Megaphone,
    children: [
      {
        href: "/admin/defne/sosyal-medya/mesajlar",
        label: "Mesajlar",
        shortLabel: "Mesaj",
        icon: MessageCircle,
      },
    ],
  },
  { href: "/admin/defne/icerik", label: "İçerik", shortLabel: "İçerik", icon: FileText },
  { href: "/admin/defne/galeri", label: "Galeri", shortLabel: "Galeri", icon: Images },
  { href: "/admin/defne/ai-asistan", label: "AI Asistan", shortLabel: "AI", icon: Bot },
  { href: "/admin/defne/canli-yayin", label: "TikTok Geliri", shortLabel: "TikTok", icon: Radio },
  {
    href: "/admin/defne/kurumsal-destekci",
    label: "Kurumsal Destekçi",
    shortLabel: "Kurumsal",
    icon: Briefcase,
  },
  {
    href: "/admin/defne/influencer-radar",
    label: "Influencer Radar",
    shortLabel: "Radar",
    icon: Radar,
  },
  {
    href: "/admin/defne/reklam-performansi",
    label: "Reklam Performansı",
    shortLabel: "Reklam",
    icon: Target,
  },
  { href: "/admin/defne/raporlar", label: "Raporlar", shortLabel: "Rapor", icon: FileBarChart },
  { href: "/admin/defne/ayarlar", label: "Ayarlar", shortLabel: "Ayar", icon: Settings },
];

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminLayout({ title, subtitle, actions, children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/admin/defne/login");
      return;
    }
    setUsername(getAdminSession()?.username ?? "");
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutAdmin();
    router.replace("/admin/defne/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-on-surface-variant text-body-sm">Yükleniyor…</div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/admin/defne" ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar — desktop & tablet */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-primary text-on-primary fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin/defne" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="KAMPANYATAKİP"
              width={180}
              height={36}
              className="h-8 w-auto object-contain"
              style={{ mixBlendMode: "screen" }}
            />
          </Link>
          <p className="mt-3 text-label-sm text-on-primary-container">
            Minik Defne Kampanyası
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const parentExpanded = item.children?.some((c) => isActive(c.href)) || active;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-on-secondary shadow-[0_4px_12px_rgba(0,103,127,0.4)]"
                      : "text-on-primary-container hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
                {item.children && parentExpanded && (
                  <div className="ml-3 mt-1 mb-1 pl-3 border-l border-white/10 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-label-md font-medium transition-colors",
                            childActive
                              ? "bg-secondary/80 text-on-secondary"
                              : "text-on-primary-container hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <Link
            href="/kampanya/demo"
            target="_blank"
            className="block text-label-sm text-on-primary-container hover:text-white px-3 py-2"
          >
            ↗ Kamuya açık sayfa
          </Link>
        </div>
      </aside>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-primary text-on-primary transform transition-transform duration-300 flex flex-col",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <Image
            src="/logo.png"
            alt="KAMPANYATAKİP"
            width={160}
            height={32}
            className="h-7 w-auto object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-on-primary-container hover:bg-white/10"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors",
                    active
                      ? "bg-secondary text-on-secondary"
                      : "text-on-primary-container hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
                {item.children && (
                  <div className="ml-3 mt-1 mb-1 pl-3 border-l border-white/10 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-label-md font-medium transition-colors",
                            childActive
                              ? "bg-secondary/80 text-on-secondary"
                              : "text-on-primary-container hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium text-on-primary-container hover:bg-white/5 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant px-4 md:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 -ml-2 rounded-lg text-on-surface hover:bg-surface-container"
                aria-label="Menüyü aç"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-h3 md:text-[26px] font-semibold leading-tight text-on-surface truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-body-sm text-on-surface-variant mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {actions}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary text-label-sm font-bold flex items-center justify-center">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="text-label-md text-on-surface">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-label-md text-on-surface-variant hover:text-error hover:bg-error-container/40 transition"
                aria-label="Çıkış"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline">Çıkış</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-[1600px] w-full">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-primary text-on-primary border-t border-white/10">
        <div className="grid grid-cols-5 gap-1 px-1 py-1.5">
          {NAV.slice(0, 5).map(({ href, shortLabel, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors",
                  active
                    ? "bg-secondary text-on-secondary"
                    : "text-on-primary-container hover:text-white",
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
