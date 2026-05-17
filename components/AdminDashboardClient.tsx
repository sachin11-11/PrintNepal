"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminButton, AdminEmptyState, AdminError, AdminMetricCard, AdminPageHeader, AdminPanel, cx } from "@/components/AdminUI";
import { adminFetch } from "@/lib/admin-client";
import { DEMO_ADMIN_ORDERS, type DemoAdminOrder } from "@/lib/admin-demo-data";
import type { OrderRow } from "@/types/database";
import { StatusBadge } from "./StatusBadge";

type DashboardOrder = (OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
}) | DemoAdminOrder;

const productionStatuses = ["received", "designing", "printing", "ready", "delivered", "cancelled"];
const paymentStatuses = ["pending", "confirmed", "paid", "failed", "refunded"];

function currency(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-IN")}`;
}

function orderValue(order: DashboardOrder) {
  return order.total_estimate ?? order.quantity * 120;
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function serviceName(order: DashboardOrder) {
  return order.services?.title ?? order.product_templates?.title ?? order.product_designs?.title ?? "Custom print";
}

function barTone(status: string) {
  if (status === "ready" || status === "delivered" || status === "paid") return "bg-cyan";
  if (status === "printing" || status === "confirmed") return "bg-press";
  if (status === "designing" || status === "pending") return "bg-brass";
  if (status === "cancelled" || status === "failed" || status === "refunded") return "bg-red-500";
  return "bg-steel";
}

export function AdminDashboardClient() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/orders")
      .then((payload) => setOrders(payload.orders ?? []))
      .catch((loadError) => {
        const message = loadError instanceof Error ? loadError.message : "Could not load dashboard.";
        if (message === "Admin database is not configured.") {
          setOrders(DEMO_ADMIN_ORDERS);
          return;
        }
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const summary = useMemo(() => {
    const openOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
    const readyOrders = orders.filter((order) => order.status === "ready");
    const revenue = orders.reduce((sum, order) => sum + orderValue(order), 0);
    const confirmedRevenue = orders
      .filter((order) => ["confirmed", "paid"].includes(order.payment_status))
      .reduce((sum, order) => sum + orderValue(order), 0);
    const averageOrder = orders.length ? revenue / orders.length : 0;

    return { openOrders, readyOrders, revenue, confirmedRevenue, averageOrder };
  }, [orders]);

  const statusCounts = useMemo(() => {
    const max = Math.max(...productionStatuses.map((status) => orders.filter((order) => order.status === status).length), 1);
    return productionStatuses.map((status) => {
      const count = orders.filter((order) => order.status === status).length;
      return { status, count, width: `${Math.max(count ? 8 : 0, (count / max) * 100)}%` };
    });
  }, [orders]);

  const paymentCounts = useMemo(() => {
    const max = Math.max(...paymentStatuses.map((status) => orders.filter((order) => order.payment_status === status).length), 1);
    return paymentStatuses.map((status) => {
      const count = orders.filter((order) => order.payment_status === status).length;
      return { status, count, width: `${Math.max(count ? 8 : 0, (count / max) * 100)}%` };
    });
  }, [orders]);

  const recentOrders = orders.slice(0, 7);
  const priorityOrders = summary.openOrders
    .filter((order) => ["received", "designing", "printing", "ready"].includes(order.status))
    .slice(0, 6);

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        action={<AdminButton href="/admin/orders">Open order queue</AdminButton>}
        description="A production-first view of revenue, payment health, and the print jobs that need attention."
        eyebrow="Dashboard"
        title="Print operations"
      />

      <AdminError message={error} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard helper={`${orders.length} visible orders`} label="Total revenue" tone="press" value={isLoading ? "Loading..." : currency(summary.revenue)} />
        <AdminMetricCard helper={`${currency(summary.averageOrder)} average order`} label="Confirmed revenue" tone="sage" value={isLoading ? "Loading..." : currency(summary.confirmedRevenue)} />
        <AdminMetricCard helper={`${summary.readyOrders.length} ready now`} label="Open orders" tone="steel" value={isLoading ? "..." : String(summary.openOrders.length)} />
        <AdminMetricCard helper="Awaiting pickup or delivery" label="Ready orders" tone="brass" value={isLoading ? "..." : String(summary.readyOrders.length)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Production pipeline</p>
              <h2 className="mt-2 text-xl font-black text-ink">Status load</h2>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-black text-graphite">{summary.openOrders.length} active</span>
          </div>
          <div className="mt-5 grid gap-3">
            {statusCounts.map((item) => (
              <div className="grid gap-2" key={item.status}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold capitalize text-ink">{item.status}</span>
                  <span className="font-black text-graphite">{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-mist">
                  <div className={cx("h-full rounded-full", barTone(item.status))} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Payment summary</p>
              <h2 className="mt-2 text-xl font-black text-ink">Cash status</h2>
            </div>
            <AdminButton href="/admin/orders" variant="secondary">Review</AdminButton>
          </div>
          <div className="mt-5 grid gap-3">
            {paymentCounts.map((item) => (
              <div className="rounded-lg border border-[var(--line)] bg-mist/60 p-3" key={item.status}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black capitalize text-ink">{item.status}</span>
                  <span className="text-sm font-black text-graphite">{item.count}</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className={cx("h-full rounded-full", barTone(item.status))} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <AdminPanel className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Recent orders</p>
              <h2 className="mt-2 text-xl font-black text-ink">Latest customer work</h2>
            </div>
            <AdminButton href="/admin/orders" variant="secondary">View all</AdminButton>
          </div>
          {recentOrders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-mist text-[11px] uppercase tracking-[0.08em] text-graphite">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Work</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {recentOrders.map((order) => (
                    <tr className="hover:bg-mist/60" key={order.id}>
                      <td className="px-4 py-3 font-mono text-xs font-bold text-ink">{shortId(order.id)}</td>
                      <td className="px-4 py-3">
                        <p className="font-black text-ink">{order.customer_name}</p>
                        <p className="mt-1 text-xs text-graphite">{formatDate(order.created_at)}</p>
                      </td>
                      <td className="px-4 py-3 text-graphite">{serviceName(order)}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-right font-black text-ink">{currency(orderValue(order))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <AdminEmptyState title="No orders yet" description="Orders will appear here as customers submit print jobs." />
            </div>
          )}
        </AdminPanel>

        <div className="grid gap-5">
          <AdminPanel className="p-4 sm:p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Priority queue</p>
            <div className="mt-4 grid gap-3">
              {priorityOrders.length ? priorityOrders.map((order) => (
                <a className="rounded-lg border border-[var(--line)] bg-mist/60 p-3 transition hover:border-press hover:bg-white" href="/admin/orders" key={order.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-ink">{order.customer_name}</p>
                      <p className="mt-1 truncate text-xs font-semibold text-graphite">{serviceName(order)}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </a>
              )) : <AdminEmptyState title="Queue clear" description="No active production jobs are visible." />}
            </div>
          </AdminPanel>

          <AdminPanel className="p-4 sm:p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Quick actions</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <AdminButton href="/admin/orders" variant="secondary">Orders</AdminButton>
              <AdminButton href="/admin/services" variant="secondary">Services</AdminButton>
              <AdminButton href="/admin/designs" variant="secondary">Designs</AdminButton>
              <AdminButton href="/admin/materials" variant="secondary">Materials</AdminButton>
              <AdminButton className="col-span-2" href="/admin/categories" variant="secondary">Templates</AdminButton>
            </div>
          </AdminPanel>
        </div>
      </div>
    </section>
  );
}
