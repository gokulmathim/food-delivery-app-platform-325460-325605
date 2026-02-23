"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { useOrdersStore } from "@/stores/ordersStore";
import { WsClient } from "@/lib/wsClient";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const token = useAuthStore((s) => s.session?.accessToken ?? null);

  React.useEffect(() => {
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;

    const ws = new WsClient({
      token,
      onEvent: (evt) => {
        if (evt.type === "notification") {
          useNotificationsStore.getState().push(evt.payload);
        }
        if (evt.type === "order_status") {
          useOrdersStore.getState().setOrderStatus(evt.payload.orderId, evt.payload.status as any);
        }
      }
    });

    try {
      ws.connect();
    } catch {
      // If env not set or WS not available, ignore (UI still works with REST).
    }

    return () => ws.disconnect();
  }, [isHydrated, token]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
