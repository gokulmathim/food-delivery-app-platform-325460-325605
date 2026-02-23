"use client";

import { create } from "zustand";
import type { CartItem, MenuItem } from "@/lib/types";

type CartState = {
  restaurantId: string | null;
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  setQuantity: (menuItemId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  restaurantId: null,
  items: [],

  addItem: (item) =>
    set((state) => {
      // Enforce single-restaurant cart for simplicity.
      const nextRestaurantId = state.restaurantId ?? item.restaurantId;
      const shouldReset = state.restaurantId && state.restaurantId !== item.restaurantId;
      const baseItems = shouldReset ? [] : state.items;

      const idx = baseItems.findIndex((ci) => ci.item.id === item.id);
      const next = [...baseItems];
      if (idx >= 0) {
        next[idx] = { item: next[idx]!.item, quantity: next[idx]!.quantity + 1 };
      } else {
        next.push({ item, quantity: 1 });
      }
      return { restaurantId: nextRestaurantId, items: next };
    }),

  removeItem: (menuItemId) =>
    set((state) => {
      const next = state.items.filter((ci) => ci.item.id !== menuItemId);
      return { items: next, restaurantId: next.length ? state.restaurantId : null };
    }),

  setQuantity: (menuItemId, quantity) =>
    set((state) => {
      const q = Math.max(0, quantity);
      const next = state.items
        .map((ci) => (ci.item.id === menuItemId ? { ...ci, quantity: q } : ci))
        .filter((ci) => ci.quantity > 0);
      return { items: next, restaurantId: next.length ? state.restaurantId : null };
    }),

  clear: () => set({ items: [], restaurantId: null }),

  total: () => get().items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)
}));
