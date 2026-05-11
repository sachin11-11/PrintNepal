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
      <div className="border-l-4 border-press bg-white/80 p-5">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-4 text-5xl font-black text-ink">Print operations.</h1>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="border border-ink/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-graphite">{label}</p>
            <p className="mt-4 text-4xl font-black text-ink">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <AdminOrdersManager />
      </div>
    </section>
  );
}
