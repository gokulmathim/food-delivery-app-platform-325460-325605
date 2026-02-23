"use client";

import React from "react";
import Link from "next/link";
import { useOrdersStore } from "@/stores/ordersStore";

export function CustomerDashboard() {
  const { orders, listMyOrders, isLoading } = useOrdersStore();

  React.useEffect(() => {
    listMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stack">
      <div className="card" style={{ padding: 18 }}>
        <h1 className="h1">Customer Dashboard</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Browse restaurants, checkout, and track orders in real time (WebSocket updates when available).
        </p>
        <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <Link className="btn btnPrimary" href="/restaurants">
            Browse restaurants
          </Link>
          <Link className="btn" href="/cart">
            View cart
          </Link>
          <Link className="btn" href="/orders">
            My orders
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 className="h2">Recent Orders</h2>
          <Link className="btn" href="/orders">
            See all
          </Link>
        </div>
        <div className="hr" />
        {isLoading ? <p className="small">Loading...</p> : null}
        {!isLoading && !orders.length ? <p className="small">No orders yet.</p> : null}
        <div className="stack">
          {orders.slice(0, 3).map((o) => (
            <div key={o.id} className="card" style={{ padding: 12, background: "rgba(255,255,255,0.03)" }}>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <strong>Order {o.id.slice(0, 8)}</strong>
                <span className="badge">{o.status}</span>
              </div>
              <div className="small" style={{ marginTop: 6 }}>
                Total: ${o.total.toFixed(2)} • {new Date(o.createdAt).toLocaleString()}
              </div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn" href={`/orders/${o.id}`}>
                  Track order
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
