"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useOrdersStore } from "@/stores/ordersStore";

export default function OrdersPage() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const { orders, isLoading, error, listMyOrders } = useOrdersStore();

  React.useEffect(() => {
    if (!session) router.replace("/auth/login");
  }, [session, router]);

  React.useEffect(() => {
    if (session) listMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!session) return null;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="card" style={{ padding: 18 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h1 className="h1">Orders</h1>
          <button className="btn" onClick={listMyOrders}>
            Refresh
          </button>
        </div>
        <div className="hr" />
        {isLoading ? <p className="small">Loading...</p> : null}
        {error ? (
          <div className="badge" style={{ borderColor: "rgba(239,68,68,0.45)", color: "rgba(254,202,202,0.95)" }}>
            {error}
          </div>
        ) : null}

        {!isLoading && !orders.length ? <p className="small">No orders found.</p> : null}

        <div className="stack">
          {orders.map((o) => (
            <div key={o.id} className="card" style={{ padding: 12, background: "rgba(255,255,255,0.03)" }}>
              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                <strong>Order {o.id.slice(0, 10)}</strong>
                <span className="badge">{o.status}</span>
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                Total: ${o.total.toFixed(2)} • Updated: {new Date(o.updatedAt).toLocaleString()}
              </div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btnPrimary" href={`/orders/${o.id}`}>
                  Track
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
