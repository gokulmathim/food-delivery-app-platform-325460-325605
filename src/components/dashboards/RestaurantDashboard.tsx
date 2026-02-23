"use client";

import Link from "next/link";

export function RestaurantDashboard() {
  return (
    <div className="stack">
      <div className="card" style={{ padding: 18 }}>
        <h1 className="h1">Restaurant Dashboard</h1>
        <p className="small" style={{ marginTop: 8 }}>
          Manage menu items and incoming orders. (Backend endpoints will power these actions.)
        </p>
        <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
          <Link className="btn btnPrimary" href="/restaurants">
            View restaurants (public)
          </Link>
          <Link className="btn" href="/orders">
            Orders feed
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <h2 className="h2">Next steps</h2>
        <div className="hr" />
        <ul className="small" style={{ margin: 0, paddingLeft: 18 }}>
          <li>Menu management UI (create/update items)</li>
          <li>Accept/prepare/ready statuses for orders</li>
          <li>Kitchen display view</li>
        </ul>
      </div>
    </div>
  );
}
