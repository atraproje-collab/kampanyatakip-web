"use client";

const STORAGE_KEY = "kt_admin_session_defne";
const DEMO_USER = "defne";
const DEMO_PASS = "demo2026";

export type AdminSession = {
  username: string;
  loggedInAt: number;
};

export function loginAdmin(username: string, password: string): AdminSession | null {
  if (username.trim().toLowerCase() === DEMO_USER && password === DEMO_PASS) {
    const session: AdminSession = {
      username: DEMO_USER,
      loggedInAt: Date.now(),
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  }
  return null;
}

export function logoutAdmin() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}
