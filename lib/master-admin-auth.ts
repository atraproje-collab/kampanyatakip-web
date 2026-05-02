"use client";

const STORAGE_KEY = "kt_master_admin_session";
const MASTER_USER = "admin";
const MASTER_PASS = "kampanya2026";

export type MasterAdminSession = {
  username: string;
  loggedInAt: number;
};

export function loginMasterAdmin(
  username: string,
  password: string,
): MasterAdminSession | null {
  if (
    username.trim().toLowerCase() === MASTER_USER &&
    password === MASTER_PASS
  ) {
    const session: MasterAdminSession = {
      username: MASTER_USER,
      loggedInAt: Date.now(),
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
    return session;
  }
  return null;
}

export function logoutMasterAdmin() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function getMasterAdminSession(): MasterAdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MasterAdminSession;
  } catch {
    return null;
  }
}

export function isMasterAdminAuthenticated(): boolean {
  return getMasterAdminSession() !== null;
}
