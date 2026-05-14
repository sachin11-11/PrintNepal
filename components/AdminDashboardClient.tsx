"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-client";
import type { OrderRow } from "@/types/database";
import { AdminOrdersManager } from "./AdminOrdersManager";

export function AdminDashboardClient() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    adminFetch("/api/admin/orders")
      .then((payload) => setOrders(payload.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  const metrics = useMemo(
    () => [
      ["Open orders", orders.filter((order) => !["delivered", "cancelled"].includes(order.status)).length.toString()],
      ["Designing", orders.filter((order) => order.status === "designing").length.toString()],
      ["Printing", orders.filter((order) => order.status === "printing").length.toString()],
      ["Ready", orders.filter((order) => order.status === "ready").length.toString()]
    ],
    [orders]
  );

  return (
    <section>
      <div className="atelier-hero p-5 sm:p-7">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-4 text-5xl font-black text-ink">Print operations.</h1>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="atelier-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-graphite">{label}</p>
            <p className="mt-4 text-5xl font-black text-press">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <AdminOrdersManager />
      </div>
    </section>
  );
}
