"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isAdminAuthenticated, loginAdmin } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/defne");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const session = loginAdmin(username, password);
    if (session) {
      router.replace("/admin/defne");
    } else {
      setError("Kullanıcı adı veya şifre hatalı");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 hero-gradient">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo.png"
            alt="KAMPANYATAKİP"
            width={240}
            height={48}
            priority
            className="h-10 w-auto object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <p className="mt-3 text-white/70 text-sm tracking-wide">
            Şeffaf Bağış Takip Sistemi
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(0,24,53,0.25)] border border-outline-variant overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h1 className="text-h3 font-semibold text-on-surface leading-tight">
                  Kampanya Yönetim Paneli
                </h1>
                <p className="text-body-sm text-on-surface-variant">
                  Minik Defne Kampanyası
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            <div>
              <label htmlFor="username" className="block text-label-md text-on-surface mb-1.5">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                  placeholder="kullanıcı adınız"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-label-md text-on-surface mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-error-container px-3 py-2.5 text-body-sm text-on-error-container border border-error/20">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>

            <div className="rounded-lg bg-surface-container-low px-3 py-2.5 text-label-sm text-on-surface-variant text-center">
              Demo: <span className="font-semibold">defne</span> / <span className="font-semibold">demo2026</span>
            </div>
          </form>
        </div>

        <p className="text-center text-white/60 text-label-sm mt-6">
          © 2026 KAMPANYATAKİP — Şeffaf Bağış Takip Sistemi
        </p>
      </div>
    </div>
  );
}
