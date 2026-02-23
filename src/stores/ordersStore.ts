"use client";

import { create } from "zustand";
import type { Order, OrderStatus } from "@/lib/types";
import { apiRequest } from "@/lib/apiClient";
import { useAuthStore } from "@/stores/authStore";

type OrdersState = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;

  listMyOrders: () => Promise<void>;
  createOrder: (input: {
    restaurantId: string;
    items: Array<{ menuItemId: string; quantity: number }>;
  }) => Promise<Order>;
  refreshOrder: (orderId: string) => Promise<Order | null>;
  setOrderStatus: (orderId: string, status: OrderStatus) => void; // used by WS updates
};

function nowIso() {
  return new Date().toISOString();
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,

  listMyOrders: async () => {
    const token = useAuthStore.getState().session?.accessToken ?? null;
    set({ isLoading: true, error: null });
    try {
      const res = await apiRequest<Order[]>("/orders/me", { token });
      set({ orders: res, isLoading: false });
    } catch (e: any) {
      // Mock fallback
      set({ isLoading: false, error: e?.message ?? "Failed to load orders" });
    }
  },

  createOrder: async ({ restaurantId, items }) => {
    const token = useAuthStore.getState().session?.accessToken ?? null;
    try {
      const created = await apiRequest<Order>("/orders", {
        method: "POST",
        token,
        body: { restaurantId, items }
      });
      set({ orders: [created, ...get().orders] });
      return created;
    } catch {
      const total = 0; // UI computes totals; backend will compute in real impl.
      const mock: Order = {
        id: crypto.randomUUID(),
        status: "placed",
        restaurantId,
        customerId: useAuthStore.getState().session?.user.id ?? "unknown",
        items: items.map((it) => ({ menuItemId: it.menuItemId, name: "Item", price: 0, quantity: it.quantity })),
        total,
        createdAt: nowIso(),
        updatedAt: nowIso()
      };
      set({ orders: [mock, ...get().orders] });
      return mock;
    }
  },

  refreshOrder: async (orderId) => {
    const token = useAuthStore.getState().session?.accessToken ?? null;
    try {
      const order = await apiRequest<Order>(`/orders/${orderId}`, { token });
      set({ orders: get().orders.map((o) => (o.id === orderId ? order : o)) });
      return order;
    } catch {
      return get().orders.find((o) => o.id === orderId) ?? null;
    }
  },

  setOrderStatus: (orderId, status) => {
    set({
      orders: get().orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: nowIso() } : o))
    });
  }
}));
