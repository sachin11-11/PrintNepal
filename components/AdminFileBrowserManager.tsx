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

type FileOrder = (OrderRow & {
  services?: { title: string } | null;
  product_templates?: { title: string; thumbnail_url: string | null } | null;
  product_designs?: { title: string; image_url: string | null } | null;
}) | DemoAdminOrder;

type FileKind = "all" | "customer-upload" | "final-pdf" | "legacy-final" | "missing-final";

type FileRecord = {
  id: string;
  order: FileOrder;
  kind: "Customer upload" | "Final PDF" | "Legacy final";
  bucket: "design-files" | "final-designs" | "external";
  path: string;
  url: string | null;
  isPdf: boolean;
  isPrivate: boolean;
};

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function serviceName(order: FileOrder) {
  return order.services?.title ?? order.service_id ?? "Custom print";
}

function designName(order: FileOrder) {
  return order.product_templates?.title ?? order.product_designs?.title ?? "Customer artwork";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function isPdfPath(value?: string | null) {
  if (!value) return false;
  return value.split("?")[0].toLowerCase().endsWith(".pdf");
}

function finalDesignPath(url: string) {
  const marker = "/final-designs/";
  const index = url.indexOf(marker);
  if (index === -1) return url;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

function fileName(path: string) {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function orderFolder(path: string) {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "orders" && parts[1]) return `${parts[0]}/${parts[1]}`;
  return "legacy-flat-storage";
}

function buildFileRecords(order: FileOrder): FileRecord[] {
  const records: FileRecord[] = [];

  if (order.design_file_url) {
    records.push({
      id: `${order.id}-customer-upload`,
      order,
      kind: "Customer upload",
      bucket: "design-files",
      path: order.design_file_url,
      url: null,
      isPdf: isPdfPath(order.design_file_url),
      isPrivate: true
    });
  }

  if (order.final_design_url) {
    const isPdf = isPdfPath(order.final_design_url);
    records.push({
      id: `${order.id}-final`,
      order,
      kind: isPdf ? "Final PDF" : "Legacy final",
      bucket: order.final_design_url.includes("/final-designs/") ? "final-designs" : "external",
      path: order.final_design_url.includes("/final-designs/") ? finalDesignPath(order.final_design_url) : order.final_design_url,
      url: order.final_design_url,
      isPdf,
      isPrivate: false
    });
  }

  return records;
}

export function AdminFileBrowserManager() {
  const [orders, setOrders] = useState<FileOrder[]>([]);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<FileKind>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/orders")
      .then((payload) => setOrders(payload.orders ?? []))
      .catch((loadError) => {
        const message = loadError instanceof Error ? loadError.message : "Could not load files.";
        if (message === "Admin database is not configured.") {
          setOrders(DEMO_ADMIN_ORDERS);
          return;
        }
        setError(message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const records = useMemo(() => orders.flatMap(buildFileRecords), [orders]);

  const visibleRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return records.filter((record) => {
      if (kind === "customer-upload" && record.kind !== "Customer upload") return false;
      if (kind === "final-pdf" && record.kind !== "Final PDF") return false;
      if (kind === "legacy-final" && record.kind !== "Legacy final") return false;
      if (!normalized) return true;

      return [
        record.path,
        record.kind,
        record.bucket,
        record.order.id,
        record.order.customer_name,
        record.order.email,
        record.order.phone ?? "",
        serviceName(record.order),
        designName(record.order)
      ].join(" ").toLowerCase().includes(normalized);
    });
  }, [records, query, kind]);

  const missingFinalOrders = useMemo(() => orders.filter((order) => !isPdfPath(order.final_design_url)), [orders]);
  const displayRows = kind === "missing-final" ? [] : visibleRecords;

  async function openRecord(record: FileRecord) {
    if (record.isPrivate) {
      const token = await getAdminToken();
      if (!token) return;
      window.open(`/api/admin/files/${encodeURIComponent(record.path)}?token=${token}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (record.url) {
      window.open(record.url, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        description="Browse every stored customer upload and final output with order ID, customer details, bucket, path, and PDF readiness."
        eyebrow="Files"
        title="Customer and print files"
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminMetricCard helper="Private customer artwork" label="Customer uploads" tone="steel" value={isLoading ? "..." : String(records.filter((record) => record.kind === "Customer upload").length)} />
        <AdminMetricCard helper="Print-ready output files" label="Final PDFs" tone="sage" value={isLoading ? "..." : String(records.filter((record) => record.kind === "Final PDF").length)} />
        <AdminMetricCard helper="PNG/external old final links" label="Legacy finals" tone="brass" value={isLoading ? "..." : String(records.filter((record) => record.kind === "Legacy final").length)} />
        <AdminMetricCard helper="Orders without final PDF" label="Missing final PDF" tone="press" value={isLoading ? "..." : String(missingFinalOrders.length)} />
      </div>

      <AdminToolbar>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <input
            className={adminInputClass}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search order ID, customer, phone, file path, bucket, product"
            type="search"
            value={query}
          />
          <select className={adminInputClass} onChange={(event) => setKind(event.target.value as FileKind)} value={kind}>
            <option value="all">All files</option>
            <option value="customer-upload">Customer uploads</option>
            <option value="final-pdf">Final PDFs</option>
            <option value="legacy-final">Legacy finals</option>
            <option value="missing-final">Orders missing final PDF</option>
          </select>
          <p className="text-sm font-black text-graphite">
            {kind === "missing-final" ? `${missingFinalOrders.length} orders` : `${displayRows.length} files`}
          </p>
        </div>
      </AdminToolbar>

      <AdminError message={error} />

      {kind === "missing-final" ? (
        <div className="grid gap-3">
          {missingFinalOrders.map((order) => (
            <AdminPanel className="p-4" key={order.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-black text-press">{shortId(order.id)}</p>
                  <h2 className="mt-1 text-lg font-black text-ink">{order.customer_name}</h2>
                  <p className="mt-1 text-sm font-semibold text-graphite">{serviceName(order)} · {designName(order)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={order.status} />
                  <AdminButton href="/admin/design-work" variant="primary">Upload final PDF</AdminButton>
                </div>
              </div>
            </AdminPanel>
          ))}
          {!isLoading && missingFinalOrders.length === 0 ? <AdminEmptyState title="All orders have final PDFs" description="Every visible order has a PDF final file attached." /> : null}
        </div>
      ) : (
        <>
          {!error && !isLoading && displayRows.length === 0 ? (
            <AdminEmptyState title="No files found" description="Adjust the file filter or wait for customer uploads and final PDFs." />
          ) : null}

          <AdminPanel className="hidden overflow-hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-mist text-[11px] uppercase tracking-[0.08em] text-graphite">
                  <tr>
                    <th className="px-4 py-3">File</th>
                    <th className="px-4 py-3">Customer / order</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Storage</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {displayRows.map((record) => (
                    <tr className="align-top hover:bg-mist/60" key={record.id}>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{fileName(record.path)}</p>
                        <p className="mt-1 text-xs font-bold text-graphite">{record.kind}</p>
                        <p className="mt-2 max-w-[20rem] break-all font-mono text-[11px] text-graphite">{record.path}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{record.order.customer_name}</p>
                        <p className="mt-1 font-mono text-xs font-bold text-press">{shortId(record.order.id)}</p>
                        <p className="mt-1 text-xs text-graphite">{record.order.email}</p>
                        <p className="mt-1 text-xs text-graphite">{record.order.phone ?? "No phone"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{serviceName(record.order)}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{designName(record.order)}</p>
                        <p className="mt-2 text-xs font-semibold text-graphite">Created {formatDate(record.order.created_at)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-black text-ink">{record.bucket}</p>
                        <p className="mt-1 text-xs font-semibold text-graphite">{orderFolder(record.path)}</p>
                        <span className={cx("mt-3 inline-flex rounded-md px-2 py-1 text-xs font-black", record.isPrivate ? "bg-steel/10 text-steel" : "bg-cyan/10 text-cyan")}>
                          {record.isPrivate ? "Private" : "Public"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid gap-2">
                          <StatusBadge status={record.order.status} />
                          <span className={cx("w-fit rounded-md px-2 py-1 text-xs font-black", record.isPdf ? "bg-cyan/10 text-cyan" : "bg-brass/10 text-brass")}>
                            {record.isPdf ? "PDF" : "Not PDF"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid gap-2">
                          <AdminButton onClick={() => openRecord(record)}>Open file</AdminButton>
                          {!record.isPdf ? <AdminButton href="/admin/design-work" variant="secondary">Make final PDF</AdminButton> : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <div className="grid gap-3 lg:hidden">
            {displayRows.map((record) => (
              <AdminPanel className="p-4" key={record.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-press">{record.kind}</p>
                    <h2 className="mt-1 truncate text-lg font-black text-ink">{fileName(record.path)}</h2>
                    <p className="mt-1 font-mono text-xs text-graphite">{shortId(record.order.id)}</p>
                  </div>
                  <span className={cx("rounded-md px-2 py-1 text-xs font-black", record.isPdf ? "bg-cyan/10 text-cyan" : "bg-brass/10 text-brass")}>
                    {record.isPdf ? "PDF" : "Not PDF"}
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-mist p-3">
                  <p className="text-sm font-black text-ink">{record.order.customer_name}</p>
                  <p className="mt-1 text-xs font-semibold text-graphite">{serviceName(record.order)} · {designName(record.order)}</p>
                  <p className="mt-3 break-all font-mono text-[11px] text-graphite">{record.path}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminButton onClick={() => openRecord(record)}>Open file</AdminButton>
                  <AdminButton href="/admin/design-work" variant="secondary">Design work</AdminButton>
                </div>
              </AdminPanel>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
