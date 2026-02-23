"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrdersStore } from "@/stores/ordersStore";

const statusSteps = [
  "placed",
  "accepted_by_restaurant",
  "preparing",
  "ready_for_pickup",
  "picked_up",
  "delivered"
] as const;

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const order = useOrdersStore((s) => s.orders.find((o) => o.id === orderId) ?? null);
  const refreshOrder = useOrdersStore((s) => s.refreshOrder);

  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setBusy(true);
      try {
        await refreshOrder(orderId);
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    const timer = setInterval(() => {
      refreshOrder(orderId);
    }, 15_000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId, refreshOrder]);

  const currentStatus = order?.status ?? "placed";
  const currentIndex = statusSteps.indexOf(currentStatus as any);
  const progress = currentIndex >= 0 ? currentIndex : 0;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="stack">
        <div className="card" style={{ padding: 18 }}>
          <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
            <div>
              <h1 className="h1">Order Tracking</h1>
              <p className="small" style={{ marginTop: 8 }}>
                Order ID: <code>{orderId}</code> {busy ? "• refreshing..." : ""}
              </p>
            </div>
            <button className="btn" onClick={() => refreshOrder(orderId)}>
              Refresh
            </button>
          </div>

          <div className="hr" />

          <div className="row" style={{ flexWrap: "wrap", gap: 10 }}>
            <span className="badge">Status: {currentStatus}</span>
            {order ? <span className="badge">Total: ${order.total.toFixed(2)}</span> : null}
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
              {statusSteps.map((s, idx) => {
                const done = idx <= progress;
                return (
                  <div
                    key={s}
                    className="card"
                    style={{
                      padding: 12,
                      background: done ? "rgba(34,197,94,0.10)" : "rgba(255,255,255,0.03)",
                      borderColor: done ? "rgba(34,197,94,0.35)" : "var(--border)"
                    }}
                  >
                    <strong style={{ textTransform: "capitalize" }}>{s.replaceAll("_", " ")}</strong>
                    <div className="small" style={{ marginTop: 6 }}>
                      {done ? "Completed" : "Pending"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h2 className="h2">Items</h2>
          <div className="hr" />
          {!order ? <p className="small">Order details not loaded yet.</p> : null}
          {order ? (
            <div className="stack">
              {order.items.map((it) => (
                <div key={it.menuItemId} className="row" style={{ justifyContent: "space-between" }}>
                  <span className="small">
                    {it.quantity}× {it.name}
                  </span>
                  <span className="small">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="card" style={{ padding: 18 }}>
          <h2 className="h2">Real-time updates</h2>
          <div className="hr" />
          <p className="small" style={{ margin: 0 }}>
            If backend WebSocket is available (NEXT_PUBLIC_WS_URL), status changes should update automatically via WS events.
          </p>
        </div>
      </div>
    </main>
  );
}
