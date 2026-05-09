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
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-graphite">Dashboard</p>
      <h1 className="mt-4 font-serif text-5xl text-ink">Print operations.</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-graphite">{label}</p>
            <p className="mt-4 font-serif text-4xl text-ink">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-10">
        <AdminOrdersManager />
      </div>
    </section>
  );
}
