"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminButton,
  AdminEmptyState,
  AdminError,
  AdminMetricCard,
  AdminPageHeader,
  AdminPanel,
  AdminToolbar,
  adminInputClass,
  cx
} from "@/components/AdminUI";
import { adminFetch, getAdminToken } from "@/lib/admin-client";
import { DEMO_ADMIN_SERVICES, filterDemoAdminOrders, type DemoAdminOrder } from "@/lib/admin-demo-data";
import type { OrderRow, OrderStatus, ServiceRow } from "@/types/database";
import { orderStatuses, paymentStatuses } from "@/lib/validations/order";
import { StatusBadge } from "./StatusBadge";

type AdminOrder = (OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
}) | DemoAdminOrder;

type FulfillmentFilter = "all" | "delivery" | "pickup";

function currency(value: number) {
  return `NPR ${Math.round(value).toLocaleString("en-IN")}`;
}

function orderValue(order: AdminOrder) {
  return order.total_estimate ?? order.quantity * 120;
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function whatsappHref(order: AdminOrder) {
  if (order.whatsapp_link) return order.whatsapp_link;
  const digits = order.phone?.replace(/\D/g, "");
  if (!digits) return null;
  const normalized = digits.startsWith("977") ? digits : `977${digits.replace(/^0+/, "")}`;
  return `https://wa.me/${normalized}`;
}

function serviceName(order: AdminOrder) {
  return order.services?.title ?? order.service_id ?? "Custom print";
}

function designName(order: AdminOrder) {
  return order.product_templates?.title ?? order.product_designs?.title ?? "Custom upload";
}

function designMethodLabel(method: string) {
  if (method === "need_design") return "Needs design";
  if (method === "email_design") return "Email design";
  return "Uploaded";
}

function hasDelivery(order: AdminOrder) {
  return Boolean(order.delivery_distance_km || order.customer_lat || order.customer_lng);
}

function isPdfUrl(url?: string | null) {
  if (!url) return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [fulfillment, setFulfillment] = useState<FulfillmentFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders(nextStatus = status, nextPaymentStatus = paymentStatus, nextServiceId = serviceId) {
    setIsLoading(true);
    setError("");

    try {
      const payload = await adminFetch(`/api/admin/orders?status=${nextStatus}&payment_status=${nextPaymentStatus}&service_id=${nextServiceId}`);
      setOrders(payload.orders ?? []);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Could not load orders.";
      if (message === "Admin database is not configured.") {
        setOrders(filterDemoAdminOrders(nextStatus, nextPaymentStatus, nextServiceId));
        return;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    adminFetch("/api/admin/services")
      .then((payload) => setServices(payload.services ?? []))
      .catch((servicesError) => {
        if (servicesError instanceof Error && servicesError.message === "Admin database is not configured.") {
          setServices(DEMO_ADMIN_SERVICES);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(orderId: string, nextStatus: OrderStatus) {
    try {
      await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus })
      });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Order status updated." }));
      await loadOrders();
    } catch (updateError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: updateError instanceof Error ? updateError.message : "Could not update order." }));
    }
  }

  async function updatePaymentStatus(orderId: string, nextPaymentStatus: string) {
    try {
      await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: nextPaymentStatus })
      });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Payment status updated." }));
      await loadOrders();
    } catch (updateError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: updateError instanceof Error ? updateError.message : "Could not update payment." }));
    }
  }

  async function openFile(path: string) {
    const token = await getAdminToken();
    if (!token) return;
    window.open(`/api/admin/files/${encodeURIComponent(path)}?token=${token}`, "_blank", "noopener,noreferrer");
  }

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (fulfillment === "delivery" && !hasDelivery(order)) return false;
      if (fulfillment === "pickup" && hasDelivery(order)) return false;
      if (!normalized) return true;

      return [
        order.id,
        order.customer_name,
        order.email,
        order.phone ?? "",
        serviceName(order),
        designName(order),
        order.paper_size ?? "",
        order.paper_type ?? "",
        order.status,
        order.payment_status
      ].join(" ").toLowerCase().includes(normalized);
    });
  }, [orders, query, fulfillment]);

  const metrics = useMemo(() => {
    const open = visibleOrders.filter((order) => !["delivered", "cancelled"].includes(order.status));
    const ready = visibleOrders.filter((order) => order.status === "ready");
    const unpaid = visibleOrders.filter((order) => ["pending", "failed"].includes(order.payment_status));
    const value = visibleOrders.reduce((sum, order) => sum + orderValue(order), 0);

    return { open, ready, unpaid, value };
  }, [visibleOrders]);

  function changeStatus(nextStatus: string) {
    setStatus(nextStatus);
    loadOrders(nextStatus, paymentStatus, serviceId);
  }

  function changePaymentStatus(nextPaymentStatus: string) {
    setPaymentStatus(nextPaymentStatus);
    loadOrders(status, nextPaymentStatus, serviceId);
  }

  function changeService(nextServiceId: string) {
    setServiceId(nextServiceId);
    loadOrders(status, paymentStatus, nextServiceId);
  }

  function FileActions({ order }: { order: AdminOrder }) {
    return (
      <div className="flex flex-wrap gap-2">
        {order.final_design_url ? (
          <AdminButton href={order.final_design_url} variant={isPdfUrl(order.final_design_url) ? "primary" : "secondary"}>
            {isPdfUrl(order.final_design_url) ? "Final PDF" : "Legacy final"}
          </AdminButton>
        ) : null}
        {order.design_file_url ? (
          <AdminButton onClick={() => openFile(order.design_file_url!)} variant="secondary">Customer upload</AdminButton>
        ) : null}
        <AdminButton href="/admin/design-work" variant="secondary">Design work</AdminButton>
        {!order.final_design_url && !order.design_file_url ? <span className="text-xs font-semibold text-graphite">No artwork</span> : null}
      </div>
    );
  }

  function OrderControls({ order }: { order: AdminOrder }) {
    return (
      <div className="grid gap-2">
        <select className={cx(adminInputClass, "min-h-9 py-0 text-xs")} onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)} value={order.status}>
          {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className={cx(adminInputClass, "min-h-9 py-0 text-xs")} onChange={(event) => updatePaymentStatus(order.id, event.target.value)} value={order.payment_status}>
          {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
    );
  }

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        description="Search customer work, update production/payment states, open final files, and continue WhatsApp handoff."
        eyebrow="Orders"
        title="Production queue"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard helper={`${visibleOrders.length} matching orders`} label="Queue value" tone="press" value={isLoading ? "Loading..." : currency(metrics.value)} />
        <AdminMetricCard helper="Received, designing, printing, ready" label="Open" tone="steel" value={isLoading ? "..." : String(metrics.open.length)} />
        <AdminMetricCard helper="Awaiting pickup or delivery" label="Ready" tone="sage" value={isLoading ? "..." : String(metrics.ready.length)} />
        <AdminMetricCard helper="Pending or failed payment" label="Needs payment" tone="brass" value={isLoading ? "..." : String(metrics.unpaid.length)} />
      </div>

      <AdminToolbar>
        <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
          <input
            className={adminInputClass}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order ID, customer, phone, service, template, status"
            type="search"
            value={query}
          />
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:min-w-[760px]">
            <select className={adminInputClass} onChange={(event) => changeStatus(event.target.value)} value={status}>
              <option value="all">All statuses</option>
              {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className={adminInputClass} onChange={(event) => changePaymentStatus(event.target.value)} value={paymentStatus}>
              <option value="all">All payments</option>
              {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select className={adminInputClass} onChange={(event) => changeService(event.target.value)} value={serviceId}>
              <option value="all">All products</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
            </select>
            <select className={adminInputClass} onChange={(event) => setFulfillment(event.target.value as FulfillmentFilter)} value={fulfillment}>
              <option value="all">All fulfillment</option>
              <option value="delivery">Delivery/location</option>
              <option value="pickup">Pickup/no location</option>
            </select>
          </div>
        </div>
      </AdminToolbar>

      <AdminError message={error} />

      {!error && !isLoading && visibleOrders.length === 0 ? (
        <AdminEmptyState title="No orders found" description="Adjust search or filters to see more customer print jobs." />
      ) : null}

      {visibleOrders.length > 0 ? (
        <>
          <AdminPanel className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1240px] text-left text-sm">
                <thead className="bg-mist text-[11px] uppercase tracking-[0.08em] text-graphite">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Specs</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Files</th>
                    <th className="px-4 py-3">Fulfillment</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {visibleOrders.map((order) => (
                    <tr className="align-top hover:bg-mist/60" key={order.id}>
                      <td className="px-4 py-4">
                        <p className="font-mono text-xs font-black text-ink">{shortId(order.id)}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{formatDate(order.created_at)}</p>
                        <p className="mt-3 text-sm font-black text-ink">{currency(orderValue(order))}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{order.customer_name}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{order.phone ?? "No phone"}</p>
                        <p className="mt-1 max-w-[13rem] truncate text-xs text-graphite">{order.email}</p>
                        {whatsappHref(order) ? <AdminButton className="mt-3 min-h-8 px-3 text-xs" href={whatsappHref(order) ?? undefined} variant="secondary">WhatsApp</AdminButton> : null}
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{serviceName(order)}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{designName(order)}</p>
                        <span className="mt-3 inline-flex rounded-md bg-mist px-2 py-1 text-xs font-black text-graphite">{designMethodLabel(order.design_method)}</span>
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold leading-5 text-graphite">
                        <p><span className="text-ink">Qty:</span> {order.quantity}</p>
                        <p><span className="text-ink">Size:</span> {order.paper_size ?? "Not set"}</p>
                        <p><span className="text-ink">Paper:</span> {order.paper_type ?? "Not set"}</p>
                        {order.notes ? <p className="mt-2 max-w-[16rem] line-clamp-3">{order.notes}</p> : null}
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid gap-3">
                          <StatusBadge status={order.status} />
                          <span className="rounded-md bg-mist px-2 py-1 text-xs font-black capitalize text-graphite">{order.payment_status}</span>
                          <OrderControls order={order} />
                        </div>
                      </td>
                      <td className="px-4 py-4"><FileActions order={order} /></td>
                      <td className="px-4 py-4 text-xs font-semibold leading-5 text-graphite">
                        <p>{hasDelivery(order) ? "Delivery" : "Pickup / no location"}</p>
                        <p>{order.delivery_distance_km ? `${order.delivery_distance_km} km` : "No distance"}</p>
                        <p>{order.estimated_delivery_minutes ? `${order.estimated_delivery_minutes} min delivery` : null}</p>
                        <p>{order.estimated_completion_minutes ? `${order.estimated_completion_minutes} min print` : null}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid gap-2">
                          {whatsappHref(order) ? <AdminButton href={whatsappHref(order) ?? undefined} variant="primary">Open chat</AdminButton> : null}
                          <AdminButton href={`/track-order`} variant="secondary">Track page</AdminButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <div className="grid gap-3 lg:hidden">
            {visibleOrders.map((order) => (
              <AdminPanel className="p-4" key={order.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-black text-press">{shortId(order.id)}</p>
                    <h2 className="mt-1 truncate text-lg font-black text-ink">{order.customer_name}</h2>
                    <p className="mt-1 text-xs font-semibold text-graphite">{formatDate(order.created_at)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="mt-4 grid gap-3 rounded-lg bg-mist p-3 text-sm">
                  <div>
                    <p className="font-black text-ink">{serviceName(order)}</p>
                    <p className="mt-1 text-xs font-semibold text-graphite">{designName(order)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-graphite">
                    <span>Qty {order.quantity}</span>
                    <span>{currency(orderValue(order))}</span>
                    <span className="capitalize">{order.payment_status}</span>
                    <span>{hasDelivery(order) ? "Delivery" : "Pickup"}</span>
                  </div>
                </div>
                <div className="mt-4 grid gap-3">
                  <OrderControls order={order} />
                  <div className="flex flex-wrap gap-2">
                    {whatsappHref(order) ? <AdminButton href={whatsappHref(order) ?? undefined}>WhatsApp</AdminButton> : null}
                    <FileActions order={order} />
                  </div>
                </div>
              </AdminPanel>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
