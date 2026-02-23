"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { CustomerDashboard } from "@/components/dashboards/CustomerDashboard";
import { RestaurantDashboard } from "@/components/dashboards/RestaurantDashboard";
import { CourierDashboard } from "@/components/dashboards/CourierDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);

  React.useEffect(() => {
    if (!session) router.replace("/auth/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <main className="container" style={{ padding: "28px 0" }}>
      {session.user.role === "customer" ? <CustomerDashboard /> : null}
      {session.user.role === "restaurant" ? <RestaurantDashboard /> : null}
      {session.user.role === "courier" ? <CourierDashboard /> : null}
      {session.user.role === "admin" ? <AdminDashboard /> : null}
    </main>
  );
}
