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
import { DEMO_ADMIN_ORDERS, type DemoAdminOrder } from "@/lib/admin-demo-data";
import type { OrderRow } from "@/types/database";
import { StatusBadge } from "./StatusBadge";

type DesignWorkOrder = (OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
}) | DemoAdminOrder;

type WorkFilter = "all" | "customer-upload" | "template-final" | "needs-pdf" | "pdf-ready";

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function serviceName(order: DesignWorkOrder) {
  return order.services?.title ?? order.service_id ?? "Custom print";
}

function designName(order: DesignWorkOrder) {
  return order.product_templates?.title ?? order.product_designs?.title ?? "Customer artwork";
}

function isPdfUrl(url?: string | null) {
  if (!url) return false;
  return url.split("?")[0].toLowerCase().endsWith(".pdf");
}

function hasCustomerUpload(order: DesignWorkOrder) {
  return Boolean(order.design_file_url);
}

function hasTemplateFinal(order: DesignWorkOrder) {
  return Boolean(order.selected_template_id || order.product_templates || order.final_design_json);
}

function needsPdf(order: DesignWorkOrder) {
  return !isPdfUrl(order.final_design_url);
}

export function AdminDesignWorkManager() {
  const [orders, setOrders] = useState<DesignWorkOrder[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setIsLoading(true);
    setError("");

    try {
      const payload = await adminFetch("/api/admin/orders");
      setOrders(payload.orders ?? []);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Could not load design work.";
      if (message === "Admin database is not configured.") {
        setOrders(DEMO_ADMIN_ORDERS);
        return;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function openCustomerUpload(path: string) {
    const token = await getAdminToken();
    if (!token) return;
    window.open(`/api/admin/files/${encodeURIComponent(path)}?token=${token}`, "_blank", "noopener,noreferrer");
  }

  async function uploadFinalPdf(orderId: string, file: File) {
    const data = new FormData();
    data.append("order_id", orderId);
    data.append("file", file);

    try {
      setUploadingId(orderId);
      await adminFetch("/api/admin/design-work/final-pdf", {
        method: "POST",
        body: data
      });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Final PDF saved for this order." }));
      await loadOrders();
    } catch (uploadError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: uploadError instanceof Error ? uploadError.message : "Could not upload final PDF." }));
    } finally {
      setUploadingId(null);
    }
  }

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (filter === "customer-upload" && !hasCustomerUpload(order)) return false;
      if (filter === "template-final" && !hasTemplateFinal(order)) return false;
      if (filter === "needs-pdf" && !needsPdf(order)) return false;
      if (filter === "pdf-ready" && !isPdfUrl(order.final_design_url)) return false;
      if (!normalized) return true;

      return [
        order.id,
        order.customer_name,
        order.email,
        order.phone ?? "",
        serviceName(order),
        designName(order),
        order.status,
        order.payment_status
      ].join(" ").toLowerCase().includes(normalized);
    });
  }, [orders, query, filter]);

  const metrics = useMemo(() => {
    const customerUploads = orders.filter(hasCustomerUpload).length;
    const templateFinals = orders.filter(hasTemplateFinal).length;
    const pdfReady = orders.filter((order) => isPdfUrl(order.final_design_url)).length;
    const needsFinalPdf = orders.filter(needsPdf).length;

    return { customerUploads, templateFinals, pdfReady, needsFinalPdf };
  }, [orders]);

  function FinalPdfControl({ order }: { order: DesignWorkOrder }) {
    const pdfReady = isPdfUrl(order.final_design_url);

    return (
      <div className="grid gap-2">
        {order.final_design_url ? (
          <AdminButton href={order.final_design_url} variant={pdfReady ? "primary" : "secondary"}>
            {pdfReady ? "Open final PDF" : "Open legacy final"}
          </AdminButton>
        ) : (
          <span className="rounded-lg border border-dashed border-[var(--line)] bg-mist px-3 py-2 text-xs font-bold text-graphite">No final PDF yet</span>
        )}
        <label className={cx("inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg px-4 text-sm font-black transition", uploadingId === order.id ? "bg-neutral-300 text-graphite" : "border border-[var(--line)] bg-[var(--surface)] text-ink hover:border-press")}>
          {uploadingId === order.id ? "Uploading..." : pdfReady ? "Replace PDF" : "Upload final PDF"}
          <input
            accept="application/pdf,.pdf"
            className="sr-only"
            disabled={uploadingId === order.id}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadFinalPdf(order.id, file);
              event.currentTarget.value = "";
            }}
            type="file"
          />
        </label>
      </div>
    );
  }

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        description="Review customer artwork, template-generated finals, and final print PDFs from one production workspace."
        eyebrow="Design work"
        title="Artwork and final PDFs"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard helper="Private design-files bucket" label="Customer uploads" tone="steel" value={isLoading ? "..." : String(metrics.customerUploads)} />
        <AdminMetricCard helper="Template orders and saved JSON" label="Template finals" tone="brass" value={isLoading ? "..." : String(metrics.templateFinals)} />
        <AdminMetricCard helper="Ready for print workflow" label="PDF ready" tone="sage" value={isLoading ? "..." : String(metrics.pdfReady)} />
        <AdminMetricCard helper="Needs final PDF upload/export" label="Needs PDF" tone="press" value={isLoading ? "..." : String(metrics.needsFinalPdf)} />
      </div>

      <AdminToolbar>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            className={adminInputClass}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customer, order, product, template, phone"
            type="search"
            value={query}
          />
          <select className={adminInputClass} onChange={(event) => setFilter(event.target.value as WorkFilter)} value={filter}>
            <option value="all">All design work</option>
            <option value="customer-upload">Customer uploads</option>
            <option value="template-final">Template finals</option>
            <option value="needs-pdf">Needs final PDF</option>
            <option value="pdf-ready">PDF ready</option>
          </select>
          <p className="text-sm font-black text-graphite">{isLoading ? "Loading..." : `${visibleOrders.length} jobs`}</p>
        </div>
      </AdminToolbar>

      <AdminError message={error} />

      {!error && !isLoading && visibleOrders.length === 0 ? (
        <AdminEmptyState title="No design work found" description="Adjust the filter or wait for customer uploads and template orders." />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {visibleOrders.map((order) => {
          const pdfReady = isPdfUrl(order.final_design_url);

          return (
            <AdminPanel className="p-4 sm:p-5" key={order.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs font-black text-press">{shortId(order.id)}</p>
                    <StatusBadge status={order.status} />
                    <span className={cx("rounded-md px-2 py-1 text-xs font-black", pdfReady ? "bg-cyan/10 text-cyan" : "bg-brass/10 text-brass")}>
                      {pdfReady ? "PDF ready" : "Needs PDF"}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-black text-ink">{order.customer_name}</h2>
                  <p className="mt-1 text-xs font-semibold text-graphite">{formatDate(order.created_at)} · {order.phone ?? "No phone"}</p>
                </div>
                <FinalPdfControl order={order} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-mist p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-graphite">Product</p>
                  <p className="mt-2 text-sm font-black text-ink">{serviceName(order)}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite">{designName(order)}</p>
                </div>
                <div className="rounded-lg bg-mist p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-graphite">Specs</p>
                  <p className="mt-2 text-sm font-black text-ink">Qty {order.quantity}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite">{order.paper_size ?? "Custom"} · {order.paper_type ?? "Standard"}</p>
                </div>
                <div className="rounded-lg bg-mist p-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-graphite">Source</p>
                  <p className="mt-2 text-sm font-black text-ink">
                    {hasCustomerUpload(order) ? "Customer upload" : hasTemplateFinal(order) ? "Template editor" : "Design help"}
                  </p>
                  <p className="mt-1 text-xs font-semibold capitalize text-graphite">{order.design_method.replace(/_/g, " ")}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {order.design_file_url ? (
                  <AdminButton onClick={() => openCustomerUpload(order.design_file_url!)} variant="secondary">
                    View customer upload
                  </AdminButton>
                ) : null}
                {hasTemplateFinal(order) && order.final_design_json ? (
                  <span className="inline-flex min-h-10 items-center rounded-lg border border-[var(--line)] bg-mist px-4 text-sm font-black text-graphite">
                    Template JSON saved
                  </span>
                ) : null}
                {order.final_design_url ? (
                  <AdminButton href={order.final_design_url} variant="secondary">Open stored final</AdminButton>
                ) : null}
                {!order.design_file_url && !order.final_design_url && !order.final_design_json ? (
                  <span className="inline-flex min-h-10 items-center rounded-lg border border-dashed border-[var(--line)] bg-mist px-4 text-sm font-bold text-graphite">
                    No artwork file attached
                  </span>
                ) : null}
              </div>
            </AdminPanel>
          );
        })}
      </div>
    </section>
  );
}
