"use client";

import Link from "next/link";

export function CourierDashboard() {
  return (
    <div className="stack">
      <div className="card" style={{ padding: 18 }}>
        <h1 className="h1">Delivery Partner Dashboard</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Accept deliveries and update pickup/delivered status. WebSocket notifications will surface new assignments.
        </p>
        <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <Link className="btn btnPrimary" href="/orders">
            Delivery orders
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <h2 className="h2">Next steps</h2>
        <div className="hr" />
        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Assignment queue</li>
          <li>Map/route view (future)</li>
          <li>Status updates to backend</li>
        </ul>
      </div>
    </div>
  );
}
