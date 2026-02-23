"use client";

import { create } from "zustand";
import type { AuthSession, AuthUser, UserRole } from "@/lib/types";
import { apiRequest } from "@/lib/apiClient";
import { clearSession, loadSession, saveSession } from "@/lib/storage";

type AuthState = {
  session: AuthSession | null;
  isHydrated: boolean;
  hydrate: () => void;

  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;

  updateProfile: (params: { name: string }) => Promise<void>;
};

function mockRoleFromEmail(email: string): UserRole {
  const lower = email.toLowerCase();
  if (lower.includes("+admin")) return "admin";
  if (lower.includes("+restaurant")) return "restaurant";
  if (lower.includes("+courier")) return "courier";
  return "customer";
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  isHydrated: false,

  hydrate: () => {
    const session = loadSession();
    set({ session, isHydrated: true });
  },

  login: async ({ email, password }) => {
    // Try backend first.
    try {
      const res = await apiRequest<AuthSession>("/auth/login", { method: "POST", body: { email, password } });
      saveSession(res);
      set({ session: res });
      return;
    } catch {
      // Dev-friendly fallback to allow UI progress while backend is built.
      const user: AuthUser = {
        id: crypto.randomUUID(),
        email,
        name: email.split("@")[0],
        role: mockRoleFromEmail(email)
      };
      const session: AuthSession = { accessToken: "mock-token", user };
      saveSession(session);
      set({ session });
    }
  },

  register: async ({ name, email, password }) => {
    try {
      const res = await apiRequest<AuthSession>("/auth/register", { method: "POST", body: { name, email, password } });
      saveSession(res);
      set({ session: res });
      return;
    } catch {
      const user: AuthUser = { id: crypto.randomUUID(), email, name, role: mockRoleFromEmail(email) };
      const session: AuthSession = { accessToken: "mock-token", user };
      saveSession(session);
      set({ session });
    }
  },

  logout: () => {
    clearSession();
    set({ session: null });
  },

  updateProfile: async ({ name }) => {
    const s = get().session;
    if (!s) return;

    try {
      const updated = await apiRequest<AuthUser>("/me", { method: "PATCH", token: s.accessToken, body: { name } });
      const session: AuthSession = { ...s, user: updated };
      saveSession(session);
      set({ session });
    } catch {
      const session: AuthSession = { ...s, user: { ...s.user, name } };
      saveSession(session);
      set({ session });
    }
  }
}));
