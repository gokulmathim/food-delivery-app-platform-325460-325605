import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container" style={{ padding: "28px 0" }}>
      <div className="stack">
        <div className="card" style={{ padding: 18 }}>
          <h1 className="h1">Food Delivery</h1>
          <p className="small" style={{ marginTop: 8 }}>
            Browse restaurants, manage orders, and receive real-time notifications. This is a scaffolded frontend wired to backend
            REST/WS via environment variables.
          </p>
          <div className="row" style={{ marginTop: 12, flexWrap: "wrap" }}>
            <Link className="btn btnPrimary" href="/restaurants">
              Browse Restaurants
            </Link>
            <Link className="btn" href="/auth/login">
              Login
            </Link>
            <Link className="btn" href="/auth/register">
              Register
            </Link>
            <Link className="btn" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div className="card" style={{ padding: 16 }}>
            <h2 className="h2">Customer</h2>
            <p className="small">Browse menus, cart & checkout, order tracking, notifications.</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h2 className="h2">Restaurant Partner</h2>
            <p className="small">Manage menus and incoming orders.</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h2 className="h2">Delivery Partner</h2>
            <p className="small">Accept deliveries and update order status.</p>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h2 className="h2">Admin</h2>
            <p className="small">Users/restaurants/orders overview and moderation.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
