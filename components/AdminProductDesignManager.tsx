"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  AdminButton,
  AdminEmptyState,
  AdminError,
  AdminField,
  AdminPageHeader,
  AdminPanel,
  AdminToolbar,
  adminInputClass,
  adminTextareaClass,
  cx
} from "@/components/AdminUI";
import { adminFetch } from "@/lib/admin-client";
import { DEMO_ADMIN_SERVICES } from "@/lib/admin-demo-data";
import type { ProductDesignRow, ServiceRow } from "@/types/database";

type DesignWithService = ProductDesignRow & {
  services?: { title: string; slug: string } | null;
};

type FormState = {
  service_id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  price: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  service_id: "",
  title: "",
  category: "",
  description: "",
  image_url: "",
  price: "",
  is_active: true
};

const designPresets = [
  { label: "Minimal", category: "Minimal", description: "Clean spacing, simple typography, logo-first layout.", price: "250" },
  { label: "Premium", category: "Premium", description: "High contrast layout with strong hierarchy and polished visual accents.", price: "500" },
  { label: "Photo", category: "Photo based", description: "Large image area with compact supporting text and production-safe margins.", price: "400" },
  { label: "Institutional", category: "Institutional", description: "Structured school, office, or organization style with clear identity fields.", price: "350" }
];

export function AdminProductDesignManager() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [designs, setDesigns] = useState<DesignWithService[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setIsLoading(true);
    setError("");

    try {
      const [servicesPayload, designsPayload] = await Promise.all([
        adminFetch("/api/admin/services"),
        adminFetch("/api/admin/product-designs")
      ]);
      setServices(servicesPayload.services ?? []);
      setDesigns(designsPayload.designs ?? []);
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === "Admin database is not configured.") {
        setServices(DEMO_ADMIN_SERVICES);
        setDesigns([]);
        return;
      }
      setError(loadError instanceof Error ? loadError.message : "Could not load designs.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const visibleDesigns = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return designs.filter((design) => {
      if (serviceFilter !== "all" && design.service_id !== serviceFilter) return false;
      if (activeFilter === "active" && !design.is_active) return false;
      if (activeFilter === "inactive" && design.is_active) return false;
      if (!normalized) return true;

      return [
        design.title,
        design.category ?? "",
        design.description ?? "",
        design.services?.title ?? ""
      ].join(" ").toLowerCase().includes(normalized);
    });
  }, [designs, query, serviceFilter, activeFilter]);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const payload = await adminFetch("/api/admin/product-images", {
        method: "POST",
        body: formData
      });
      setForm((current) => ({ ...current, image_url: payload.image_url ?? "" }));
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Design image uploaded." }));
    } catch (uploadError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: uploadError instanceof Error ? uploadError.message : "Could not upload image." }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await adminFetch(editingId ? `/api/admin/product-designs/${editingId}` : "/api/admin/product-designs", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(form)
      });
      setEditingId(null);
      setForm(emptyForm);
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: editingId ? "Design updated." : "Design added." }));
      await loadData();
    } catch (saveError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: saveError instanceof Error ? saveError.message : "Could not save design." }));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteDesign(id: string) {
    try {
      await adminFetch(`/api/admin/product-designs/${id}`, { method: "DELETE" });
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: "Design deleted." }));
      await loadData();
    } catch (deleteError) {
      window.dispatchEvent(new CustomEvent("printnepal:toast", { detail: deleteError instanceof Error ? deleteError.message : "Could not delete design." }));
    }
  }

  function applyDesignPreset(preset: (typeof designPresets)[number]) {
    setForm((current) => ({
      ...current,
      title: current.title || `${preset.label} design`,
      category: preset.category,
      description: preset.description,
      price: preset.price,
      is_active: true
    }));
  }

  function editDesign(design: DesignWithService) {
    setEditingId(design.id);
    setForm({
      service_id: design.service_id ?? "",
      title: design.title,
      category: design.category ?? "",
      description: design.description ?? "",
      image_url: design.image_url ?? "",
      price: String(design.price),
      is_active: design.is_active
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <section className="grid gap-5">
      <AdminPageHeader
        description="Add selectable design options under customer-facing print products, with price, preview image, and active state."
        eyebrow="Design catalog"
        title="Product design options"
      />

      <AdminError message={error} />

      <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{editingId ? "Editing design" : "Create design"}</p>
              <h2 className="mt-2 text-xl font-black text-ink">{editingId ? "Update design option" : "Add design option"}</h2>
            </div>
            {editingId ? <AdminButton onClick={clearEdit} variant="secondary">Cancel edit</AdminButton> : null}
          </div>

          <form className="mt-5 grid gap-4 lg:grid-cols-3" onSubmit={handleSubmit}>
            <AdminField label="Product">
              <select className={adminInputClass} onChange={(event) => setForm((current) => ({ ...current, service_id: event.target.value }))} required value={form.service_id}>
                <option value="" disabled>Select product</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Design name">
              <input className={adminInputClass} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required value={form.title} />
            </AdminField>
            <AdminField label="Style">
              <input className={adminInputClass} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} value={form.category} />
            </AdminField>
            <AdminField label="Price">
              <input className={adminInputClass} min="0" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required type="number" value={form.price} />
            </AdminField>
            <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3">
              {["0", "250", "500", "750"].map((price) => (
                <button className="rounded-md border border-[var(--line)] bg-mist px-3 py-1 text-xs font-black text-ink hover:border-press" key={price} onClick={() => setForm((current) => ({ ...current, price }))} type="button">
                  NPR {price}
                </button>
              ))}
            </div>
            <AdminField label="Image URL">
              <input className={adminInputClass} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} value={form.image_url} />
            </AdminField>
            <label className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-[var(--line)] bg-mist px-4 text-sm font-black text-ink transition hover:border-press">
              Upload image
              <input accept="image/*" className="sr-only" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) uploadImage(file);
              }} type="file" />
            </label>
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-bold text-ink">
              <input checked={form.is_active} onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))} type="checkbox" />
              Active for customers
            </label>
            <AdminField className="lg:col-span-3" label="Design details">
              <textarea className={adminTextareaClass} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} value={form.description} />
            </AdminField>
            {form.image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-[var(--line)] bg-mist lg:col-span-3">
                <Image alt="Design preview" className="h-full w-full object-cover" fill sizes="(min-width: 1024px) 60vw, 100vw" src={form.image_url} />
              </div>
            ) : (
              <div className="grid min-h-36 place-items-center rounded-lg border border-dashed border-[var(--line)] bg-mist text-center text-sm font-bold text-graphite lg:col-span-3">
                Upload or paste an image URL to preview this design option.
              </div>
            )}
            <div className="flex flex-col gap-2 sm:flex-row lg:col-span-3">
              <AdminButton className="flex-1" disabled={isSaving} type="submit">{editingId ? "Update design" : "Add design"}</AdminButton>
              <AdminButton onClick={clearEdit} variant="secondary">Clear</AdminButton>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel className="p-4 sm:p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">Style presets</p>
          <h2 className="mt-2 text-xl font-black text-ink">Design blueprints</h2>
          <div className="mt-4 grid gap-3">
            {designPresets.map((preset) => (
              <button
                className="rounded-lg border border-[var(--line)] bg-mist p-3 text-left transition hover:border-press hover:bg-white"
                key={preset.label}
                onClick={() => applyDesignPreset(preset)}
                type="button"
              >
                <span className="text-sm font-black text-ink">{preset.label}</span>
                <span className="mt-1 block text-xs font-semibold leading-5 text-graphite">NPR {preset.price} · {preset.category}</span>
              </button>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminToolbar>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <input className={adminInputClass} onChange={(event) => setQuery(event.target.value)} placeholder="Search design, style, product" type="search" value={query} />
          <select className={adminInputClass} onChange={(event) => setServiceFilter(event.target.value)} value={serviceFilter}>
            <option value="all">All products</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
          <select className={adminInputClass} onChange={(event) => setActiveFilter(event.target.value)} value={activeFilter}>
            <option value="all">All states</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <p className="text-sm font-black text-graphite">{isLoading ? "Loading..." : `${visibleDesigns.length} designs`}</p>
        </div>
      </AdminToolbar>

      {!error && !isLoading && visibleDesigns.length === 0 ? (
        <AdminEmptyState title="No designs found" description="Add a design option or adjust filters to see more assets." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleDesigns.map((design) => (
          <AdminPanel className="overflow-hidden" key={design.id}>
            {design.image_url ? (
              <div className="relative aspect-[4/3] border-b border-[var(--line)] bg-mist">
                <Image alt={`${design.title} design`} className="h-full w-full object-cover" fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" src={design.image_url} />
              </div>
            ) : (
              <div className="grid aspect-[4/3] place-items-center border-b border-[var(--line)] bg-mist text-sm font-black text-graphite">No preview</div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.08em] text-press">{design.services?.title ?? "Product"}</p>
                  <h2 className="mt-2 text-lg font-black text-ink">{design.title}</h2>
                </div>
                <span className={cx("rounded-md px-2 py-1 text-xs font-black", design.is_active ? "bg-cyan/10 text-cyan" : "bg-mist text-graphite")}>
                  {design.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-graphite">{design.description || "No description yet."}</p>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-mist p-3 text-sm font-black text-ink">
                <span>{design.category ?? "Style"}</span>
                <span>NPR {Number(design.price).toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <AdminButton onClick={() => editDesign(design)} variant="secondary">Edit</AdminButton>
                <AdminButton onClick={() => deleteDesign(design.id)} variant="danger">Delete</AdminButton>
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>
    </section>
  );
}
