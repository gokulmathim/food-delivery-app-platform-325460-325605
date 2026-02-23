"use client";

import { create } from "zustand";
import type { NotificationMessage } from "@/lib/types";

type NotificationsState = {
  items: NotificationMessage[];
  unread: number;
  push: (n: NotificationMessage) => void;
  markAllRead: () => void;
  clear: () => void;
};

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  unread: 0,

  push: (n) =>
    set(() => ({
      items: [n, ...get().items].slice(0, 50),
      unread: get().unread + 1
    })),

  markAllRead: () => set({ unread: 0 }),

  clear: () => set({ items: [], unread: 0 })
}));
