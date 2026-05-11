"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch, getAdminToken } from "@/lib/admin-client";
import type { OrderRow, OrderStatus, ServiceRow } from "@/types/database";
import { orderStatuses, paymentStatuses } from "@/lib/validations/order";
import { StatusBadge } from "./StatusBadge";

type AdminOrder = OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
};

export function AdminOrdersManager() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [status, setStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders(nextStatus = status, nextPaymentStatus = paymentStatus, nextServiceId = serviceId) {
    setIsLoading(true);
    setError("");

    try {
      const payload = await adminFetch(`/api/admin/orders?status=${nextStatus}&payment_status=${nextPaymentStatus}&service_id=${nextServiceId}`);
      setOrders(payload.orders ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load orders.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    adminFetch("/api/admin/services").then((payload) => setServices(payload.services ?? [])).catch(() => {});
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

    if (!token) {
      return;
    }

    window.open(`/api/admin/files/${encodeURIComponent(path)}?token=${token}`, "_blank", "noopener,noreferrer");
  }

  const total = useMemo(() => orders.length, [orders]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Orders</p>
          <h1 className="mt-4 text-5xl font-black text-ink">Order queue.</h1>
          <p className="mt-3 text-sm text-graphite">{isLoading ? "Loading orders..." : `${total} orders`}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="min-h-11 border border-ink/10 bg-white px-4 text-sm font-semibold text-ink" onChange={(event) => {
            setStatus(event.target.value);
            loadOrders(event.target.value, paymentStatus, serviceId);
          }} value={status}>
            <option value="all">All statuses</option>
            {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="min-h-11 border border-ink/10 bg-white px-4 text-sm font-semibold text-ink" onChange={(event) => {
            setPaymentStatus(event.target.value);
            loadOrders(status, event.target.value, serviceId);
          }} value={paymentStatus}>
            <option value="all">All payments</option>
            {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select className="min-h-11 border border-ink/10 bg-white px-4 text-sm font-semibold text-ink" onChange={(event) => {
            setServiceId(event.target.value);
            loadOrders(status, paymentStatus, event.target.value);
          }} value={serviceId}>
            <option value="all">All products</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
        </div>
      </div>
      {error ? <p className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
      {!error && !isLoading && orders.length === 0 ? (
        <p className="mt-8 border border-black/10 bg-white p-5 text-sm text-graphite">No orders found.</p>
      ) : null}
      {orders.length > 0 ? (
        <div className="mt-8 overflow-x-auto border border-ink/10 bg-white shadow-sm">
          <table className="w-full min-w-[1320px] text-left text-sm">
            <thead className="bg-mist text-xs uppercase tracking-[0.16em] text-graphite">
              <tr>
                <th className="px-5 py-4">Order</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Template</th>
                <th className="px-5 py-4">Quantity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Final design</th>
                <th className="px-5 py-4">Delivery</th>
                <th className="px-5 py-4">WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-5 py-4 font-mono text-xs text-ink">{order.id}</td>
                  <td className="px-5 py-4 text-graphite">{order.customer_name}<br />{order.email}</td>
                  <td className="px-5 py-4 text-graphite">{order.services?.title ?? order.service_id}</td>
                  <td className="px-5 py-4 text-graphite">{order.product_templates?.title ?? order.product_designs?.title ?? "Custom upload"}</td>
                  <td className="px-5 py-4 text-graphite">{order.quantity}</td>
                  <td className="px-5 py-4">
                    <div className="grid gap-2">
                      <StatusBadge status={order.status} />
                      <select className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs" onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)} value={order.status}>
                        {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs" onChange={(event) => updatePaymentStatus(order.id, event.target.value)} value={order.payment_status}>
                      {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    {order.final_design_url ? (
                      <a className="rounded-full border border-black/10 px-3 py-2 text-xs text-ink" href={order.final_design_url} rel="noreferrer" target="_blank">View final</a>
                    ) : order.design_file_url ? (
                      <button className="rounded-full border border-black/10 px-3 py-2 text-xs text-ink" onClick={() => openFile(order.design_file_url!)} type="button">View upload</button>
                    ) : (
                      <span className="text-xs text-graphite">No upload</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs leading-5 text-graphite">
                    {order.delivery_distance_km ? `${order.delivery_distance_km} km` : "No location"}<br />
                    {order.estimated_delivery_minutes ? `${order.estimated_delivery_minutes} min delivery` : null}<br />
                    {order.estimated_completion_minutes ? `${order.estimated_completion_minutes} min print` : null}
                  </td>
                  <td className="px-5 py-4">
                    {order.whatsapp_link ? <a className="rounded-full border border-black/10 px-3 py-2 text-xs text-ink" href={order.whatsapp_link} rel="noreferrer" target="_blank">Open</a> : <span className="text-xs text-graphite">None</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
