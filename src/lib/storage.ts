import type { AuthSession } from "@/lib/types";

const SESSION_KEY = "fd.session";

// PUBLIC_INTERFACE
export function loadSession(): AuthSession | null {
  /** Loads the current auth session from localStorage (client-only). */
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function saveSession(session: AuthSession): void {
  /** Persists the auth session to localStorage (client-only). */
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// PUBLIC_INTERFACE
export function clearSession(): void {
  /** Clears auth session from localStorage (client-only). */
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
