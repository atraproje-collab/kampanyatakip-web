"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMasterAdminSession,
  isMasterAdminAuthenticated,
  logoutMasterAdmin,
} from "@/lib/master-admin-auth";

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
};

const NAV: NavItem[] = [
  { href: "/master-admin", label: "Dashboard", shortLabel: "Bakış", icon: LayoutDashboard },
  { href: "/master-admin/kampanyalar", label: "Kampanyalar", shortLabel: "Kampanya", icon: Megaphone },
  { href: "/master-admin/kullanicilar", label: "Kullanıcılar", shortLabel: "Kullanıcı", icon: Users },
  { href: "/master-admin/finansal", label: "Finansal", shortLabel: "Finans", icon: DollarSign },
  { href: "/master-admin/sistem", label: "Sistem Sağlığı", shortLabel: "Sistem", icon: Activity },
  { href: "/master-admin/ayarlar", label: "Ayarlar", shortLabel: "Ayar", icon: Settings },
];

interface MasterAdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function MasterAdminLayout({
  title,
  subtitle,
  actions,
  children,
}: MasterAdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMasterAdminAuthenticated()) {
      router.replace("/master-admin/login");
      return;
    }
    setUsername(getMasterAdminSession()?.username ?? "");
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logoutMasterAdmin();
    router.replace("/master-admin/login");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-on-surface-variant text-body-sm">Yükleniyor…</div>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === "/master-admin"
      ? pathname === href
      : pathname?.startsWith(href);

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col bg-primary text-on-primary fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/master-admin" className="flex items-center gap-3">
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
            Yönetim Merkezi
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
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

      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

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
              <Link
                key={item.href}
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

      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 min-w-0">
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
                <p className="hidden md:block text-label-sm text-on-surface-variant uppercase tracking-wide">
                  KAMPANYATAKİP Yönetim Merkezi
                </p>
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
                <span className="text-label-md text-on-surface">
                  {username}
                </span>
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

        <main className="flex-1 px-4 md:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-[1600px] w-full">
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-primary text-on-primary border-t border-white/10">
        <div className="grid grid-cols-6 gap-1 px-1 py-1.5">
          {NAV.map(({ href, shortLabel, icon: Icon }) => {
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
